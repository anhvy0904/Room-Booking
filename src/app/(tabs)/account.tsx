import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable, ActivityIndicator } from 'react-native';
import { Screen } from '../../components/Screen';
import { useBookingStore } from '../../store/useBookingStore';
import { signOutUser } from '../../api/auth';
import { confirmAction, showMessage } from '../../utils/alerts';
import { scheduleTestNotification, cancelAllBookingReminders } from '../../utils/notifications';
import {
  Sparkles,
  LogOut,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from 'lucide-react-native';

export default function AccountScreen() {
  const user = useBookingStore((state) => state.user);
  const notificationsEnabled = useBookingStore((state) => state.notificationsEnabled);
  const setNotificationsEnabled = useBookingStore((state) => state.setNotificationsEnabled);

  const [testingNotification, setTestingNotification] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleTestNotification = async () => {
    setTestingNotification(true);
    try {
      await scheduleTestNotification();
    } catch {
      showMessage('Thông báo', 'Không thể khởi tạo thông báo thử nghiệm.');
    } finally {
      setTestingNotification(false);
    }
  };

  const handleSignOut = () => {
    confirmAction('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng VKU Bookroom?', async () => {
      if (signingOut) return;
      setSigningOut(true);
      try {
        await cancelAllBookingReminders();
        await signOutUser();
      } catch {
        showMessage('Lỗi', 'Chưa thể đăng xuất. Vui lòng thử lại.');
      } finally {
        setSigningOut(false);
      }
    });
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tài khoản</Text>
          <Text style={styles.headerSubtitle}>Quản lý thông tin cá nhân và cài đặt thông báo</Text>
        </View>

        {/* User Card */}
        <View style={styles.card}>
          <View style={styles.userProfile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Sinh viên VKU'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'Chưa liên kết email'}</Text>
              <View style={styles.roleBadge}>
                <ShieldCheck size={12} color="#005A5D" />
                <Text style={styles.roleText}>Tài khoản Sinh viên chính thức</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notification Settings Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Cài đặt thông báo & Nhắc lịch</Text>

          {/* Toggle 15-minute reminder */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconArea}>
              <Clock size={20} color="#0284C7" />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Nhắc trước buổi học 15 phút</Text>
              <Text style={styles.settingSubtitle}>
                Tự động gửi thông báo cục bộ tới điện thoại để bạn không bỏ lỡ giờ nhận phòng.
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#CBD5E1', true: '#B1E5E6' }}
              thumbColor={notificationsEnabled ? '#005A5D' : '#F8FAFC'}
            />
          </View>

          {/* Test Notification Button */}
          <View style={styles.testNotificationArea}>
            <Pressable
              disabled={testingNotification}
              onPress={handleTestNotification}
              style={({ pressed }) => [
                styles.testBtn,
                (pressed || testingNotification) && { opacity: 0.8 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Thử thông báo sau 5 giây"
            >
              {testingNotification ? (
                <ActivityIndicator size="small" color="#005A5D" />
              ) : (
                <>
                  <Sparkles size={16} color="#005A5D" />
                  <Text style={styles.testBtnText}>Thử thông báo sau 5 giây</Text>
                </>
              )}
            </Pressable>
            <Text style={styles.testHint}>
              Kiểm tra quyền và hiển thị thông báo mẫu trực tiếp trên thiết bị của bạn.
            </Text>
          </View>
        </View>

        {/* VKU Campus Guidelines */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Quy định sử dụng phòng học VKU</Text>
          <View style={styles.guidelineItem}>
            <CheckCircle2 size={16} color="#16A34A" />
            <Text style={styles.guidelineText}>
              Vui lòng có mặt và bấm <Text style={styles.bold}>Check-in</Text> đúng giờ hoặc tối đa sau 15 phút.
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <CheckCircle2 size={16} color="#16A34A" />
            <Text style={styles.guidelineText}>
              Bảo quản trang thiết bị (máy chiếu, điều hòa, máy tính). Tắt điện trước khi rời phòng.
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <CheckCircle2 size={16} color="#16A34A" />
            <Text style={styles.guidelineText}>
              Nếu kết thúc sớm, vui lòng bấm <Text style={styles.bold}>Trả phòng sớm</Text> để nhường chỗ cho các bạn sinh viên khác.
            </Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <Pressable
          disabled={signingOut}
          onPress={handleSignOut}
          style={({ pressed }) => [
            styles.signOutBtn,
            (pressed || signingOut) && { opacity: 0.8 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Đăng xuất tài khoản"
        >
          {signingOut ? (
            <ActivityIndicator color="#DC2626" />
          ) : (
            <>
              <LogOut size={18} color="#DC2626" />
              <Text style={styles.signOutText}>Đăng xuất khỏi thiết bị này</Text>
            </>
          )}
        </Pressable>

        <Text style={styles.versionFooter}>
          VKU Study Room Booking v1.0.0 • Đại học VKU
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#CCFBFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#005A5D',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0369A1',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIconArea: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  testNotificationArea: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  testBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#CCFBFA',
    paddingVertical: 12,
    borderRadius: 12,
  },
  testBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#005A5D',
  },
  testHint: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  guidelineText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
    flex: 1,
  },
  bold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  versionFooter: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
});
