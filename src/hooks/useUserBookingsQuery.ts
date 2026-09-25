import { useCallback } from 'react';
import { subscribeToUserBookings } from '../api/bookings';
import { useBookingStore } from '../store/useBookingStore';
import { Booking } from '../types/booking';
import { useRealtimeQuery } from './useRealtimeQuery';

export const useUserBookingsQuery = () => {
  const userId = useBookingStore(state => state.user?.id);
  const subscribe = useCallback((next: (bookings: Booking[]) => void, fail: (error: Error) => void) =>
    userId ? subscribeToUserBookings(userId, next, fail) : () => {}, [userId]);
  return useRealtimeQuery(['bookings', userId], subscribe, !!userId);
};
