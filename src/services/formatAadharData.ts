import { extractDob } from "../utils/aadharExtractors/extractDob";
import { extractAadhaarNumber } from "../utils/aadharExtractors/extractAadhaarNumber";
import { extractGender } from "../utils/aadharExtractors/extraxtGender";
import { extractName } from "../utils/aadharExtractors/extractName";
import { extractFatherName } from "../utils/aadharExtractors/extractFathersName";
import { extractPinCode } from "../utils/aadharExtractors/extractPinCode";
import { extractAddress } from "../utils/aadharExtractors/extractAddress";


const cleanText = (text: string): string => {
  return text.replace(/\s+/g, " ").trim();
};


const splitLines = (text: string): string[] => {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

export const extractAadhaarInfo = (
  frontText: string,
  backText: string
): {
  name: string | null;
  fatherName: string | null;
  dob: string | null;
  gender: string | null;
  aadhaarNumber: string | null;
  address: string | null;
  pinCode: string | null;
} => {
  const cleanFrontText = cleanText(frontText);
  const cleanBackText = cleanText(backText);

  const frontLines = splitLines(frontText);  // pass raw lines to preserve original OCR quirks
  const backLines = splitLines(backText);

  return {
    name: extractName(cleanFrontText, frontLines),
    fatherName: extractFatherName(cleanBackText, backLines),
    dob: extractDob(cleanFrontText),
    gender: extractGender(cleanFrontText),
    aadhaarNumber:   extractAadhaarNumber(cleanFrontText, frontLines) ||
  extractAadhaarNumber(cleanBackText, backLines),
    address: extractAddress(cleanBackText),
    pinCode: extractPinCode(cleanBackText),
  };
};
