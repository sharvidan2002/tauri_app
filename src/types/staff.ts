export interface Staff {
  id?: number;

  // Identification & Personal Details
  appointmentNumber: string;
  fullName: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string; // Format: dd-MM-yyyy
  age: number;
  nicNumber: string; // Will be stored as new format
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  contactNumber: string;
  email?: string;

  // Employment Details
  designation: Designation;
  dateOfFirstAppointment: string; // Format: dd-MM-yyyy
  dateOfRetirement: string; // Auto-calculated
  incrementDate: string; // Format: dd-MM

  // Salary Information
  salaryCode: SalaryCode;
  basicSalary: number;
  incrementAmount: number;

  // Image
  imagePath?: string;
  imageFile?: File; // Add imageFile property

  // System fields
  createdAt?: string;
  updatedAt?: string;
}

export type Designation =
  | 'District Forest Officer'
  | 'Asst.District Forest Officer'
  | 'Management Service Officer'
  | 'Development Officer'
  | 'Range Forest officer'
  | 'Beat forest officer'
  | 'extension officer'
  | 'field forest assistant'
  | 'office employee service'
  | 'garden labour';

export type SalaryCode = 'S1' | 'S2' | 'S3' | 'D1' | 'D2' | 'D3' | 'A1' | 'A2';

export type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed';

export type Gender = 'Male' | 'Female';

export interface StaffSearch {
  query?: string;
  designation?: Designation;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  salaryCode?: SalaryCode;
  ageMin?: number;
  ageMax?: number;
  nicNumber?: string;
}

export interface StaffCount {
  total: number;
  byDesignation: DesignationCount[];
  byGender: GenderCount[];
}

export interface DesignationCount {
  designation: string;
  count: number;
}

export interface GenderCount {
  gender: string;
  count: number;
}

// Fix: Include age and dateOfRetirement in StaffFormData
export interface StaffFormData extends Omit<Staff, 'id' | 'createdAt' | 'updatedAt'> {
  age: number;
  dateOfRetirement: string;
}

export interface NICInfo {
  year: number;
  dayOfYear: number;
  gender: string;
  newFormat: string;
}

export interface PrintOptions {
  staffIds: number[];
  templateType: 'individual' | 'bulk';
  filters?: StaffSearch;
  includePhoto?: boolean;
  includePersonalDetails?: boolean;
  includeEmploymentDetails?: boolean;
  includeSalaryDetails?: boolean;
}

export const DESIGNATIONS: Designation[] = [
  'District Forest Officer',
  'Asst.District Forest Officer',
  'Management Service Officer',
  'Development Officer',
  'Range Forest officer',
  'Beat forest officer',
  'extension officer',
  'field forest assistant',
  'office employee service',
  'garden labour',
];

export const SALARY_CODES: SalaryCode[] = ['S1', 'S2', 'S3', 'D1', 'D2', 'D3', 'A1', 'A2'];

export const MARITAL_STATUSES: MaritalStatus[] = ['Single', 'Married', 'Divorced', 'Widowed'];

export const GENDERS: Gender[] = ['Male', 'Female'];

// Default values for form initialization
export const DEFAULT_STAFF: Omit<StaffFormData, 'appointmentNumber' | 'fullName' | 'dateOfBirth' | 'nicNumber' | 'addressLine1' | 'contactNumber' | 'designation' | 'dateOfFirstAppointment' | 'incrementDate' | 'salaryCode'> = {
  gender: 'Male',
  maritalStatus: 'Single',
  age: 0,
  dateOfRetirement: '',
  basicSalary: 0,
  incrementAmount: 0,
};

// Form validation rules
export const VALIDATION_RULES = {
  appointmentNumber: {
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  nicNumber: {
    required: true,
    pattern: /^(\d{9}[VvXx]|\d{12})$/, // Old format: 9 digits + V/X, New format: 12 digits
  },
  contactNumber: {
    required: true,
    pattern: /^(\+94|0)?[0-9]{9}$/, // Sri Lankan phone number format
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email format
  },
  dateOfBirth: {
    required: true,
    pattern: /^\d{2}-\d{2}-\d{4}$/, // dd-MM-yyyy format
  },
  dateOfFirstAppointment: {
    required: true,
    pattern: /^\d{2}-\d{2}-\d{4}$/, // dd-MM-yyyy format
  },
  incrementDate: {
    required: true,
    pattern: /^\d{2}-\d{2}$/, // dd-MM format
  },
  basicSalary: {
    required: true,
    min: 0,
  },
  incrementAmount: {
    required: true,
    min: 0,
  },
} as const;