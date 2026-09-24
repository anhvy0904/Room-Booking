export const generateBookingId = (roomId: string, date: string, slotStart: string): string => {
  // Format: VKU-A201-20260924-0930-X7P2
  const dateStr = date.replace(/-/g, '');
  const timeStr = slotStart.replace(':', '');
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `VKU-${roomId.replace('room_', '')}-${dateStr}-${timeStr}-${randomChars}`;
};
