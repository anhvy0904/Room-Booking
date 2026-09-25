import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { BookingCard } from '../../components/BookingCard';
import { QRCodeModal } from '../../components/QRCodeModal';
import { Screen } from '../../components/Screen';
import { ConnectionBanner } from '../../components/ConnectionBanner';
import { layout, typography, colors } from '../../constants/theme';
import { confirmAction, showMessage } from '../../utils/alerts';
import { cancelBookingReminder } from '../../utils/notifications';
import { useUserBookingsQuery } from '../../hooks/useUserBookingsQuery';
import { cancelBooking, checkInBooking, checkOutBooking } from '../../api/bookings';
import { Booking } from '../../types/booking';
import { useNow } from '../../hooks/useNow';
import { CalendarCheck, History, ArrowRight } from 'lucide-react-native';

type TabType = 'upcoming' | 'history';

export default function BookingsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const now = useNow();

  const { data: bookings = [], isLoading, isError, refetch } = useUserBookingsQuery();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<{ booking: Booking; roomName: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Classify bookings
  const { upcomingBookings, historyBookings } = useMemo(() => {
    const upcoming: Booking[] = [];
    const history: Booking[] = [];

    bookings.forEach((b) => {
      const isPast = new Date(`${b.date}T${b.endTime}`).getTime() <= now.getTime();
      if ((b.status === 'active' && !isPast) || b.status === 'checked_in') {
        upcoming.push(b);
      } else {
        history.push(b);
      }
    });

    // Upcoming: nearest first
    upcoming.sort((a, b) => {
      const timeA = new Date(`${a.date}T${a.startTime}`).getTime();
      const timeB = new Date(`${b.date}T${b.startTime}`).getTime();
      return timeA - timeB;
    });

    // History: most recent first
    history.sort((a, b) => {
      const timeA = new Date(`${a.date}T${a.startTime}`).getTime();
      const timeB = new Date(`${b.date}T${b.startTime}`).getTime();
      return timeB - timeA;
    });

    return { upcomingBookings: upcoming, historyBookings: history };
  }, [bookings, now]);

  const displayedList = activeTab === 'upcoming' ? upcomingBookings : historyBookings;

  const handleCancel = (booking: Booking) => {
    confirmAction(
      'Hủy đặt phòng',
      'Bạn có chắc chắn muốn hủy lịch đặt phòng này? Khung giờ sẽ được mở lại cho sinh viên khác.',
      async () => {
        try {
          setActionLoading(true);
          await cancelBooking(booking);
          await cancelBookingReminder(booking.id);
          await refetch();
          showMessage('Thành công', 'Đã hủy đặt phòng thành công.');
        } catch {
          showMessage('Lỗi', 'Không thể hủy đặt phòng. Vui lòng thử lại.');
        } finally {
          setActionLoading(false);
        }
      },
      true
    );
  };

  const handleCheckIn = async (booking: Booking) => {
    try {
      setActionLoading(true);
      await checkInBooking(booking);
      await refetch();
      showMessage('Thành công', 'Nhận phòng thành công! Chúc bạn có buổi học hiệu quả.');
    } catch {
      showMessage('Lỗi', 'Không thể nhận phòng. Vui lòng kiểm tra lại thời gian hoặc kết nối mạng.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = (booking: Booking) => {
    confirmAction(
      'Trả phòng sớm',
      'Bạn có chắc chắn muốn trả phòng sớm? Phòng sẽ được giải phóng ngay lập tức cho các bạn khác đặt.',
      async () => {
        try {
          setActionLoading(true);
          await checkOutBooking(booking);
          await cancelBookingReminder(booking.id);
          await refetch();
          showMessage('Thành công', 'Đã hoàn tất trả phòng. Cảm ơn bạn!');
        } catch {
          showMessage('Lỗi', 'Không thể trả phòng. Vui lòng thử lại sau.');
        } finally {
          setActionLoading(false);
        }
      }
    );
  };

  const handleShowQR = (booking: Booking, roomName: string) => {
    setSelectedBooking({ booking, roomName });
    setQrModalVisible(true);
  };

  return (
    <Screen>
      <ConnectionBanner onRetry={() => { void refetch(); }} />

      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch của tôi</Text>
        <Text style={styles.headerSubtitle}>Quản lý lịch học nhóm, check-in và vé QR</Text>

        {/* Tab switchers */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tabButton, activeTab === 'upcoming' && styles.tabButtonActive]}
            onPress={() => setActiveTab('upcoming')}
          >
            <CalendarCheck size={16} color={activeTab === 'upcoming' ? colors.primary.main : '#64748B'} />
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
              Sắp tới ({upcomingBookings.length})
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabButton, activeTab === 'history' && styles.tabButtonActive]}
            onPress={() => setActiveTab('history')}
          >
            <History size={16} color={activeTab === 'history' ? colors.primary.main : '#64748B'} />
            <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
              Lịch sử ({historyBookings.length})
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Loading state */}
      {isLoading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text style={styles.loadingText}>Đang tải danh sách lịch đặt...</Text>
        </View>
      ) : isError ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Lỗi kết nối</Text>
          <Text style={styles.emptySubtitle}>Không thể tải danh sách đặt phòng.</Text>
          <Pressable style={styles.retryBtn} onPress={() => { void refetch(); }}>
            <Text style={styles.retryBtnText}>Thử lại</Text>
          </Pressable>
        </View>
      ) : displayedList.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>
            {activeTab === 'upcoming' ? 'Không có lịch sắp tới' : 'Chưa có lịch sử đặt phòng'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === 'upcoming'
              ? 'Bạn chưa đặt lịch học nhóm nào trong thời gian tới. Hãy tìm phòng phù hợp ngay!'
              : 'Các lịch học đã hoàn thành hoặc đã hủy sẽ được lưu giữ tại đây.'}
          </Text>
          {activeTab === 'upcoming' && (
            <Pressable
              style={styles.exploreBtn}
              onPress={() => router.push('/(tabs)')}
              accessibilityRole="button"
            >
              <Text style={styles.exploreBtnText}>Khám phá phòng ngay</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </Pressable>
          )}
        </View>
      ) : (
        <FlatList
          data={displayedList}
          keyExtractor={(item) => item.id}
          key={isWide ? 'bookings-grid-wide' : 'bookings-list'}
          numColumns={isWide ? 2 : 1}
          columnWrapperStyle={isWide ? styles.columnWrapper : undefined}
          contentContainerStyle={[styles.listContent, isWide && styles.wideContainer]}
          renderItem={({ item }) => (
            <View style={isWide ? styles.gridCardWrapper : undefined}>
              <BookingCard
                booking={item}
                onShowQR={handleShowQR}
                onCancel={handleCancel}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
              />
            </View>
          )}
        />
      )}

      {selectedBooking && (
        <QRCodeModal
          visible={qrModalVisible}
          onClose={() => setQrModalVisible(false)}
          bookingId={selectedBooking.booking.id}
          roomName={selectedBooking.roomName}
          date={selectedBooking.booking.date}
          time={`${selectedBooking.booking.startTime} - ${selectedBooking.booking.endTime}`}
        />
      )}

      {actionLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: layout.spacing.md,
    paddingTop: layout.spacing.md,
    paddingBottom: layout.spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  headerSubtitle: {
    ...typography.subtitle,
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    ...layout.shadow.soft,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: colors.primary.main,
    fontWeight: '700',
  },
  listContent: {
    padding: layout.spacing.md,
    paddingBottom: 40,
  },
  wideContainer: {
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
  },
  columnWrapper: {
    gap: 16,
  },
  gridCardWrapper: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  emptyTitle: {
    ...typography.h2,
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.body,
    fontSize: 13,
    color: colors.neutral.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 380,
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary.main,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    ...layout.shadow.soft,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
