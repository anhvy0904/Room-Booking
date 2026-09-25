import { useState, useCallback } from 'react';
import { TIME_SLOTS, SlotStatus, TimeSlot as TimeSlotType } from '../constants/timeSlots';
import { getNextSevenDays } from '../utils/dateUtils';
import { useRoomAvailability } from './useRoomAvailability';

export const useBookingSlots = (roomId: string) => {
  const [selectedDate, setSelectedDate] = useState<string>(getNextSevenDays()[0]?.dateString || '');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  
  const { isSlotBooked } = useRoomAvailability(selectedDate);

  const getSlotStatus = useCallback((slotId: string, slotStart: string): SlotStatus => {
    if (selectedSlotId === slotId) return 'SELECTED';
    if (isSlotBooked(roomId, slotId)) return 'BOOKED';
    
    // Check if past
    const now = new Date();
    const isToday = selectedDate === now.toISOString().split('T')[0];
    if (isToday) {
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${hours}:${minutes}`;
      if (currentTimeStr >= slotStart) return 'PAST';
    }
    
    return 'AVAILABLE';
  }, [selectedSlotId, selectedDate, roomId, isSlotBooked]);

  return {
    selectedDate,
    setSelectedDate,
    selectedSlotId,
    setSelectedSlotId,
    getSlotStatus,
    slots: TIME_SLOTS,
  };
};
