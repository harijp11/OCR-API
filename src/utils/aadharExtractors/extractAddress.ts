export const extractAddress = (text: string): string | null => {
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
    'Ladakh', 'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Lakshadweep',
    'Puducherry', 'Andaman and Nicobar Islands'
  ];

  const ocrArtifacts = new Set([
    'j', 'ada', 'fate', 'gear', 'wifasey', 'ZO', 'q4ar', 'TEAST', 'TATATA', 'ATE',
    'ATH', 'TH', 'JTEATH', 'faz', '9183', '0074', '6619', 'Aadhaar', 'Aam', 'Admi',
    'ka', 'Adhikar', 'UNIQUE', 'IDENTIFICATION', 'AUTHORITY', 'OF', 'INDIA', 'ni',
    'RAT', 'ARSE', 'yggmesfoeor', 'A', 'BA', '72M', 'SE', 'ie', 'aS', 'g', 'CES',
    'IEG', 'Q', 'PRY', 'RT', 'BY', 'Ne', 'yd', 'E', 'ily', 'Sis', ':', 'ARB', 'Vig',
    'rn', 'NTs', 'Aaa', 'arcing', 'd', 'Acie', 'RR', 'AR', 'LAR', 'ZB', '1947', 'DX',
    'help@uidai.gov.in', 'www.uidai.gov.in', 'wha', 'fafse', 'ew', 'wie', 'qeam',
    'Mig', 'Tae', 'wf', 'ais', 'TAIN', '3FT', 'Fast', 'qor', 'ET', 'WaT', 'qo',
    'HERTS', 'ardfasg', 'g1', '9x', 'das', 'rN', 'uldal', 'gov', 'in', 'ww', 'wi',
    '1800', '300', "Sr"
  ]);

  const addressStartMatch = text.match(/Address\s*:\s*/i);
  if (!addressStartMatch) return null;

  let addressSection = text.substring(addressStartMatch.index! + addressStartMatch[0].length);
  addressSection = addressSection.replace(/S\/[O0]\s*:?[A-Za-z\s,]+?(,|\b)/gi, '');
  addressSection = addressSection.replace(new RegExp(`\\b(${Array.from(ocrArtifacts).join('|')})\\b`, 'gi'), ' ');

  const lines = addressSection.split('\n').map(line => line.trim()).filter(line => {
    const cleanLine = line.replace(/[^\w\s,.-]/g, '').toLowerCase();
    return (/\d/.test(line) || cleanLine.split(/\s+/).some(word => word.length > 2)) && !/^\s*$/.test(line);
  });

  let cleanAddress = lines.join(', ').replace(/\s+/g, ' ').trim();

  const stateMatch = indianStates.find(state => cleanAddress.toLowerCase().includes(state.toLowerCase()));
  if (stateMatch) {
    const stateIndex = cleanAddress.toLowerCase().indexOf(stateMatch.toLowerCase());
    cleanAddress = cleanAddress.substring(0, stateIndex + stateMatch.length).trim();
    cleanAddress = cleanAddress.replace(new RegExp(`\\b${stateMatch}\\b`, 'gi'), `, ${stateMatch}`);
  }

  cleanAddress = cleanAddress.replace(/\b\d{6}\b/, '').trim();
  cleanAddress = cleanAddress.replace(/,\s*,/g, ',').replace(/\s*,\s*/g, ', ').trim();
  cleanAddress = cleanAddress.replace(/\bno-?\s*(\d+)/gi, 'No-$1');
  cleanAddress = cleanAddress.replace(/\bward\s*no-?\s*(\d+)/gi, 'Ward No-$1');
  cleanAddress = cleanAddress.replace(/\s+/g, ' ');
  if (cleanAddress.endsWith(',')) cleanAddress = cleanAddress.slice(0, -1).trim();
  cleanAddress = cleanAddress.split(',').filter(part => part.trim().length > 0).join(', ');

  return cleanAddress.length > 10 && stateMatch ? cleanAddress : null;
};