# Architecture: VKU Study Room Booking App

## 1. Source Code Structure
The project follows a standard feature-based Expo structure using `expo-router` for navigation.

```text
src/
├── app/                  # Expo Router screens (file-based routing)
│   ├── _layout.tsx       # Root layout and navigation config
│   ├── index.tsx         # Home Screen (Room Discovery)
│   └── room/
│       └── [id].tsx      # Room Detail & Booking Screen
├── components/           # Reusable UI components
│   ├── RoomCard.tsx      # Memoized room card
│   ├── FilterChip.tsx    # Filter UI chip
│   ├── SearchBar.tsx     # Search input
│   ├── DateSelector.tsx  # 7-day horizontal selector
│   └── TimeSlot.tsx      # Booking time slot
├── store/                # Global State Management
│   └── useBookingStore.ts# Zustand store with persistence
├── services/             # External services integration
│   └── notificationService.ts # (Pending) Expo Local Notifications
├── utils/                # Helper functions
│   ├── bookingConflict.ts# Logic for conflict prevention and availability
│   ├── bookingId.ts      # Unique ID generator
│   └── dateUtils.ts      # Date manipulation for 7-day selector
├── data/                 # Mock data
│   └── rooms.ts          # Static room definitions
└── constants/            # Global constants
    ├── equipment.ts      # Equipment enum and labels
    └── timeSlots.ts      # Fixed 2-hour slots
```

## 2. Navigation
We use **Expo Router** which provides file-based routing.
- **`/` (index)**: Renders `HomeScreen`. Shows the list of rooms, search, and filters.
- **`/room/[id]`**: Renders `RoomDetailScreen`. Displays room info and handles the booking flow.
- *(Future)* **`/bookings`**: Will render `MyBookingsScreen` to show active/cancelled bookings.

## 3. Zustand Store (`useBookingStore`)
State management is handled via `zustand` and persisted using `@react-native-async-storage/async-storage`.

### State
- `user`: Current mocked user session (`{ id: string, name: string }`).
- `rooms`: Array of `Room` objects (currently static mock data).
- `bookings`: Array of `Booking` objects representing user reservations.
- `filters`: An object containing active filters (`building`, `minCapacity`, `equipment[]`).
- `searchQuery`: String representing the current search input.

### Actions
- `setUser`: Updates current user.
- `setSearchQuery`, `setBuildingFilter`, `setCapacityFilter`, `toggleEquipmentFilter`, `clearFilters`: Filter mutation actions.
- `addBooking`: Adds a new booking to the array.
- `cancelBooking`: Sets a booking status to `'cancelled'`.

### Persistence
The `persist` middleware only persists the `bookings` and `user` state, omitting `filters` and `rooms` since rooms are static and filters should reset on app restart.

## 4. Data Models

### Room
```typescript
interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  equipment: Equipment[];
  image?: string;
}
```

### Booking
```typescript
interface Booking {
  id: string;            // e.g., VKU-A201-20260924-0930-X7P2
  userId: string;
  roomId: string;
  date: string;          // YYYY-MM-DD
  slotId: string;
  startTime: string;     // HH:mm
  endTime: string;       // HH:mm
  createdAt: string;     // ISO string
  status: 'active' | 'cancelled';
  notificationId?: string;
}
```

### Time Slot
```typescript
interface TimeSlot {
  id: string;
  start: string;
  end: string;
}
```

## 5. Services
### Notification Service
- Will use `expo-notifications`.
- Responsible for requesting permissions.
- Schedules a local notification 15 minutes prior to the `startTime` of a booking.
- Cancels the scheduled notification if the booking is cancelled.

## 6. Data Flow & Conflict Prevention
1. **Room Discovery**: The Home screen derives a `filteredRooms` array using `useMemo` based on `rooms`, `filters`, and `searchQuery` from Zustand. It uses `isRoomOccupiedNow()` utility to display current status.
2. **Date & Slot Selection**: In the Room Detail screen, slots are dynamically evaluated using `getSlotStatus()`. A slot is marked as `BOOKED` if `hasBookingConflict()` returns true for the current `roomId`, `date`, and `slotId` against the global `bookings` array.
3. **Booking Confirmation**: When "Confirm Booking" is pressed, a final synchronous `hasBookingConflict()` check is performed. If successful, `addBooking()` is called, state updates, and the user is navigated.
