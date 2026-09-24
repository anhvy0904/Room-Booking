import { useMemo } from 'react';
import { useBookingStore } from '../store/useBookingStore';
import { Room } from '../types/room';

export const useRoomFilters = (rooms: Room[] | undefined) => {
  const { filters, searchQuery } = useBookingStore();

  const filteredRooms = useMemo(() => {
    if (!rooms) return [];

    return rooms.filter((room: Room) => {
      // Search by name or id
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!room.name.toLowerCase().includes(query) && !room.id.toLowerCase().includes(query)) {
          return false;
        }
      }
      
      // Building filter
      if (filters.building && room.building !== filters.building) {
        return false;
      }
      
      // Capacity filter
      if (filters.minCapacity && room.capacity < filters.minCapacity) {
        return false;
      }
      
      // Equipment filter
      if (filters.equipment.length > 0) {
        const hasAllEquipment = filters.equipment.every((eq) => room.equipment.includes(eq));
        if (!hasAllEquipment) return false;
      }
      
      return true;
    });
  }, [rooms, filters, searchQuery]);

  const hasActiveFilters = !!filters.building || !!filters.minCapacity || filters.equipment.length > 0;

  return {
    filteredRooms,
    hasActiveFilters,
  };
};
