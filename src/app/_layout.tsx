import { useEffect } from 'react';
import { Stack } from "expo-router";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { requestNotificationPermissions } from '../utils/notifications';

export default function RootLayout() {
  useEffect(() => {
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
