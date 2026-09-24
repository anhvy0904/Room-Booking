# TASK PLAN — VKU Study Room Booking App

> **Project:** Mini-Project 2 — Real-time Study Room Booking App  
> **Platform:** React Native + Expo  
> **Language:** TypeScript (`strict` mode)  
> **Navigation:** Expo Router with Tabs + nested Stack  
> **Client State:** Zustand + AsyncStorage persistence  
> **Async/Server State:** TanStack Query  
> **Source of truth:** `prd.md`, `architecture.md`, `design_system.md`, `AGENTS.md`

---

# 0. Non-Negotiable Project Rules

## 0.1 Read Project Docs Before Coding

Before implementing or changing any feature:

- [ ] Read `prd.md`.
- [ ] Read `architecture.md`.
- [ ] Read `design_system.md`.
- [ ] Read `AGENTS.md`.
- [ ] Do not add features outside the approved MVP scope without explicit request.

## 0.2 Expo Rules

Before writing code that touches Expo, EAS, or React Native APIs:

- [ ] Read the installed `expo` major version from `package.json`.
- [ ] Check the matching Expo versioned documentation.
- [ ] Use `npx expo install <package>` for Expo-compatible dependency installation.
- [ ] Do not manually create/edit native `ios/` or `android/` folders when using Continuous Native Generation.
- [ ] Prefer Expo-supported modules over unnecessary third-party native modules.
- [ ] If a native dependency is unavailable in Expo Go, use a development build.

## 0.3 Required Validation Before Any Phase Is Marked Done

Run:

```bash
npx expo lint
npx tsc --noEmit
npx expo-doctor
```

- [ ] Lint passes.
- [ ] TypeScript passes with no type errors.
- [ ] Expo Doctor reports no unresolved compatibility problems.

---

# 1. Required Technology & Architecture

The project MUST use:

- [ ] React Native.
- [ ] Expo.
- [ ] Expo Router.
- [ ] TypeScript.
- [ ] TypeScript strict mode.
- [ ] Zustand.
- [ ] AsyncStorage.
- [ ] TanStack Query.
- [ ] React hooks.
- [ ] Custom hooks.
- [ ] `FlatList`.
- [ ] `React.memo`.
- [ ] `useMemo`.
- [ ] `useCallback`.
- [ ] `expo-notifications`.
- [ ] QR generation compatible with Expo.

The MVP MUST NOT introduce:

- [ ] Firebase.
- [ ] Supabase.
- [ ] Custom backend.
- [ ] WebSocket server.

unless explicitly requested later.

---

# 2. TypeScript Strict Requirements

## 2.1 Compiler Configuration

- [ ] Enable:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true
  }
}
```

- [ ] Do not use `any` unless there is a documented reason.
- [ ] Prefer explicit domain types.
- [ ] Handle nullable/optional values safely.
- [ ] All new files should use `.ts` / `.tsx`.

## 2.2 Central Types

Create:

```text
src/types/
├── room.ts
├── booking.ts
├── filters.ts
├── navigation.ts
└── api.ts
```

Required types:

- [ ] `Room`
- [ ] `Booking`
- [ ] `BookingStatus`
- [ ] `TimeSlot`
- [ ] `Equipment`
- [ ] `RoomFilters`
- [ ] `UserSession`
- [ ] `RoomAvailability`
- [ ] `SlotStatus`
- [ ] Query/API response types
- [ ] Router/search param types

---

# 3. Expo Router Navigation — Tabs + Stack

`AGENTS.md` requires Expo Router, so navigation MUST use file-based routing.

## 3.1 Required Route Structure

Create/maintain:

```text
src/app/
├── _layout.tsx                    # Root Stack
├── (tabs)/
│   ├── _layout.tsx                # Bottom Tabs
│   ├── index.tsx                  # Rooms / Home
│   └── bookings.tsx               # My Bookings
├── room/
│   └── [id].tsx                   # Room Detail
├── booking/
│   └── confirm.tsx                # Booking Confirmation
└── modal/
    └── qr.tsx                     # Optional QR modal route if route-based
