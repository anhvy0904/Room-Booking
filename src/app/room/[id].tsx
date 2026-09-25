import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DateSelector } from '../../components/DateSelector';
import { TimeSlot } from '../../components/TimeSlot';
import { RoomImageCarousel } from '../../components/RoomImageCarousel';
import {
  Users,
  Building2,
  ChevronLeft,
  Heart,
  Layers,
  Sparkles,
  Info,
  Calendar,
  Clock,
  ShieldCheck,
} from 'lucide-react-native';
import { useRoomQuery } from '../../hooks/useRoomsQuery';
import { useBookingSlots } from '../../hooks/useBookingSlots';
import { useBookingActions } from '../../hooks/useBookingActions';
import { useBookingStore } from '../../store/useBookingStore';
import { PrimaryButton } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { colors, layout, typography } from '../../constants/theme';
import { DEFAULT_ROOM_CATALOG } from '../../data/rooms';

const EQUIPMENT_LABELS: Record<string, string> = {
  projector: 'Máy chiếu sắc nét',
  whiteboard: 'Bảng trắng & Bút dạ',
  high_spec_pc: 'Dàn PC cấu hình cao',
  ac: 'Điều hòa nhiệt độ',
};

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 860;

  const { data: rawRoom, isLoading, isError } = useRoomQuery(id);
  const favoriteRoomIds = useBookingStore((state) => state.favoriteRoomIds);
  const toggleFavoriteRoom = useBookingStore((state) => state.toggleFavoriteRoom);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  // Merge with catalog data for rich images, description, type
  const room = useMemo(() => {
    if (!rawRoom) return null;
    const catalog = DEFAULT_ROOM_CATALOG[rawRoom.id];
    const imageList: string[] = rawRoom.images && rawRoom.images.length > 0
      ? rawRoom.images
      : catalog?.images || (rawRoom.image ? [rawRoom.image] : []);

    return {
      ...rawRoom,
      type: rawRoom.type || catalog?.type || 'study',
      description: rawRoom.description || catalog?.description || 'Phòng học nhóm tiện nghi tại VKU.',
      images: imageList,
    };
  }, [rawRoom]);

  const {
    selectedDate,
    setSelectedDate,
    selectedSlotId,
    setSelectedSlotId,
    getSlotStatus,
    slots,
    isAvailabilityPending,
    isAvailabilityError,
  } = useBookingSlots(id);

  const { confirmBooking, isSubmitting } = useBookingActions(room);

  const isFavorited = room ? favoriteRoomIds.includes(room.id) : false;
  const selectedSlot = slots.find((s) => s.id === selectedSlotId);
  const isSlotReady = Boolean(
    selectedSlot && getSlotStatus(selectedSlot.id, selectedSlot.start) === 'SELECTED'
  );

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text style={styles.loadingText}>Đang tải thông tin phòng...</Text>
        </View>
      </Screen>
    );
  }

  if (isError || !room) {
    return (
      <Screen>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Không tìm thấy phòng hoặc đã xảy ra lỗi</Text>
          <PrimaryButton label="Quay lại" onPress={handleGoBack} />
        </View>
      </Screen>
    );
  }

  const roomImages: string[] = room.images && room.images.length > 0
    ? room.images
    : (room.image ? [room.image] : []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <Pressable
          style={styles.navBtn}
          onPress={handleGoBack}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <ChevronLeft color="#0F172A" size={24} />
        </Pressable>

        <Text style={styles.navTitle} numberOfLines={1}>
          {room.name}
        </Text>

        <Pressable
          style={[styles.navBtn, isFavorited && styles.navBtnFavorited]}
          onPress={() => toggleFavoriteRoom(room.id)}
          accessibilityRole="button"
          accessibilityLabel={isFavorited ? 'Bỏ yêu thích' : 'Yêu thích phòng'}
        >
          <Heart
            size={20}
            color={isFavorited ? '#EF4444' : '#64748B'}
            fill={isFavorited ? '#EF4444' : 'transparent'}
          />
        </Pressable>
      </View>

      <ScrollView
        bounces={false}
        style={styles.container}
        contentContainerStyle={[styles.content, isDesktop && styles.desktopContainer]}
      >
        <View style={isDesktop ? styles.desktopColumns : styles.mobileColumn}>
          {/* LEFT COLUMN: Photos & Room Specs */}
          <View style={isDesktop ? styles.desktopLeft : undefined}>
            {/* Multi-image carousel with fullscreen gallery */}
            <RoomImageCarousel images={roomImages} roomName={room.name} />

            {/* Room Primary Info Header */}
            <View style={styles.header}>
              <View style={styles.typeBadgeContainer}>
                <View
                  style={[
                    styles.typeBadge,
                    room.type === 'lab' ? styles.labBadge : styles.studyBadge,
                  ]}
                >
                  <Sparkles size={12} color={room.type === 'lab' ? '#7C3AED' : '#005A5D'} />
                  <Text
                    style={[
                      styles.typeBadgeText,
                      room.type === 'lab' ? styles.labBadgeText : styles.studyBadgeText,
                    ]}
                  >
                    {room.type === 'lab' ? 'Phòng máy thực hành' : 'Phòng học nhóm'}
                  </Text>
                </View>
                <View style={styles.activeDotBadge}>
                  <View style={styles.dot} />
                  <Text style={styles.activeDotText}>Đang hoạt động</Text>
                </View>
              </View>

              <Text style={styles.title}>{room.name}</Text>

              <View style={styles.specChipsRow}>
                <View style={styles.specChip}>
                  <Building2 size={15} color={colors.primary.main} />
                  <Text style={styles.specChipText}>
                    Tòa {room.building} • Tầng {room.floor}
                  </Text>
                </View>
                <View style={styles.specChip}>
                  <Users size={15} color={colors.primary.main} />
                  <Text style={styles.specChipText}>Sức chứa: {room.capacity} chỗ</Text>
                </View>
              </View>
            </View>

            {/* Description Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Info size={17} color={colors.primary.main} />
                <Text style={styles.sectionTitle}>Mô tả phòng</Text>
              </View>
              <Text style={styles.descriptionText}>{room.description}</Text>
            </View>

            {/* Amenities Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Layers size={17} color={colors.primary.main} />
                <Text style={styles.sectionTitle}>Tiện nghi & Trang thiết bị</Text>
              </View>
              <View style={styles.amenitiesWrap}>
                {room.equipment.map((item, idx) => (
                  <View key={idx} style={styles.amenityItem}>
                    <ShieldCheck size={14} color="#059669" />
                    <Text style={styles.amenityText}>{EQUIPMENT_LABELS[item] || item}</Text>
                  </View>
                ))}
                <View style={styles.amenityItem}>
                  <ShieldCheck size={14} color="#059669" />
                  <Text style={styles.amenityText}>WiFi 6 Campus VKU</Text>
                </View>
                <View style={styles.amenityItem}>
                  <ShieldCheck size={14} color="#059669" />
                  <Text style={styles.amenityText}>Ổ cắm điện từng bàn</Text>
                </View>
              </View>
            </View>
          </View>

          {/* RIGHT COLUMN: Booking Form (Date & Slots) */}
          <View style={isDesktop ? styles.desktopRight : undefined}>
            <View style={styles.bookingCard}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Calendar size={17} color={colors.primary.main} />
                  <Text style={styles.sectionTitle}>1. Chọn ngày học</Text>
                </View>
                <DateSelector
                  selectedDate={selectedDate}
                  onSelectDate={(d) => {
                    setSelectedDate(d);
                    setSelectedSlotId(null);
                  }}
                />
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Clock size={17} color={colors.primary.main} />
                  <Text style={styles.sectionTitle}>2. Chọn khung giờ</Text>
                </View>

                {isAvailabilityPending && (
                  <View style={styles.slotLoading}>
                    <ActivityIndicator size="small" color={colors.primary.main} />
                    <Text style={styles.slotLoadingText}>Đang cập nhật tình trạng phòng...</Text>
                  </View>
                )}

                {isAvailabilityError && (
                  <Text style={styles.errorText}>
                    Không thể tải dữ liệu phòng. Vui lòng thử lại.
                  </Text>
                )}

                <View style={styles.slotsGrid}>
                  {slots.map((slot) => (
                    <TimeSlot
                      key={slot.id}
                      slot={slot}
                      status={getSlotStatus(slot.id, slot.start)}
                      onPress={() => setSelectedSlotId(slot.id)}
                    />
                  ))}
                </View>
              </View>

              {/* Selection Summary Box */}
              {selectedSlot && isSlotReady && (
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryTitle}>Thông tin đặt phòng</Text>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Phòng:</Text>
                    <Text style={styles.summaryValue}>{room.name} (Tòa {room.building})</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Ngày:</Text>
                    <Text style={styles.summaryValue}>{selectedDate}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Thời gian:</Text>
                    <Text style={styles.summaryValue}>
                      {selectedSlot.start} - {selectedSlot.end}
                    </Text>
                  </View>
                </View>
              )}

              {/* Confirm Booking Button */}
              <View style={styles.actionArea}>
                <PrimaryButton
                  label={
                    isSubmitting
                      ? 'Đang xử lý...'
                      : isSlotReady
                      ? 'Xác nhận đặt phòng & Nhận vé QR'
                      : 'Vui lòng chọn khung giờ trống'
                  }
                  loading={isSubmitting}
                  disabled={
                    isAvailabilityPending ||
                    isAvailabilityError ||
                    !isSlotReady
                  }
                  onPress={() =>
                    confirmBooking(selectedDate, selectedSlotId, () => setSelectedSlotId(null))
                  }
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  navBtnFavorited: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECDD3',
  },
  navTitle: {
    ...typography.h2,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingBottom: 40,
  },
  desktopContainer: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  mobileColumn: {
    flexDirection: 'column',
  },
  desktopColumns: {
    flexDirection: 'row',
    gap: 28,
    alignItems: 'flex-start',
  },
  desktopLeft: {
    flex: 1.2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingBottom: 20,
  },
  desktopRight: {
    flex: 1,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 20,
    ...layout.shadow.soft,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.spacing.xl,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  errorText: {
    ...typography.h2,
    color: colors.status.error,
    fontSize: 15,
    marginBottom: layout.spacing.md,
    textAlign: 'center',
  },
  header: {
    padding: layout.spacing.lg,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  typeBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  studyBadge: {
    backgroundColor: colors.primary.light,
  },
  studyBadgeText: {
    color: '#005A5D',
    fontSize: 12,
    fontWeight: '700',
  },
  labBadge: {
    backgroundColor: '#F3E8FF',
  },
  labBadgeText: {
    color: '#7C3AED',
    fontSize: 12,
    fontWeight: '700',
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  activeDotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  activeDotText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  title: {
    ...typography.h1,
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: layout.spacing.sm,
  },
  specChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  specChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    ...typography.h2,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  descriptionText: {
    ...typography.body,
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  amenitiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  amenityText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
  },
  slotLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
  },
  slotLoadingText: {
    fontSize: 12,
    color: '#64748B',
  },
  slotsGrid: {
    marginTop: 4,
  },
  summaryBox: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D9488',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  actionArea: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
});
