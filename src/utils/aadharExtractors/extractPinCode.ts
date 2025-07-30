export const extractPinCode = (text: string): string | null => {
  const pattern = /\b(\d{6})\b/g;
  const matches = [...text.matchAll(pattern)];
  if (matches.length) {
    const pin = matches[matches.length - 1][1];
    const pinValue = parseInt(pin);
    if (pinValue < 100000 || pinValue > 999999) return null;
    return pin;
  }
  return null;
};