import { ref, get, child, push, set, update, runTransaction, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../config/firebase';
import { Booking } from '../types/booking';

export const getBookingsForUser = async (userId: string): Promise<Booking[]> => {
  const bookingsRef = ref(db, 'bookings');
  const userBookingsQuery = query(bookingsRef, orderByChild('userId'), equalTo(userId));
  const snapshot = await get(userBookingsQuery);
  
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

export const subscribeToUserBookings = (userId: string, callback: (bookings: Booking[]) => void) => {
  const bookingsRef = ref(db, 'bookings');
  const userBookingsQuery = query(bookingsRef, orderByChild('userId'), equalTo(userId));
  
  const unsubscribe = onValue(userBookingsQuery, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const bookings: Booking[] = [];
      Object.keys(data).forEach((key) => {
        bookings.push({
          id: key,
          ...data[key]
        } as Booking);
      });
      callback(bookings);
    } else {
      callback([]);
    }
  });
  return unsubscribe;
};

export const subscribeToDateBookings = (date: string, callback: (bookings: Booking[]) => void) => {
  const bookingsRef = ref(db, 'bookings');
  const dateBookingsQuery = query(bookingsRef, orderByChild('date'), equalTo(date));
  
  const unsubscribe = onValue(dateBookingsQuery, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const bookings: Booking[] = [];
      Object.keys(data).forEach((key) => {
        bookings.push({
          id: key,
          ...data[key]
        } as Booking);
      });
      callback(bookings);
    } else {
      callback([]);
    }
  });
  return unsubscribe;
};

export const createBooking = async (bookingData: Omit<Booking, 'id' | 'status'>): Promise<Booking> => {
  const { roomId, date, slotId, userId } = bookingData;
  
  const slotRef = ref(db, `roomSlots/${roomId}/${date}/${slotId}`);
  const bookingsRef = ref(db, 'bookings');
  const newBookingRef = push(bookingsRef);
  const bookingId = newBookingRef.key as string;

  const transactionResult = await runTransaction(slotRef, (currentData) => {
    if (currentData === null) {
      // Slot is empty, we can claim it
      return { bookingId, userId };
    } else {
      // Slot is already booked, abort transaction
      return; 
    }
  });

  if (!transactionResult.committed) {
    throw new Error('SLOT_ALREADY_BOOKED');
  }

  const newBooking: Booking = {
    ...bookingData,
    id: bookingId,
    status: 'active'
  };

  try {
    await set(newBookingRef, newBooking);
    return newBooking;
  } catch (error) {
    // If booking write fails, rollback the slot lock
    await set(slotRef, null);
    throw error;
  }
};

export const cancelBooking = async (booking: Booking): Promise<void> => {
  const { id, roomId, date, slotId } = booking;
  const updates: any = {};
  
  updates[`bookings/${id}/status`] = 'cancelled';
  updates[`roomSlots/${roomId}/${date}/${slotId}`] = null;
  
  await update(ref(db), updates);
};
