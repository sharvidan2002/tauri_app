import { Designation, SalaryCode, MaritalStatus, Gender } from '@/types/staff';

export const DESIGNATIONS: { value: Designation; label: string }[] = [
  { value: 'District Forest Officer', label: 'District Forest Officer' },
  { value: 'Asst.District Forest Officer', label: 'Assistant District Forest Officer' },
  { value: 'Management Service Officer', label: 'Management Service Officer' },
  { value: 'Development Officer', label: 'Development Officer' },
  { value: 'Range Forest officer', label: 'Range Forest Officer' },
  { value: 'Beat forest officer', label: 'Beat Forest Officer' },
  { value: 'extension officer', label: 'Extension Officer' },
  { value: 'field forest assistant', label: 'Field Forest Assistant' },
  { value: 'office employee service', label: 'Office Employee Service' },
  { value: 'garden labour', label: 'Garden Labour' },
];

export const SALARY_CODES: { value: SalaryCode; label: string }[] = [
  { value: 'S1', label: 'S1' },
  { value: 'S2', label: 'S2' },
  { value: 'S3', label: 'S3' },
  { value: 'D1', label: 'D1' },
  { value: 'D2', label: 'D2' },
  { value: 'D3', label: 'D3' },
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
];

export const MARITAL_STATUSES: { value: MaritalStatus; label: string }[] = [
  { value: 'Single', label: 'Single' },
  { value: 'Married', label: 'Married' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' },
];

export const GENDERS: { value: Gender; label: string }[] = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
];

export const OFFICE_INFO = {
  name: 'Divisional Forest Office - Vavuniya',
  address: 'Forest Department, Vavuniya, Sri Lanka',
  phone: '+94 24 222 2222',
  email: 'forestoffice.vavuniya@fd.gov.lk',
  logo: '/assets/images/forest-logo.png',
};

export const APP_CONFIG = {
  organization: 'Divisional Forest Office - Vavuniya',
  version: '1.0.0',
};

export const APP_THEME = {
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    light: '#f8fafc',
    dark: '#1e293b',
    muted: '#64748b',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    neutral: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: '0 0 20px rgba(102, 126, 234, 0.3)',
  },
};

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  },
  slideInFromLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 },
  },
  slideInFromRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2 },
  },
};

export const TABLE_COLUMNS = {
  STAFF_LIST: [
    { key: 'appointmentNumber', label: 'App. No.', sortable: true, width: '120px' },
    { key: 'fullName', label: 'Full Name', sortable: true },
    { key: 'designation', label: 'Designation', sortable: true },
    { key: 'gender', label: 'Gender', sortable: true, width: '80px' },
    { key: 'age', label: 'Age', sortable: true, width: '60px' },
    { key: 'contactNumber', label: 'Contact', sortable: false, width: '120px' },
    { key: 'dateOfFirstAppointment', label: 'Appointment Date', sortable: true, width: '140px' },
    { key: 'actions', label: 'Actions', sortable: false, width: '120px' },
  ],
  STAFF_BULK_PRINT: [
    { key: 'appointmentNumber', label: 'App. No.' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'designation', label: 'Designation' },
    { key: 'gender', label: 'Gender' },
    { key: 'age', label: 'Age' },
    { key: 'nicNumber', label: 'NIC Number' },
    { key: 'contactNumber', label: 'Contact' },
    { key: 'basicSalary', label: 'Basic Salary' },
  ],
};

export const FORM_SECTIONS = {
  PERSONAL_DETAILS: {
    id: 'personal',
    title: 'Identification & Personal Details',
    icon: '👤',
    fields: [
      'appointmentNumber',
      'fullName',
      'gender',
      'dateOfBirth',
      'nicNumber',
      'maritalStatus',
      'addressLine1',
      'addressLine2',
      'addressLine3',
      'contactNumber',
      'email',
    ],
  },
  EMPLOYMENT_DETAILS: {
    id: 'employment',
    title: 'Employment Details',
    icon: '💼',
    fields: [
      'designation',
      'dateOfFirstAppointment',
      'incrementDate',
    ],
  },
  SALARY_DETAILS: {
    id: 'salary',
    title: 'Salary Information',
    icon: '💰',
    fields: [
      'salaryCode',
      'basicSalary',
      'incrementAmount',
    ],
  },
  IMAGE_UPLOAD: {
    id: 'image',
    title: 'Staff Photo',
    icon: '📷',
    fields: ['imagePath'],
  },
};

