import { useCallback } from 'react';
import { useDateBookingsQuery } from './useDateBookingsQuery';
import { hasBookingConflict, isRoomOccupiedNow as checkOccupied } from '../utils/bookingConflict';

export const useRoomAvailability = (date: string) => {
  const { data: bookingsToday = [], isPending, isError } = useDateBookingsQuery(date);

  const isSlotBooked = useCallback((roomId: string, slotId: string) => {
    return hasBookingConflict(roomId, date, slotId, bookingsToday);
  }, [bookingsToday, date]);

  const isRoomOccupiedNow = useCallback((roomId: string) => {
    return checkOccupied(roomId, bookingsToday);
  }, [bookingsToday]);

  return {
    isPending,
    isError,
    isSlotBooked,
    isRoomOccupiedNow,
  };
};
