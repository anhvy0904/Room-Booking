import { useMemo } from 'react';
import { useBookingStore } from '../store/useBookingStore';
import { Room } from '../types/room';
import { removeVietnameseTones } from '../utils/search';
import { EQUIPMENT_LABELS } from '../constants/equipment';

export const useRoomFilters = (rooms: Room[] | undefined) => {
  const { filters, searchQuery } = useBookingStore();

  const filteredRooms = useMemo(() => {
    if (!rooms) return [];

    return rooms.filter((room: Room) => {
      // 1. Search filter with Vietnamese unaccented matching
      if (searchQuery.trim()) {
        const cleanQuery = removeVietnameseTones(searchQuery);
        const cleanName = removeVietnameseTones(room.name);
        const cleanId = removeVietnameseTones(room.id);
        const cleanBuilding = removeVietnameseTones(`Tòa ${room.building} Toa ${room.building} Khu ${room.building}`);
        const cleanFloor = removeVietnameseTones(`Tầng ${room.floor} Tang ${room.floor}`);
        const cleanDesc = removeVietnameseTones(room.description || '');
        const cleanType = removeVietnameseTones(room.type === 'lab' ? 'Phòng máy tính lab máy' : 'Phòng học nhóm tự học');
        const cleanEquipment = room.equipment
          .map((eq) => removeVietnameseTones(EQUIPMENT_LABELS[eq] || eq))
          .join(' ');

        const searchableBlock = `${cleanName} ${cleanId} ${cleanBuilding} ${cleanFloor} ${cleanDesc} ${cleanType} ${cleanEquipment}`;

        // Every keyword in query must match
        const queryTerms = cleanQuery.split(/\s+/).filter(Boolean);
        const matchesAllTerms = queryTerms.every((term) => searchableBlock.includes(term));
        if (!matchesAllTerms) return false;
      }
      
      // 2. Room Type filter
      if (filters.roomType && filters.roomType !== 'all') {
        const type = room.type || (room.equipment.includes('high_spec_pc' as any) ? 'lab' : 'study');
        if (type !== filters.roomType) return false;
      }

      // 3. Building filter
      if (filters.building && room.building !== filters.building) {
        return false;
      }
      
      // 4. Capacity filter
      if (filters.minCapacity && room.capacity < filters.minCapacity) {
        return false;
      }
      
      // 5. Equipment filter (AND condition)
      if (filters.equipment.length > 0) {
        const hasAllEquipment = filters.equipment.every((eq) => room.equipment.includes(eq));
        if (!hasAllEquipment) return false;
      }
      
      return true;
    });
  }, [rooms, filters, searchQuery]);

  const hasActiveFilters = !!filters.building || !!filters.minCapacity || filters.equipment.length > 0 || (filters.roomType !== 'all') || !!searchQuery.trim();

  return {
    filteredRooms,
    hasActiveFilters,
  };
};