```

Navigation behavior:

```text
Root Stack
├── (tabs)
│   ├── Rooms
│   └── My Bookings
├── room/[id]
├── booking/confirm
└── qr modal / QR component
```

## 3.2 Typed Route Params

Typed route/search params MUST be defined and used.

Examples:

```ts
type RoomDetailParams = {
  id: string;
};

type BookingConfirmParams = {
  roomId: string;
  date: string;
  slotId: string;
};
```

Tasks:

- [ ] Use `useLocalSearchParams<...>()`.
- [ ] Validate required params at runtime.
- [ ] Never assume params are always valid strings.
- [ ] Do not pass full `Room` or `Booking` objects through navigation.
- [ ] Pass IDs/basic serializable primitives only.
- [ ] Derive full domain objects from store/query by ID.

## Acceptance Criteria

- [ ] Bottom Tabs work.
- [ ] Rooms → Room Detail works.
- [ ] Room Detail → Booking Confirmation works.
- [ ] My Bookings tab works.
- [ ] Route params are typed.
- [ ] Invalid/missing params are handled gracefully.

---

# 4. State Ownership — Zustand + TanStack Query

The project MUST clearly separate **client/global state** from **async/server-style state**.

## 4.1 Zustand Responsibilities

Zustand owns:

- [ ] Mocked user session.
- [ ] Active search query.
- [ ] Active filters.
- [ ] Local booking draft/selection state if needed.
- [ ] Persisted local bookings for MVP.
- [ ] Booking cancellation action.
- [ ] UI-independent booking state.
- [ ] AsyncStorage persistence.

Suggested store:

```text
src/store/useBookingStore.ts
```

State:

```ts
user
bookings
filters
searchQuery
```

Actions:

```ts
setUser
setSearchQuery
setBuildingFilter
setCapacityFilter
toggleEquipmentFilter
clearFilters
addBooking
cancelBooking
updateBookingNotificationId
```

Persistence:

- [ ] Persist `user`.
- [ ] Persist `bookings`.
- [ ] Filters reset on app restart unless product requirements later change.
- [ ] Static rooms should not be persisted.

## 4.2 TanStack Query Responsibilities

TanStack Query owns asynchronous data access and query lifecycle.

Even with mock/local data in MVP, create a proper async boundary so the architecture is ready for real APIs later.

Use it for:

- [ ] Fetching room data through an async repository/service function.
- [ ] Fetching/deriving availability through async query functions if needed.
- [ ] Query loading/error states.
- [ ] Query caching.
- [ ] Query invalidation after booking/cancellation where relevant.

Recommended:

```text
src/lib/queryClient.ts
src/api/rooms.ts
src/api/bookings.ts
```

or equivalent repository/service naming.

Required query hooks:

```text
useRoomsQuery
useRoomQuery
useRoomAvailabilityQuery
```

If bookings remain fully local through Zustand for MVP:

- [ ] Do NOT duplicate the persisted booking source of truth inside TanStack Query.
- [ ] Use TanStack Query for async room/repository data and derived async availability.
- [ ] Invalidate/recompute relevant room/availability queries after booking/cancellation when required.

## 4.3 Query Client Provider

- [ ] Create `QueryClient`.
- [ ] Add `QueryClientProvider` at the root layout.
- [ ] Configure sensible default retry/stale behavior for local mock async data.
- [ ] Avoid aggressive polling.

## Acceptance Criteria

- [ ] Zustand and TanStack Query responsibilities do not overlap unnecessarily.
- [ ] Rooms use TanStack Query async flow.
- [ ] Global client state uses Zustand.
- [ ] Query loading/error states render correctly.
- [ ] Booking persistence still works after restart.

---

# 5. Custom Hooks Architecture

Create:

```text
src/hooks/
├── useRoomFilters.ts
├── useRoomAvailability.ts
├── useBookingSlots.ts
├── useBookings.ts
├── useBookingActions.ts
└── useNotifications.ts
```

## 5.1 `useRoomFilters`

Responsibilities:

- [ ] Read search/filter state.
- [ ] Derive filtered room list.
- [ ] Expose `hasActiveFilters`.
- [ ] Expose reset helper.
- [ ] Use `useMemo`.

## 5.2 `useRoomAvailability`

Responsibilities:

- [ ] Determine `Available Now` / `Occupied`.
- [ ] Read active bookings.
- [ ] Derive current room status.
- [ ] Keep status logic out of `RoomCard`.

## 5.3 `useBookingSlots`

Responsibilities:

- [ ] Generate slot UI state.
- [ ] Determine `AVAILABLE`.
- [ ] Determine `SELECTED`.
- [ ] Determine `BOOKED`.
- [ ] Determine `PAST`.
- [ ] Call conflict utilities instead of duplicating logic.

## 5.4 `useBookings`

Responsibilities:

- [ ] Return active bookings.
- [ ] Return booking by ID.
- [ ] Return room bookings.
- [ ] Avoid repeated filtering code in screens.

## 5.5 `useBookingActions`

Responsibilities:

- [ ] Create booking.
- [ ] Final conflict validation.
- [ ] Generate booking ID.
- [ ] Persist via Zustand.
- [ ] Schedule notification.
- [ ] Invalidate relevant TanStack Query cache.
- [ ] Cancel booking.
- [ ] Cancel notification.
- [ ] Release/invalidate availability.

## 5.6 `useNotifications`

Responsibilities:

- [ ] Permission flow.
- [ ] Schedule reminder.
- [ ] Cancel reminder.
- [ ] Expose safe status/error result.

## Hook Rules

- [ ] Hooks must not hide unclear side effects.
- [ ] Hooks must have typed return values.
- [ ] Keep pure utilities outside hooks.
- [ ] Do not build a giant “god hook”.

---

# Phase 1 — Project Setup

## Tasks

- [ ] Verify Expo SDK/version.
- [ ] Convert/confirm project is TypeScript-based.
- [ ] Enable strict TypeScript.
- [ ] Install Zustand using Expo-compatible workflow.
- [ ] Install AsyncStorage.
- [ ] Install TanStack Query.
- [ ] Install `expo-notifications`.
- [ ] Install compatible QR package.
- [ ] Configure Expo Router.
- [ ] Configure root providers.
- [ ] Create project folders:

```text
src/
├── app/
├── api/
├── components/
├── hooks/
├── store/
├── services/
├── utils/
├── data/
├── constants/
├── types/
└── lib/
```

## Acceptance Criteria

- [ ] App launches.
- [ ] Expo Router works.
- [ ] Bottom Tabs shell renders.
- [ ] TypeScript strict passes.
- [ ] TanStack Query provider is connected.
- [ ] Zustand store is connected.
- [ ] Lint/typecheck/doctor pass.

---

# Phase 2 — Design System Foundation & UI Polish Base

The UI must follow `design_system.md`.

## 2.1 Design Tokens

Create centralized tokens for:

- [ ] `primary-light` — `#CCFBFA`
- [ ] `primary-main` — `#B1E5E6`
- [ ] `accent-light` — `#F7ADAD`
- [ ] `accent-main` — `#F29191`
- [ ] White/off-white backgrounds.
- [ ] Primary/secondary text colors.
- [ ] Border colors.
- [ ] Spacing.
- [ ] Radius.
- [ ] Shadow/elevation.
- [ ] Typography sizes/weights.

