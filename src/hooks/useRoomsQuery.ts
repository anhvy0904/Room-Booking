import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getRooms, getRoomById, subscribeToRooms } from '../api/rooms';
import { useEffect } from 'react';

export const useRoomsQuery = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = subscribeToRooms((rooms) => {
      queryClient.setQueryData(['rooms'], rooms);
    });
    return () => unsubscribe();
  }, [queryClient]);

  return useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms,
  });
};

export const useRoomQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['rooms', id],
    queryFn: () => (id ? getRoomById(id) : Promise.resolve(undefined)),
    enabled: !!id,
  });
};
