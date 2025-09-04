import { useState, useCallback } from 'react';
import { Staff, PrintOptions } from '@/types/staff';
import { TauriPrint } from '@/lib/tauri';

interface PrintState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export function usePrint() {
  const [printState, setPrintState] = useState<PrintState>({
    isLoading: false,
    error: null,
    success: false,
  });

  const resetState = useCallback(() => {
    setPrintState({
      isLoading: false,
      error: null,
      success: false,
    });
  }, []);

  const printHTML = useCallback(async (htmlContent: string) => {
    setPrintState({ isLoading: true, error: null, success: false });

    try {
      const result = await TauriPrint.printHTML(htmlContent);
      if (result.error) {
        throw new Error(result.error);
      }

      setPrintState({ isLoading: false, error: null, success: true });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Print failed';
      setPrintState({ isLoading: false, error: errorMessage, success: false });
      return false;
    }
  }, []);

  const exportToPDF = useCallback(async (htmlContent: string, filename: string) => {
    setPrintState({ isLoading: true, error: null, success: false });

    try {
      const result = await TauriPrint.exportToPDF(htmlContent, filename);
      if (result.error) {
        throw new Error(result.error);
      }

      setPrintState({ isLoading: false, error: null, success: true });
      return result.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      setPrintState({ isLoading: false, error: errorMessage, success: false });
      return null;
    }
  }, []);

