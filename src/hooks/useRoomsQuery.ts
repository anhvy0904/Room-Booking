import { useQuery } from '@tanstack/react-query';
import { getRooms, getRoomById } from '../api/rooms';

export const useRoomsQuery = () => {
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
