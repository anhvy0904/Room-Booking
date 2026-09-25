import { useCallback } from 'react';
import { subscribeToRooms, subscribeToRoom } from '../api/rooms';
import { useRealtimeQuery } from './useRealtimeQuery';
import { Room } from '../types/room';

export const useRoomsQuery = () => useRealtimeQuery(['rooms'], subscribeToRooms);

export const useRoomQuery = (id: string | undefined) => {
  const subscribe = useCallback((next: (room: Room | null) => void, fail: (error: Error) => void) =>
    id ? subscribeToRoom(id, next, fail) : () => {}, [id]);
  return useRealtimeQuery(['rooms', id], subscribe, !!id);
};
