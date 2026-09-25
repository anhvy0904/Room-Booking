import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Booking } from '../types/booking';
import { useRoomQuery } from '../hooks/useRoomsQuery';
import { colors, layout, typography } from '../constants/theme';
import { PrimaryButton, DestructiveButton } from './Button';
import { StatusBadge } from './StatusBadge';
import { QrCode, Calendar, Clock, MapPin } from 'lucide-react-native';

interface BookingCardProps {
  booking: Booking;
  onShowQR: (booking: Booking, roomName: string) => void;
  onCancel: (booking: Booking) => void;
}

export const BookingCard = ({ booking, onShowQR, onCancel }: BookingCardProps) => {
  const { data: room } = useRoomQuery(booking.roomId);
  
  const isPast = new Date(`${booking.date}T${booking.endTime}`) < new Date();
  const isActive = booking.status === 'active' && !isPast;
  const isCancelled = booking.status === 'cancelled';

  const roomName = room?.name || booking.roomId;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{roomName}</Text>
          <View style={styles.badgeContainer}>
            {isCancelled ? (
              <StatusBadge status="occupied" label="Cancelled" />
            ) : isPast ? (
              <StatusBadge status="neutral" label="Past" />
            ) : (
              <StatusBadge status="available" label="Active" />
            )}
          </View>
        </View>
        
        {isActive && (
          <PrimaryButton 
            label="QR Pass" 
            onPress={() => onShowQR(booking, roomName)} 
            style={styles.qrBtn}
            textStyles={{ fontSize: 14 }}
          />
        )}
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoRow}>
          <Calendar size={16} color={colors.neutral.textSecondary} />
          <Text style={styles.infoText}>{booking.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Clock size={16} color={colors.neutral.textSecondary} />
          <Text style={styles.infoText}>{booking.startTime} - {booking.endTime}</Text>
        </View>
        {room && (
          <View style={styles.infoRow}>
            <MapPin size={16} color={colors.neutral.textSecondary} />
            <Text style={styles.infoText}>Building {room.building}, Floor {room.floor}</Text>
          </View>
        )}
      </View>

      {isActive && (
        <View style={styles.footer}>
          <DestructiveButton 
            label="Cancel Booking" 
            onPress={() => onCancel(booking)} 
            style={styles.cancelBtn}
          />
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: layout.spacing.md,
  },
  title: {
    ...typography.h2,
    marginBottom: layout.spacing.sm,
  },
  badgeContainer: {
    marginTop: 4,
  },
  qrBtn: {
    minHeight: 40,
    paddingVertical: 8,
    paddingHorizontal: layout.spacing.md,
  },
  infoGrid: {
    gap: layout.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    ...typography.body,
    color: colors.neutral.textSecondary,
  },
  footer: {
    marginTop: layout.spacing.lg,
    paddingTop: layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
  },
  cancelBtn: {
    minHeight: 44,
  }
});
