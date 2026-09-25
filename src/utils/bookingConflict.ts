import { Booking } from '../types/booking';
import { toLocalDateString } from './dateUtils';

export const isRoomOccupiedNow = (roomId: string, activeBookings: Booking[], now: Date = new Date()): boolean => {
  const currentDateStr = toLocalDateString(now);
  
  // Format current time as HH:mm
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const currentTimeStr = `${hours}:${minutes}`;

  return activeBookings.some(booking => {
    const isOccupying = booking.status === 'active' || booking.status === 'checked_in';
    if (booking.roomId !== roomId || !isOccupying) return false;
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
      (b.status === 'active' || b.status === 'checked_in')
  );
};
