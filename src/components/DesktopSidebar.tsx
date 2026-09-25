import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { BrandLogo } from './BrandLogo';
import { Compass, Heart, Calendar, User, LogOut } from 'lucide-react-native';
import { usePathname, useRouter } from 'expo-router';
import { useBookingStore } from '../store/useBookingStore';
import { confirmAction, showMessage } from '../utils/alerts';
import { signOutUser } from '../api/auth';
import { cancelAllBookingReminders } from '../utils/notifications';

export const DesktopSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useBookingStore((state) => state.user);
  const favoriteRoomIds = useBookingStore((state) => state.favoriteRoomIds);

  const handleSignOut = () => {
    confirmAction('Đăng xuất', 'Bạn muốn đăng xuất khỏi tài khoản?', async () => {
      try {
        await cancelAllBookingReminders();
        await signOutUser();
      } catch {
        showMessage('Lỗi', 'Chưa thể đăng xuất. Vui lòng thử lại.');
      }
    });
  };

  const navItems = [
    { label: 'Khám phá phòng', path: '/', icon: Compass },
    { label: 'Phòng yêu thích', path: '/favorites', icon: Heart, badge: favoriteRoomIds.length },
    { label: 'Lịch của tôi', path: '/bookings', icon: Calendar },
    { label: 'Tài khoản & Cài đặt', path: '/account', icon: User },
  ];

  return (
    <View style={styles.sidebar}>
      {/* Brand Logo */}
      <View style={styles.brandArea}>
        <BrandLogo size={54} />
      </View>

      {/* Nav Items */}
      <View style={styles.navGroup}>
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Pressable
              key={item.path}
              onPress={() => router.push(item.path as any)}
              style={({ pressed }) => [
                styles.navItem,
                isActive && styles.navItemActive,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Icon size={20} color={isActive ? '#005A5D' : '#64748B'} />
              <Text style={[styles.navText, isActive && styles.navTextActive]}>
                {item.label}
              </Text>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* User Footer Profile */}
      <View style={styles.footer}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.userMeta}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name || 'Sinh viên VKU'}
            </Text>
            <Text style={styles.userRole}>Sinh viên</Text>
          </View>
        </View>

        <Pressable
          onPress={handleSignOut}
          style={({ pressed }) => [styles.signOutBtn, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
          accessibilityLabel="Đăng xuất"
        >
          <LogOut size={18} color="#DC2626" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 260,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    height: '100%',
    paddingVertical: 24,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  brandArea: {
    paddingHorizontal: 8,
    marginBottom: 28,
  },
  navGroup: {
    flex: 1,
    gap: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 12,
  },
  navItemActive: {
    backgroundColor: '#CCFBFA',
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    flex: 1,
  },
  navTextActive: {
    color: '#005A5D',
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#B1E5E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#005A5D',
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  userRole: {
    fontSize: 11,
    color: '#64748B',
  },
  signOutBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
});
