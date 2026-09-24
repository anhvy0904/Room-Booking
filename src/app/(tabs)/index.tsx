import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, Text, ScrollView, StatusBar, Platform, ActivityIndicator, Image } from 'react-native';
import { useBookingStore } from '../../store/useBookingStore';
import { RoomCard } from '../../components/RoomCard';
import { SearchBar } from '../../components/SearchBar';
import { FilterChip } from '../../components/FilterChip';
import { BUILDINGS } from '../../data/rooms';
import { EQUIPMENT_LABELS } from '../../constants/equipment';
import { Room, Equipment } from '../../types/room';
import { isRoomOccupiedNow } from '../../utils/bookingConflict';
import { Filter, Users } from 'lucide-react-native';
import { useRoomsQuery } from '../../hooks/useRoomsQuery';
import { useRoomFilters } from '../../hooks/useRoomFilters';
import { Screen } from '../../components/Screen';
import { colors, layout, typography } from '../../constants/theme';

export default function HomeScreen() {
  const { bookings, filters, searchQuery, setSearchQuery, setBuildingFilter, setCapacityFilter, toggleEquipmentFilter, clearFilters } = useBookingStore();
  const { data: rooms, isLoading, isError } = useRoomsQuery();
  const { filteredRooms, hasActiveFilters } = useRoomFilters(rooms);

  const renderItem = useCallback(({ item }: { item: Room }) => {
    const isOccupied = isRoomOccupiedNow(item.id, bookings);
    return <RoomCard room={item} isOccupied={isOccupied} />;
  }, [bookings]);

  const keyExtractor = useCallback((item: Room) => item.id, []);

  return (
    <Screen>
      <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.offWhite} />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://vku.udn.vn/wp-content/uploads/2020/05/logo-vku.png' }} 
              style={styles.logo} 
              resizeMode="contain" 
            />
            <Text style={styles.logoText}>VKU BOOKING ROOM</Text>
          </View>
          
          <View style={styles.searchContainer}>
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          </View>
        </View>

        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {hasActiveFilters && (
              <FilterChip 
                label="Clear All" 
                isActive={false} 
                onPress={clearFilters} 
                icon={<Filter size={14} color="#475569" />}
              />
            )}
            
            {/* Building Filters */}
            {BUILDINGS.map((b: string) => (
              <FilterChip
                key={`b-${b}`}
                label={`Building ${b}`}
                isActive={filters.building === b}
                onPress={() => setBuildingFilter(filters.building === b ? null : b)}
              />
            ))}

            {/* Capacity Filters (Mock simplified for UI) */}
            {[2, 5, 10, 20].map((cap: number) => (
              <FilterChip
                key={`cap-${cap}`}
                label={`${cap}+ Seats`}
                isActive={filters.minCapacity === cap}
                onPress={() => setCapacityFilter(filters.minCapacity === cap ? null : cap)}
                icon={<Users size={14} color={filters.minCapacity === cap ? "#fff" : "#475569"} />}
              />
            ))}

            {/* Equipment Filters */}
            {Object.values(Equipment).map((eq: string) => (
              <FilterChip
                key={eq}
                label={EQUIPMENT_LABELS[eq as Equipment]}
                isActive={filters.equipment.includes(eq as Equipment)}
                onPress={() => toggleEquipmentFilter(eq as Equipment)}
              />
            ))}
          </ScrollView>
        </View>

        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={colors.primary.main} />
          </View>
        ) : isError ? (
          <View style={styles.centerState}>
            <Text style={styles.emptyTitle}>Failed to load rooms</Text>
            <Text style={styles.emptySubtitle}>Please check your connection and try again.</Text>
          </View>
        ) : filteredRooms.length === 0 ? (
          <View style={styles.centerState}>
            <Text style={styles.emptyTitle}>No rooms found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters or search query.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredRooms}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            initialNumToRender={5}
            windowSize={5}
            removeClippedSubviews={Platform.OS === 'android'}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: layout.spacing.md,
    paddingTop: layout.spacing.md,
    paddingBottom: layout.spacing.sm,
    backgroundColor: colors.neutral.offWhite,
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: layout.spacing.lg,
  },
  logo: {
    width: 80,
    height: 40,
    marginBottom: 4,
  },
  logoText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary.main,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    ...typography.h1,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...typography.subtitle,
    marginBottom: layout.spacing.md,
  },
  searchContainer: {
    marginBottom: 4,
  },
  filterSection: {
    marginBottom: layout.spacing.md,
  },
  filterScroll: {
    paddingHorizontal: layout.spacing.md,
    gap: layout.spacing.sm,
  },
  listContent: {
    paddingBottom: layout.spacing.xl,
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    ...typography.h2,
    fontSize: 18,
    marginBottom: layout.spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.neutral.textSecondary,
    textAlign: 'center',
  }
});
