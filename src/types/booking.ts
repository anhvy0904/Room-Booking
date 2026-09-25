export type BookingStatus = 'active' | 'cancelled' | 'checked_in' | 'completed';

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  date: string;
  slotId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  status: BookingStatus;
  checkedInAt?: string;
  completedAt?: string;
  notificationId?: string;
}