## 2.2 Typography

Implement hierarchy:

- [ ] H1/H2: 24–28px, 700/800.
- [ ] Subtitle: 14–16px, 500.
- [ ] Body/badge: 12–14px, 600.
- [ ] Consistent line heights.

## 2.3 Shared Polished Components

Create polished reusable primitives:

- [ ] `Screen`
- [ ] `AppHeader`
- [ ] `PrimaryButton`
- [ ] `SecondaryButton`
- [ ] `DestructiveButton`
- [ ] `StatusBadge`
- [ ] `FilterChip`
- [ ] `EmptyState`
- [ ] `LoadingState`
- [ ] `ErrorState`

## 2.4 Interaction Polish

- [ ] Press feedback using opacity and scale.
- [ ] RoomCard scales to about `0.98`.
- [ ] Chips/slots/buttons use subtle pressed states.
- [ ] Disabled state is visibly different.
- [ ] Touch targets are mobile-friendly.
- [ ] State transitions are immediate but soft.
- [ ] Avoid excessive or distracting animation.

## Acceptance Criteria

- [ ] UI components use shared tokens.
- [ ] No random one-off colors where token should exist.
- [ ] Press/disabled/selected states are consistent.
- [ ] Spacing is consistently 16–20px where appropriate.
- [ ] Visual style matches the soft teal/pink design system.

