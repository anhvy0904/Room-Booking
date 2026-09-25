import { useCallback } from 'react';
import { useDateBookingsQuery } from './useDateBookingsQuery';
import { hasBookingConflict } from '../utils/bookingConflict';

export const useRoomAvailability = (date: string) => {
  const { data: bookingsToday = [] } = useDateBookingsQuery(date);

  const isSlotBooked = useCallback((roomId: string, slotId: string) => {
    return hasBookingConflict(roomId, date, slotId, bookingsToday);
  }, [bookingsToday, date]);

  const isRoomOccupiedNow = useCallback((roomId: string) => {
    return false; // Simplified, normally use bookingConflict.ts
  }, [bookingsToday]);

  return {
    isSlotBooked,
    isRoomOccupiedNow,
  };
};
