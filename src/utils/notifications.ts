import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';
import { showMessage } from './alerts';

const notificationsSupported = () => Platform.OS !== 'web' && Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

export const configureNotifications = async () => {
  if (!notificationsSupported()) return;
  try {
    const Notifications = await import('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (error) {
    console.warn("Could not configure notifications:", error);
  }
};

export const requestNotificationPermissions = async () => {
  if (!notificationsSupported()) return false;
  try {
    const Notifications = await import('expo-notifications');
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
  } catch (error) {
    console.warn("Notification permission error:", error);
    return false;
  }
};

export const scheduleBookingReminder = async (bookingId: string, roomName: string, date: string, startTime: string) => {
  if (!notificationsSupported()) return;
  const parts = startTime.split(':');
  if (parts.length !== 2) return;
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);

  const triggerDate = new Date(`${date}T00:00:00`);
  triggerDate.setHours(hours, minutes, 0, 0);
  
  // 15 minutes before
  triggerDate.setMinutes(triggerDate.getMinutes() - 15);

  if (triggerDate > new Date()) {
    try {
      if (!(await requestNotificationPermissions())) return;
      const Notifications = await import('expo-notifications');
      await Notifications.scheduleNotificationAsync({
        identifier: bookingId,
        content: {
          title: "Sắp tới giờ học 📚",
          body: `Lịch đặt tại ${roomName} sẽ bắt đầu sau 15 phút!`,
          data: { bookingId },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
          channelId: 'default',
        },
      });
    } catch (error) {
      console.warn("Could not schedule notification:", error);
    }
  }
};

export const scheduleTestNotification = async (onTriggered?: () => void) => {
  if (notificationsSupported()) {
    const granted = await requestNotificationPermissions();
    if (!granted) {
      showMessage('Thông báo bị chặn', 'Vui lòng cấp quyền thông báo trong Cài đặt thiết bị để nhận nhắc lịch.');
      return false;
    }
    try {
      const Notifications = await import('expo-notifications');
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "VKU Bookroom 📚",
          body: "Thông báo thử nghiệm hoạt động tốt! Nhắc nhở sẽ gửi trước giờ học 15 phút.",
          data: { type: 'test' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5,
          channelId: 'default',
        },
      });
      showMessage('Đã lên lịch', 'Thông báo thử nghiệm sẽ xuất hiện sau 5 giây.');
      return true;
    } catch (e) {
      console.warn('Lỗi gửi thông báo thử nghiệm:', e);
      return false;
    }
  } else {
    // Web / Expo Go simulation
    showMessage('Đã hẹn giờ', 'Thông báo thử nghiệm sẽ kích hoạt sau 5 giây.');
    setTimeout(() => {
      showMessage('VKU Bookroom 📚', 'Thông báo thử nghiệm: Hệ thống thông báo và nhắc lịch sẵn sàng!');
      onTriggered?.();
    }, 5000);
    return true;
  }
};

export const cancelBookingReminder = async (bookingId: string) => {
  if (!notificationsSupported()) return;
  try {
    const Notifications = await import('expo-notifications');
    const reminders = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(reminders
      .filter((reminder) => reminder.identifier === bookingId || reminder.content.data?.bookingId === bookingId)
      .map((reminder) => Notifications.cancelScheduledNotificationAsync(reminder.identifier)));
  } catch (error) {
    console.warn('Could not cancel booking reminder:', error);
  }
};

export const cancelAllBookingReminders = async () => {
  if (!notificationsSupported()) return;
  const Notifications = await import('expo-notifications');
  const reminders = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(reminders.filter(reminder => typeof reminder.content.data?.bookingId === 'string')
    .map(reminder => Notifications.cancelScheduledNotificationAsync(reminder.identifier)));
};