---

# Phase 3 — Room Data + TanStack Query Room Fetching

## 3.1 Room Model

Create strict `Room` type:

```ts
interface Room {
  id: string;
  name: string;
  building: Building;
  floor: number;
  capacity: number;
  equipment: Equipment[];
  image?: string;
}
```

- [ ] `Building` should be a union type.
- [ ] `Equipment` should be a union/enum-like type.

## 3.2 Mock Dataset

- [ ] 15–20 rooms.
- [ ] Buildings A, B, C, V.
- [ ] Different capacities.
- [ ] Different equipment combinations.
- [ ] Images/fallbacks.

## 3.3 Async Repository/API Layer

Create async room access:

```text
src/api/rooms.ts
```

- [ ] `getRooms()`
- [ ] `getRoomById(id)`

Even if backed by mock data:

- [ ] Return via async Promise.
- [ ] Keep screens unaware of mock implementation.

## 3.4 TanStack Query Hooks

- [ ] `useRoomsQuery()`.
- [ ] `useRoomQuery(id)`.
- [ ] Typed query results.
- [ ] Loading state.
- [ ] Error state.
- [ ] Empty data handling.

## Acceptance Criteria

- [ ] Rooms load through TanStack Query.
- [ ] Home does not directly import raw room mock array.
- [ ] Room Detail loads room by ID through typed query/repository boundary.
- [ ] Loading/error states are polished.

---

# Phase 4 — Room Discovery + High-Performance FlatList

## Tasks

Create polished `RoomCard`:

- [ ] Image.
- [ ] Name/code.
- [ ] Building/floor.
- [ ] Capacity badge.
- [ ] Equipment badges.
- [ ] Available/Occupied badge.
- [ ] Press feedback.
- [ ] Soft shadow.
- [ ] 16px radius.
- [ ] Correct design tokens.

FlatList:

- [ ] Use `FlatList`.
- [ ] Stable `keyExtractor`.
- [ ] `RoomCard` uses `React.memo`.
- [ ] Memoize `renderItem` with `useCallback`.
- [ ] Tune `initialNumToRender`.
- [ ] Tune `windowSize`.
- [ ] Consider `removeClippedSubviews`.
- [ ] Avoid nested vertical `ScrollView`.

## Acceptance Criteria

- [ ] Scrolling is smooth.
- [ ] Card visual design is polished.
- [ ] Cards navigate to `/room/[id]`.
- [ ] No obvious unnecessary whole-list re-render.

---

# Phase 5 — Search

## Tasks

- [ ] Build polished `SearchBar`.
- [ ] Bind query to Zustand.
- [ ] Search by room name/code.
- [ ] Search is case-insensitive.
- [ ] Search updates immediately.
- [ ] Empty query shows all filtered rooms.
- [ ] No-results state is polished.
- [ ] Search logic lives in `useRoomFilters`.

## Acceptance Criteria

- [ ] Search works with strict typing.
- [ ] Search works together with active filters.
- [ ] Search does not noticeably lag.

---

# Phase 6 — Multi-Parameter Filters

## Building Filter

- [ ] A.
- [ ] B.
- [ ] C.
- [ ] V.

## Capacity Filter

- [ ] Minimum capacity.
- [ ] Supports range 2–20.
- [ ] Rule:

```text
room.capacity >= selectedMinimum
```

## Equipment Filter

- [ ] Projector.
- [ ] Whiteboard.
- [ ] High-spec PC.
- [ ] AC.
- [ ] Multiple selections.
- [ ] Room must contain ALL selected equipment.

## UX

- [ ] Selected chip uses `primary-main`.
- [ ] Unselected chip uses neutral background.
- [ ] Press state uses subtle scale/opacity.
- [ ] Clear Filters action.
- [ ] Show active filter indication.
- [ ] Handle zero-result state.

## Logic

- [ ] Zustand stores filter values.
- [ ] `useRoomFilters` derives result with `useMemo`.
- [ ] Original query data is never mutated.

## Acceptance Criteria

Test:

```text
Search + Building A + Capacity >= 10 + Projector + AC
```

