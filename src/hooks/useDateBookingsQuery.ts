import { useQuery, useQueryClient } from '@tanstack/react-query';
import { subscribeToDateBookings } from '../api/bookings';
import { useEffect } from 'react';
import { get } from 'firebase/database';
import { ref, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../config/firebase';
import { Booking } from '../types/booking';

const getDateBookings = async (date: string): Promise<Booking[]> => {
  const bookingsRef = ref(db, 'bookings');
  const dateBookingsQuery = query(bookingsRef, orderByChild('date'), equalTo(date));
  const snapshot = await get(dateBookingsQuery);
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    const bookings: Booking[] = [];
    Object.keys(data).forEach((key) => {
      bookings.push({
        id: key,
        ...data[key]
      } as Booking);
    });
    return bookings;
  }
  return [];
};

export const useDateBookingsQuery = (date: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!date) return;
    const unsubscribe = subscribeToDateBookings(date, (bookings) => {
      queryClient.setQueryData(['bookings_by_date', date], bookings);
    });
    return () => unsubscribe();
  }, [queryClient, date]);

  return useQuery({
    queryKey: ['bookings_by_date', date],
    queryFn: () => (date ? getDateBookings(date) : Promise.resolve([])),
    enabled: !!date,
  });
};
