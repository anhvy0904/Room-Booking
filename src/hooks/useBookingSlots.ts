import { useState, useCallback } from 'react';
import { TIME_SLOTS, SlotStatus } from '../constants/timeSlots';
import { getNextSevenDays, isSlotPast } from '../utils/dateUtils';
import { useNow } from './useNow';
import { useRoomAvailability } from './useRoomAvailability';

export const useBookingSlots = (roomId: string) => {
  const now = useNow();
  const [selectedDate, setSelectedDate] = useState<string>(getNextSevenDays()[0]?.dateString || '');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  
  const { isSlotBooked, isPending, isError } = useRoomAvailability(selectedDate);

  const getSlotStatus = useCallback((slotId: string, slotStart: string): SlotStatus => {
    if (isSlotBooked(roomId, slotId)) return 'BOOKED';
    if (isSlotPast(selectedDate, slotStart, now)) return 'PAST';
    if (selectedSlotId === slotId) return 'SELECTED';
    
    return 'AVAILABLE';
  }, [selectedSlotId, selectedDate, roomId, isSlotBooked, now]);

  return {
    isAvailabilityPending: isPending,
    isAvailabilityError: isError,
    selectedDate,
    setSelectedDate,
    selectedSlotId,
    setSelectedSlotId,
    getSlotStatus,
    slots: TIME_SLOTS,
  };
};
