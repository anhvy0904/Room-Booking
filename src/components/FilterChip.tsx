import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, layout, typography } from '../constants/theme';

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
}

export const FilterChip = ({ label, isActive, onPress, icon }: FilterChipProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        isActive && styles.chipActive,
        pressed && styles.chipPressed
      ]}
    >
      {icon}
      <Text style={[styles.label, isActive && styles.labelActive]}>
        {label}
      </Text>
    </Pressable>
  );
};



const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    borderRadius: layout.radius.full,
    backgroundColor: colors.neutral.offWhite,
    marginRight: layout.spacing.sm,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  chipActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  chipPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  label: {
    ...typography.body,
    color: colors.neutral.textSecondary,
  },
  labelActive: {
    color: '#005A5D',
  },
});
