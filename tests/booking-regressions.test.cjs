/* global __dirname */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Load the actual TypeScript with injected SDK boundaries; no live Firebase writes.
function load(file, mocks = {}, cache = new Map()) {
  const filename = path.resolve(__dirname, '..', file);
  if (cache.has(filename)) return cache.get(filename);
  const exports = {};
  cache.set(filename, exports);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const localRequire = (id) => {
    if (id in mocks) return mocks[id];
    if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), `${id}.ts`), mocks, cache);
    return require(id);
  };
  vm.runInThisContext(`(function(require, exports) { ${source}\n})`, { filename })(localRequire, exports);
  return exports;
}

const dates = load('src/utils/dateUtils.ts');
const conflicts = load('src/utils/bookingConflict.ts');

test('calendar keys agree with local labels around midnight and year rollover', () => {
  const today = new Date(2026, 11, 31, 0, 15);
  const days = dates.getNextSevenDays(today);
  assert.equal(days[0].dateString, '2026-12-31');
  assert.equal(days[0].dayOfMonth, '31');
  assert.equal(days[1].dateString, '2027-01-01');
  assert.equal(new Set(days.map(day => day.dateString)).size, 7);
});

test('reject elapsed dates and exact start boundary but allow future slots', () => {
  const now = new Date(2026, 8, 25, 7, 30);
  assert.equal(dates.isSlotPast('2026-09-24', '17:00', now), true);
  assert.equal(dates.isSlotPast('2026-09-25', '07:30', now), true);
  assert.equal(dates.isSlotPast('2026-09-25', '09:30', now), false);
});

test('occupancy respects date, end boundary and cancelled records', () => {
  const booking = { roomId: 'r1', date: '2026-09-25', startTime: '07:30', endTime: '09:30', status: 'active' };
  assert.equal(conflicts.isRoomOccupiedNow('r1', [booking], new Date(2026, 8, 25, 7, 30)), true);
  assert.equal(conflicts.isRoomOccupiedNow('r1', [booking], new Date(2026, 8, 25, 9, 30)), false);
  assert.equal(conflicts.isRoomOccupiedNow('r1', [{ ...booking, status: 'cancelled' }], new Date(2026, 8, 25, 8)), false);
});

function fixture() {
  const data = new Map();
  const auth = { currentUser: { uid: 'u1' } };
  let count = 0;
  const sdk = {
    ref: (_db, key) => key,
    push: () => ({ key: `new-${++count}` }),
    get: async key => ({ exists: () => data.has(key), val: () => data.get(key) }),
    set: async (key, value) => { data.set(typeof key === 'string' ? key : `bookings/${key.key}`, value); },
    runTransaction: async (key, update) => {
      // Firebase can first call the updater with null before fetching server data.
      if (update(null) === undefined) return { committed: false };
      const value = update(data.get(key) ?? null);
      if (value === undefined) return { committed: false };
      data.set(key, value);
      return { committed: true };
    },
  };
  const api = load('src/api/bookings.ts', { 'firebase/database': sdk, '../config/firebase': { db: {}, auth } });
  const date = dates.getNextSevenDays()[1].dateString;
  const booking = { id: 'old', userId: 'u1', roomId: 'r1', date, slotId: 'slot_1', startTime: '07:30', endTime: '09:30', createdAt: new Date().toISOString(), status: 'active' };
  const slotKey = `roomSlots/r1/${date}/slot_1`;
  data.set('bookings/old', booking);
  data.set(slotKey, { bookingId: 'old', userId: 'u1' });
  return { api, auth, data, sdk, booking, slotKey };
}

test('cancellation with an empty local cache still releases its own server lock', async () => {
  const { api, data, booking, slotKey } = fixture();
  await api.cancelBooking(booking);
  assert.equal(data.get(slotKey), null);
  assert.equal(data.get('bookings/old/status'), 'cancelled');
});

test('repeated stale cancellation cannot release a newer booking lock', async () => {
  const { api, data, booking, slotKey } = fixture();
  await api.cancelBooking(booking);
  data.set(slotKey, { bookingId: 'new-owner', userId: 'u2' });
  await api.cancelBooking(booking);
  assert.equal(data.get(slotKey).bookingId, 'new-owner');
});

test('failed cancellation write leaves the occupied slot locked', async () => {
  const { api, data, sdk, booking, slotKey } = fixture();
  sdk.set = async () => { throw new Error('permission-denied'); };
  await assert.rejects(api.cancelBooking(booking), /permission-denied/);
  assert.equal(data.get(slotKey).bookingId, 'old');
});

test('cannot cancel a record owned by someone else using a forged cached user', async () => {
  const { api, data, booking, slotKey } = fixture();
  data.set('bookings/old', { ...booking, userId: 'u2' });
  await assert.rejects(api.cancelBooking(booking), /AUTH_REQUIRED/);
  assert.equal(data.get(slotKey).bookingId, 'old');
});

test('only one concurrent booking can claim the same slot', async () => {
  const { api, data, booking, slotKey } = fixture();
  data.set(slotKey, null);
  const outcomes = await Promise.allSettled([api.createBooking(booking), api.createBooking(booking)]);
  assert.equal(outcomes.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(outcomes.filter(result => result.status === 'rejected').length, 1);
});

test('failed booking write rolls back its own slot', async () => {
  const { api, data, sdk, booking, slotKey } = fixture();
  data.set(slotKey, null);
  sdk.set = async () => { throw new Error('write-failed'); };
  await assert.rejects(api.createBooking(booking), /write-failed/);
  assert.equal(data.get(slotKey), null);
});

test('booking creation requires auth and valid future slot data', async () => {
  const { api, auth, booking } = fixture();
  await assert.rejects(api.createBooking({ ...booking, startTime: '00:00' }), /INVALID_BOOKING/);
  await assert.rejects(api.createBooking({ ...booking, date: '2020-01-01' }), /INVALID_BOOKING/);
  auth.currentUser = null;
  await assert.rejects(api.createBooking(booking), /AUTH_REQUIRED/);
});
