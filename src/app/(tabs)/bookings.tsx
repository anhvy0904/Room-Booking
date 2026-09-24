import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, Alert } from 'react-native';
import { useBookingStore, Booking } from '../../store/useBookingStore';
import { BookingCard } from '../../components/BookingCard';
import { QRCodeModal } from '../../components/QRCodeModal';
import { Screen } from '../../components/Screen';
import { layout, typography, colors } from '../../constants/theme';
import { useRoomQuery } from '../../hooks/useRoomsQuery';

export default function BookingsScreen() {
  const { bookings, cancelBooking } = useBookingStore();
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<{booking: Booking, roomName: string} | null>(null);

  // Sort: active/upcoming first, then past
  const sortedBookings = [...bookings].sort((a, b) => {
    const timeA = new Date(`${a.date}T${a.startTime}`).getTime();
    const timeB = new Date(`${b.date}T${b.startTime}`).getTime();
    return timeB - timeA; // Newest first
  });

  const handleCancel = (bookingId: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        { text: 'No, Keep it', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: () => cancelBooking(bookingId)
        }
      ]
    );
  };

  const handleShowQR = (booking: Booking, roomName: string) => {
    setSelectedBooking({ booking, roomName });
    setQrModalVisible(true);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>View and manage your room reservations</Text>
      </View>

      {sortedBookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptySubtitle}>Your upcoming and past reservations will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={sortedBookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <BookingCard 
              booking={item} 
              onShowQR={handleShowQR} 
              onCancel={handleCancel} 
            />
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: layout.spacing.md,
    paddingTop: layout.spacing.md,
    paddingBottom: layout.spacing.md,
    backgroundColor: colors.neutral.offWhite,
  },
  headerTitle: {
    ...typography.h1,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...typography.subtitle,
  },
  listContent: {
    padding: layout.spacing.md,
    paddingBottom: layout.spacing.xl,
  },
  emptyState: {
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
