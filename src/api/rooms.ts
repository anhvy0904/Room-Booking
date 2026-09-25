import { ref, get, onValue } from 'firebase/database';
import { db } from '../config/firebase';
import { Room } from '../types/room';
import { parseRoom, parseRooms } from '../utils/roomData';

export const getRooms = async (): Promise<Room[]> => parseRooms((await get(ref(db, 'rooms'))).val());
export const getRoomById = async (id: string): Promise<Room | null> => parseRoom(id, (await get(ref(db, `rooms/${id}`))).val());

export const subscribeToRooms = (callback: (rooms: Room[]) => void, onError: (error: Error) => void) =>
  onValue(ref(db, 'rooms'), snapshot => callback(parseRooms(snapshot.val())), onError);

export const subscribeToRoom = (id: string, callback: (room: Room | null) => void, onError: (error: Error) => void) =>
  onValue(ref(db, `rooms/${id}`), snapshot => callback(parseRoom(id, snapshot.val())), onError);
