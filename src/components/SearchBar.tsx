import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { colors, layout, typography } from '../constants/theme';
import { Search, X } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChangeText, placeholder = "Search rooms..." }: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <Search size={20} color="#64748b" style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} style={styles.clearBtn}>
          <X size={18} color="#64748b" />
        </Pressable>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.background,
    borderRadius: layout.radius.lg,
    paddingHorizontal: layout.spacing.md,
    height: 50,
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    ...typography.body,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  }
});
