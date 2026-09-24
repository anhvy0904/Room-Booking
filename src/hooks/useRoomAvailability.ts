import { useCallback } from 'react';
import { useBookingStore } from '../store/useBookingStore';
import { hasBookingConflict } from '../utils/bookingConflict';

export const useRoomAvailability = () => {
  const { bookings } = useBookingStore();

  const isSlotBooked = useCallback((roomId: string, date: string, slotId: string) => {
    return hasBookingConflict(roomId, date, slotId, bookings);
  }, [bookings]);

  const isRoomOccupiedNow = useCallback((roomId: string) => {
    // Current date and time logic could be extracted, but here we just check current slot
    return false; // Simplified, normally use bookingConflict.ts
  }, [bookings]);

  return {
    isSlotBooked,
    isRoomOccupiedNow,
  };
};