export const VALIDATION_MESSAGES = {
  required: (field: string) => `${field} is required`,
  minLength: (field: string, min: number) => `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) => `${field} must not exceed ${max} characters`,
  pattern: (field: string) => `${field} format is invalid`,
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid Sri Lankan phone number',
  nic: 'Please enter a valid NIC number (9 digits + V/X or 12 digits)',
  date: 'Please enter a valid date in dd-MM-yyyy format',
  incrementDate: 'Please enter a valid date in dd-MM format',
  number: 'Please enter a valid number',
  positive: 'Value must be positive',
  future: 'Date cannot be in the future',
  past: 'Date cannot be in the past',
  age: 'Age must be between 18 and 70',
  fileSize: 'File size must be less than 5MB',
  fileType: 'Only JPEG, PNG, and WebP images are allowed',
};

export const PRINT_TEMPLATES = {
  INDIVIDUAL: {
    name: 'Individual Staff Details',
    description: 'Print detailed information for a single staff member',
    pageSize: 'A4',
    orientation: 'portrait',
  },
  BULK: {
    name: 'Staff List (Bulk)',
    description: 'Print multiple staff members in table format',
    pageSize: 'A4',
    orientation: 'landscape',
  },
};

export const EXPORT_FORMATS = [
  { value: 'pdf', label: 'PDF Document', icon: '📄' },
  { value: 'excel', label: 'Excel Spreadsheet', icon: '📊' },
  { value: 'csv', label: 'CSV File', icon: '📋' },
];

export const SEARCH_FILTERS = {
  QUICK_FILTERS: [
    { label: 'All Staff', value: null },
    { label: 'Officers', value: ['District Forest Officer', 'Asst.District Forest Officer', 'Range Forest officer'] },
    { label: 'Assistant Staff', value: ['Beat forest officer', 'field forest assistant', 'extension officer'] },
    { label: 'Support Staff', value: ['office employee service', 'garden labour'] },
    { label: 'Recent Joiners', value: 'recent' },
    { label: 'Near Retirement', value: 'retirement' },
  ],
  AGE_RANGES: [
    { label: 'All Ages', value: null },
    { label: '20-30 years', value: { min: 20, max: 30 } },
    { label: '31-40 years', value: { min: 31, max: 40 } },
    { label: '41-50 years', value: { min: 41, max: 50 } },
    { label: '51-60 years', value: { min: 51, max: 60 } },
  ],
};

export const KEYBOARD_SHORTCUTS = {
  'Ctrl+N': 'Add new staff',
  'Ctrl+S': 'Save current form',
  'Ctrl+F': 'Focus search bar',
  'Ctrl+P': 'Print current page',
  'Escape': 'Close modal/cancel action',
  'F5': 'Refresh data',
};

export const LOCAL_STORAGE_KEYS = {
  THEME: 'forest-office-theme',
  LANGUAGE: 'forest-office-language',
  TABLE_SETTINGS: 'forest-office-table-settings',
  SEARCH_HISTORY: 'forest-office-search-history',
  FORM_DRAFTS: 'forest-office-form-drafts',
};

export const API_ENDPOINTS = {
  STAFF: {
    LIST: 'get_all_staff',
    CREATE: 'add_staff',
    UPDATE: 'update_staff',
    DELETE: 'delete_staff',
    GET_BY_ID: 'get_staff_by_id',
    SEARCH: 'search_staff',
    COUNT: 'get_staff_count',
    EXPORT: 'export_staff_to_pdf',
  },
};

export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  CROP_ASPECT_RATIO: 3 / 4, // 3:4 ratio for staff photos
  THUMBNAIL_SIZE: { width: 150, height: 200 },
  PREVIEW_SIZE: { width: 300, height: 400 },
  QUALITY: 0.8,
};

export const DATE_FORMATS = {
  DISPLAY: 'dd-MM-yyyy',
  INPUT: 'yyyy-MM-dd',
  INCREMENT: 'dd-MM',
  TIMESTAMP: 'yyyy-MM-dd HH:mm:ss',
};

export const RETIREMENT_CONFIG = {
  DEFAULT_AGE: 60,
  MIN_AGE: 18,
  MAX_AGE: 70,
  EARLY_RETIREMENT_AGE: 55,
  EXTENSION_MAX_AGE: 65,
};