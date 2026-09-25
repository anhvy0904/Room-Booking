import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useBookingStore } from '../store/useBookingStore';
import { hasBookingConflict } from '../utils/bookingConflict';
import { scheduleBookingReminder } from '../utils/notifications';
import { TIME_SLOTS } from '../constants/timeSlots';
import { Room } from '../types/room';
import { createBooking } from '../api/bookings';

export const useBookingActions = (room: Room | null | undefined) => {
  const router = useRouter();
  const { user } = useBookingStore();

  const confirmBooking = useCallback((selectedDate: string, selectedSlotId: string | null, onReset: () => void) => {
    if (!selectedSlotId || !user || !room) return;
    
    const slot = TIME_SLOTS.find(s => s.id === selectedSlotId);
    if (!slot) return;

    Alert.alert(
      'Confirm Booking',
      `Room: ${room.name}\nDate: ${selectedDate}\nTime: ${slot.start} - ${slot.end}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          style: 'default',
          onPress: async () => {
            try {
              const newBooking = await createBooking({
                userId: user.id,
                roomId: room.id,
                date: selectedDate,
                slotId: slot.id,
                startTime: slot.start,
                endTime: slot.end,
                createdAt: new Date().toISOString(),
              });
              
              // Schedule notification
              scheduleBookingReminder(newBooking.id, room.name, selectedDate, slot.start);
              
              Alert.alert('Success', 'Booking confirmed!', [
                { text: 'View Pass', onPress: () => router.push('/bookings') },
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error: any) {
              if (error.message === 'SLOT_ALREADY_BOOKED') {
                Alert.alert('Slot Unavailable', 'This slot was just booked by someone else.');
              } else {
                Alert.alert('Error', 'Failed to create booking. Please try again.');
              }
              onReset();
            }
          }
        }
      ]
    );
  }, [room, user, router]);

  return {
    confirmBooking
  };
};
