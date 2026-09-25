export const removeVietnameseTones = (str: string): string => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
};

export const matchesSearch = (text: string | undefined | null, query: string): boolean => {
  if (!query.trim()) return true;
  if (!text) return false;
  const cleanText = removeVietnameseTones(text);
  const cleanQuery = removeVietnameseTones(query);
  return cleanText.includes(cleanQuery);
};
