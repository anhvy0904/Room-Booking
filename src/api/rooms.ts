import { Room } from '../types/room';
import { MOCK_ROOMS } from '../data/rooms';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getRooms = async (): Promise<Room[]> => {
  await delay(500); // Simulate fetch
  return MOCK_ROOMS;
};

export const getRoomById = async (id: string): Promise<Room | undefined> => {
  await delay(300);
  return MOCK_ROOMS.find(r => r.id === id);
};
