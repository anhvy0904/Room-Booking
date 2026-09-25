import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Equipment, RoomType } from '../types/room';

export type BookingStatus = 'active' | 'cancelled' | 'checked_in' | 'completed';

export interface FilterState {
  building: string | null;
  minCapacity: number | null;
  equipment: Equipment[];
  roomType: 'all' | RoomType;
}

interface BookingState {
  user: { id: string; name: string; email?: string } | null;
  filters: FilterState;
  searchQuery: string;
  favoriteRoomIds: string[];
  notificationsEnabled: boolean;
  
  // Actions
  setUser: (user: { id: string; name: string; email?: string } | null) => void;
  setSearchQuery: (query: string) => void;
  setBuildingFilter: (building: string | null) => void;
  setCapacityFilter: (capacity: number | null) => void;
  setRoomTypeFilter: (roomType: 'all' | RoomType) => void;
  toggleEquipmentFilter: (equipment: Equipment) => void;
  toggleFavoriteRoom: (roomId: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  clearFilters: () => void;
}

const initialFilters: FilterState = {
  building: null,
  minCapacity: null,
  equipment: [],
  roomType: 'all',
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      user: null,
      filters: initialFilters,
      searchQuery: '',
      favoriteRoomIds: [],
      notificationsEnabled: true,

      setUser: (user) => set({ user }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setBuildingFilter: (building) => 
        set((state) => ({ filters: { ...state.filters, building } })),
      setCapacityFilter: (minCapacity) => 
        set((state) => ({ filters: { ...state.filters, minCapacity } })),
      setRoomTypeFilter: (roomType) =>
        set((state) => ({ filters: { ...state.filters, roomType } })),
      toggleEquipmentFilter: (eq) =>
        set((state) => {
          const currentEq = state.filters.equipment;
          const updatedEq = currentEq.includes(eq)
            ? currentEq.filter((e) => e !== eq)
            : [...currentEq, eq];
          return { filters: { ...state.filters, equipment: updatedEq } };
        }),
      toggleFavoriteRoom: (roomId) =>
        set((state) => {
          const isFav = state.favoriteRoomIds.includes(roomId);
          return {
            favoriteRoomIds: isFav
              ? state.favoriteRoomIds.filter((id) => id !== roomId)
              : [...state.favoriteRoomIds, roomId],
          };
        }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      clearFilters: () => set({ filters: initialFilters, searchQuery: '' }),
    }),
    {
      name: 'vku-booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favoriteRoomIds: state.favoriteRoomIds,
        notificationsEnabled: state.notificationsEnabled,
      }),
    }
  )
);
