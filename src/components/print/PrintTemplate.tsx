import React from 'react';
import { Staff } from '@/types/staff';
import { formatCurrency, getYearsOfService } from '@/lib/utils';
import { OFFICE_INFO } from '@/lib/constants';

interface PrintTemplateProps {
  staff: Staff;
  includePhoto?: boolean;
  includePersonalDetails?: boolean;
  includeEmploymentDetails?: boolean;
  includeSalaryDetails?: boolean;
}

const PrintTemplate: React.FC<PrintTemplateProps> = ({
  staff,
  includePhoto = true,
  includePersonalDetails = true,
  includeEmploymentDetails = true,
  includeSalaryDetails = true,
}) => {
  const yearsOfService = getYearsOfService(staff.dateOfFirstAppointment);

  return (
    <div className="staff-print-individual print-only">
      {/* Header */}
      <div className="staff-print-header">
        <div className="staff-print-logo">
          <img src="/assets/images/forest-logo.png" alt="Forest Office Logo" />
        </div>
        <h1 className="staff-print-title">DIVISIONAL FOREST OFFICE - VAVUNIYA</h1>
        <p className="staff-print-subtitle">Staff Information Record</p>
        <p className="staff-print-office">Forest Department, Sri Lanka</p>
      </div>

      {/* Content */}
      <div className="staff-print-content">
        {/* Photo Section */}
        {includePhoto && (
          <div className="staff-print-photo">
            {staff.imagePath ? (
              <img src={staff.imagePath} alt={staff.fullName} />
            ) : (
              <div className="no-photo">No Photo Available</div>
            )}
          </div>
        )}

        {/* Details Section */}
        <div className="staff-print-details">
          {/* Personal Details */}
          {includePersonalDetails && (
            <div className="staff-print-section">
              <h2 className="staff-print-section-title">Personal Details</h2>

              <div className="staff-print-field">
                <span className="staff-print-label">Appointment Number:</span>
                <span className="staff-print-value">{staff.appointmentNumber}</span>
              </div>

              <div className="staff-print-field">
                <span className="staff-print-label">Full Name:</span>
                <span className="staff-print-value">{staff.fullName}</span>
              </div>

              <div className="staff-print-field">
                <span className="staff-print-label">Gender:</span>
                <span className="staff-print-value">{staff.gender}</span>
              </div>

              <div className="staff-print-field">
                <span className="staff-print-label">Date of Birth:</span>
                <span className="staff-print-value">{staff.dateOfBirth}</span>
              </div>

              <div className="staff-print-field">
                <span className="staff-print-label">Age:</span>
                <span className="staff-print-value">{staff.age} years</span>
              </div>

              <div className="staff-print-field">
                <span className="staff-print-label">NIC Number:</span>
                <span className="staff-print-value">{staff.nicNumber}</span>
              </div>

              <div className="staff-print-field">
                <span className="staff-print-label">Marital Status:</span>
                <span className="staff-print-value">{staff.maritalStatus}</span>
              </div>

              <div className="staff-print-field">
                <span className="staff-print-label">Address:</span>
                <span className="staff-print-value">
                  {staff.addressLine1}
                  {staff.addressLine2 && <><br />{staff.addressLine2}</>}
                  {staff.addressLine3 && <><br />{staff.addressLine3}</>}
                </span>
              </div>

              <div className="staff-print-field">
                <span className="staff-print-label">Contact Number:</span>
                <span className="staff-print-value">{staff.contactNumber}</span>
              </div>

              {staff.email && (
                <div className="staff-print-field">
                  <span className="staff-print-label">Email:</span>
                  <span className="staff-print-value">{staff.email}</span>
                </div>
              )}
            </div>
          )}

          {/* Employment Details */}
          {includeEmploymentDetails && (
            <div className="staff-print-section">
              <h2 className="staff-print-section-title">Employment Details</h2>

              <div className="staff-print-field">
                <span className="staff-print-label">Designation:</span>
                <span className="staff-print-value">{staff.designation}</span>
              </div>

              <div className="staff-print-field">
                <span className="staff-print-label">First Appointment:</span>
                <span className="staff-print-value">{staff.dateOfFirstAppointment}</span>
              </div>

              <div className="staff-print-field">
                <span className="staff-print-label">Years of Service:</span>
                <span className="staff-print-value">{yearsOfService} years</span>
              </div>

              <div className="staff-print-field">
                <span className="staff-print-label">Retirement Date:</span>
                <span className="staff-print-value">{staff.dateOfRetirement}</span>
              </div>

              <div className="staff-print-field">
                <span className="staff-print-label">Increment Date:</span>
                <span className="staff-print-value">{staff.incrementDate}</span>
              </div>
            </div>
          )}

          {/* Salary Information */}
          {includeSalaryDetails && (
            <div className="staff-print-section">
              <h2 className="staff-print-section-title">Salary Information</h2>

              <div className="staff-print-field">
                <span className="staff-print-label">Salary Code:</span>
                <span className="staff-print-value">{staff.salaryCode}</span>
              </div>

              <div className="staff-print-field">
                <span className="staff-print-label">Basic Salary:</span>
                <span className="staff-print-value">{formatCurrency(staff.basicSalary)}</span>
              </div>

              <div className="staff-print-field">
                <span className="staff-print-label">Increment Amount:</span>
                <span className="staff-print-value">{formatCurrency(staff.incrementAmount)}</span>
              </div>

              <div className="staff-print-field">
                <span className="staff-print-label">Total Monthly:</span>
                <span className="staff-print-value">
                  {formatCurrency(staff.basicSalary + staff.incrementAmount)}
                </span>
              </div>

              <div className="staff-print-field">
                <span className="staff-print-label">Annual Salary:</span>
                <span className="staff-print-value">
                  {formatCurrency((staff.basicSalary + staff.incrementAmount) * 12)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="staff-print-footer">
        <p>Generated on {new Date().toLocaleDateString('en-GB')} at {new Date().toLocaleTimeString('en-GB')}</p>
        <p>{OFFICE_INFO.name}</p>
        <p>{OFFICE_INFO.address}</p>
      </div>
    </div>
  );
};

export default PrintTemplate;