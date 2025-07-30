export const extractFatherName = (text: string, lines: string[]): string | null => {
  const patterns = [
    /S\/O\s+([A-Z][a-zA-Z\s]+?),/i,
    /S\/0:\s*([A-Z][a-zA-Z\s]+?),\s*Sr/i,
    /S\/O:\s*([A-Z][a-zA-Z\s]+?),\s*Sr/i,
    /S\/[O0]:\s*([A-Z][a-zA-Z\s]+?),\s*Sr/i,
    /S\/O\s+([A-Z][a-zA-Z\s]+?),/i,
    /S\/0\s+([A-Z][a-zA-Z\s]+?),/i,
    /S\/[O0]:\s*([A-Z][a-zA-Z\s]+?),/i,
    /S\/[O0]\s*:?\s*([A-Z][a-zA-Z\s]{3,30})/i
  ];

  // First, try full text patterns
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let extractedName = match[1].trim();
      extractedName = extractedName
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (
        extractedName.length > 2 &&
        extractedName.length < 50 &&
        !/\b(Address|PIN|Ward|Village|Post|Dist|State|No|ais|TAIN|3FT|Fast|Mig|Tae|wf)\b/i.test(
          extractedName
        )
      ) {
        return extractedName;
      }
    }
  }

  // Then fallback to checking line-by-line
  for (const line of lines) {
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        let extractedName = match[1].trim();
        extractedName = extractedName
          .replace(/[^\w\s]/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        if (
          extractedName.length > 2 &&
          extractedName.length < 50 &&
          !/\b(Address|PIN|Ward|Village|Post|Dist|State|No|ais|TAIN|3FT|Fast|Mig|Tae|wf)\b/i.test(
            extractedName
          )
        ) {
          return extractedName;
        }
      }
    }
  }

  // Final fallback check
  const allSoMatches = text.match(/S\/[O0]:\s*[^,]+/gi);
  if (allSoMatches) {
    for (const match of allSoMatches) {
      const nameMatch = match.match(/S\/[O0]:\s*([A-Z][a-zA-Z\s]+)/i);
      if (nameMatch) {
        let extractedName = nameMatch[1].trim();
        extractedName = extractedName
          .replace(/[^\w\s]/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        if (extractedName.length > 5 && extractedName.length < 50) {
          return extractedName;
        }
      }
    }
  }

  return null;
};
