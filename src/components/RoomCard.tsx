import { shadow } from '../utils/shadow';
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { colors, layout, typography } from '../constants/theme';
import { Users, Monitor, Projector, AirVent, Presentation, Building2, Heart, Images } from 'lucide-react-native';
import { Room, Equipment } from '../types/room';
import { EQUIPMENT_LABELS } from '../constants/equipment';
import { useBookingStore } from '../store/useBookingStore';
import { Link } from 'expo-router';

interface RoomCardProps {
  room: Room;
  isOccupied: boolean;
  style?: any;
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

const RoomCardComponent = ({ room, isOccupied, style }: RoomCardProps) => {
  const favoriteRoomIds = useBookingStore((state) => state.favoriteRoomIds);
  const toggleFavoriteRoom = useBookingStore((state) => state.toggleFavoriteRoom);
  const isFavorite = favoriteRoomIds.includes(room.id);

  const isLab = room.type === 'lab' || room.equipment.includes(Equipment.HIGH_SPEC_PC);
  const coverImage = room.image || (room.images && room.images[0]) || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600';
  const photoCount = room.images?.length || 1;

  const handleFavoritePress = (e: any) => {
    e.stopPropagation?.();
    toggleFavoriteRoom(room.id);
  };

  return (
    <Link href={`/room/${room.id}`} asChild>
      <Pressable style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
        style,
      ]}>
        {/* Cover Image & Badges */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: coverImage }} 
            style={styles.image} 
            resizeMode="cover"
          />

          {/* Top Overlay Badges */}
          <View style={styles.topOverlay}>
            <View style={[styles.typeBadge, isLab ? styles.labBadge : styles.studyBadge]}>
              <Text style={styles.typeBadgeText}>
                {isLab ? 'Phòng máy tính' : 'Phòng học nhóm'}
              </Text>
            </View>

            {/* Favorite Button */}
            <Pressable
              onPress={handleFavoritePress}
              style={({ pressed }) => [
                styles.favButton,
                pressed && { transform: [{ scale: 0.88 }] }
              ]}
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
            >
              <Heart
                size={18}
                color={isFavorite ? '#EF4444' : '#FFFFFF'}
                fill={isFavorite ? '#EF4444' : 'rgba(0,0,0,0.25)'}
              />
            </Pressable>
          </View>

          {/* Bottom Overlay Info (Status & Photo count) */}
          <View style={styles.bottomOverlay}>
            <View style={[styles.statusBadge, isOccupied ? styles.statusOccupied : styles.statusAvailable]}>
              <View style={[styles.statusDot, { backgroundColor: isOccupied ? '#F87171' : '#4ADE80' }]} />
              <Text style={styles.statusText}>
                {isOccupied ? 'Đang bận' : 'Còn trống'}
              </Text>
            </View>

            {photoCount > 1 && (
              <View style={styles.photoCountBadge}>
                <Images size={12} color="#FFFFFF" />
                <Text style={styles.photoCountText}>{photoCount} ảnh</Text>
              </View>
            )}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>{room.name}</Text>
            <View style={styles.capacityBadge}>
              <Users size={14} color="#005A5D" />
              <Text style={styles.capacityText}>{room.capacity} chỗ</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <Building2 size={14} color="#64748B" />
            <Text style={styles.locationText}>
              Tòa {room.building} • Tầng {room.floor}
            </Text>
          </View>

          {room.description && (
            <Text style={styles.descriptionText} numberOfLines={2}>
              {room.description}
            </Text>
          )}

          {/* Equipment Chips */}
          <View style={styles.equipmentContainer}>
            {room.equipment.slice(0, 3).map((eq) => (
              <View key={eq} style={styles.equipmentChip}>
                <EquipmentIcon type={eq} color="#334155" />
                <Text style={styles.equipmentText}>{EQUIPMENT_LABELS[eq]}</Text>
              </View>
            ))}
            {room.equipment.length > 3 && (
              <View style={[styles.equipmentChip, styles.equipmentMore]}>
                <Text style={styles.equipmentMoreText}>+{room.equipment.length - 3}</Text>
              </View>
            )}
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
    ...layout.shadow.soft,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.95,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#0F172A',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    ...shadow(0.1, 4, 1, 1),
  },
  studyBadge: {
    backgroundColor: 'rgba(16, 75, 80, 0.9)',
  },
  labBadge: {
    backgroundColor: 'rgba(79, 70, 229, 0.9)',
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  favButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    ...shadow(0.15, 6, 2, 2),
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusAvailable: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
  },
  statusOccupied: {
    backgroundColor: 'rgba(153, 27, 27, 0.9)',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  photoCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  photoCountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    padding: layout.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  title: {
    ...typography.h2,
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: layout.radius.sm,
    gap: 5,
  },
  capacityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#475569',
    marginBottom: 10,
  },
  equipmentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  equipmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
  },
  equipmentText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  equipmentMore: {
    backgroundColor: '#E2E8F0',
  },
  equipmentMoreText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '700',
  },
});
