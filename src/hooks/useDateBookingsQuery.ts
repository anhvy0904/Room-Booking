import { useCallback } from 'react';
import { subscribeToDateBookings } from '../api/bookings';
import { Booking } from '../types/booking';
import { useRealtimeQuery } from './useRealtimeQuery';

export const useDateBookingsQuery = (date: string) => {
  const subscribe = useCallback((next: (bookings: Booking[]) => void, fail: (error: Error) => void) =>
    subscribeToDateBookings(date, next, fail), [date]);
  return useRealtimeQuery(['bookings_by_date', date], subscribe, !!date);
};
