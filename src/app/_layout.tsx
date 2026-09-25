import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';
import { queryClient } from '../lib/queryClient';
import { configureNotifications } from '../utils/notifications';
import { useAuth } from '../hooks/useAuth';
import { useBookingStore } from '../store/useBookingStore';
import { BrandLogo } from '../components/BrandLogo';

export default function RootLayout() {
  const { loading } = useAuth();
  const user = useBookingStore(state => state.user);

  useEffect(() => { void configureNotifications(); }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        {loading ? (
          <View style={{ flex: 1, backgroundColor: '#F6FAF8', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            <BrandLogo size={80} />
            <ActivityIndicator color="#104B50" accessibilityLabel="Đang tải phiên đăng nhập" />
          </View>
        ) : (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={!user}>
              <Stack.Screen name="sign-in" />
            </Stack.Protected>
            <Stack.Protected guard={!!user}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="room/[id]" options={{ presentation: 'card' }} />
            </Stack.Protected>
          </Stack>
        )}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
