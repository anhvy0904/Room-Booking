export type Building = 'A' | 'B' | 'C' | 'V';

export enum Equipment {
  PROJECTOR = 'projector',
  WHITEBOARD = 'whiteboard',
  HIGH_SPEC_PC = 'high_spec_pc',
  AC = 'ac'
}

export interface Room {
  id: string;
  name: string;
  building: Building;
  floor: number;
  capacity: number;
  equipment: Equipment[];
  image?: string;
}