  const generateIndividualPrintContent = useCallback((staff: Staff, options?: Partial<PrintOptions>) => {
    const {
      includePhoto = true,
      includePersonalDetails = true,
      includeEmploymentDetails = true,
      includeSalaryDetails = true,
    } = options || {};

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Staff Details - ${staff.fullName}</title>
        <style>
          ${getCommonPrintStyles()}
          ${getIndividualPrintStyles()}
        </style>
      </head>
      <body class="staff-print-individual">
        <div class="staff-print-header">
          <div class="staff-print-logo">
            <img src="/assets/images/forest-logo.png" alt="Forest Office Logo" />
          </div>
          <h1 class="staff-print-title">DIVISIONAL FOREST OFFICE - VAVUNIYA</h1>
          <p class="staff-print-subtitle">Staff Information Record</p>
          <p class="staff-print-office">Forest Department, Sri Lanka</p>
        </div>

        <div class="staff-print-content">
          ${includePhoto ? `
            <div class="staff-print-photo">
              ${staff.imagePath ?
                `<img src="${staff.imagePath}" alt="${staff.fullName}" />` :
                '<div class="no-photo">No Photo Available</div>'
              }
            </div>
          ` : ''}

          <div class="staff-print-details">
            ${includePersonalDetails ? `
              <div class="staff-print-section">
                <h2 class="staff-print-section-title">Personal Details</h2>
                <div class="staff-print-field">
                  <span class="staff-print-label">Appointment Number:</span>
                  <span class="staff-print-value">${staff.appointmentNumber}</span>
                </div>
                <div class="staff-print-field">
                  <span class="staff-print-label">Full Name:</span>
                  <span class="staff-print-value">${staff.fullName}</span>
                </div>
                <div class="staff-print-field">
                  <span class="staff-print-label">Gender:</span>
                  <span class="staff-print-value">${staff.gender}</span>
                </div>
                <div class="staff-print-field">
                  <span class="staff-print-label">Date of Birth:</span>
                  <span class="staff-print-value">${staff.dateOfBirth}</span>
                </div>
                <div class="staff-print-field">
                  <span class="staff-print-label">Age:</span>
                  <span class="staff-print-value">${staff.age} years</span>
                </div>
                <div class="staff-print-field">
                  <span class="staff-print-label">NIC Number:</span>
                  <span class="staff-print-value">${staff.nicNumber}</span>
                </div>
                <div class="staff-print-field">
                  <span class="staff-print-label">Marital Status:</span>
                  <span class="staff-print-value">${staff.maritalStatus}</span>
                </div>
                <div class="staff-print-field">
                  <span class="staff-print-label">Address:</span>
                  <span class="staff-print-value">
                    ${staff.addressLine1}${staff.addressLine2 ? '<br>' + staff.addressLine2 : ''}${staff.addressLine3 ? '<br>' + staff.addressLine3 : ''}
                  </span>
                </div>
                <div class="staff-print-field">
                  <span class="staff-print-label">Contact Number:</span>
                  <span class="staff-print-value">${staff.contactNumber}</span>
                </div>
                ${staff.email ? `
                  <div class="staff-print-field">
                    <span class="staff-print-label">Email:</span>
                    <span class="staff-print-value">${staff.email}</span>
                  </div>
                ` : ''}
              </div>
            ` : ''}

            ${includeEmploymentDetails ? `
              <div class="staff-print-section">
                <h2 class="staff-print-section-title">Employment Details</h2>
                <div class="staff-print-field">
                  <span class="staff-print-label">Designation:</span>
                  <span class="staff-print-value">${staff.designation}</span>
                </div>
                <div class="staff-print-field">
                  <span class="staff-print-label">First Appointment:</span>
                  <span class="staff-print-value">${staff.dateOfFirstAppointment}</span>
                </div>
                <div class="staff-print-field">
                  <span class="staff-print-label">Retirement Date:</span>
                  <span class="staff-print-value">${staff.dateOfRetirement}</span>
                </div>
                <div class="staff-print-field">
                  <span class="staff-print-label">Increment Date:</span>
                  <span class="staff-print-value">${staff.incrementDate}</span>
                </div>
              </div>
            ` : ''}

            ${includeSalaryDetails ? `
              <div class="staff-print-section">
                <h2 class="staff-print-section-title">Salary Information</h2>
                <div class="staff-print-field">
                  <span class="staff-print-label">Salary Code:</span>
                  <span class="staff-print-value">${staff.salaryCode}</span>
                </div>
                <div class="staff-print-field">
                  <span class="staff-print-label">Basic Salary:</span>
                  <span class="staff-print-value">Rs. ${staff.basicSalary.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="staff-print-field">
                  <span class="staff-print-label">Increment Amount:</span>
                  <span class="staff-print-value">Rs. ${staff.incrementAmount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="staff-print-footer">
          <p>Generated on ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB')}</p>
          <p>Divisional Forest Office - Vavuniya, Sri Lanka</p>
        </div>
      </body>
      </html>
    `;
  }, []);

  const generateBulkPrintContent = useCallback((
    staffList: Staff[],
    options?: Partial<PrintOptions & { title?: string }>
  ) => {
    const { title = 'Staff List', filters } = options || {};

    const filterText = filters ? Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ') : '';

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          ${getCommonPrintStyles()}
          ${getBulkPrintStyles()}
        </style>
      </head>
      <body class="staff-print-bulk">
        <div class="staff-print-bulk-header">
          <h1 class="staff-print-bulk-title">DIVISIONAL FOREST OFFICE - VAVUNIYA</h1>
          <h2>${title}</h2>
          ${filterText ? `<div class="staff-print-bulk-filters">Filters Applied: ${filterText}</div>` : ''}
        </div>

        <table class="staff-print-table">
          <thead>
            <tr>
              <th>App. No.</th>
              <th>Full Name</th>
              <th>Designation</th>
              <th>Gender</th>
              <th>Age</th>
              <th>NIC Number</th>
              <th>Contact</th>
              <th>Appointment Date</th>
              <th>Basic Salary</th>
            </tr>
          </thead>
          <tbody>
            ${staffList.map(staff => `
              <tr>
                <td>${staff.appointmentNumber}</td>
                <td>${staff.fullName}</td>
                <td>${staff.designation}</td>
                <td>${staff.gender}</td>
                <td>${staff.age}</td>
                <td>${staff.nicNumber}</td>
                <td>${staff.contactNumber}</td>
                <td>${staff.dateOfFirstAppointment}</td>
                <td>Rs. ${staff.basicSalary.toLocaleString('en-LK')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="staff-print-summary">
          <div class="staff-print-summary-title">Summary</div>
          <div class="staff-print-summary-stats">
            <span>Total Staff: ${staffList.length}</span>
            <span>Generated: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB')}</span>
          </div>
        </div>
      </body>
      </html>
    `;
  }, []);

  return {
    ...printState,
    printHTML,
    exportToPDF,
    generateIndividualPrintContent,
    generateBulkPrintContent,
    resetState,
  };
}

function getCommonPrintStyles(): string {
  return `
    @page {
      size: A4;
      margin: 1cm;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Times New Roman', serif;
      line-height: 1.4;
      margin: 0;
      padding: 0;
      background: white;
      color: black;
    }

    .no-photo {
      width: 120px;
      height: 150px;
      border: 2px solid #333;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      font-size: 12px;
      color: #666;
    }
  `;
}

function getIndividualPrintStyles(): string {
  return `
    .staff-print-individual {
      padding: 20px;
      max-width: 210mm;
      margin: 0 auto;
    }

    .staff-print-header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #333;
      padding-bottom: 15px;
    }

    .staff-print-logo img {
      width: 80px;
      height: 80px;
      margin-bottom: 15px;
    }

    .staff-print-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin: 0 0 5px 0;
    }

    .staff-print-subtitle {
      font-size: 14px;
      color: #666;
      margin: 0 0 5px 0;
    }

    .staff-print-office {
      font-size: 12px;
      color: #666;
      margin: 0;
    }

    .staff-print-content {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .staff-print-photo {
      flex-shrink: 0;
      width: 120px;
      text-align: center;
    }

    .staff-print-photo img {
      width: 120px;
      height: 150px;
      object-fit: cover;
      border: 2px solid #333;
      border-radius: 8px;
    }

    .staff-print-details {
      flex: 1;
    }

    .staff-print-section {
      margin-bottom: 20px;
    }

    .staff-print-section-title {
      font-size: 14px;
      font-weight: bold;
      color: #333;
      margin: 0 0 10px 0;
      padding-bottom: 5px;
      border-bottom: 1px solid #ccc;
    }

    .staff-print-field {
      display: flex;
      margin-bottom: 8px;
      padding: 4px 0;
    }

    .staff-print-label {
      font-weight: bold;
      width: 150px;
      color: #555;
    }

    .staff-print-value {
      flex: 1;
      color: #333;
    }

    .staff-print-footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #ccc;
      text-align: center;
      font-size: 10px;
      color: #666;
    }
  `;
}

function getBulkPrintStyles(): string {
  return `
    .staff-print-bulk {
      padding: 15px;
      max-width: 297mm;
      margin: 0 auto;
    }

    .staff-print-bulk-header {
      text-align: center;
      margin-bottom: 20px;
    }

    .staff-print-bulk-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin: 0 0 10px 0;
    }

    .staff-print-bulk-header h2 {
      font-size: 14px;
      margin: 0 0 10px 0;
    }

    .staff-print-bulk-filters {
      font-size: 10px;
      color: #666;
      margin-bottom: 15px;
    }

    .staff-print-table {
      width: 100%;
      border-collapse: collapse;
      border: 2px solid #333;
      font-size: 9px;
    }

    .staff-print-table th {
      background: #f5f5f5;
      color: #333;
      font-weight: bold;
      padding: 6px 4px;
      border: 1px solid #333;
      text-align: left;
    }

    .staff-print-table td {
      padding: 4px 3px;
      border: 1px solid #666;
      vertical-align: top;
    }

    .staff-print-table tbody tr:nth-child(even) {
      background: #fafafa;
    }

    .staff-print-summary {
      margin-top: 20px;
      padding: 10px;
      border: 1px solid #ccc;
      background: #f9f9f9;
    }

    .staff-print-summary-title {
      font-weight: bold;
      margin-bottom: 8px;
    }

    .staff-print-summary-stats {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
    }
  `;
}