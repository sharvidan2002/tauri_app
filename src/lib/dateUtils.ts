import { DATE_FORMATS, RETIREMENT_CONFIG } from './constants';

/**
 * Parses date string in various formats and returns a Date object
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString || dateString.trim() === '') return null;

  // Handle dd-MM-yyyy format
  const ddMMyyyyMatch = dateString.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (ddMMyyyyMatch) {
    const [, day, month, year] = ddMMyyyyMatch;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    // Validate the date
    if (date.getFullYear() === parseInt(year) &&
        date.getMonth() === parseInt(month) - 1 &&
        date.getDate() === parseInt(day)) {
      return date;
    }
    return null;
  }

  // Handle yyyy-MM-dd format (ISO)
  const yyyyMMddMatch = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (yyyyMMddMatch) {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  // Try parsing as ISO date
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Formats date to dd-MM-yyyy format
 */
export function formatDate(date: Date | string, format: string = DATE_FORMATS.DISPLAY): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? parseDate(date) : date;
  if (!dateObj || isNaN(dateObj.getTime())) return typeof date === 'string' ? date : '';

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear().toString();

  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year);
}

/**
 * Formats date for HTML input (yyyy-MM-dd)
 */
export function formatDateForInput(date: Date | string): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? parseDate(date) : date;
  if (!dateObj || isNaN(dateObj.getTime())) return '';

  return dateObj.toISOString().split('T')[0];
}

/**
 * Converts HTML input date (yyyy-MM-dd) to display format (dd-MM-yyyy)
 */
export function convertInputDateToDisplay(inputDate: string): string {
  if (!inputDate) return '';

  const date = new Date(inputDate);
  if (isNaN(date.getTime())) return inputDate;

  return formatDate(date);
}

/**
 * Calculates age from birth date
 */
