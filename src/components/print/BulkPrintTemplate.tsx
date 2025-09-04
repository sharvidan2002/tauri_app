import React from 'react';
import { Staff, StaffSearch } from '@/types/staff';
import { formatCurrency } from '@/lib/utils';
import { OFFICE_INFO } from '@/lib/constants';

interface BulkPrintTemplateProps {
  staffList: Staff[];
  title?: string;
  filters?: StaffSearch;
  includeImages?: boolean;
  selectedColumns?: string[];
}

const BulkPrintTemplate: React.FC<BulkPrintTemplateProps> = ({
  staffList,
  title = 'Staff List',
  filters,
  includeImages = false,
  selectedColumns = [
    'appointmentNumber',
    'fullName',
    'designation',
    'gender',
    'age',
    'nicNumber',
    'contactNumber',
    'basicSalary'
  ],
}) => {
  const renderFilterInfo = () => {
    if (!filters) return null;

    const activeFilters = Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        return `${label}: ${value}`;
      });

    if (activeFilters.length === 0) return null;

    return (
      <div className="staff-print-bulk-filters">
        <strong>Applied Filters:</strong> {activeFilters.join(', ')}
      </div>
    );
  };

  const renderTableHeader = () => (
    <thead>
      <tr>
        {selectedColumns.includes('appointmentNumber') && <th>App. No.</th>}
        {selectedColumns.includes('fullName') && <th>Full Name</th>}
        {selectedColumns.includes('designation') && <th>Designation</th>}
        {selectedColumns.includes('gender') && <th>Gender</th>}
        {selectedColumns.includes('age') && <th>Age</th>}
        {selectedColumns.includes('nicNumber') && <th>NIC Number</th>}
        {selectedColumns.includes('maritalStatus') && <th>Marital Status</th>}
        {selectedColumns.includes('contactNumber') && <th>Contact</th>}
        {selectedColumns.includes('email') && <th>Email</th>}
        {selectedColumns.includes('dateOfFirstAppointment') && <th>Appointment Date</th>}
        {selectedColumns.includes('dateOfRetirement') && <th>Retirement Date</th>}
        {selectedColumns.includes('salaryCode') && <th>Salary Code</th>}
        {selectedColumns.includes('basicSalary') && <th>Basic Salary</th>}
        {selectedColumns.includes('incrementAmount') && <th>Increment</th>}
        {selectedColumns.includes('totalSalary') && <th>Total Monthly</th>}
        {includeImages && <th>Photo</th>}
      </tr>
    </thead>
  );

  const renderTableRow = (staff: Staff) => (
    <tr key={staff.id}>
      {selectedColumns.includes('appointmentNumber') && (
        <td>{staff.appointmentNumber}</td>
      )}
      {selectedColumns.includes('fullName') && (
        <td>{staff.fullName}</td>
      )}
      {selectedColumns.includes('designation') && (
        <td>{staff.designation}</td>
      )}
      {selectedColumns.includes('gender') && (
        <td>{staff.gender}</td>
      )}
      {selectedColumns.includes('age') && (
        <td>{staff.age}</td>
      )}
      {selectedColumns.includes('nicNumber') && (
        <td>{staff.nicNumber}</td>
      )}
      {selectedColumns.includes('maritalStatus') && (
        <td>{staff.maritalStatus}</td>
      )}
      {selectedColumns.includes('contactNumber') && (
        <td>{staff.contactNumber}</td>
      )}
      {selectedColumns.includes('email') && (
        <td>{staff.email || '-'}</td>
      )}
      {selectedColumns.includes('dateOfFirstAppointment') && (
        <td>{staff.dateOfFirstAppointment}</td>
      )}
      {selectedColumns.includes('dateOfRetirement') && (
        <td>{staff.dateOfRetirement}</td>
      )}
      {selectedColumns.includes('salaryCode') && (
        <td>{staff.salaryCode}</td>
      )}
      {selectedColumns.includes('basicSalary') && (
        <td>{formatCurrency(staff.basicSalary)}</td>
      )}
      {selectedColumns.includes('incrementAmount') && (
        <td>{formatCurrency(staff.incrementAmount)}</td>
      )}
      {selectedColumns.includes('totalSalary') && (
        <td>{formatCurrency(staff.basicSalary + staff.incrementAmount)}</td>
      )}
      {includeImages && (
        <td>
          {staff.imagePath ? (
            <img
              src={staff.imagePath}
              alt={staff.fullName}
              style={{ width: '30px', height: '40px', objectFit: 'cover' }}
            />
          ) : (
            '-'
          )}
        </td>
      )}
    </tr>
  );

  const calculateSummaryStats = () => {
    const totalStaff = staffList.length;
    const totalBasicSalary = staffList.reduce((sum, staff) => sum + staff.basicSalary, 0);
    const totalIncrements = staffList.reduce((sum, staff) => sum + staff.incrementAmount, 0);
    const totalMonthlySalaries = staffList.reduce((sum, staff) => sum + staff.basicSalary + staff.incrementAmount, 0);
    const avgAge = Math.round(staffList.reduce((sum, staff) => sum + staff.age, 0) / totalStaff);

    const genderBreakdown = staffList.reduce((acc, staff) => {
      acc[staff.gender] = (acc[staff.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const designationBreakdown = staffList.reduce((acc, staff) => {
      acc[staff.designation] = (acc[staff.designation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalStaff,
      totalBasicSalary,
      totalIncrements,
      totalMonthlySalaries,
      avgAge,
      genderBreakdown,
      designationBreakdown,
    };
  };

  const stats = calculateSummaryStats();

  return (
    <div className="staff-print-bulk print-only">
      {/* Header */}
      <div className="staff-print-bulk-header">
        <h1 className="staff-print-bulk-title">DIVISIONAL FOREST OFFICE - VAVUNIYA</h1>
        <h2>{title}</h2>
        <p>Forest Department, Sri Lanka</p>
        {renderFilterInfo()}
      </div>

      {/* Staff Table */}
      <table className="staff-print-table">
        {renderTableHeader()}
        <tbody>
          {staffList.map(renderTableRow)}
        </tbody>
      </table>

      {/* Summary Section */}
      <div className="staff-print-summary">
        <div className="staff-print-summary-title">Summary Statistics</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
          {/* Basic Stats */}
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '11pt', fontWeight: 'bold' }}>
              General Statistics
            </h4>
            <div style={{ fontSize: '9pt', lineHeight: '1.4' }}>
              <div><strong>Total Staff:</strong> {stats.totalStaff}</div>
              <div><strong>Average Age:</strong> {stats.avgAge} years</div>
              <div><strong>Total Basic Salaries:</strong> {formatCurrency(stats.totalBasicSalary)}</div>
              <div><strong>Total Increments:</strong> {formatCurrency(stats.totalIncrements)}</div>
              <div><strong>Total Monthly Salaries:</strong> {formatCurrency(stats.totalMonthlySalaries)}</div>
              <div><strong>Total Annual Cost:</strong> {formatCurrency(stats.totalMonthlySalaries * 12)}</div>
            </div>
          </div>

          {/* Breakdowns */}
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '11pt', fontWeight: 'bold' }}>
              Staff Distribution
            </h4>
            <div style={{ fontSize: '9pt', lineHeight: '1.4' }}>
              <div><strong>Gender Distribution:</strong></div>
              {Object.entries(stats.genderBreakdown).map(([gender, count]) => (
                <div key={gender} style={{ marginLeft: '10px' }}>
                  {gender}: {count} ({Math.round((count / stats.totalStaff) * 100)}%)
                </div>
              ))}

              <div style={{ marginTop: '8px' }}><strong>Top Designations:</strong></div>
              {Object.entries(stats.designationBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([designation, count]) => (
                  <div key={designation} style={{ marginLeft: '10px', fontSize: '8pt' }}>
                    {designation}: {count}
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="staff-print-summary-stats" style={{ marginTop: '15px', fontSize: '8pt' }}>
          <span><strong>Report Generated:</strong> {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-GB')}</span>
          <span><strong>Office:</strong> {OFFICE_INFO.name}</span>
        </div>
      </div>

      {/* Page Break for Multiple Pages */}
      {staffList.length > 25 && (
        <div style={{ pageBreakBefore: 'always' }} className="page-break" />
      )}

      {/* Footer */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        fontSize: '8pt',
        color: '#666'
      }}>
        Page 1 | {OFFICE_INFO.name}
      </div>
    </div>
  );
};

export default BulkPrintTemplate;