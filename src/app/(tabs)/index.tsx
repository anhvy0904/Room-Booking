import React, { useCallback } from 'react';
import { useNow } from '../../hooks/useNow';
import { toLocalDateString } from '../../utils/dateUtils';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  useWindowDimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BrandLogo } from '../../components/BrandLogo';
import { useBookingStore } from '../../store/useBookingStore';
import { RoomCard } from '../../components/RoomCard';
import { SearchBar } from '../../components/SearchBar';
import { FilterChip } from '../../components/FilterChip';
import { ConnectionBanner } from '../../components/ConnectionBanner';
import { BUILDINGS } from '../../data/rooms';
import { EQUIPMENT_LABELS } from '../../constants/equipment';
import { Room, Equipment } from '../../types/room';
import { isRoomOccupiedNow } from '../../utils/bookingConflict';
import { Filter, Users, RefreshCw, Sparkles, BookOpen, Monitor } from 'lucide-react-native';
import { useRoomsQuery } from '../../hooks/useRoomsQuery';
import { useDateBookingsQuery } from '../../hooks/useDateBookingsQuery';
import { useRoomFilters } from '../../hooks/useRoomFilters';
import { Screen } from '../../components/Screen';
import { colors, layout, typography } from '../../constants/theme';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const user = useBookingStore(state => state.user);
  const {
    filters,
    searchQuery,
    setSearchQuery,
    setBuildingFilter,
    setCapacityFilter,
    setRoomTypeFilter,
    toggleEquipmentFilter,
    clearFilters
  } = useBookingStore();

  const { data: rooms, isLoading: isRoomsLoading, isError, refetch } = useRoomsQuery();
  const { filteredRooms, hasActiveFilters } = useRoomFilters(rooms);
  
  const now = useNow();
  const currentDateStr = toLocalDateString(now);
  const { data: bookingsToday = [] } = useDateBookingsQuery(currentDateStr);

  const renderItem = useCallback(({ item }: { item: Room }) => {
    const isOccupied = isRoomOccupiedNow(item.id, bookingsToday, now);
    return (
      <View style={isDesktop ? styles.gridCol : styles.listRow}>
        <RoomCard room={item} isOccupied={isOccupied} />
      </View>
    );
  }, [bookingsToday, now, isDesktop]);

  const keyExtractor = useCallback((item: Room) => item.id, []);

  return (
    <Screen>
      <StatusBar style="dark" />
      <ConnectionBanner isError={isError} onRetry={() => { void refetch(); }} />

      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandLeft}>
              <BrandLogo size={44} showName={true} />
            </View>
            <View style={styles.userBadge}>
              <Text style={styles.greeting} numberOfLines={1}>
                {user?.name || 'Sinh viên VKU'}
              </Text>
            </View>
          </View>

          {/* Search Box */}
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Tìm theo tên phòng, tòa, mô tả, thiết bị..."
            />
          </View>

          {/* Quick Room Type Segment Tabs */}
          <View style={styles.categoryRow}>
            <Pressable
              onPress={() => setRoomTypeFilter('all')}
              style={[
                styles.categoryTab,
                filters.roomType === 'all' && styles.categoryTabActive,
              ]}
            >
              <Sparkles size={14} color={filters.roomType === 'all' ? '#005A5D' : '#64748B'} />
              <Text style={[styles.categoryText, filters.roomType === 'all' && styles.categoryTextActive]}>
                Tất cả phòng ({rooms?.length || 0})
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setRoomTypeFilter('study')}
              style={[
                styles.categoryTab,
                filters.roomType === 'study' && styles.categoryTabActive,
              ]}
            >
              <BookOpen size={14} color={filters.roomType === 'study' ? '#005A5D' : '#64748B'} />
              <Text style={[styles.categoryText, filters.roomType === 'study' && styles.categoryTextActive]}>
                Phòng học nhóm
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setRoomTypeFilter('lab')}
              style={[
                styles.categoryTab,
                filters.roomType === 'lab' && styles.categoryTabActive,
              ]}
            >
              <Monitor size={14} color={filters.roomType === 'lab' ? '#005A5D' : '#64748B'} />
              <Text style={[styles.categoryText, filters.roomType === 'lab' && styles.categoryTextActive]}>
                Phòng máy tính
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Filter Scroll Chips */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {hasActiveFilters && (
              <FilterChip 
                label="Xóa bộ lọc" 
                isActive={false} 
                onPress={clearFilters} 
                icon={<Filter size={14} color="#DC2626" />}
              />
            )}
            
            {/* Building Filters */}
            {BUILDINGS.map((b: string) => (
              <FilterChip
                key={`b-${b}`}
                label={`Tòa ${b}`}
                isActive={filters.building === b}
                onPress={() => setBuildingFilter(filters.building === b ? null : b)}
              />
            ))}

            {/* Capacity Filters */}
            {[10, 20, 40].map((cap: number) => (
              <FilterChip
                key={`cap-${cap}`}
                label={`${cap}+ Chỗ ngồi`}
                isActive={filters.minCapacity === cap}
                onPress={() => setCapacityFilter(filters.minCapacity === cap ? null : cap)}
                icon={<Users size={14} color={filters.minCapacity === cap ? "#005A5D" : "#475569"} />}
              />
            ))}

            {/* Equipment Filters */}
            {Object.values(Equipment).map((eq) => (
              <FilterChip
                key={`eq-${eq}`}
                label={EQUIPMENT_LABELS[eq]}
                isActive={filters.equipment.includes(eq)}
                onPress={() => toggleEquipmentFilter(eq)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Room List Content */}
        {isRoomsLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#005A5D" />
            <Text style={styles.loadingText}>Đang tải danh sách phòng...</Text>
          </View>
        ) : isError ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorTitle}>Chưa thể kết nối tới cơ sở dữ liệu phòng</Text>
            <Text style={styles.errorSubtitle}>Vui lòng kiểm tra kết nối mạng và thử lại.</Text>
            <Pressable style={styles.retryButton} onPress={() => { void refetch(); }}>
              <RefreshCw size={16} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>Tải lại dữ liệu</Text>
            </Pressable>
          </View>
        ) : filteredRooms.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyTitle}>Không tìm thấy phòng phù hợp</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery.trim()
                ? `Không có kết quả nào cho "${searchQuery}". Hãy thử tìm không dấu hoặc từ khóa khác.`
                : 'Thử điều chỉnh lại các tiêu chí lọc để tìm được phòng trống phù hợp.'}
            </Text>
            {hasActiveFilters && (
              <Pressable style={styles.clearFiltersButton} onPress={clearFilters}>
                <Text style={styles.clearFiltersButtonText}>Xóa tất cả bộ lọc</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <FlatList
            key={isDesktop ? 'desktop-grid-2col' : 'mobile-list-1col'}
            data={filteredRooms}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={isDesktop ? 2 : 1}
            contentContainerStyle={[
              styles.listContainer,
              isDesktop && styles.desktopListPadding,
            ]}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: layout.spacing.lg,
    paddingTop: layout.spacing.md,
    paddingBottom: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  userBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    maxWidth: 160,
  },
  greeting: {
    color: '#005A5D',
    fontSize: 12,
    fontWeight: '700',
  },
  searchContainer: {
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  categoryTabActive: {
    backgroundColor: '#CCFBFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryTextActive: {
    color: '#005A5D',
    fontWeight: '700',
  },
  filterSection: {
    paddingVertical: layout.spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterScroll: {
    paddingHorizontal: layout.spacing.lg,
    gap: 8,
    alignItems: 'center',
  },
  listContainer: {
    padding: layout.spacing.md,
    paddingBottom: 40,
  },
  desktopListPadding: {
    paddingHorizontal: 24,
  },
  gridCol: {
    flex: 1,
    paddingHorizontal: 8,
  },
  listRow: {
    width: '100%',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
  },
  errorTitle: {
    ...typography.h2,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtitle: {
    ...typography.body,
    color: colors.neutral.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0284C7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyTitle: {
    ...typography.h2,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.neutral.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 360,
    lineHeight: 20,
  },
  clearFiltersButton: {
    backgroundColor: '#CCFBFA',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  clearFiltersButtonText: {
    color: '#005A5D',
    fontWeight: '700',
    fontSize: 14,
  },
});
