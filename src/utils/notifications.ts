import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermissions = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
};

export const scheduleBookingReminder = async (bookingId: string, roomName: string, date: string, startTime: string) => {
  const parts = startTime.split(':');
  if (parts.length !== 2) return;
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);

  const triggerDate = new Date(`${date}T00:00:00`);
  triggerDate.setHours(hours, minutes, 0, 0);
  
  // 15 minutes before
  triggerDate.setMinutes(triggerDate.getMinutes() - 15);

  if (triggerDate > new Date()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Upcoming Study Session 📚",
        body: `Your booking in ${roomName} starts in 15 minutes!`,
        data: { bookingId },
      },
      trigger: triggerDate as any,
    });
  }
};
