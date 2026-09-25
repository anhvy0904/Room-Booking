import React from 'react';
import { Tabs } from 'expo-router';
import { Compass, Heart, Calendar, User } from 'lucide-react-native';
import { useWindowDimensions, View, StyleSheet } from 'react-native';
import { DesktopSidebar } from '../../components/DesktopSidebar';
import { useBookingStore } from '../../store/useBookingStore';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const favoriteRoomIds = useBookingStore((state) => state.favoriteRoomIds);

  return (
    <View style={styles.container}>
      {isDesktop && <DesktopSidebar />}
      <View style={styles.content}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#005A5D',
            tabBarInactiveTintColor: '#64748B',
            headerShown: false,
            tabBarStyle: isDesktop
              ? { display: 'none' }
              : {
                  backgroundColor: '#FFFFFF',
                  borderTopColor: '#E2E8F0',
                  height: 60,
                  paddingBottom: 8,
                  paddingTop: 6,
                },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Khám phá',
              tabBarIcon: ({ color }) => <Compass size={22} color={color} />,
            }}
          />
          <Tabs.Screen
            name="favorites"
            options={{
              title: 'Yêu thích',
              tabBarBadge: favoriteRoomIds.length > 0 ? favoriteRoomIds.length : undefined,
              tabBarBadgeStyle: { backgroundColor: '#EF4444', fontSize: 10 },
              tabBarIcon: ({ color }) => <Heart size={22} color={color} />,
            }}
          />
          <Tabs.Screen
            name="bookings"
            options={{
              title: 'Lịch của tôi',
              tabBarIcon: ({ color }) => <Calendar size={22} color={color} />,
            }}
          />
          <Tabs.Screen
            name="account"
            options={{
              title: 'Tài khoản',
              tabBarIcon: ({ color }) => <User size={22} color={color} />,
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
});
