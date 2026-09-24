import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, layout, typography } from '../constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: any;
  textStyles?: any;
}

const BaseButton = ({ label, onPress, disabled, loading, style, variantStyles, textStyles }: ButtonProps & { variantStyles: any, textStyles: any }) => (
  <TouchableOpacity
    style={[
      styles.base,
      variantStyles,
      disabled && styles.disabled,
      style,
    ]}
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.8}
  >
    {loading ? (
      <ActivityIndicator color={textStyles.color} />
    ) : (
      <Text style={[styles.text, textStyles]}>{label}</Text>
    )}
  </TouchableOpacity>
);

export const PrimaryButton = (props: ButtonProps) => (
  <BaseButton
    {...props}
    variantStyles={styles.primary}
    textStyles={styles.primaryText}
  />
);

export const SecondaryButton = (props: ButtonProps) => (
  <BaseButton
    {...props}
    variantStyles={styles.secondary}
    textStyles={styles.secondaryText}
  />
);

export const DestructiveButton = (props: ButtonProps) => (
  <BaseButton
    {...props}
    variantStyles={styles.destructive}
    textStyles={styles.destructiveText}
  />
);

const styles = StyleSheet.create({
  base: {
    paddingVertical: layout.spacing.md,
    paddingHorizontal: layout.spacing.xl,
    borderRadius: layout.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 56,
  },
  text: {
    ...typography.body,
    fontSize: 16,
  },
  disabled: {
    backgroundColor: colors.neutral.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  primary: {
    backgroundColor: colors.primary.main,
    ...layout.shadow.soft,
  },
  primaryText: {
    color: '#005A5D', // Darker teal for contrast
  },
  secondary: {
    backgroundColor: colors.primary.light,
  },
  secondaryText: {
    color: '#005A5D',
  },
  destructive: {
    backgroundColor: colors.accent.main,
    ...layout.shadow.soft,
  },
  destructiveText: {
    color: '#FFFFFF',
  },
});
