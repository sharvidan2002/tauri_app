import React, { useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Edit,
  Print,
  Download,
  User,
  Briefcase,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Clock,
  Badge,
  FileText
} from 'lucide-react';
import { Staff } from '@/types/staff';
import { formatCurrency, getYearsOfService } from '@/lib/utils';
import { usePrint } from '@/hooks/usePrint';
import { OFFICE_INFO } from '@/lib/constants';

interface StaffDetailsProps {
  staff: Staff;
  onBack: () => void;
  onEdit: () => void;
}

const StaffDetails: React.FC<StaffDetailsProps> = ({
  staff,
  onBack,
  onEdit,
}) => {
  const {
    generateIndividualPrintContent,
    printHTML,
    exportToPDF,
    isLoading: printLoading
  } = usePrint();

  const handlePrint = useCallback(async () => {
    const printContent = generateIndividualPrintContent(staff);
    await printHTML(printContent);
  }, [staff, generateIndividualPrintContent, printHTML]);

  const handleExport = useCallback(async () => {
    const printContent = generateIndividualPrintContent(staff);
    const filename = `staff-${staff.appointmentNumber}-${staff.fullName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    await exportToPDF(printContent, filename);
  }, [staff, generateIndividualPrintContent, exportToPDF]);

  const renderDetailSection = (
    title: string,
    icon: React.ReactNode,
    children: React.ReactNode
  ) => (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );

  const renderDetailRow = (label: string, value: string | number | undefined, icon?: React.ReactNode) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-2 text-gray-600 font-medium">
        {icon}
        {label}
      </div>
      <div className="text-gray-900 font-semibold">
        {value || 'Not specified'}
      </div>
    </div>
  );

  const yearsOfService = getYearsOfService(staff.dateOfFirstAppointment);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="glass">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              className="btn-modern"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={onEdit}
                className="btn-modern"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>

              <Button
                variant="outline"
                onClick={handlePrint}
                loading={printLoading}
                className="btn-modern"
              >
                <Print className="h-4 w-4 mr-2" />
                Print
              </Button>

              <Button
                variant="outline"
                onClick={handleExport}
                loading={printLoading}
                className="btn-modern"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Profile */}
      <Card className="glass">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-60 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl shadow-lg overflow-hidden">
                {staff.imagePath ? (
                  <img
                    src={staff.imagePath}
                    alt={staff.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-grow">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {staff.fullName}
                  </h1>
                  <p className="text-xl text-blue-600 font-semibold mb-1">
                    {staff.designation}
                  </p>
                  <p className="text-gray-600">
                    {OFFICE_INFO.name}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-600">Appointment No:</span>
                      <span className="font-semibold">{staff.appointmentNumber}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      <span className="text-gray-600">NIC:</span>
                      <span className="font-semibold">{staff.nicNumber}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <span className="text-gray-600">Age:</span>
                      <span className="font-semibold">{staff.age} years</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-orange-600" />
                      <span className="text-gray-600">Contact:</span>
                      <span className="font-semibold">{staff.contactNumber}</span>
                    </div>

                    {staff.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-red-600" />
                        <span className="text-gray-600">Email:</span>
                        <span className="font-semibold">{staff.email}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-indigo-600" />
                      <span className="text-gray-600">Service:</span>
                      <span className="font-semibold">{yearsOfService} years</span>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 pt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Active Employee
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {staff.gender}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {staff.maritalStatus}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    Grade {staff.salaryCode}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Details */}
        {renderDetailSection(
          'Personal Information',
          <User className="h-5 w-5" />,
          <div className="space-y-1">
            {renderDetailRow('Full Name', staff.fullName)}
            {renderDetailRow('Gender', staff.gender)}
            {renderDetailRow('Date of Birth', staff.dateOfBirth)}
            {renderDetailRow('Age', `${staff.age} years`)}
            {renderDetailRow('NIC Number', staff.nicNumber)}
            {renderDetailRow('Marital Status', staff.maritalStatus)}
            {renderDetailRow(
              'Address',
              [staff.addressLine1, staff.addressLine2, staff.addressLine3]
                .filter(Boolean)
                .join(', ')
            )}
            {renderDetailRow('Contact Number', staff.contactNumber, <Phone className="h-4 w-4" />)}
            {staff.email && renderDetailRow('Email Address', staff.email, <Mail className="h-4 w-4" />)}
          </div>
        )}

        {/* Employment Details */}
        {renderDetailSection(
          'Employment Information',
          <Briefcase className="h-5 w-5" />,
          <div className="space-y-1">
            {renderDetailRow('Appointment Number', staff.appointmentNumber)}
            {renderDetailRow('Designation', staff.designation)}
            {renderDetailRow('First Appointment', staff.dateOfFirstAppointment)}
            {renderDetailRow('Years of Service', `${yearsOfService} years`)}
            {renderDetailRow('Retirement Date', staff.dateOfRetirement)}
            {renderDetailRow('Increment Date', staff.incrementDate)}
          </div>
        )}

        {/* Salary Information */}
        {renderDetailSection(
          'Salary Details',
          <DollarSign className="h-5 w-5" />,
          <div className="space-y-1">
            {renderDetailRow('Salary Code', staff.salaryCode)}
            {renderDetailRow('Basic Salary', formatCurrency(staff.basicSalary))}
            {renderDetailRow('Increment Amount', formatCurrency(staff.incrementAmount))}
            {renderDetailRow(
              'Total Monthly',
              formatCurrency(staff.basicSalary + staff.incrementAmount)
            )}
            {renderDetailRow(
              'Annual Salary',
              formatCurrency((staff.basicSalary + staff.incrementAmount) * 12)
            )}
          </div>
        )}

        {/* Additional Information */}
        {renderDetailSection(
          'System Information',
          <FileText className="h-5 w-5" />,
          <div className="space-y-1">
            {renderDetailRow(
              'Record Created',
              staff.createdAt ? new Date(staff.createdAt).toLocaleDateString('en-GB') : 'Unknown'
            )}
            {renderDetailRow(
              'Last Updated',
              staff.updatedAt ? new Date(staff.updatedAt).toLocaleDateString('en-GB') : 'Unknown'
            )}
            {renderDetailRow('Employee Status', 'Active')}
            {renderDetailRow('Department', 'Forest Department')}
            {renderDetailRow('Office Location', 'Vavuniya, Sri Lanka')}
          </div>
        )}
      </div>

      {/* Career Summary */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Career Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {yearsOfService}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Years of Service
                </div>
              </div>

              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatCurrency((staff.basicSalary + staff.incrementAmount) * 12)}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Annual Salary
                </div>
              </div>

              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {60 - staff.age}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Years Until Retirement
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="glass">
        <CardContent className="p-6">
          <div className="flex justify-center space-x-4">
            <Button
              onClick={onEdit}
              className="btn-modern bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Staff Details
            </Button>

            <Button
              variant="outline"
              onClick={handlePrint}
              loading={printLoading}
              className="btn-modern"
            >
              <Print className="h-4 w-4 mr-2" />
              Print Profile
            </Button>

            <Button
              variant="outline"
              onClick={handleExport}
              loading={printLoading}
              className="btn-modern"
            >
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffDetails;