import { ref, get, child } from 'firebase/database';
import { db } from '../config/firebase';
import { Room } from '../types/room';

export const getRooms = async (): Promise<Room[]> => {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, 'rooms'));
  if (snapshot.exists()) {
    const data = snapshot.val();
    const rooms: Room[] = [];
    Object.keys(data).forEach((key) => {
      rooms.push({
        id: key,
        ...data[key]
      } as Room);
    });
    return rooms;
  }
  return [];
};

export const getRoomById = async (id: string): Promise<Room | null> => {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, `rooms/${id}`));
  if (snapshot.exists()) {
    return {
      id,
      ...snapshot.val()
    } as Room;
  }
  return null;
};

import { onValue } from 'firebase/database';

export const subscribeToRooms = (callback: (rooms: Room[]) => void) => {
  const roomsRef = ref(db, 'rooms');
  const unsubscribe = onValue(roomsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const rooms: Room[] = [];
      Object.keys(data).forEach((key) => {
        rooms.push({
          id: key,
          ...data[key]
        } as Room);
      });
      callback(rooms);
    } else {
      callback([]);
    }
  });
  return unsubscribe;
};
