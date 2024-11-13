"use server";

// Types for our verification data
type PersonalInfo = {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  height?: string;
  personalIdNumber?: string;
  expiryDate: string;
};

type ExtractedIDData = {
  title: string;
  firstName: string;
  middleName: string;
  height: string;
  dateOfBirth: string;
  expiryDate: string;
  personalIdNumber: string;
};

type VerificationStatus = "pending" | "verified" | "requires visit" | "flagged";

// Helper function to calculate string similarity
function calculateStringSimilarity(str1: string, str2: string): number {
  if (!str1 && !str2) return 1;
  if (!str1 || !str2) return 0;

  str1 = str1.toLowerCase().trim();
  str2 = str2.toLowerCase().trim();

  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let i = 0; i <= str2.length; i++) matrix[i][0] = i;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + substitutionCost
      );
    }
  }

  const maxLength = Math.max(str1.length, str2.length);
  const distance = matrix[str2.length][str1.length];
  return 1 - distance / maxLength;
}

// Helper function to compare names
function compareNames(
  personal: PersonalInfo,
  extracted: ExtractedIDData
): {
  similarity: number;
  issues: string[];
} {
  const issues: string[] = [];

  // Compare first names
  const firstNameSimilarity = calculateStringSimilarity(
    personal.firstName,
    extracted.firstName
  );

  // Compare middle names if present
  const middleNameSimilarity =
    personal.middleName && extracted.middleName
      ? calculateStringSimilarity(personal.middleName, extracted.middleName)
      : 1;

  // Calculate overall name similarity
  const overallSimilarity = (firstNameSimilarity + middleNameSimilarity) / 2;

  if (firstNameSimilarity < 0.8) {
    issues.push("First name shows significant differences");
  }

  if (
    personal.middleName &&
    extracted.middleName &&
    middleNameSimilarity < 0.8
  ) {
    issues.push("Middle name shows significant differences");
  }

  return {
    similarity: overallSimilarity,
    issues,
  };
}

// Helper function to calculate age
const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn't occurred this year
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

// Main verification function
export async function verifyKYC(
  personalInfo: PersonalInfo,
  extractedData: ExtractedIDData
): Promise<{
  status: VerificationStatus;
  reasons: string[];
}> {
  const reasons: string[] = [];
  let flagCount = 0;

  // Compare names
  const nameComparison = compareNames(personalInfo, extractedData);
  reasons.push(...nameComparison.issues);
  if (nameComparison.issues.length > 0) {
    flagCount++;
  }

  // Check date of birth
  if (personalInfo.dateOfBirth) {
    const personalDOB = new Date(personalInfo.dateOfBirth);
    const extractedDOB = new Date(extractedData.dateOfBirth);
    if (personalDOB.getTime() !== extractedDOB.getTime()) {
      reasons.push("Date of birth mismatch");
      flagCount++;
    }

    const age = calculateAge(personalDOB);
    if (age < 14) {
      reasons.push("Applicant must be at least 14 years old");
      flagCount++;
    }
  }

  // Check height if provided
  if (personalInfo.height && extractedData.height) {
    const heightDiff = Math.abs(
      parseInt(personalInfo.height) - parseInt(extractedData.height)
    );
    if (heightDiff > 2) {
      // Allow 2cm difference for measurement variations
      reasons.push("Significant height difference");
      flagCount++;
    }
  }

  // Check ID number if provided
  if (
    personalInfo.personalIdNumber &&
    personalInfo.personalIdNumber !== extractedData.personalIdNumber
  ) {
    reasons.push("Personal ID number mismatch");
    flagCount += 2; // More serious issue
  }

  // Check ID expiration
  const expiryDate = new Date(extractedData.expiryDate);
  if (expiryDate < new Date()) {
    reasons.push("ID is expired");
    flagCount += 2;
  }

  // Determine verification status
  let status: VerificationStatus;
  if (flagCount === 0) {
    status = "verified";
  } else if (flagCount === 1) {
    status = "requires visit";
  } else if (flagCount >= 2) {
    status = "flagged";
  } else {
    status = "pending";
  }

  return {
    status,
    reasons,
  };
}

// Example usage
// async function handleKYCVerification(
//   formData: PersonalInfo,
//   extractedData: ExtractedIDData
// ) {
//   try {
//     const result = await verifyKYC(formData, extractedData);

//     // Log verification attempt
//     console.log("KYC Verification Result:", {
//       status: result.status,
//       reasons: result.reasons,
//       formData,
//       extractedData,
//     });

//     return result;
//   } catch (error) {
//     console.error("KYC verification failed:", error);
//     throw new Error("Failed to process KYC verification");
//   }
// }
