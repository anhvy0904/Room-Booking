import { Room, Building, Equipment } from '../types/room';

export const ROOM_STATUS = {
  AVAILABLE_NOW: 'AVAILABLE_NOW',
  OCCUPIED: 'OCCUPIED'
} as const;

export const BUILDINGS: Building[] = ['A', 'B', 'C', 'V'];

export const MOCK_ROOMS: Room[] = [
  // Building A (Large/Tech focus)
  { id: "room_A201", name: "A201", building: "A", floor: 2, capacity: 10, equipment: [Equipment.PROJECTOR, Equipment.WHITEBOARD, Equipment.AC], image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" },
  { id: "room_A202", name: "A202", building: "A", floor: 2, capacity: 20, equipment: [Equipment.PROJECTOR, Equipment.WHITEBOARD, Equipment.AC, Equipment.HIGH_SPEC_PC], image: "https://images.unsplash.com/photo-1572025442646-866d16c84a54?auto=format&fit=crop&q=80&w=800" },
  { id: "room_A301", name: "A301", building: "A", floor: 3, capacity: 15, equipment: [Equipment.PROJECTOR, Equipment.AC], image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=800" },
  { id: "room_A305", name: "A305", building: "A", floor: 3, capacity: 5, equipment: [Equipment.WHITEBOARD], image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800" },
  
  // Building B (Small/Medium Study)
  { id: "room_B105", name: "B105", building: "B", floor: 1, capacity: 5, equipment: [Equipment.WHITEBOARD, Equipment.AC], image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800" },
  { id: "room_B201", name: "B201", building: "B", floor: 2, capacity: 8, equipment: [Equipment.AC], image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800" },
  { id: "room_B202", name: "B202", building: "B", floor: 2, capacity: 12, equipment: [Equipment.PROJECTOR, Equipment.WHITEBOARD], image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=800" },
  { id: "room_B301", name: "B301", building: "B", floor: 3, capacity: 6, equipment: [Equipment.WHITEBOARD, Equipment.AC], image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" },

  // Building C (Computer Labs)
  { id: "room_C101", name: "C101", building: "C", floor: 1, capacity: 20, equipment: [Equipment.HIGH_SPEC_PC, Equipment.AC, Equipment.PROJECTOR], image: "https://images.unsplash.com/photo-1572025442646-866d16c84a54?auto=format&fit=crop&q=80&w=800" },
  { id: "room_C201", name: "C201", building: "C", floor: 2, capacity: 15, equipment: [Equipment.HIGH_SPEC_PC, Equipment.AC], image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=800" },
  { id: "room_C301", name: "C301", building: "C", floor: 3, capacity: 15, equipment: [Equipment.HIGH_SPEC_PC, Equipment.AC], image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800" },
  { id: "room_C305", name: "C305", building: "C", floor: 3, capacity: 10, equipment: [Equipment.HIGH_SPEC_PC], image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800" },

  // Building V (Premium/VIP)
  { id: "room_V101", name: "V101", building: "V", floor: 1, capacity: 12, equipment: [Equipment.PROJECTOR, Equipment.WHITEBOARD, Equipment.AC, Equipment.HIGH_SPEC_PC], image: "https://images.unsplash.com/photo-1572025442646-866d16c84a54?auto=format&fit=crop&q=80&w=800" },
  { id: "room_V201", name: "V201", building: "V", floor: 2, capacity: 20, equipment: [Equipment.PROJECTOR, Equipment.WHITEBOARD, Equipment.AC], image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=800" },
  { id: "room_V401", name: "V401", building: "V", floor: 4, capacity: 8, equipment: [Equipment.PROJECTOR, Equipment.AC], image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800" },
];
