export interface NICInfo {
  year: number;
  dayOfYear: number;
  gender: string;
  newFormat: string;
  isValid: boolean;
}

export class NICError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NICError';
  }
}

/**
 * Converts old format NIC to new format
 * Old format: YY DDD SSS C V/X (9 digits + letter)
 * New format: YYYY DDD SSSS C (12 digits)
 */
export function convertOldToNewNIC(oldNIC: string): string {
  // Remove any spaces and convert to uppercase
  const cleaned = oldNIC.replace(/\s/g, '').toUpperCase();

  // Check if it's already new format (12 digits)
  if (cleaned.length === 12 && /^\d{12}$/.test(cleaned)) {
    return cleaned;
  }

  // Check old format: 9 digits + 1 letter (V/X)
  if (cleaned.length === 10) {
    const digits = cleaned.substring(0, 9);
    const letter = cleaned.substring(9);

    if (!/^\d{9}$/.test(digits)) {
      throw new NICError('Invalid NIC format: digits part is invalid');
    }

    if (letter !== 'V' && letter !== 'X') {
      throw new NICError('Invalid NIC format: letter must be V or X');
    }

    return convert9DigitsTo12(digits);
  }

  // Check if it's just 9 digits without letter
  if (cleaned.length === 9 && /^\d{9}$/.test(cleaned)) {
    return convert9DigitsTo12(cleaned);
  }

  throw new NICError('Invalid NIC length or format');
}

function convert9DigitsTo12(digits: string): string {
  if (digits.length !== 9) {
    throw new NICError('Invalid NIC length: expected 9 digits');
  }

  // Parse the components: YY DDD SSS C
  const yy = parseInt(digits.substring(0, 2));
  const ddd = parseInt(digits.substring(2, 5));
  const sss = digits.substring(5, 8);
  const c = digits.substring(8, 9);

  // Validate day of year (1-366 for normal, 501-866 for female)
  if ((ddd < 1 || ddd > 366) && (ddd < 501 || ddd > 866)) {
    throw new NICError('Invalid day of year in NIC');
  }

  // Convert YY to YYYY
  // Assuming cutoff year 50: 00-50 = 2000-2050, 51-99 = 1951-1999
  const yyyy = yy <= 50 ? 2000 + yy : 1900 + yy;

  // Format as 12-digit NIC: YYYY DDD 0SSS C
  return `${yyyy}${ddd.toString().padStart(3, '0')}0${sss}${c}`;
}

/**
 * Extracts information from NIC number (both old and new formats)
 */
export function extractNICInfo(nic: string): NICInfo {
  try {
    const newNIC = convertOldToNewNIC(nic);

    if (newNIC.length !== 12) {
      throw new NICError('Invalid NIC length after conversion');
    }

    const year = parseInt(newNIC.substring(0, 4));
    const dayOfYear = parseInt(newNIC.substring(4, 7));

    // Check if it's a valid year
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear + 10) {
      throw new NICError('Invalid birth year');
    }

    const [actualDay, isFemale] = dayOfYear > 500
      ? [dayOfYear - 500, true]
      : [dayOfYear, false];

    // Validate actual day of year
    if (actualDay < 1 || actualDay > 366) {
      throw new NICError('Invalid day of year');
    }

    const gender = isFemale ? 'Female' : 'Male';

    return {
      year,
      dayOfYear: actualDay,
      gender,
      newFormat: newNIC,
      isValid: true,
    };
  } catch (error) {
    return {
      year: 0,
      dayOfYear: 0,
      gender: 'Unknown',
      newFormat: nic,
      isValid: false,
    };
  }
}

/**
 * Validates NIC number format
 */
export function validateNIC(nic: string): boolean {
  try {
    const info = extractNICInfo(nic);
    return info.isValid;
  } catch (error) {
    return false;
  }
}

/**
 * Formats NIC number for display
 */
export function formatNIC(nic: string): string {
  const cleaned = nic.replace(/\s/g, '');

  if (cleaned.length === 10) {
    // Old format: YYDDDSSSCV -> YY DDD SSS CV
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{1}\w{1})/, '$1 $2 $3 $4');
  } else if (cleaned.length === 12) {
    // New format: YYYYDDDSSSC -> YYYY DDD SSS C
    return cleaned.replace(/(\d{4})(\d{3})(\d{4})(\d{1})/, '$1 $2 $3 $4');
  }

  return cleaned;
}

/**
 * Calculates birth date from NIC
 */
export function getBirthDateFromNIC(nic: string): Date | null {
  try {
    const info = extractNICInfo(nic);
    if (!info.isValid) return null;

    const year = info.year;
    const dayOfYear = info.dayOfYear;

    // Create date from year and day of year
    const date = new Date(year, 0, dayOfYear);

    // Check if the calculated date is valid
    if (date.getFullYear() === year &&
        (date.getTime() - new Date(year, 0, 1).getTime()) / (24 * 60 * 60 * 1000) + 1 === dayOfYear) {
      return date;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Auto-detects gender from NIC
 */
export function getGenderFromNIC(nic: string): 'Male' | 'Female' | null {
  try {
    const info = extractNICInfo(nic);
    return info.isValid ? (info.gender as 'Male' | 'Female') : null;
  } catch (error) {
    return null;
  }
}

/**
 * Calculates age from NIC
 */
export function getAgeFromNIC(nic: string): number {
  const birthDate = getBirthDateFromNIC(nic);
  if (!birthDate) return 0;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return Math.max(0, age);
}

/**
 * Formats birth date from NIC in dd-MM-yyyy format
 */
export function getFormattedBirthDateFromNIC(nic: string): string {
  const birthDate = getBirthDateFromNIC(nic);
  if (!birthDate) return '';

  const day = birthDate.getDate().toString().padStart(2, '0');
  const month = (birthDate.getMonth() + 1).toString().padStart(2, '0');
  const year = birthDate.getFullYear().toString();

  return `${day}-${month}-${year}`;
}

/**
 * Test cases for NIC conversion
 */
export const TEST_CASES = [
  {
    old: '741922757V',
    new: '197419202757',
    description: 'Example A: Male born in 1974, day 192',
  },
  {
    old: '861234567V',
    new: '198612304567',
    description: 'Example B: Male born in 1986, day 123',
  },
  {
    old: '916980123V',
    new: '199169800123',
    description: 'Example C: Female born in 1991, day 198 (698-500)',
  },
  {
    old: '001001234V',
    new: '200010001234',
    description: 'Example D: Born in year 2000, day 100',
  },
];

/**
 * Runs test cases to verify NIC conversion
 */
export function runNICTests(): boolean {
  let allPassed = true;

  for (const testCase of TEST_CASES) {
    try {
      const result = convertOldToNewNIC(testCase.old);
      if (result !== testCase.new) {
        console.error(`Test failed for ${testCase.old}: expected ${testCase.new}, got ${result}`);
        allPassed = false;
      } else {
        console.log(`✓ Test passed: ${testCase.description}`);
      }
    } catch (error) {
      console.error(`Test failed for ${testCase.old}:`, error);
      allPassed = false;
    }
  }

  return allPassed;
}

// Export everything for proper module detection
export default {
  convertOldToNewNIC,
  extractNICInfo,
  validateNIC,
  formatNIC,
  getBirthDateFromNIC,
  getGenderFromNIC,
  getAgeFromNIC,
  getFormattedBirthDateFromNIC,
  runNICTests,
  TEST_CASES,
  NICError
};