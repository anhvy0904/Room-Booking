import { Platform, ViewStyle } from 'react-native';

export const shadow = (opacity = 0.1, radius = 8, offsetY = 4, elevation = 2): ViewStyle =>
  Platform.OS === 'web'
    ? { boxShadow: `0px ${offsetY}px ${radius}px rgba(0, 0, 0, ${opacity})` }
    : { shadowColor: '#000', shadowOpacity: opacity, shadowRadius: radius, shadowOffset: { width: 0, height: offsetY }, elevation };
