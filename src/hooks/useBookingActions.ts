import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useBookingStore } from '../store/useBookingStore';
import { hasBookingConflict } from '../utils/bookingConflict';
import { generateBookingId } from '../utils/bookingId';
import { scheduleBookingReminder } from '../utils/notifications';
import { TIME_SLOTS } from '../constants/timeSlots';
import { Room } from '../types/room';

export const useBookingActions = (room: Room | undefined) => {
  const router = useRouter();
  const { bookings, user, addBooking } = useBookingStore();

  const confirmBooking = useCallback((selectedDate: string, selectedSlotId: string | null, onReset: () => void) => {
    if (!selectedSlotId || !user || !room) return;
    
    const slot = TIME_SLOTS.find(s => s.id === selectedSlotId);
    if (!slot) return;

    // Final conflict check
    if (hasBookingConflict(room.id, selectedDate, selectedSlotId, bookings)) {
      Alert.alert('Slot Unavailable', 'This slot was just booked by someone else.');
      onReset();
      return;
    }

    Alert.alert(
      'Confirm Booking',
      `Room: ${room.name}\nDate: ${selectedDate}\nTime: ${slot.start} - ${slot.end}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          style: 'default',
          onPress: () => {
            const bookingId = generateBookingId(room.id, selectedDate, slot.start);
            addBooking({
              id: bookingId,
              userId: user.id,
              roomId: room.id,
              date: selectedDate,
              slotId: slot.id,
              startTime: slot.start,
              endTime: slot.end,
              createdAt: new Date().toISOString(),
              status: 'active'
            });
            // Schedule notification
            scheduleBookingReminder(bookingId, room.name, selectedDate, slot.start);
            
            Alert.alert('Success', 'Booking confirmed!', [
              { text: 'View Pass', onPress: () => router.push('/bookings') },
              { text: 'OK', onPress: () => router.back() }
            ]);
          }
        }
      ]
    );
  }, [room, bookings, user, addBooking, router]);

  return {
    confirmBooking
  };
};
