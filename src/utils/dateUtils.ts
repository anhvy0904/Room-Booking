export interface AppDate {
  dateString: string; // YYYY-MM-DD
  dayOfWeek: string;  // Mon, Tue, etc.
  dayOfMonth: string; // 24
  isToday: boolean;
}

export const getNextSevenDays = (): AppDate[] => {
  const dates: AppDate[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    
    dates.push({
      dateString: nextDate.toISOString().split('T')[0] || '',
      dayOfWeek: nextDate.toLocaleDateString('en-US', { weekday: 'short' }),
      dayOfMonth: nextDate.getDate().toString(),
      isToday: i === 0
    });
  }
  
  return dates;
};

export const formatBookingDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};
