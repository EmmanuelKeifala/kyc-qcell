import { OCRAIFormatter } from "./format-ocr-blob";

/**
 * Process an image for OCR via OCR API
 * @param {File|string} input - File object or URL as string
 * @param {string} apiKey - API key for OCR service
 * @param {string} language - OCR language
 * @param {boolean} isOverlayRequired - Whether overlay is required
 * @returns {Promise<Object>} Parsed OCR result
 */
export async function ProcessImageOCR({
  input,
  language = 'eng',
  isOverlayRequired = true,
  retryCount = 3,
  retryDelay = 1000
}: {
  input: File | string;
  language?: string;
  isOverlayRequired?: boolean;
  retryCount?: number;
  retryDelay?: number;
}) {
  for (let attempt = 0; attempt < retryCount; attempt++) {
    try {
      const formData = new FormData();
      if (typeof input === 'string') {
        formData.append('url', input);
      } else {
        formData.append('file', input);
      }
      formData.append('language', language);
      formData.append('apikey', "K85938299288957");
      formData.append('isOverlayRequired', isOverlayRequired ? 'true' : 'false');

      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
        cache: 'no-cache',
      });

      if (!response.ok) {
        const responseD = await response.json();
        console.log(responseD);
        if (response.status === 403) {
          console.log('403 Forbidden: Exceeded concurrent connections. Retrying...');
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
        return { success: false, data: `HTTP error! Status: ${response.status}` };
      }

      const result = await response.json();
      const paresed = parseOcrResult(result);
      // Check if paresed.data exists and is defined
      if (paresed && paresed.data) {
        const aiformatted = await OCRAIFormatter({ dataInput: paresed.data.structuredData });
        return { success: true, data: aiformatted.data };
      } else {
        console.error("Parsed data is undefined or empty:", paresed);
        return { success: false, data: "Parsed data is undefined or empty" };
      }

    } catch (error: any) {
      console.log("Error:", error);
      return { success: false, data: `Unexpected server error: ${error.message}` };
    }
  }
  return { success: false, data: 'Max retries exceeded.' };
}



/**
 * Parse OCR result into a structured format
 * @param {Object} ocrResult - Raw OCR result
 * @returns {Object} Key-value JSON response
 */
function parseOcrResult(ocrResult: any) {
  const { ParsedResults, IsErroredOnProcessing, ErrorMessage, ProcessingTimeInMilliseconds } = ocrResult;

  if (IsErroredOnProcessing) {
    return { success: false, data: ErrorMessage || 'Processing error occurred' };
  }

  if (ParsedResults && ParsedResults.length > 0) {
    const page = ParsedResults[0];
    const { ParsedText, FileParseExitCode } = page;

    if (FileParseExitCode === 1) {
      const structuredData = convertToStructuredData(ParsedText);
      return { success: true, data: { structuredData, processingTime: ProcessingTimeInMilliseconds } };
    } else {
      return { success: false, data: `Parse error with code: ${FileParseExitCode}` };
    }
  }

  return { success: false, data: 'No results found' };
}

/**
 * Convert parsed text into structured key-value pairs
 * @param {string} parsedText - Full text output from OCR
 * @returns {Object} Structured key-value pairs extracted from text
 */
function convertToStructuredData(parsedText: string) {
  const lines = parsedText.split('\n').filter(line => line.trim() !== '');
  const lineBasedData: Record<string, string> = {};
  lines.forEach((line, index) => {
    lineBasedData[`Line_${index + 1}`] = line.trim();
  });

  const structuredData: Record<string, string> = {};
  const knownFields: Record<string, string> = {
    'REPUBLIC OF SIERRA LEONE': 'title',
    'N A T I O N A L IDENTITY CARD': 'title',
    'Surname': 'surname',
    'Name': 'firstName',
    'Middle Name': 'middleName',
    'Date of Birth': 'dateOfBirth',
    'Height (m)': 'height',
    'Date of Expiry': 'expiryDate',
    'Personal ID Number': 'personalIdNumber'
  };

  for (let i = 1; i <= Object.keys(lineBasedData).length; i++) {
    const currentLine = lineBasedData[`Line_${i}`];
    const nextLine = lineBasedData[`Line_${i + 1}`];

    if (knownFields[currentLine]) {
      structuredData[knownFields[currentLine]] = nextLine;
      i++;
    } else if (i === 1) {
      structuredData.title = currentLine;
    }
  }

  return { rawLines: lineBasedData, structured: structuredData };
}

