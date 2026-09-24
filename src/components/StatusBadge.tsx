import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, layout, typography } from '../constants/theme';

type Status = 'available' | 'occupied' | 'warning' | 'neutral';

interface StatusBadgeProps {
  status: Status;
  label: string;
}

export const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  return (
    <View style={[styles.badge, styles[status]]}>
      <Text style={[styles.text, styles[`${status}Text`]]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: layout.radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.badge,
  },
  available: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  availableText: {
    color: '#15803d',
  },
  occupied: {
    backgroundColor: colors.accent.light,
  },
  occupiedText: {
    color: '#991b1b',
  },
  warning: {
    backgroundColor: '#FEF3C7',
  },
  warningText: {
    color: '#92400E',
  },
  neutral: {
    backgroundColor: colors.neutral.border,
  },
  neutralText: {
    color: colors.neutral.textSecondary,
  },
});
