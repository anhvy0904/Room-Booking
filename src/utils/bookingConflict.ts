import { BookingStatus } from '../store/useBookingStore';
import { Booking } from '../types/booking';
import { TIME_SLOTS } from '../constants/timeSlots';

export const isRoomOccupiedNow = (roomId: string, activeBookings: Booking[]): boolean => {
  const now = new Date();
  const currentDateStr = now.toISOString().split('T')[0];
  
  // Format current time as HH:mm
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const currentTimeStr = `${hours}:${minutes}`;

  return activeBookings.some(booking => {
    if (booking.roomId !== roomId || booking.status !== 'active') return false;
    if (booking.date !== currentDateStr) return false;
    
    // Check if current time is within booking time
    return currentTimeStr >= booking.startTime && currentTimeStr < booking.endTime;
  });
};

export const hasBookingConflict = (
  roomId: string,
  date: string,
  slotId: string,
  activeBookings: Booking[]
): boolean => {
  return activeBookings.some(
    (b) =>
      b.roomId === roomId &&
      b.date === date &&
      b.slotId === slotId &&
      b.status === 'active'
  );
};
