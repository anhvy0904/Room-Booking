export type SlotStatus = 'AVAILABLE' | 'SELECTED' | 'BOOKED' | 'PAST';

export interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

export const TIME_SLOTS: TimeSlot[] = [
  {
    id: "slot_1",
    start: "07:30",
    end: "09:30"
  },
  {
    id: "slot_2",
    start: "09:30",
    end: "11:30"
  },
  {
    id: "slot_3",
    start: "13:00",
    end: "15:00"
  },
  {
    id: "slot_4",
    start: "15:00",
    end: "17:00"
  }
];
