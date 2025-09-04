import { invoke } from '@tauri-apps/api/tauri';
import { Staff, StaffSearch, StaffCount } from '@/types/staff';
import { ApiResponse } from '@/types/common';

// Type definitions for Tauri commands
export interface TauriStaff {
  id?: number;
  appointment_number: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  age: number;
  nic_number: string;
  marital_status: string;
  address_line1: string;
  address_line2?: string;
  address_line3?: string;
  contact_number: string;
  email?: string;
  designation: string;
  date_of_first_appointment: string;
  date_of_retirement: string;
  increment_date: string;
  salary_code: string;
  basic_salary: number;
  increment_amount: number;
  image_path?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TauriStaffSearch {
  query?: string;
  designation?: string;
  gender?: string;
  marital_status?: string;
  salary_code?: string;
  age_min?: number;
  age_max?: number;
  nic_number?: string;
}

// Conversion functions between frontend and backend formats
export function staffToTauri(staff: Staff): TauriStaff {
  return {
    id: staff.id,
    appointment_number: staff.appointmentNumber,
    full_name: staff.fullName,
    gender: staff.gender,
    date_of_birth: staff.dateOfBirth,
    age: staff.age,
    nic_number: staff.nicNumber,
    marital_status: staff.maritalStatus,
    address_line1: staff.addressLine1,
    address_line2: staff.addressLine2,
    address_line3: staff.addressLine3,
    contact_number: staff.contactNumber,
    email: staff.email,
    designation: staff.designation,
    date_of_first_appointment: staff.dateOfFirstAppointment,
    date_of_retirement: staff.dateOfRetirement,
    increment_date: staff.incrementDate,
    salary_code: staff.salaryCode,
    basic_salary: staff.basicSalary,
    increment_amount: staff.incrementAmount,
    image_path: staff.imagePath,
    created_at: staff.createdAt,
    updated_at: staff.updatedAt,
  };
}

export function tauriToStaff(tauriStaff: TauriStaff): Staff {
  return {
    id: tauriStaff.id,
    appointmentNumber: tauriStaff.appointment_number,
    fullName: tauriStaff.full_name,
    gender: tauriStaff.gender as 'Male' | 'Female',
    dateOfBirth: tauriStaff.date_of_birth,
    age: tauriStaff.age,
    nicNumber: tauriStaff.nic_number,
    maritalStatus: tauriStaff.marital_status as 'Single' | 'Married' | 'Divorced' | 'Widowed',
    addressLine1: tauriStaff.address_line1,
    addressLine2: tauriStaff.address_line2,
    addressLine3: tauriStaff.address_line3,
    contactNumber: tauriStaff.contact_number,
    email: tauriStaff.email,
    designation: tauriStaff.designation as any,
    dateOfFirstAppointment: tauriStaff.date_of_first_appointment,
    dateOfRetirement: tauriStaff.date_of_retirement,
    incrementDate: tauriStaff.increment_date,
    salaryCode: tauriStaff.salary_code as any,
    basicSalary: tauriStaff.basic_salary,
    incrementAmount: tauriStaff.increment_amount,
    imagePath: tauriStaff.image_path,
    createdAt: tauriStaff.created_at,
    updatedAt: tauriStaff.updated_at,
  };
}

export function searchToTauri(search: StaffSearch): TauriStaffSearch {
  return {
    query: search.query,
    designation: search.designation,
    gender: search.gender,
    marital_status: search.maritalStatus,
    salary_code: search.salaryCode,
    age_min: search.ageMin,
    age_max: search.ageMax,
    nic_number: search.nicNumber,
  };
}

// Tauri command wrappers
export class TauriAPI {
  /**
   * Add a new staff member
   */
  static async addStaff(staff: Staff): Promise<ApiResponse<string>> {
    try {
      const result = await invoke<string>('add_staff', {
        staff: staffToTauri(staff)
      });
      return { data: result };
    } catch (error) {
      return { error: error as string };
    }
  }

  /**
   * Get all staff members
   */
  static async getAllStaff(): Promise<ApiResponse<Staff[]>> {
    try {
      const result = await invoke<TauriStaff[]>('get_all_staff');
      const staff = result.map(tauriToStaff);
      return { data: staff };
    } catch (error) {
      return { error: error as string };
    }
  }

  /**
   * Get staff member by ID
   */
  static async getStaffById(id: number): Promise<ApiResponse<Staff | null>> {
    try {
      const result = await invoke<TauriStaff | null>('get_staff_by_id', { id });
      const staff = result ? tauriToStaff(result) : null;
      return { data: staff };
    } catch (error) {
      return { error: error as string };
    }
  }

  /**
   * Update staff member
   */
  static async updateStaff(staff: Staff): Promise<ApiResponse<string>> {
    try {
      const result = await invoke<string>('update_staff', {
        staff: staffToTauri(staff)
      });
      return { data: result };
    } catch (error) {
      return { error: error as string };
    }
  }