- [ ] Every result satisfies all conditions.
- [ ] Reset works.
- [ ] Visual state is polished and consistent.

---

# Phase 7 — Room Detail + Typed Params

## Tasks

Route:

```text
/room/[id]
```

- [ ] Read typed `id` with `useLocalSearchParams`.
- [ ] Validate `id`.
- [ ] Load room using `useRoomQuery(id)`.
- [ ] Handle invalid ID.
- [ ] Handle loading.
- [ ] Handle query error.

Display:

- [ ] Hero/image.
- [ ] Room name.
- [ ] Building/floor.
- [ ] Capacity.
- [ ] Equipment.
- [ ] Current availability.
- [ ] 7-day selector.
- [ ] Time slots.
- [ ] Booking CTA.

## Acceptance Criteria

- [ ] No untyped route param access.
- [ ] Invalid room route fails gracefully.
- [ ] UI follows design system.

---

# Phase 8 — 7-Day Selector + Time Slots

## Date Selector

- [ ] Today + next 6 days.
- [ ] Exactly 7 dates.
- [ ] Typed date utility.
- [ ] Stored date format is `YYYY-MM-DD`.
- [ ] Selected day is polished and obvious.

## Slots

Required:

- [ ] 07:30–09:30
- [ ] 09:30–11:30
- [ ] 13:00–15:00
- [ ] 15:00–17:00

Slot states:

- [ ] `AVAILABLE`
- [ ] `SELECTED`
- [ ] `BOOKED`
- [ ] `PAST`

- [ ] Past slots disabled.
- [ ] Booked slots disabled.
- [ ] Selected slot uses `primary-main`.
- [ ] Booked slot uses accent/error visual.
- [ ] Do not communicate state by color alone.

Logic:

- [ ] Use `useBookingSlots`.
- [ ] Keep pure date/conflict helpers in `utils`.

---

# Phase 9 — Booking Model + Conflict Engine

## Booking Type

Strict typed model:

```ts
interface Booking {
  id: string;
  userId: string;
  roomId: string;
  date: string;
  slotId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  status: 'active' | 'cancelled';
  notificationId?: string;
}
```

## Conflict Rules

A booking conflicts if:

```text
same roomId
AND same date
AND same slotId
AND existing.status === active
```

- [ ] Cancelled booking does not conflict.
- [ ] Conflict logic exists once in `bookingConflict.ts`.
- [ ] UI uses same conflict logic.
- [ ] Final confirmation reruns conflict check.
- [ ] Prevent rapid double submit.

## Acceptance Criteria

- [ ] Duplicate slot blocked.
- [ ] Different room/same slot allowed.
- [ ] Same room/different slot allowed.
- [ ] Cancelled booking no longer blocks.

---

# Phase 10 — Booking Confirmation + Typed Params

Route:

```text
/booking/confirm
```

Typed params:

```ts
type BookingConfirmParams = {
  roomId: string;
  date: string;
  slotId: string;
};
```

## Tasks

- [ ] Pass primitives only.
- [ ] Validate params.
- [ ] Resolve room/slot data by ID.
- [ ] Show polished booking summary.
- [ ] Confirm button.
- [ ] Back/cancel action.
- [ ] Disable confirm while submitting.
- [ ] Final conflict check.
- [ ] Generate unique booking ID.
- [ ] Save to Zustand.
- [ ] Schedule notification.
- [ ] Invalidate relevant TanStack Query keys.
- [ ] Show success state.

## Acceptance Criteria

- [ ] Params are typed.
- [ ] Booking is created once.
- [ ] Conflict race inside app is blocked.
- [ ] Success UI is polished.

---

# Phase 11 — My Bookings Tab

Route:

```text
/(tabs)/bookings
```

## Tasks

- [ ] Read active bookings from custom hook.
- [ ] Sort upcoming bookings.
- [ ] Render performant list.
- [ ] Show:
  - [ ] Room.
  - [ ] Building/floor.
  - [ ] Date.
  - [ ] Time.
  - [ ] QR action.
  - [ ] Cancel action.
- [ ] Polished empty state.

## Cancellation

- [ ] Confirmation dialog.
- [ ] Cancel scheduled notification.
- [ ] Set booking to cancelled.
- [ ] Persist.
- [ ] Invalidate availability/query cache.
- [ ] Slot becomes available.

