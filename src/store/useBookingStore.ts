import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_ROOMS } from '../data/rooms';
import { Room, Equipment } from '../types/room';

export type BookingStatus = 'active' | 'cancelled';

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  date: string; // YYYY-MM-DD
  slotId: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  createdAt: string; // ISO string
  status: BookingStatus;
  notificationId?: string;
}

interface FilterState {
  building: string | null;
  minCapacity: number | null;
  equipment: Equipment[];
}

interface BookingState {
  user: { id: string; name: string } | null;
  rooms: Room[];
  bookings: Booking[];
  filters: FilterState;
  searchQuery: string;
  
  // Actions
  setUser: (user: { id: string; name: string } | null) => void;
  setSearchQuery: (query: string) => void;
  setBuildingFilter: (building: string | null) => void;
  setCapacityFilter: (capacity: number | null) => void;
  toggleEquipmentFilter: (equipment: Equipment) => void;
  clearFilters: () => void;
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
}

const initialFilters: FilterState = {
  building: null,
  minCapacity: null,
  equipment: [],
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      user: { id: "student_001", name: "Current Student" }, // Mock user
      rooms: MOCK_ROOMS, // We keep it here so it can be filtered
      bookings: [],
      filters: initialFilters,
      searchQuery: '',

      setUser: (user) => set({ user }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setBuildingFilter: (building) => 
        set((state) => ({ filters: { ...state.filters, building } })),
      setCapacityFilter: (minCapacity) => 
        set((state) => ({ filters: { ...state.filters, minCapacity } })),
      toggleEquipmentFilter: (eq) =>
        set((state) => {
          const currentEq = state.filters.equipment;
          const updatedEq = currentEq.includes(eq)
            ? currentEq.filter((e) => e !== eq)
            : [...currentEq, eq];
          return { filters: { ...state.filters, equipment: updatedEq } };
        }),
      clearFilters: () => set({ filters: initialFilters, searchQuery: '' }),
      
      addBooking: (booking) => 
        set((state) => ({ bookings: [...state.bookings, booking] })),
      cancelBooking: (bookingId) =>
        set((state) => ({
          bookings: state.bookings.map((b) => 
            b.id === bookingId ? { ...b, status: 'cancelled' } : b
          )
        })),
    }),
    {
      name: 'booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ bookings: state.bookings, user: state.user }), // Only persist bookings and user
    }
  )
);