export function calculateAge(dateOfBirth: string | Date): number {
  const birthDate = typeof dateOfBirth === 'string' ? parseDate(dateOfBirth) : dateOfBirth;
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
 * Calculates retirement date based on birth date and retirement age
 */
export function calculateRetirementDate(
  dateOfBirth: string | Date,
  retirementAge: number = RETIREMENT_CONFIG.DEFAULT_AGE
): string {
  const birthDate = typeof dateOfBirth === 'string' ? parseDate(dateOfBirth) : dateOfBirth;
  if (!birthDate) return '';

  const retirementDate = new Date(birthDate);
  retirementDate.setFullYear(birthDate.getFullYear() + retirementAge);

  return formatDate(retirementDate);
}

/**
 * Validates if date is in valid range (not in future, not too far in past)
 */
export function validateDateRange(
  date: string | Date,
  options: {
    allowFuture?: boolean;
    minAge?: number;
    maxAge?: number;
  } = {}
): { isValid: boolean; error?: string } {
  const dateObj = typeof date === 'string' ? parseDate(date) : date;
  if (!dateObj) {
    return { isValid: false, error: 'Invalid date format' };
  }

  const today = new Date();
  const age = calculateAge(dateObj);

  if (!options.allowFuture && dateObj > today) {
    return { isValid: false, error: 'Date cannot be in the future' };
  }

  if (options.minAge && age < options.minAge) {
    return { isValid: false, error: `Age must be at least ${options.minAge} years` };
  }

  if (options.maxAge && age > options.maxAge) {
    return { isValid: false, error: `Age cannot exceed ${options.maxAge} years` };
  }

  return { isValid: true };
}

/**
 * Formats increment date (dd-MM format)
 */
export function formatIncrementDate(date: string | Date): string {
  if (typeof date === 'string') {
    // If already in dd-MM format, return as is
    if (/^\d{1,2}-\d{1,2}$/.test(date)) {
      const [day, month] = date.split('-');
      return `${day.padStart(2, '0')}-${month.padStart(2, '0')}`;
    }

    // Try parsing as full date
    const dateObj = parseDate(date);
    if (!dateObj) return date;

    return `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
  }

  if (date instanceof Date && !isNaN(date.getTime())) {
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  }

  return '';
}

/**
 * Validates increment date format (dd-MM)
 */
export function validateIncrementDate(incrementDate: string): { isValid: boolean; error?: string } {
  if (!incrementDate) {
    return { isValid: false, error: 'Increment date is required' };
  }

  if (!/^\d{1,2}-\d{1,2}$/.test(incrementDate)) {
    return { isValid: false, error: 'Format must be dd-MM' };
  }

  const [dayStr, monthStr] = incrementDate.split('-');
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);

  if (day < 1 || day > 31) {
    return { isValid: false, error: 'Day must be between 1 and 31' };
  }

  if (month < 1 || month > 12) {
    return { isValid: false, error: 'Month must be between 1 and 12' };
  }

  // Check for valid day-month combinations
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day > daysInMonth[month - 1]) {
    return { isValid: false, error: 'Invalid day for the selected month' };
  }

  return { isValid: true };
}

/**
 * Auto-formats increment date input (adds dash after 2 digits)
 */
export function autoFormatIncrementDate(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');

  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 4) {
    return `${digits.substring(0, 2)}-${digits.substring(2)}`;
  }

  // Limit to 4 digits max (dd-MM)
  return `${digits.substring(0, 2)}-${digits.substring(2, 4)}`;
}

/**
 * Gets years of service from appointment date
 */
export function getYearsOfService(appointmentDate: string | Date): number {
  const appointment = typeof appointmentDate === 'string' ? parseDate(appointmentDate) : appointmentDate;
  if (!appointment) return 0;

  const today = new Date();
  let years = today.getFullYear() - appointment.getFullYear();
  const monthDiff = today.getMonth() - appointment.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < appointment.getDate())) {
    years--;
  }

  return Math.max(0, years);
}

/**
 * Checks if staff is near retirement (within 5 years)
 */
export function isNearRetirement(dateOfBirth: string | Date, retirementAge: number = RETIREMENT_CONFIG.DEFAULT_AGE): boolean {
  const age = calculateAge(dateOfBirth);
  return age >= (retirementAge - 5);
}

/**
 * Gets next increment date based on current date and increment date pattern
 */
export function getNextIncrementDate(incrementDate: string): Date | null {
  if (!validateIncrementDate(incrementDate).isValid) return null;

  const [day, month] = incrementDate.split('-').map(Number);
  const currentYear = new Date().getFullYear();
  const today = new Date();

  // Try current year first
  let nextDate = new Date(currentYear, month - 1, day);

  // If the date has already passed this year, use next year
  if (nextDate <= today) {
    nextDate = new Date(currentYear + 1, month - 1, day);
  }

  return nextDate;
}

/**
 * Formats date range for display
 */
export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  if (!start && !end) return '';
  if (!start) return `Until ${end}`;
  if (!end) return `From ${start}`;

  return `${start} - ${end}`;
}

/**
 * Gets current date in dd-MM-yyyy format
 */
export function getCurrentDate(): string {
  return formatDate(new Date());
}

/**
 * Checks if a date is today
 */
export function isToday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseDate(date) : date;
  if (!dateObj) return false;

  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
}

/**
 * Gets relative time description (e.g., "2 days ago", "in 3 months")
 */
export function getRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseDate(date) : date;
  if (!dateObj) return '';

  const now = new Date();
  const diffInMs = dateObj.getTime() - now.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (Math.abs(diffInDays) === 0) return 'Today';
  if (Math.abs(diffInDays) === 1) return diffInDays > 0 ? 'Tomorrow' : 'Yesterday';

  if (Math.abs(diffInDays) < 30) {
    return diffInDays > 0
      ? `In ${diffInDays} days`
      : `${Math.abs(diffInDays)} days ago`;
  }

  const diffInMonths = Math.floor(Math.abs(diffInDays) / 30);
  if (diffInMonths < 12) {
    return diffInDays > 0
      ? `In ${diffInMonths} month${diffInMonths > 1 ? 's' : ''}`
      : `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return diffInDays > 0
    ? `In ${diffInYears} year${diffInYears > 1 ? 's' : ''}`
    : `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}