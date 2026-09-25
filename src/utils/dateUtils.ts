export interface AppDate {
  dateString: string; // YYYY-MM-DD
  dayOfWeek: string;  // Mon, Tue, etc.
  dayOfMonth: string; // 24
  isToday: boolean;
}

export const toLocalDateString = (date: Date = new Date()): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const isSlotPast = (date: string, start: string, now: Date = new Date()): boolean =>
  new Date(`${date}T${start}:00`).getTime() <= now.getTime();

export const getNextSevenDays = (today: Date = new Date()): AppDate[] => {
  const dates: AppDate[] = [];
  
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    
    dates.push({
      dateString: toLocalDateString(nextDate),
      dayOfWeek: nextDate.toLocaleDateString('en-US', { weekday: 'short' }),
      dayOfMonth: nextDate.getDate().toString(),
      isToday: i === 0
    });
  }
  
  return dates;
};

export const formatBookingDate = (dateString: string): string => {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};
