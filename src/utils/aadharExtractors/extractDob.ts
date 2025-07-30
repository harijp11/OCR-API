export const extractDob = (text: string): string | null => {
  const dobPatterns = [
    /(?:Date of Birth|DOB)[:\s]*(\d{2}\/\d{2}\/\d{4})/i,
    /(?:Date of Birth|DOB)[:\s]*(\d{2}-\d{2}-\d{4})/i,
    /(?:Date of Birth|DOB)[:\s]*(\d{2}\.\d{2}\.\d{4})/i,
    /(\d{2}\/\d{2}\/\d{4})/g,
  ];
  for (const pattern of dobPatterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return null;
};