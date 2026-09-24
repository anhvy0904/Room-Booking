import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, layout, typography } from '../constants/theme';
import { TimeSlot as TimeSlotType, SlotStatus } from '../constants/timeSlots';
import { Clock, Check, X, AlertCircle } from 'lucide-react-native';

interface TimeSlotProps {
  slot: TimeSlotType;
  status: SlotStatus;
  onPress: () => void;
}

export const TimeSlot = ({ slot, status, onPress }: TimeSlotProps) => {
  const isAvailable = status === 'AVAILABLE';
  const isSelected = status === 'SELECTED';
  const isBooked = status === 'BOOKED';
  const isPast = status === 'PAST';

  const getIcon = () => {
    if (isSelected) return <Check size={16} color="#fff" />;
    if (isBooked) return <X size={16} color="#94a3b8" />;
    if (isPast) return <AlertCircle size={16} color="#94a3b8" />;
    return <Clock size={16} color="#0ea5e9" />;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={!isAvailable && !isSelected}
      style={({ pressed }) => [
        styles.container,
        isAvailable && styles.available,
        isSelected && styles.selected,
        (isBooked || isPast) && styles.disabled,
        pressed && isAvailable && styles.pressed
      ]}
    >
      {getIcon()}
      <Text style={[
        styles.timeText,
        isAvailable && styles.timeAvailable,
        isSelected && styles.timeSelected,
        (isBooked || isPast) && styles.timeDisabled
      ]}>
        {slot.start} - {slot.end}
      </Text>
      
      {(isBooked || isPast) && (
        <Text style={styles.statusLabel}>
          {isBooked ? 'Booked' : 'Passed'}
        </Text>
      )}
    </Pressable>
  );
};



const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: layout.spacing.md,
    borderRadius: layout.radius.lg,
    marginBottom: 12,
    borderWidth: 1,
    gap: 12,
  },
  available: {
    backgroundColor: colors.neutral.offWhite,
    borderColor: colors.neutral.border,
  },
  selected: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabled: {
    backgroundColor: colors.neutral.border,
    borderColor: colors.neutral.disabled,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  timeText: {
    ...typography.body,
    fontSize: 16,
    flex: 1,
  },
  timeAvailable: {
    color: colors.neutral.textMain,
  },
  timeSelected: {
    color: '#005A5D',
  },
  timeDisabled: {
    color: colors.neutral.textMuted,
  },
  statusLabel: {
    ...typography.badge,
    color: colors.neutral.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }
});
