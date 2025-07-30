export const extractAadhaarNumber = (
  text: string,
  lines?: string[]
): string | null => {
  const patterns = [
    /(\d{4}\s+\d{4}\s+\d{4})/,
    /(\d{4}-\d{4}-\d{4})/,
    /(\d{12})/
  ];

  // Step 1: Try matching line-by-line for more accurate extraction
  if (lines && Array.isArray(lines)) {
    for (const line of lines) {
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          const digits = match[1].replace(/\D/g, "");
          if (digits.length === 12) {
            return digits.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3");
          }
        }
      }
    }
  }

  // Step 2: Fallback to whole text
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const digits = match[1].replace(/\D/g, "");
      if (digits.length === 12) {
        return digits.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3");
      }
    }
  }

  return null;
};
