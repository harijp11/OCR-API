export const extractName = (text: string, lines: string[]): string | null => {
  const namePatterns = [
    /Government of India[^\n]*\n[^\n]*\n([A-Z][a-zA-Z\s]+)/i,
    /Aadhaar[^\n]*\n[^\n]*\n([A-Z][a-zA-Z\s]+)/i,
  ];
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match) {
      let name = match[1].trim();
      if (
        name.length > 2 &&
        name.length < 50 &&
        !/Government|India|Male|Female|DOB|Date|Year|Month|Day/i.test(name)
      ) {
        name = name.replace(/\b(or|Fen|ardw|and|the|Qe|gr|hod)\b\s*/gi, "").trim();
        if (name.startsWith("or ")) {
          name = name.substring(3).trim();
        }
        return name;
      }
    }
  }
  for (let i = 0; i < lines.length; i++) {
    if (/DOB|Date of Birth/i.test(lines[i])) {
      const potentialName = lines[i - 1]?.trim();
      if (
        potentialName &&
        !/Government|India|Male|Female|DOB|Date|Year|Month|Day/i.test(potentialName)
      ) {
        let name = potentialName.replace(/\b(or|Fen|ardw|and|the|Qe|gr|hod)\b\s*/gi, "").trim();
        if (name.startsWith("or ")) {
          name = name.substring(3).trim();
        }
        return name;
      }
    }
  }
  return null;
};