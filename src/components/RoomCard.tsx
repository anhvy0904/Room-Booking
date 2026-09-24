import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { colors, layout, typography } from '../constants/theme';
import { Users, Monitor, Projector, AirVent, Presentation, Building2 } from 'lucide-react-native';
import { Room, Equipment } from '../types/room';
import { EQUIPMENT_LABELS } from '../constants/equipment';
import { Link } from 'expo-router';

interface RoomCardProps {
  room: Room;
  isOccupied: boolean;
}

const EquipmentIcon = ({ type, color = "#64748b" }: { type: Equipment, color?: string }) => {
  switch (type) {
    case Equipment.PROJECTOR: return <Projector size={14} color={color} />;
    case Equipment.WHITEBOARD: return <Presentation size={14} color={color} />;
    case Equipment.HIGH_SPEC_PC: return <Monitor size={14} color={color} />;
    case Equipment.AC: return <AirVent size={14} color={color} />;
    default: return null;
  }
};

const RoomCardComponent = ({ room, isOccupied }: RoomCardProps) => {
  return (
    <Link href={`/room/${room.id}`} asChild>
      <Pressable style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed
      ]}>
        <Image 
          source={{ uri: room.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400" }} 
          style={styles.image} 
        />
        
        <View style={styles.statusBadgeContainer}>
          <View style={[styles.statusBadge, isOccupied ? styles.statusOccupied : styles.statusAvailable]}>
            <Text style={styles.statusText}>
              {isOccupied ? 'Occupied' : 'Available Now'}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{room.name}</Text>
            <View style={styles.capacityBadge}>
              <Users size={14} color="#0284c7" />
              <Text style={styles.capacityText}>{room.capacity}</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <Building2 size={14} color="#64748b" />
            <Text style={styles.locationText}>
              Building {room.building}, Floor {room.floor}
            </Text>
          </View>

          <View style={styles.equipmentContainer}>
            {room.equipment.map((eq) => (
              <View key={eq} style={styles.equipmentChip}>
                <EquipmentIcon type={eq} />
                <Text style={styles.equipmentText}>{EQUIPMENT_LABELS[eq]}</Text>
              </View>
            ))}
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export const RoomCard = React.memo(RoomCardComponent);


const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.background,
    borderRadius: layout.radius.lg,
    marginBottom: layout.spacing.md,
    marginHorizontal: layout.spacing.md,
    ...layout.shadow.soft,
    overflow: 'hidden',
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: colors.neutral.border,
  },
  statusBadgeContainer: {
    position: 'absolute',
    top: layout.spacing.md,
    right: layout.spacing.md,
  },
  statusBadge: {
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: 6,
    borderRadius: layout.radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusAvailable: {
    backgroundColor: colors.status.success,
  },
  statusOccupied: {
    backgroundColor: colors.status.error,
  },
  statusText: {
    color: '#fff',
    ...typography.badge,
    letterSpacing: 0.5,
  },
  content: {
    padding: layout.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  title: {
    ...typography.h2,
    fontSize: 20,
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: layout.radius.md,
    gap: 4,
  },
  capacityText: {
    ...typography.badge,
    color: '#005A5D',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  locationText: {
    ...typography.body,
    fontWeight: '500',
    color: colors.neutral.textSecondary,
  },
  equipmentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.spacing.sm,
  },
  equipmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.offWhite,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: layout.radius.lg,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  equipmentText: {
    ...typography.badge,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
  }
});
