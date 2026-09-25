import { Equipment, Room } from '../types/room';
import { DEFAULT_ROOM_CATALOG } from '../data/rooms';

export const parseRoom = (id: string, value: unknown): Room | null => {
  const data = (value && typeof value === 'object') ? (value as Record<string, unknown>) : {};
  const defaultMeta = DEFAULT_ROOM_CATALOG[id];

  if (!defaultMeta && Object.keys(data).length === 0) return null;

  const building = (typeof data.building === 'string' && ['A', 'B', 'C', 'V'].includes(data.building)
    ? data.building
    : defaultMeta?.building) as Room['building'];

  if (!building) return null;

  const capacity = typeof data.capacity === 'number' && Number.isFinite(data.capacity) && data.capacity > 0
    ? data.capacity
    : defaultMeta?.capacity ?? 30;

  const floor = typeof data.floor === 'number' && Number.isFinite(data.floor)
    ? data.floor
    : defaultMeta?.floor ?? 1;

  // RTDB removes empty arrays. Never call .map/.includes on an absent field.
  const equipmentRaw = Array.isArray(data.equipment) ? data.equipment : defaultMeta?.equipment ?? [];
  const equipment = equipmentRaw.filter((item): item is Equipment => Object.values(Equipment).includes(item));

  const roomType = (data.type === 'study' || data.type === 'lab')
    ? data.type
    : defaultMeta?.type ?? (equipment.includes(Equipment.HIGH_SPEC_PC) ? 'lab' : 'study');

  const coverImage = (typeof data.image === 'string' && data.image.trim())
    ? data.image.trim()
    : defaultMeta?.image ?? 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200';

  const galleryImages = (Array.isArray(data.images) && data.images.length > 0)
    ? data.images.filter((img): img is string => typeof img === 'string')
    : defaultMeta?.images ?? [coverImage];

  const description = (typeof data.description === 'string' && data.description.trim())
    ? data.description.trim()
    : defaultMeta?.description ?? 'Không gian học tập và nghiên cứu hiện đại tại Đại học Công nghệ Thông tin & Truyền thông Việt - Hàn (VKU).';

  const name = (typeof data.name === 'string' && data.name.trim())
    ? data.name.trim()
    : defaultMeta?.name ?? `Phòng ${id}`;

  return {
    id,
    name,
    type: roomType,
    building,
    capacity,
    floor,
    equipment,
    description,
    image: coverImage,
    images: galleryImages,
  };
};

export const parseRooms = (value: unknown): Room[] => {
  const dbData = (value && typeof value === 'object') ? (value as Record<string, unknown>) : {};

  // Combine all room IDs from DEFAULT_ROOM_CATALOG and any database entries
  const allIds = Array.from(new Set([...Object.keys(DEFAULT_ROOM_CATALOG), ...Object.keys(dbData)]));

  const parsed = allIds
    .map((id) => parseRoom(id, dbData[id]))
    .filter((room): room is Room => room !== null);

  return parsed;
};
