import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DateSelector } from '../../components/DateSelector';
import { TimeSlot } from '../../components/TimeSlot';
import { Users, Building2, ChevronLeft } from 'lucide-react-native';
import { useRoomQuery } from '../../hooks/useRoomsQuery';
import { useBookingSlots } from '../../hooks/useBookingSlots';
import { useBookingActions } from '../../hooks/useBookingActions';
import { PrimaryButton } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { colors, layout, typography } from '../../constants/theme';

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { data: room, isLoading, isError } = useRoomQuery(id);
  
  const {
    selectedDate,
    setSelectedDate,
    selectedSlotId,
    setSelectedSlotId,
    getSlotStatus,
    slots,
  } = useBookingSlots(id);

  const { confirmBooking } = useBookingActions(room);

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      </Screen>
    );
  }

  if (isError || !room) {
    return (
      <Screen>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Room not found or failed to load</Text>
          <PrimaryButton label="Go Back" onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView bounces={false} style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: room.image }} style={styles.image} />
          <Pressable style={styles.backIcon} onPress={() => router.back()}>
            <ChevronLeft color="#1e293b" size={24} />
          </Pressable>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>{room.name}</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoBadge}>
              <Building2 size={16} color={colors.neutral.textSecondary} />
              <Text style={styles.infoText}>Building {room.building}, Fl {room.floor}</Text>
            </View>
            <View style={styles.infoBadge}>
              <Users size={16} color={colors.neutral.textSecondary} />
              <Text style={styles.infoText}>Max {room.capacity}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <DateSelector 
            selectedDate={selectedDate} 
            onSelectDate={(d) => { setSelectedDate(d); setSelectedSlotId(null); }} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time Slot</Text>
          <View style={styles.slotsContainer}>
            {slots.map(slot => (
              <TimeSlot
                key={slot.id}
                slot={slot}
                status={getSlotStatus(slot.id, slot.start)}
                onPress={() => setSelectedSlotId(slot.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton 
          label="Confirm Booking"
          disabled={!selectedSlotId}
          onPress={() => confirmBooking(selectedDate, selectedSlotId, () => setSelectedSlotId(null))}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: layout.spacing.xl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.spacing.xl,
  },
  errorText: {
    ...typography.h2,
    color: colors.status.error,
    marginBottom: layout.spacing.md,
  },
  imageContainer: {
    position: 'relative',
    height: 240,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.neutral.border,
  },
  backIcon: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    padding: layout.spacing.lg,
    backgroundColor: colors.neutral.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.offWhite,
  },
  title: {
    ...typography.h1,
    marginBottom: layout.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    gap: layout.spacing.md,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.neutral.offWhite,
    paddingHorizontal: layout.spacing.md,
    paddingVertical: 8,
    borderRadius: layout.radius.md,
  },
  infoText: {
    ...typography.body,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
  },
  section: {
    paddingTop: layout.spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    fontSize: 18,
    marginBottom: layout.spacing.md,
    paddingHorizontal: layout.spacing.lg,
  },
  slotsContainer: {
    paddingHorizontal: layout.spacing.lg,
  },
  footer: {
    padding: layout.spacing.lg,
    backgroundColor: colors.neutral.background,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
    paddingBottom: Platform.OS === 'ios' ? 34 : layout.spacing.lg,
  },
});
