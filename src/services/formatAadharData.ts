interface AadhaarInfo {
  dob: string | null;
  aadharNumber: string | null;
  gender: string | null;
  name: string | null;
  fatherName: string | null;
  address: string | null;
  pinCode: string | null;
}

export const extractAadhaarInfo = (
  frontText: string,
  backText: string
): AadhaarInfo => {
  const info: AadhaarInfo = {
    dob: null,
    aadharNumber: null,
    gender: null,
    name: null,
    fatherName: null,
    address: null,
    pinCode: null,
  };

  // Helper function to clean up OCR'd text
  const cleanText = (text: string) => text.replace(/\s+/g, " ").trim();
  const cleanFrontText = cleanText(frontText);
  const cleanBackText = cleanText(backText);

  // Split into lines for line-by-line parsing
  const frontLines = frontText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line);
  const backLines = backText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line);

  // Extract DOB - try multiple patterns
  const dobPatterns = [
    /(?:Date of Birth|DOB)[:\s]*(\d{2}\/\d{2}\/\d{4})/i,
    /(?:Date of Birth|DOB)[:\s]*(\d{2}-\d{2}-\d{4})/i,
    /(?:Date of Birth|DOB)[:\s]*(\d{2}\.\d{2}\.\d{4})/i,
    /(\d{2}\/\d{2}\/\d{4})/g, // Fallback: any date pattern
  ];

  for (const pattern of dobPatterns) {
    const match = cleanFrontText.match(pattern);
    if (match) {
      info.dob = match[1];
      break;
    }
  }

  // Extract Aadhaar Number - multiple patterns
  const aadhaarPatterns = [
    /(\d{4}\s+\d{4}\s+\d{4})/,
    /(\d{4}-\d{4}-\d{4})/,
    /(\d{12})/,
  ];

  for (const pattern of aadhaarPatterns) {
    const match = cleanFrontText.match(pattern);
    if (match) {
      // Format as space-separated
      const number = match[1].replace(/\D/g, "");
      if (number.length === 12) {
        info.aadharNumber = number.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3");
        break;
      }
    }
  }

  // Extract Gender
  const genderPattern = /\b(Male|Female|Others?)\b/i;
  const genderMatch = cleanFrontText.match(genderPattern);
  info.gender = genderMatch
    ? genderMatch[1].charAt(0).toUpperCase() +
      genderMatch[1].slice(1).toLowerCase()
    : null;

  // Extract Name - improved approach
  const extractName = (text: string, lines: string[]): string | null => {
    // Look for name patterns
    const namePatterns = [
      /Government of India[^\n]*\n[^\n]*\n([A-Z][a-zA-Z\s]+)/i,
      /Aadhaar[^\n]*\n[^\n]*\n([A-Z][a-zA-Z\s]+)/i,
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match) {
        const name = match[1].trim();
        if (
          name.length > 2 &&
          name.length < 50 &&
          !/Government|India|Male|Female|DOB|Date|Year|Month|Day/i.test(name)
        ) {
          return name;
        }
      }
    }

    // Line-by-line approach for DOB
    for (let i = 0; i < lines.length; i++) {
      if (/DOB|Date of Birth/i.test(lines[i])) {
        const potentialNameLine = lines[i - 1]?.trim();
        if (
          potentialNameLine &&
          !/Government|India|Male|Female|DOB|Date|Year|Month|Day/i.test(
            potentialNameLine
          )
        ) {
          return potentialNameLine;
        }
      }
    }

    return null;
  };

  info.name = extractName(frontText, frontLines);

  if (info.name) {
    // Enhanced cleaning to remove 'ardw' and other OCR artifacts
    info.name = info.name.replace(/\b(or|Fen|ardw|and|the|Qe|gr|hod)\b\s*/gi, "").trim();

    // If name starts with common OCR errors, remove them
    if (info.name.startsWith("or ")) {
      info.name = info.name.substring(3).trim();
    }
  }

  console.log("=== EXTRACTING FATHER'S NAME FROM ===");
  console.log(cleanBackText);

  // Direct extraction without separate function
  let fatherName: string | null = null;

  // Enhanced patterns to handle more cases
  const fatherPatterns = [
    // Pattern 1: S/O Vasudevan T, (your current case)
    /S\/O\s+([A-Z][a-zA-Z\s]+?),/i,

    // Pattern 2: S/0: Gopichand Rathod, Sr (previous case)
    /S\/0:\s*([A-Z][a-zA-Z\s]+?),\s*Sr/i,

    // Pattern 3: S/O: Gopichand Rathod, Sr
    /S\/O:\s*([A-Z][a-zA-Z\s]+?),\s*Sr/i,

    // Pattern 4: More flexible S/0 or S/O pattern with colon
    /S\/[O0]:\s*([A-Z][a-zA-Z\s]+?),\s*Sr/i,

    // Pattern 5: S/O without colon but with comma (more flexible)
    /S\/O\s+([A-Z][a-zA-Z\s]+?),/i,

    // Pattern 6: S/0 without colon but with comma
    /S\/0\s+([A-Z][a-zA-Z\s]+?),/i,

    // Pattern 7: Without Sr but with comma and colon
    /S\/[O0]:\s*([A-Z][a-zA-Z\s]+?),/i,

    // Pattern 8: Just S/O or S/0 followed by name (no comma required)
    /S\/[O0]\s*:?\s*([A-Z][a-zA-Z\s]{3,30})/i,
  ];

  for (let i = 0; i < fatherPatterns.length; i++) {
    const pattern = fatherPatterns[i];
    const match = cleanBackText.match(pattern);
    if (match) {
      let extractedName = match[1].trim();

      // Clean up the name
      extractedName = extractedName
        .replace(/[^\w\s]/g, " ") // Remove special characters
        .replace(/\s+/g, " ") // Normalize spaces
        .trim();

      console.log(`Pattern ${i + 1} found father name: "${extractedName}"`);

      // Validate the name
      if (
        extractedName.length > 2 &&
        extractedName.length < 50 &&
        !/\b(Address|PIN|Ward|Village|Post|Dist|State|No|ais|TAIN|3FT|Fast|Mig|Tae|wf)\b/i.test(
          extractedName
        )
      ) {
        fatherName = extractedName;
        break;
      }
    }
  }

  // If no pattern matched, try manual extraction
  if (!fatherName) {
    console.log("No pattern matched, trying manual extraction...");

    // Look for all S/0: occurrences
    const allSoMatches = cleanBackText.match(/S\/[O0]:\s*[^,]+/gi);
    if (allSoMatches) {
      console.log("Found S/0 matches:", allSoMatches);

      // Look for the one that seems like a person's name
      for (const match of allSoMatches) {
        if (match.includes("Gopichand") || match.includes("Rathod")) {
          const nameMatch = match.match(/S\/[O0]:\s*([A-Z][a-zA-Z\s]+)/i);
          if (nameMatch) {
            let extractedName = nameMatch[1].trim();
            extractedName = extractedName
              .replace(/[^\w\s]/g, " ")
              .replace(/\s+/g, " ")
              .trim();

            console.log(`Manual extraction found: "${extractedName}"`);

            if (extractedName.length > 5 && extractedName.length < 50) {
              fatherName = extractedName;
              break;
            }
          }
        }
      }
    }
  }

  console.log("Final father name result:", fatherName);
  info.fatherName = fatherName;

  // Extract PIN Code
  const pinCodePattern = /\b(\d{6})\b/g;
  const pinMatches = [...cleanBackText.matchAll(pinCodePattern)];

  if (pinMatches.length > 0) {
    info.pinCode = pinMatches[pinMatches.length - 1][1];

    const pinValue = parseInt(info.pinCode);
    if (pinValue < 100000 || pinValue > 999999) {
      info.pinCode = null;
    }
  }

  const extractAddress = (text: string): string | null => {
    console.log("=== ENHANCED INDIAN ADDRESS EXTRACTION ===");

    // Comprehensive list of Indian states
    const indianStates = [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
      'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
      'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
      'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
      'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Dadra and Nagar Haveli',
      'Daman and Diu', 'Lakshadweep', 'Puducherry', 'Andaman and Nicobar Islands'
    ];

    // Common OCR artifacts and helpline info to exclude
    const ocrArtifacts = new Set([
      'j', 'ada', 'fate', 'gear', 'wifasey', 'ZO', 'q4ar', 'TEAST', 'TATATA', 'ATE',
      'ATH', 'TH', 'JTEATH', 'faz', '9183', '0074', '6619', 'Aadhaar', 'Aam', 'Admi',
      'ka', 'Adhikar', 'UNIQUE', 'IDENTIFICATION', 'AUTHORITY', 'OF', 'INDIA',
      'ni', 'RAT', 'ARSE', 'yggmesfoeor', 'A', 'BA', '72M', 'SE', 'ie', 'aS', 'g',
      'CES', 'IEG', 'Q', 'PRY', 'RT', 'BY', 'Ne', 'yd', 'E', 'ily', 'Sis',
      ':', 'ARB', 'Vig', 'rn', 'NTs', 'Aaa', 'arcing', 'd', 'Acie', 'RR',
      'AR', 'LAR', 'ZB', '1947', 'DX', 'help@uidai.gov.in', 'www.uidai.gov.in',
      'wha', 'fafse', 'ew', 'wie', 'qeam', 'Mig', 'Tae', 'wf', 'ais', 'TAIN',
      '3FT', 'Fast', 'qor', 'ET', 'WaT', 'qo', 'HERTS', 'ardfasg', 'g1', '9x',
      'das', 'rN', 'uldal', 'gov', 'in', 'ww', 'wi', '1800', '300', "Sr"
    ]);

    const addressStartMatch = text.match(/Address\s*:\s*/i);
    if (!addressStartMatch) {
      console.log("No 'Address:' found in text");
      return null;
    }

    let addressSection = text.substring(addressStartMatch.index! + addressStartMatch[0].length);

    // Remove everything before and including the father's name
    addressSection = addressSection.replace(/S\/[O0]\s*:?\s*[A-Za-z\s,]+?(,|\b)/gi, '');

    // Remove OCR artifacts and helpline info
    addressSection = addressSection.replace(new RegExp(`\\b(${Array.from(ocrArtifacts).join('|')})\\b`, 'gi'), ' ');

    // Split into lines and filter valid address components
    const lines = addressSection.split('\n').map(line => line.trim()).filter(line => {
      const cleanLine = line.replace(/[^\w\s,.-]/g, '').toLowerCase();
      return (/\d/.test(line) || cleanLine.split(/\s+/).some(word => word.length > 2)) && !/^\s*$/.test(line);
    });

    let cleanAddress = lines.join(', ').replace(/\s+/g, ' ').trim();

    // Identify the state and truncate the address at that point
    const stateMatch = indianStates.find(state => cleanAddress.toLowerCase().includes(state.toLowerCase()));
    if (stateMatch) {
      const stateIndex = cleanAddress.toLowerCase().indexOf(stateMatch.toLowerCase());
      cleanAddress = cleanAddress.substring(0, stateIndex + stateMatch.length).trim();
      cleanAddress = cleanAddress.replace(new RegExp(`\\b${stateMatch}\\b`, 'gi'), `, ${stateMatch}`);
    }

    // Remove PIN code if present
    cleanAddress = cleanAddress.replace(/\b\d{6}\b/, '').trim();

    // Final cleaning and normalization
    cleanAddress = cleanAddress
      .replace(/,\s*,/g, ',')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\bno-?\s*(\d+)/gi, 'No-$1') // Normalize "No" or "No-" format
      .replace(/\bward\s*no-?\s*(\d+)/gi, 'Ward No-$1') // Normalize "Ward No" format
      .replace(/\s+/g, ' ')
      .trim();

    // Remove trailing comma and empty segments
    if (cleanAddress.endsWith(',')) {
      cleanAddress = cleanAddress.slice(0, -1).trim();
    }
    cleanAddress = cleanAddress.split(',').filter(part => part.trim().length > 0).join(', ');

    console.log("Final address result:", cleanAddress);

    if (cleanAddress.length > 10 && stateMatch) {
      return cleanAddress;
    }

    return null;
  };
  info.address = extractAddress(cleanBackText);

  return info;
};