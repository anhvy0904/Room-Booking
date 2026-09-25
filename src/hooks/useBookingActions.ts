import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useBookingStore } from '../store/useBookingStore';
import { scheduleBookingReminder } from '../utils/notifications';
import { confirmAction, showMessage } from '../utils/alerts';
import { TIME_SLOTS } from '../constants/timeSlots';
import { Room } from '../types/room';
import { createBooking } from '../api/bookings';

export const useBookingActions = (room: Room | null | undefined) => {
  const router = useRouter();
  const user = useBookingStore((state) => state.user);
  const pending = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const confirmBooking = useCallback((selectedDate: string, selectedSlotId: string | null, onReset: () => void) => {
    if (!selectedSlotId || !room || pending.current) return;
    if (!user) {
      showMessage('Sign in required', 'Please wait for sign-in and try again.');
      return;
    }
    const slot = TIME_SLOTS.find(s => s.id === selectedSlotId);
    if (!slot) return;

    confirmAction('Xác nhận đặt phòng', `Phòng: ${room.name}\nNgày: ${selectedDate}\nKhung giờ: ${slot.start} - ${slot.end}`, async () => {
      if (pending.current) return;
      pending.current = true;
      setIsSubmitting(true);
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
        await scheduleBookingReminder(newBooking.id, room.name, selectedDate, slot.start);
        onReset();
        showMessage('Thành công', 'Đặt phòng thành công! Vé QR của bạn đã được tạo trong mục Lịch của tôi.');
        router.replace('/bookings');
      } catch (error) {
        const code = error instanceof Error ? error.message : '';
        if (code === 'SLOT_ALREADY_BOOKED') {
          showMessage('Khung giờ không khả dụng', 'Khung giờ này vừa có người đặt. Vui lòng chọn khung giờ khác.');
        } else if (code === 'SLOT_PAST' || code === 'INVALID_BOOKING') {
          showMessage('Khung giờ không hợp lệ', 'Vui lòng chọn khung giờ hợp lệ trong vòng 7 ngày tới.');
        } else {
          showMessage('Lỗi', 'Không thể tạo đặt phòng. Vui lòng thử lại.');
        }
        onReset();
      } finally {
        pending.current = false;
        setIsSubmitting(false);
      }
    });
  }, [room, user, router]);

  return { confirmBooking, isSubmitting };
};
