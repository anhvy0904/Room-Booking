import { useEffect } from 'react';
import { Stack } from "expo-router";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { requestNotificationPermissions, configureNotifications } from '../utils/notifications';
import { useAuth } from '../hooks/useAuth';

export default function RootLayout() {
  const { loading } = useAuth();

  useEffect(() => {
    configureNotifications();
    requestNotificationPermissions();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="room/[id]" options={{ presentation: 'card', headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
