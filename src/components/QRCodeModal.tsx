import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { X } from 'lucide-react-native';
import { colors, layout, typography } from '../constants/theme';

interface QRCodeModalProps {
  visible: boolean;
  onClose: () => void;
  bookingId: string;
  roomName: string;
  date: string;
  time: string;
}

export const QRCodeModal = ({ visible, onClose, bookingId, roomName, date, time }: QRCodeModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <X size={24} color={colors.neutral.textMain} />
          </Pressable>
          
          <Text style={styles.title}>Booking Pass</Text>
          <Text style={styles.subtitle}>Show this code to enter the room</Text>
          
          <View style={styles.qrContainer}>
            <QRCode
              value={bookingId}
              size={200}
              color={colors.neutral.textMain}
              backgroundColor={colors.neutral.background}
            />
          </View>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Room: <Text style={styles.infoValue}>{roomName}</Text></Text>
            <Text style={styles.infoLabel}>Date: <Text style={styles.infoValue}>{date}</Text></Text>
            <Text style={styles.infoLabel}>Time: <Text style={styles.infoValue}>{time}</Text></Text>
            <Text style={styles.infoLabel}>ID: <Text style={styles.infoValue}>{bookingId.slice(0, 8)}...</Text></Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.spacing.xl,
  },
  content: {
    backgroundColor: colors.neutral.background,
    borderRadius: layout.radius.xl,
    padding: layout.spacing.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    position: 'relative',
    ...layout.shadow.soft,
  },
  closeBtn: {
    position: 'absolute',
    top: layout.spacing.md,
    right: layout.spacing.md,
    padding: layout.spacing.sm,
  },
  title: {
    ...typography.h2,
    marginBottom: layout.spacing.sm,
    marginTop: layout.spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.neutral.textSecondary,
    marginBottom: layout.spacing.xl,
    textAlign: 'center',
  },
  qrContainer: {
    padding: layout.spacing.lg,
    backgroundColor: colors.neutral.offWhite,
    borderRadius: layout.radius.lg,
    marginBottom: layout.spacing.xl,
  },
  infoBox: {
    width: '100%',
    backgroundColor: colors.neutral.offWhite,
    padding: layout.spacing.md,
    borderRadius: layout.radius.md,
    gap: layout.spacing.sm,
  },
  infoLabel: {
    ...typography.body,
    color: colors.neutral.textSecondary,
  },
  infoValue: {
    color: colors.neutral.textMain,
    fontWeight: '700',
  }
});
