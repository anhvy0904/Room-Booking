export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  date: string;
  slotId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  status: 'active' | 'cancelled';
  notificationId?: string;
}
