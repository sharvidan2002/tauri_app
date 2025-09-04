export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SortInfo {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}

export interface NotificationConfig {
  id?: string;
  title?: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  closable?: boolean;
}

export interface ImageCropData {
  x: number;
  y: number;
  width: number;
  height: number;
  unit?: 'px' | '%';
  aspect?: number;
}

export interface FileUploadResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  filename?: string;
  includeImages?: boolean;
  pageSize?: 'A4' | 'A3' | 'Letter';
  orientation?: 'portrait' | 'landscape';
}

export interface PrintJobStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  error?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
}

export interface SelectOption<T = any> {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  format?: string;
}

export interface SearchFilters {
  [key: string]: any;
}

export interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

// Tauri command types
export interface TauriCommand<T = any> {
  command: string;
  payload?: any;
  response?: T;
}

// App-wide constants
export const APP_CONFIG = {
  name: 'Forest Office Staff Manager',
  version: '1.0.0',
  organization: 'Divisional Forest Office - Vavuniya',
  supportEmail: 'support@forestoffice.lk',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  dateFormat: 'dd-MM-yyyy',
  incrementDateFormat: 'dd-MM',
  timeFormat: 'HH:mm',
  currency: 'Rs.',
  defaultPageSize: 10,
  retirementAge: 60,
} as const;

export const ROUTES = {
  dashboard: '/',
  addStaff: '/add-staff',
  searchStaff: '/search-staff',
  staffDetails: '/staff/:id',
  editStaff: '/edit-staff/:id',
  reports: '/reports',
  settings: '/settings',
} as const;

export const ERROR_MESSAGES = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  invalidPhone: 'Please enter a valid phone number',
  invalidNIC: 'Please enter a valid NIC number',
  invalidDate: 'Please enter a valid date',
  fileTooLarge: 'File size must be less than 5MB',
  invalidFileType: 'Please select a valid image file (JPEG, PNG, WebP)',
  networkError: 'Network error. Please check your connection.',
  serverError: 'Server error. Please try again later.',
  notFound: 'The requested resource was not found',
  unauthorized: 'You are not authorized to perform this action',
  duplicateEntry: 'A record with this information already exists',
  dateInFuture: 'Date cannot be in the future',
  dateInPast: 'Date cannot be in the past',
  invalidAge: 'Age must be between 18 and 65',
  invalidSalary: 'Salary must be a positive number',
} as const;

export const SUCCESS_MESSAGES = {
  staffAdded: 'Staff member added successfully',
  staffUpdated: 'Staff member updated successfully',
  staffDeleted: 'Staff member deleted successfully',
  imageUploaded: 'Image uploaded successfully',
  exportCompleted: 'Export completed successfully',
  printJobSubmitted: 'Print job submitted successfully',
} as const;

export const CONFIRMATION_MESSAGES = {
  deleteStaff: 'Are you sure you want to delete this staff member? This action cannot be undone.',
  bulkDelete: 'Are you sure you want to delete the selected staff members? This action cannot be undone.',
  discardChanges: 'You have unsaved changes. Are you sure you want to discard them?',
  overwriteFile: 'A file with this name already exists. Do you want to overwrite it?',
} as const;