## Acceptance Criteria

- [ ] Booking appears immediately.
- [ ] Booking survives restart.
- [ ] Cancellation releases slot.
- [ ] Cancelled booking is removed from active list.

---

# Phase 12 — QR Booking Pass

## Tasks

- [ ] Generate QR from minimal payload:

```json
{
  "bookingId": "...",
  "roomId": "..."
}
```

- [ ] Show booking ID.
- [ ] Show room.
- [ ] Show date.
- [ ] Show time.
- [ ] Show close action.
- [ ] Use polished modal presentation.
- [ ] Active booking only.
- [ ] Handle missing/invalid booking safely.

## Acceptance Criteria

- [ ] QR content matches booking.
- [ ] Modal is polished.
- [ ] No unnecessary private/user data in QR.

---

# Phase 13 — Local Notifications

## Service

Use:

```text
src/services/notificationService.ts
```

Responsibilities:

- [ ] Request/check permission.
- [ ] Configure notification channel if required.
- [ ] Schedule local notification.
- [ ] Cancel scheduled notification.

## Reminder Rule

```text
booking start - 15 minutes
```

- [ ] Do not schedule in past.
- [ ] Booking still succeeds if permission denied.
- [ ] Save `notificationId` to booking.
- [ ] Cancel reminder when booking cancelled.

## Hook

Use `useNotifications` or integrate notification actions into `useBookingActions`.

## Acceptance Criteria

- [ ] 15-minute reminder works.
- [ ] Denied permission does not break booking.
- [ ] Cancellation handles reminder safely.

---

# Phase 14 — Available Now / Occupied

## Tasks

- [ ] Derive status dynamically.
- [ ] Use current date/time.
- [ ] Use active bookings.
- [ ] Do not store static `isOccupied` in room mock.
- [ ] Use `useRoomAvailability`.

UI:

- [ ] Available state.
- [ ] Occupied state.
- [ ] Text/icon + color.
- [ ] Follow design tokens.

## Acceptance Criteria

- [ ] Active current booking → Occupied.
- [ ] Free room → Available Now.
- [ ] Cancel current booking → status recalculates.

---

# Phase 15 — Full UI Polish Pass

This phase is mandatory, not optional.

## 15.1 Visual Consistency

- [ ] Apply design tokens to all screens.
- [ ] Consistent 16px card radius.
- [ ] Consistent shadows.
- [ ] Consistent 16–20px screen padding.
- [ ] Consistent typography hierarchy.
- [ ] Consistent badge/chip sizes.
- [ ] Consistent icon style.

## 15.2 Interaction Polish

- [ ] Pressable scale/opacity.
- [ ] Smooth selection transitions.
- [ ] Disabled state.
- [ ] Loading state.
- [ ] Empty state.
- [ ] Error state.
- [ ] Success state.
- [ ] Confirmation dialogs.
- [ ] Modal transitions.

## 15.3 Mobile Polish

- [ ] SafeArea handling.
- [ ] Keyboard handling for search.
- [ ] Avoid clipped content.
- [ ] Verify small screen.
- [ ] Verify large screen.
- [ ] Verify Android.
- [ ] Verify iOS if available.

## 15.4 Accessibility

- [ ] Touch targets are large enough.
- [ ] Important pressables use accessibility labels.
- [ ] Status is not color-only.
- [ ] Text remains legible.
- [ ] Disabled state is understandable.

## Acceptance Criteria

- [ ] No screen looks like unfinished default scaffolding.
- [ ] Visual style matches `design_system.md`.
- [ ] Search/filter/booking flows feel cohesive.
- [ ] Every interactive element has clear feedback.

---

# Phase 16 — Performance Pass

## FlatList

- [ ] `React.memo(RoomCard)`.
- [ ] `useCallback(renderItem)`.
- [ ] Stable `keyExtractor`.
- [ ] Review `initialNumToRender`.
- [ ] Review `maxToRenderPerBatch`.
- [ ] Review `windowSize`.
- [ ] Review `removeClippedSubviews`.

## Derived State

- [ ] `useMemo` for filtered rooms.
- [ ] Avoid expensive calculations during render.
- [ ] Avoid repeated `.filter()` logic across components.

