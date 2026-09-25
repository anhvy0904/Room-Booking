import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBookingsForUser, subscribeToUserBookings } from '../api/bookings';
import { useEffect } from 'react';
import { useBookingStore } from '../store/useBookingStore';

export const useUserBookingsQuery = () => {
  const queryClient = useQueryClient();
  const userId = useBookingStore((state) => state.user?.id);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = subscribeToUserBookings(userId, (bookings) => {
      queryClient.setQueryData(['bookings', userId], bookings);
    });
    return () => unsubscribe();
  }, [queryClient, userId]);

  return useQuery({
    queryKey: ['bookings', userId],
    queryFn: () => (userId ? getBookingsForUser(userId) : Promise.resolve([])),
    enabled: !!userId,
  });
};
