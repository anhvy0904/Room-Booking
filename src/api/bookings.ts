import { ref, get, push, set, runTransaction, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { auth, db } from '../config/firebase';
import { Booking } from '../types/booking';
import { getNextSevenDays, isSlotPast } from '../utils/dateUtils';
import { TIME_SLOTS } from '../constants/timeSlots';

const releaseSlot = async (roomId: string, date: string, slotId: string, bookingId: string) => {
  await runTransaction(ref(db, `roomSlots/${roomId}/${date}/${slotId}`), (current) => {
    // null may be an empty local cache: return null so the server can retry.
    if (current === null || current.bookingId === bookingId) return null;
    return undefined;
  }, { applyLocally: false });
};

export const getBookingsForUser = async (userId: string): Promise<Booking[]> => {
  const bookingsRef = ref(db, 'bookings');
  const userBookingsQuery = query(bookingsRef, orderByChild('userId'), equalTo(userId));
  const snapshot = await get(userBookingsQuery);
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    const bookings: Booking[] = [];
    Object.keys(data).forEach((key) => {
      bookings.push({
        ...data[key],
        id: key
      } as Booking);
    });
    return bookings;
  }
  return [];
};

export const subscribeToUserBookings = (userId: string, callback: (bookings: Booking[]) => void, onError: (error: Error) => void) => {
  const bookingsRef = ref(db, 'bookings');
  const userBookingsQuery = query(bookingsRef, orderByChild('userId'), equalTo(userId));
  
  const unsubscribe = onValue(userBookingsQuery, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const bookings: Booking[] = [];
      Object.keys(data).forEach((key) => {
        bookings.push({
          ...data[key],
          id: key
        } as Booking);
      });
      callback(bookings);
    } else {
      callback([]);
    }
  }, onError);
  return unsubscribe;
};

export const subscribeToDateBookings = (date: string, callback: (bookings: Booking[]) => void, onError: (error: Error) => void) => {
  const bookingsRef = ref(db, 'bookings');
  const dateBookingsQuery = query(bookingsRef, orderByChild('date'), equalTo(date));
  
  const unsubscribe = onValue(dateBookingsQuery, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const bookings: Booking[] = [];
      Object.keys(data).forEach((key) => {
        bookings.push({
          ...data[key],
          id: key
        } as Booking);
      });
      callback(bookings);
    } else {
      callback([]);
    }
  }, onError);
  return unsubscribe;
};

export const createBooking = async (bookingData: Omit<Booking, 'id' | 'status'>): Promise<Booking> => {
  const { roomId, date, slotId, userId } = bookingData;
  if (!auth.currentUser || auth.currentUser.uid !== userId) throw new Error('AUTH_REQUIRED');
  const slot = TIME_SLOTS.find((item) => item.id === slotId);
  if (!slot || slot.start !== bookingData.startTime || slot.end !== bookingData.endTime ||
      !getNextSevenDays().some((day) => day.dateString === date)) {
    throw new Error('INVALID_BOOKING');
  }
  if (isSlotPast(date, slot.start)) throw new Error('SLOT_PAST');
  
  const slotRef = ref(db, `roomSlots/${roomId}/${date}/${slotId}`);
  const bookingsRef = ref(db, 'bookings');
  const newBookingRef = push(bookingsRef);
  const bookingId = newBookingRef.key as string;

  const transactionResult = await runTransaction(slotRef, (currentData) => {
    if (currentData === null) {
      // Slot is empty, we can claim it
      return { bookingId, userId };
    } else {
      // Slot is already booked, abort transaction
      return; 
    }
  });

  if (!transactionResult.committed) {
    throw new Error('SLOT_ALREADY_BOOKED');
  }

  const newBooking: Booking = {
    ...bookingData,
    id: bookingId,
    status: 'active'
  };

  try {
    await set(newBookingRef, newBooking);
    return newBooking;
  } catch (error) {
    // If booking write fails, rollback the slot lock
    await releaseSlot(roomId, date, slotId, bookingId);
    throw error;
  }
};

export const cancelBooking = async (booking: Booking): Promise<void> => {
  if (!auth.currentUser || auth.currentUser.uid !== booking.userId) throw new Error('AUTH_REQUIRED');
  // Read the canonical record; a caller's cached booking may be stale.
  const snapshot = await get(ref(db, `bookings/${booking.id}`));
  if (!snapshot.exists()) throw new Error('BOOKING_NOT_FOUND');
  const stored = snapshot.val() as Booking;
  if (stored.userId !== auth.currentUser.uid) throw new Error('AUTH_REQUIRED');
  await set(ref(db, `bookings/${booking.id}/status`), 'cancelled');
  // Repeated cancellation must never unlock a newer reservation.
  await releaseSlot(stored.roomId, stored.date, stored.slotId, booking.id);
};

export const checkInBooking = async (booking: Booking): Promise<void> => {
  if (!auth.currentUser || auth.currentUser.uid !== booking.userId) throw new Error('AUTH_REQUIRED');
  const snapshot = await get(ref(db, `bookings/${booking.id}`));
  if (!snapshot.exists()) throw new Error('BOOKING_NOT_FOUND');
  const stored = snapshot.val() as Booking;
  if (stored.userId !== auth.currentUser.uid) throw new Error('AUTH_REQUIRED');
  if (stored.status !== 'active') throw new Error('CANNOT_CHECK_IN');

  const nowISO = new Date().toISOString();
  await set(ref(db, `bookings/${booking.id}/status`), 'checked_in');
  await set(ref(db, `bookings/${booking.id}/checkedInAt`), nowISO);
};

export const checkOutBooking = async (booking: Booking): Promise<void> => {
  if (!auth.currentUser || auth.currentUser.uid !== booking.userId) throw new Error('AUTH_REQUIRED');
  const snapshot = await get(ref(db, `bookings/${booking.id}`));
  if (!snapshot.exists()) throw new Error('BOOKING_NOT_FOUND');
  const stored = snapshot.val() as Booking;
  if (stored.userId !== auth.currentUser.uid) throw new Error('AUTH_REQUIRED');

  const nowISO = new Date().toISOString();
  await set(ref(db, `bookings/${booking.id}/status`), 'completed');
  await set(ref(db, `bookings/${booking.id}/completedAt`), nowISO);
  // Release slot lock so the room becomes available immediately
  await releaseSlot(stored.roomId, stored.date, stored.slotId, booking.id);
};