## Zustand

- [ ] Use focused selectors.
- [ ] Avoid subscribing components to the entire store.
- [ ] Avoid unnecessary state duplication.

## TanStack Query

- [ ] Stable query keys.
- [ ] Avoid redundant refetches.
- [ ] Correct invalidation after booking/cancellation.
- [ ] Do not put UI-only state into Query cache.

## Acceptance Criteria

- [ ] Smooth room scrolling.
- [ ] Search/filter remains responsive.
- [ ] Booking/QR modal does not trigger unrelated heavy rerenders.

---

# Phase 17 — Error & Edge Case Handling

## Search/Filter

- [ ] Empty search.
- [ ] Zero results.
- [ ] Invalid filter combinations.

## Router Params

- [ ] Missing room ID.
- [ ] Invalid room ID.
- [ ] Missing booking confirmation params.

## Booking

- [ ] Past slot.
- [ ] Slot becomes unavailable before confirm.
- [ ] Double tap confirm.
- [ ] Cancelled booking.
- [ ] Invalid booking ID.

## Query

- [ ] Room loading.
- [ ] Room query error.
- [ ] Empty query result.

## Persistence

- [ ] Empty AsyncStorage.
- [ ] Hydration pending.
- [ ] Corrupted/invalid data fails safely if possible.

## Notification

- [ ] Permission denied.
- [ ] Trigger time already passed.
- [ ] Scheduling error.
- [ ] Cancellation error.

## QR

- [ ] Missing booking.
- [ ] Cancelled booking.
- [ ] Invalid payload.

---

# Phase 18 — Testing

## Search

- [ ] Existing room.
- [ ] Missing room.
- [ ] Clear input.

## Filters

- [ ] Building.
- [ ] Capacity.
- [ ] Equipment.
- [ ] Multiple equipment.
- [ ] Search + filters.
- [ ] Reset filters.

## Booking

- [ ] Valid booking.
- [ ] Conflict blocked.
- [ ] Different room allowed.
- [ ] Different slot allowed.
- [ ] Past slot blocked.
- [ ] Double submit blocked.

## Navigation / Params

- [ ] Tabs.
- [ ] Room detail typed ID.
- [ ] Confirm route typed params.
- [ ] Invalid params.

## Zustand

- [ ] Search/filter state.
- [ ] Booking add/cancel.
- [ ] Persistence.

## TanStack Query

- [ ] Rooms query.
- [ ] Room detail query.
- [ ] Loading/error states.
- [ ] Invalidation after mutation-related changes.

## Hooks

- [ ] Filter hook.
- [ ] Availability hook.
- [ ] Booking slot hook.
- [ ] Booking action hook.
- [ ] Notification hook.

## QR

- [ ] Opens.
- [ ] Correct payload.
- [ ] Closes.

## Notifications

- [ ] Granted.
- [ ] Denied.
- [ ] Valid trigger.
- [ ] Past trigger.
- [ ] Cancellation.

---

# Phase 19 — Final Quality Gate

Run:

```bash
npx expo lint
npx tsc --noEmit
npx expo-doctor
```

Then verify:

- [ ] Zero TypeScript errors.
- [ ] No lint errors.
- [ ] No unresolved Expo compatibility issues.
- [ ] No `any` introduced without justification.
- [ ] No direct raw mock-data import in screens where Query layer should be used.
- [ ] No duplicate booking conflict logic.
- [ ] No screen-level duplicated filter logic.
- [ ] No untyped router param assumptions.
- [ ] No design-system-breaking one-off styles.
- [ ] No unused/debug code.
- [ ] No known crash in primary demo flow.

---

# Phase 20 — Demo Preparation

## Demo 1 — Polished Room Discovery

- [ ] Open Rooms tab.
- [ ] Show polished room cards.
- [ ] Scroll FlatList smoothly.
- [ ] Explain memoization/performance.

## Demo 2 — Search + Filter

- [ ] Search by room.
- [ ] Filter Building A.
- [ ] Capacity >= 10.
- [ ] Projector + AC.
- [ ] Show combined filtering.

## Demo 3 — Typed Navigation

- [ ] Open room detail through `/room/[id]`.
- [ ] Explain typed route param.
- [ ] Open booking confirmation with typed params.

