import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { colors, layout, typography } from '../constants/theme';
import { AppDate, getNextSevenDays } from '../utils/dateUtils';

interface DateSelectorProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const DateSelector = ({ selectedDate, onSelectDate }: DateSelectorProps) => {
  const dates = React.useMemo(() => getNextSevenDays(), []);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {dates.map((date) => {
        const isSelected = selectedDate === date.dateString;
        
        return (
          <Pressable
            key={date.dateString}
            onPress={() => onSelectDate(date.dateString)}
            style={({ pressed }) => [
              styles.dateBox,
              isSelected && styles.dateBoxSelected,
              pressed && styles.dateBoxPressed
            ]}
          >
            <Text style={[styles.dayOfWeek, isSelected && styles.textSelected]}>
              {date.dayOfWeek}
            </Text>
            <Text style={[styles.dayOfMonth, isSelected && styles.textSelected]}>
              {date.dayOfMonth}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    gap: layout.spacing.md,
  },
  dateBox: {
    width: 60,
    height: 70,
    backgroundColor: colors.neutral.background,
    borderRadius: layout.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral.border,
    ...layout.shadow.soft,
  },
  dateBoxSelected: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  dateBoxPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  dayOfWeek: {
    ...typography.badge,
    color: colors.neutral.textSecondary,
    marginBottom: 4,
  },
  dayOfMonth: {
    ...typography.h2,
    fontSize: 18,
  },
  textSelected: {
    color: '#005A5D',
  }
});