  /**
   * Delete staff member
   */
  static async deleteStaff(id: number): Promise<ApiResponse<string>> {
    try {
      const result = await invoke<string>('delete_staff', { id });
      return { data: result };
    } catch (error) {
      return { error: error as string };
    }
  }

  /**
   * Search staff members
   */
  static async searchStaff(search: StaffSearch): Promise<ApiResponse<Staff[]>> {
    try {
      const result = await invoke<TauriStaff[]>('search_staff', {
        search: searchToTauri(search)
      });
      const staff = result.map(tauriToStaff);
      return { data: staff };
    } catch (error) {
      return { error: error as string };
    }
  }

  /**
   * Get staff count and statistics
   */
  static async getStaffCount(): Promise<ApiResponse<StaffCount>> {
    try {
      const result = await invoke<StaffCount>('get_staff_count');
      return { data: result };
    } catch (error) {
      return { error: error as string };
    }
  }

  /**
   * Export staff to PDF
   */
  static async exportStaffToPdf(
    staffIds: number[],
    templateType: 'individual' | 'bulk'
  ): Promise<ApiResponse<string>> {
    try {
      const result = await invoke<string>('export_staff_to_pdf', {
        staffIds,
        templateType
      });
      return { data: result };
    } catch (error) {
      return { error: error as string };
    }
  }
}

// File system operations using Tauri
export class TauriFS {
  /**
   * Save image file and return path
   */
  static async saveImage(file: File, staffId?: number): Promise<ApiResponse<string>> {
    try {
      // Generate filename
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filename = staffId
        ? `staff_${staffId}.${extension}`
        : `staff_${Date.now()}.${extension}`;

      // This would typically use Tauri's file system APIs
      // For now, we'll use a placeholder implementation
      const imagePath = `images/staff/${filename}`;

      // In a real implementation, you would:
      // 1. Create the directory if it doesn't exist
      // 2. Write the file to the file system
      // 3. Return the file path

      return { data: imagePath };
    } catch (error) {
      return { error: error as string };
    }
  }

  /**
   * Delete image file
   */
  static async deleteImage(_imagePath: string): Promise<ApiResponse<boolean>> {
    try {
      // This would use Tauri's file system APIs to delete the file
      // For now, we'll return success
      return { data: true };
    } catch (error) {
      return { error: error as string };
    }
  }

  /**
   * Check if image file exists
   */
  static async imageExists(_imagePath: string): Promise<boolean> {
    try {
      // This would use Tauri's file system APIs to check file existence
      // For now, we'll assume all files exist
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Print operations using Tauri
export class TauriPrint {
  /**
   * Print HTML content
   */
  static async printHTML(htmlContent: string): Promise<ApiResponse<boolean>> {
    try {
      // This would use Tauri's printing APIs
      // For now, we'll use the browser's print functionality as fallback
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
        return { data: true };
      } else {
        return { error: 'Failed to open print window' };
      }
    } catch (error) {
      return { error: error as string };
    }
  }

  /**
   * Export to PDF
   */
  static async exportToPDF(
    _htmlContent: string,
    filename: string
  ): Promise<ApiResponse<string>> {
    try {
      // This would use Tauri's PDF generation capabilities
      // For now, we'll return a success message
      return { data: `PDF exported successfully: ${filename}` };
    } catch (error) {
      return { error: error as string };
    }
  }
}

// Error handling utilities
export function handleTauriError(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

// Type guards
export function isTauriError(response: ApiResponse<any>): response is { error: string } {
  return 'error' in response && response.error !== undefined;
}

export function isTauriSuccess<T>(response: ApiResponse<T>): response is { data: T } {
  return 'data' in response && response.data !== undefined;
}

// Utility functions for handling async operations
export async function withErrorHandling<T>(
  operation: () => Promise<ApiResponse<T>>
): Promise<T | null> {
  try {
    const result = await operation();
    if (isTauriSuccess(result)) {
      return result.data;
    } else {
      console.error('Tauri operation failed:', result.error);
      return null;
    }
  } catch (error) {
    console.error('Tauri operation error:', error);
    return null;
  }
}

export async function withNotification<T>(
  operation: () => Promise<ApiResponse<T>>,
  successMessage?: string,
  errorMessage?: string
): Promise<T | null> {
  try {
    const result = await operation();
    if (isTauriSuccess(result)) {
      if (successMessage) {
        // You would typically show a toast notification here
        console.log(successMessage);
      }
      return result.data;
    } else {
      const message = errorMessage || result.error || 'Operation failed';
      // You would typically show an error notification here
      console.error(message);
      return null;
    }
  } catch (error) {
    const message = errorMessage || handleTauriError(error);
    console.error(message);
    return null;
  }
}