## Demo 4 — Booking + Conflict

- [ ] Select 7-day date.
- [ ] Select slot.
- [ ] Confirm booking.
- [ ] Show duplicate slot disabled/rejected.

## Demo 5 — Zustand + TanStack Query

- [ ] Explain Zustand owns client/global state.
- [ ] Explain TanStack Query owns async room data/cache.
- [ ] Show persisted booking after restart.

## Demo 6 — QR

- [ ] Open My Bookings.
- [ ] Open QR pass.

## Demo 7 — Cancellation

- [ ] Cancel booking.
- [ ] Show slot available again.

## Demo 8 — Notification

- [ ] Show/explain reminder scheduled 15 minutes before booking.

---

# Recommended Git Commits

```text
chore: configure strict TypeScript and Expo Router
chore: add Zustand and TanStack Query providers
style: add design tokens and polished shared components
feat: add typed room query layer
feat: add optimized room discovery FlatList
feat: add room search
feat: add multi-parameter room filters
feat: add typed room detail route
feat: add seven-day selector and booking slots
feat: implement booking conflict engine
feat: add typed booking confirmation flow
feat: add bookings tab and cancellation
feat: add QR booking pass
feat: add local booking reminders
feat: derive realtime room availability
refactor: extract booking and filter custom hooks
perf: optimize FlatList and state subscriptions
style: polish booking app user experience
test: verify routing state queries and booking flows
docs: update task progress
```

---

# Current Progress

```text
Phase 1  — Project Setup                         [ ]
Phase 2  — Design System Foundation             [ ]
Phase 3  — Room Query/Data Layer                [ ]
Phase 4  — Room Discovery FlatList              [ ]
Phase 5  — Search                               [ ]
Phase 6  — Filters                              [ ]
Phase 7  — Room Detail + Typed Params           [ ]
Phase 8  — Date + Time Slots                    [ ]
Phase 9  — Conflict Engine                      [ ]
Phase 10 — Booking Confirmation                 [ ]
Phase 11 — My Bookings Tab                      [ ]
Phase 12 — QR Booking Pass                      [ ]
Phase 13 — Notifications                        [ ]
Phase 14 — Available/Occupied                   [ ]
Phase 15 — Full UI Polish                       [ ]
Phase 16 — Performance                          [ ]
Phase 17 — Edge Cases                           [ ]
Phase 18 — Testing                              [ ]
Phase 19 — Final Quality Gate                   [ ]
Phase 20 — Demo Preparation                     [ ]
```

---

# Definition of Done

The project is complete only when ALL items below are true:

## Core Product
- [ ] Polished UI.
- [ ] Search.
- [ ] Multi-filter.
- [ ] Booking.
- [ ] Conflict prevention.
- [ ] Cancellation.
- [ ] QR booking pass.
- [ ] Local reminder.
- [ ] Persistence.

## Navigation
- [ ] Expo Router.
- [ ] Bottom Tabs.
- [ ] Nested Stack.
- [ ] Typed route/search params.
- [ ] Invalid params handled safely.

## State/Data
- [ ] Zustand used for client/global state.
- [ ] AsyncStorage persistence works.
- [ ] TanStack Query used for async room/data layer.
- [ ] Query cache and invalidation are handled correctly.
- [ ] State ownership is not duplicated.

## Type Safety
- [ ] TypeScript strict enabled.
- [ ] No unresolved TypeScript errors.
- [ ] Domain types are explicit.
- [ ] Route params are typed.
- [ ] Hooks are typed.

## Hooks & Performance
- [ ] Custom hooks extract reusable logic.
- [ ] `React.memo`.
- [ ] `useMemo`.
- [ ] `useCallback`.
- [ ] Focused Zustand selectors.
- [ ] Optimized FlatList.

## Design Quality
- [ ] Design tokens are consistently used.
- [ ] Cards/chips/buttons follow design system.
- [ ] Press feedback exists.
- [ ] Disabled/selected/error/success states are polished.
- [ ] Mobile spacing and touch targets are consistent.

## Quality Gate
- [ ] `npx expo lint` passes.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npx expo-doctor` passes.
- [ ] Full demo flow runs without a known crash.
