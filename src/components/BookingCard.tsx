import React from 'react';
import { useNow } from '../hooks/useNow';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Booking } from '../types/booking';
import { useRoomQuery } from '../hooks/useRoomsQuery';
import { colors, layout, typography } from '../constants/theme';
import { Calendar, Clock, MapPin, QrCode, CheckCircle2, LogOut, Ban, Info } from 'lucide-react-native';
import { toLocalDateString } from '../utils/dateUtils';

interface BookingCardProps {
  booking: Booking;
  onShowQR: (booking: Booking, roomName: string) => void;
  onCancel: (booking: Booking) => void;
  onCheckIn?: (booking: Booking) => void;
  onCheckOut?: (booking: Booking) => void;
}

export const BookingCard = ({ booking, onShowQR, onCancel, onCheckIn, onCheckOut }: BookingCardProps) => {
  const { data: room } = useRoomQuery(booking.roomId);
  const now = useNow();

  const isPast = new Date(`${booking.date}T${booking.endTime}`).getTime() <= now.getTime();
  const roomName = room?.name || `Phòng ${booking.roomId}`;

  // Check-in window: allows check-in starting 30 mins before slot start on the booking date up to slot end
  const todayStr = toLocalDateString(now);
  const isToday = booking.date === todayStr;

  const startMillis = new Date(`${booking.date}T${booking.startTime}`).getTime();
  const endMillis = new Date(`${booking.date}T${booking.endTime}`).getTime();
  const nowMillis = now.getTime();

  // Allow check-in within 30 mins before start until end
  const isCheckInEligible = isToday && (nowMillis >= startMillis - 30 * 60 * 1000) && (nowMillis <= endMillis);

  // Status computation
  const isCancelled = booking.status === 'cancelled';
  const isCheckedIn = booking.status === 'checked_in';
  const isCompleted = booking.status === 'completed';
  const isActive = booking.status === 'active' && !isPast;
  const isExpired = booking.status === 'active' && isPast;

  return (
    <View style={styles.card}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <Text style={styles.title} numberOfLines={1}>{roomName}</Text>
          <View style={styles.statusRow}>
            {isCheckedIn ? (
              <View style={[styles.badge, styles.badgeCheckedIn]}>
                <CheckCircle2 size={12} color="#0284C7" />
                <Text style={styles.badgeTextCheckedIn}>Đã nhận phòng</Text>
              </View>
            ) : isCompleted ? (
              <View style={[styles.badge, styles.badgeCompleted]}>
                <Text style={styles.badgeTextNeutral}>Đã hoàn thành</Text>
              </View>
            ) : isCancelled ? (
              <View style={[styles.badge, styles.badgeCancelled]}>
                <Ban size={12} color="#DC2626" />
                <Text style={styles.badgeTextCancelled}>Đã hủy</Text>
              </View>
            ) : isExpired ? (
              <View style={[styles.badge, styles.badgeNeutral]}>
                <Text style={styles.badgeTextNeutral}>Đã qua giờ</Text>
              </View>
            ) : (
              <View style={[styles.badge, styles.badgeActive]}>
                <View style={styles.greenDot} />
                <Text style={styles.badgeTextActive}>Sắp tới</Text>
              </View>
            )}
          </View>
        </View>

        {/* QR Button (available for active, checked_in, or past for review) */}
        {!isCancelled && (
          <Pressable
            style={({ pressed }) => [styles.qrBtn, pressed && styles.btnPressed]}
            onPress={() => onShowQR(booking, roomName)}
            accessibilityRole="button"
            accessibilityLabel="Xem vé QR"
          >
            <QrCode size={16} color="#005A5D" />
            <Text style={styles.qrBtnText}>Vé QR</Text>
          </Pressable>
        )}
      </View>

      {/* Info Grid */}
      <View style={styles.infoGrid}>
        <View style={styles.infoRow}>
          <Calendar size={15} color="#64748B" />
          <Text style={styles.infoText}>{booking.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Clock size={15} color="#64748B" />
          <Text style={styles.infoText}>{booking.startTime} - {booking.endTime}</Text>
        </View>
        {room && (
          <View style={styles.infoRow}>
            <MapPin size={15} color="#64748B" />
            <Text style={styles.infoText}>Tòa {room.building}, Tầng {room.floor}</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      {(isActive || isCheckedIn) && (
        <View style={styles.actionsFooter}>
          {/* Check-in button */}
          {isActive && onCheckIn && (
            <Pressable
              disabled={!isCheckInEligible}
              onPress={() => onCheckIn(booking)}
              style={({ pressed }) => [
                styles.actionBtn,
                styles.checkInBtn,
                !isCheckInEligible && styles.btnDisabled,
                pressed && isCheckInEligible && styles.btnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Xác nhận nhận phòng"
            >
              <CheckCircle2 size={16} color={isCheckInEligible ? "#FFFFFF" : "#94A3B8"} />
              <Text style={[styles.actionBtnText, isCheckInEligible ? styles.whiteText : styles.disabledText]}>
                {isCheckInEligible ? 'Nhận phòng (Check-in)' : 'Chưa đến giờ nhận phòng'}
              </Text>
            </Pressable>
          )}

          {/* Early checkout button when checked-in */}
          {isCheckedIn && onCheckOut && (
            <Pressable
              onPress={() => onCheckOut(booking)}
              style={({ pressed }) => [
                styles.actionBtn,
                styles.checkOutBtn,
                pressed && styles.btnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Trả phòng sớm"
            >
              <LogOut size={16} color="#005A5D" />
              <Text style={[styles.actionBtnText, styles.primaryText]}>
                Trả phòng sớm (Giải phóng chỗ)
              </Text>
            </Pressable>
          )}

          {/* Cancel button if active and not checked-in */}
          {isActive && (
            <Pressable
              onPress={() => onCancel(booking)}
              style={({ pressed }) => [
                styles.actionBtn,
                styles.cancelBtn,
                pressed && styles.btnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Hủy đặt phòng"
            >
              <Ban size={15} color="#DC2626" />
              <Text style={styles.cancelBtnText}>Hủy lịch</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Helpful note if check-in not eligible yet */}
      {isActive && !isCheckInEligible && !isCheckedIn && (
        <View style={styles.checkInHint}>
          <Info size={13} color="#64748B" />
          <Text style={styles.checkInHintText}>
            Nút nhận phòng sẽ khả dụng từ 30 phút trước giờ bắt đầu ({booking.startTime}).
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.background,
    borderRadius: layout.radius.lg,
    padding: layout.spacing.lg,
    marginBottom: layout.spacing.md,
    ...layout.shadow.soft,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleArea: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    ...typography.h2,
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  badgeActive: {
    backgroundColor: '#DCFCE7',
  },
  badgeTextActive: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  badgeCheckedIn: {
    backgroundColor: '#E0F2FE',
  },
  badgeTextCheckedIn: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  badgeCompleted: {
    backgroundColor: '#F1F5F9',
  },
  badgeCancelled: {
    backgroundColor: '#FEE2E2',
  },
  badgeTextCancelled: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  badgeNeutral: {
    backgroundColor: '#F1F5F9',
  },
  badgeTextNeutral: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  qrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary.light,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  qrBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#005A5D',
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  infoGrid: {
    gap: 6,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
  },
  actionsFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    minHeight: 42,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  checkInBtn: {
    backgroundColor: '#0284C7',
    flex: 1,
  },
  checkOutBtn: {
    backgroundColor: colors.primary.light,
    flex: 1,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  cancelBtn: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  whiteText: {
    color: '#FFFFFF',
  },
  primaryText: {
    color: '#005A5D',
  },
  btnDisabled: {
    backgroundColor: '#E2E8F0',
    opacity: 0.8,
  },
  disabledText: {
    color: '#94A3B8',
  },
  checkInHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  checkInHintText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
});
