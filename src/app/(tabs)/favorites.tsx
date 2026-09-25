import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, Text, useWindowDimensions, Pressable, ActivityIndicator } from 'react-native';
import { Screen } from '../../components/Screen';
import { RoomCard } from '../../components/RoomCard';
import { useBookingStore } from '../../store/useBookingStore';
import { useRoomsQuery } from '../../hooks/useRoomsQuery';
import { useDateBookingsQuery } from '../../hooks/useDateBookingsQuery';
import { useNow } from '../../hooks/useNow';
import { toLocalDateString } from '../../utils/dateUtils';
import { isRoomOccupiedNow } from '../../utils/bookingConflict';
import { Room } from '../../types/room';
import { Heart, Compass } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function FavoritesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const favoriteRoomIds = useBookingStore((state) => state.favoriteRoomIds);
  const { data: rooms = [], isLoading } = useRoomsQuery();

  const now = useNow();
  const currentDateStr = toLocalDateString(now);
  const { data: bookingsToday = [] } = useDateBookingsQuery(currentDateStr);

  const favoriteRooms = rooms.filter((room) => favoriteRoomIds.includes(room.id));

  const renderItem = useCallback(({ item }: { item: Room }) => {
    const isOccupied = isRoomOccupiedNow(item.id, bookingsToday, now);
    return (
      <View style={isDesktop ? styles.gridCol : styles.listRow}>
        <RoomCard room={item} isOccupied={isOccupied} />
      </View>
    );
  }, [bookingsToday, now, isDesktop]);

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Heart size={24} color="#EF4444" fill="#EF4444" />
          <Text style={styles.headerTitle}>Phòng yêu thích</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {favoriteRooms.length} phòng đã lưu để truy cập nhanh
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#005A5D" />
        </View>
      ) : favoriteRooms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Heart size={44} color="#94A3B8" />
          </View>
          <Text style={styles.emptyTitle}>Chưa có phòng yêu thích</Text>
          <Text style={styles.emptySubtitle}>
            Bấm vào biểu tượng trái tim trên các thẻ phòng để lưu lại những phòng bạn thích nhất nhé!
          </Text>
          <Pressable
            style={({ pressed }) => [styles.exploreBtn, pressed && { opacity: 0.8 }]}
            onPress={() => router.push('/')}
          >
            <Compass size={18} color="#005A5D" />
            <Text style={styles.exploreBtnText}>Khám phá phòng ngay</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          key={isDesktop ? 'desktop-favs-grid' : 'mobile-favs-list'}
          data={favoriteRooms}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={isDesktop ? 2 : 1}
          contentContainerStyle={styles.listContent}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  listContent: {
    padding: 16,
  },
  gridCol: {
    flex: 1,
    paddingHorizontal: 8,
  },
  listRow: {
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 24,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#B1E5E6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  exploreBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#005A5D',
  },
});
