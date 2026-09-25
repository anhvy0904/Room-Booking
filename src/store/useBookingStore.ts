import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Room, Equipment } from '../types/room';

import { Booking } from '../types/booking';

export type BookingStatus = 'active' | 'cancelled';

interface FilterState {
  building: string | null;
  minCapacity: number | null;
  equipment: Equipment[];
}

interface BookingState {
  user: { id: string; name: string } | null;
  filters: FilterState;
  searchQuery: string;
  
  // Actions
  setUser: (user: { id: string; name: string } | null) => void;
  setSearchQuery: (query: string) => void;
  setBuildingFilter: (building: string | null) => void;
  setCapacityFilter: (capacity: number | null) => void;
  toggleEquipmentFilter: (equipment: Equipment) => void;
  clearFilters: () => void;
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
    }),
    {
      name: 'booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user }), // Only persist user
    }
  )
);
