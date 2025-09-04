import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'Rs.'): string {
  return `${currency} ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;
}

export function formatDate(dateString: string, format: string = 'dd-MM-yyyy'): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year);
}

export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;

  // Handle dd-MM-yyyy format
  const ddMMyyyyMatch = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (ddMMyyyyMatch) {
    const [, day, month, year] = ddMMyyyyMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  // Handle ISO format
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

export function calculateAge(dateOfBirth: string): number {
  const birthDate = parseDate(dateOfBirth);
  if (!birthDate) return 0;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export function calculateRetirementDate(dateOfBirth: string, retirementAge: number = 60): string {
  const birthDate = parseDate(dateOfBirth);
  if (!birthDate) return '';

  const retirementDate = new Date(birthDate);
  retirementDate.setFullYear(birthDate.getFullYear() + retirementAge);

  return formatDate(retirementDate.toISOString());
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+94|0)?[0-9]{9}$/;
  return phoneRegex.test(phone);
}

export function validateNIC(nic: string): boolean {
  const oldNICRegex = /^\d{9}[VvXx]$/;
  const newNICRegex = /^\d{12}$/;
  return oldNICRegex.test(nic) || newNICRegex.test(nic);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

export function formatIncrementDate(date: string): string {
  if (!date) return '';

  // If it's already in dd-MM format, return as is
  if (/^\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  // Parse date and format as dd-MM
  const parsedDate = parseDate(date);
  if (!parsedDate) return date;

  const day = parsedDate.getDate().toString().padStart(2, '0');
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');

  return `${day}-${month}`;
}

export function addDashToIncrementDate(value: string): string {
  // Remove any existing dashes
  const cleanValue = value.replace(/-/g, '');

  // Add dash after two digits
  if (cleanValue.length >= 2) {
    return cleanValue.substring(0, 2) + '-' + cleanValue.substring(2, 4);
  }

  return cleanValue;
}

export function isValidDateFormat(date: string, format: 'dd-MM-yyyy' | 'dd-MM'): boolean {
  if (format === 'dd-MM-yyyy') {
    return /^\d{2}-\d{2}-\d{4}$/.test(date);
  } else if (format === 'dd-MM') {
    return /^\d{2}-\d{2}$/.test(date);
  }
  return false;
}

export function getYearsOfService(appointmentDate: string): number {
  const appointment = parseDate(appointmentDate);
  if (!appointment) return 0;

  const today = new Date();
  let years = today.getFullYear() - appointment.getFullYear();
  const monthDiff = today.getMonth() - appointment.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < appointment.getDate())) {
    years--;
  }

  return Math.max(0, years);
}

export function sortArray<T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue === bValue) return 0;

    const comparison = aValue < bValue ? -1 : 1;
    return direction === 'asc' ? comparison : -comparison;
  });
}

export function filterArray<T>(
  array: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] {
  if (!searchTerm.trim()) return array;

  const lowerSearchTerm = searchTerm.toLowerCase();

  return array.filter(item =>
    searchFields.some(field => {
      const fieldValue = item[field];
      if (fieldValue == null) return false;
      return fieldValue.toString().toLowerCase().includes(lowerSearchTerm);
    })
  );
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

export function isImageFile(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return allowedTypes.includes(file.type);
}

export function compressImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to compress image'));
        }
      }, file.type, quality);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}