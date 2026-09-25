import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Screen = ({ children, style }: ScreenProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral.offWhite,
  },
  container: {
    flex: 1,
  },
});
