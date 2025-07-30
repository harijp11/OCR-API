export const extractGender = (text: string): string | null => {
  const genderPattern = /\b(Male|Female|Others?)\b/i;
  const match = text.match(genderPattern);
  return match ? match[1][0].toUpperCase() + match[1].slice(1).toLowerCase() : null;
};