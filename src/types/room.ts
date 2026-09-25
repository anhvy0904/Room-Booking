export type Building = 'A' | 'B' | 'C' | 'V';

export type RoomType = 'study' | 'lab';

export enum Equipment {
  PROJECTOR = 'projector',
  WHITEBOARD = 'whiteboard',
  HIGH_SPEC_PC = 'high_spec_pc',
  AC = 'ac'
}

export interface Room {
  id: string;
  name: string;
  type?: RoomType;
  building: Building;
  floor: number;
  capacity: number;
  equipment: Equipment[];
  description?: string;
  image?: string;
  images?: string[];
}

