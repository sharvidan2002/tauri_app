import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  Users,
  Settings,
  Eye,
  Printer,
  FileDown
} from 'lucide-react';
import { Staff, PrintOptions } from '@/types/staff';
import { usePrint } from '@/hooks/usePrint';
import PrintTemplate from './PrintTemplate';
import BulkPrintTemplate from './BulkPrintTemplate';

interface PrintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: Staff[];
  selectedStaffIds?: number[];
  defaultType?: 'individual' | 'bulk';
}

const PrintDialog: React.FC<PrintDialogProps> = ({
  isOpen,
  onClose,
  staffList,
  selectedStaffIds = [],
  defaultType = 'individual',
}) => {
  const [printOptions, setPrintOptions] = useState<PrintOptions>({
    staffIds: selectedStaffIds,
    templateType: defaultType,
    includePhoto: true,
    includePersonalDetails: true,
    includeEmploymentDetails: true,
    includeSalaryDetails: true,
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([
    'appointmentNumber',
    'fullName',
    'designation',
    'gender',
    'age',
    'contactNumber',
    'basicSalary'
  ]);

  const {
    generateIndividualPrintContent,
    generateBulkPrintContent,
    printHTML,
    exportToPDF,
    isLoading: printLoading
  } = usePrint();

  const selectedStaff = staffList.filter(staff =>
    printOptions.staffIds.includes(staff.id!)
  );

  const handleOptionChange = useCallback((key: keyof PrintOptions, value: any) => {
    setPrintOptions(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleColumnToggle = useCallback((column: string, checked: boolean) => {
    setSelectedColumns(prev =>
      checked
        ? [...prev, column]
        : prev.filter(c => c !== column)
    );
  }, []);

  const handlePrint = useCallback(async () => {
    if (selectedStaff.length === 0) return;

    if (printOptions.templateType === 'individual') {
      // Print individual templates for each selected staff
      for (const staff of selectedStaff) {
        const printContent = generateIndividualPrintContent(staff, printOptions);
        await printHTML(printContent);
      }
    } else {
      // Print bulk template
      const printContent = generateBulkPrintContent(selectedStaff, {
        title: 'Selected Staff List',
        ...printOptions,
      });
      await printHTML(printContent);
    }

    onClose();
  }, [selectedStaff, printOptions, generateIndividualPrintContent, generateBulkPrintContent, printHTML, onClose]);

  const handleExport = useCallback(async () => {
    if (selectedStaff.length === 0) return;

    if (printOptions.templateType === 'individual') {
      // Export individual PDFs
      for (const staff of selectedStaff) {
        const printContent = generateIndividualPrintContent(staff, printOptions);
        const filename = `staff-${staff.appointmentNumber}-${staff.fullName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
        await exportToPDF(printContent, filename);
      }
    } else {
      // Export bulk PDF
      const printContent = generateBulkPrintContent(selectedStaff, {
        title: 'Selected Staff List',
        ...printOptions,
      });
      const filename = `staff-list-${new Date().toISOString().split('T')[0]}.pdf`;
      await exportToPDF(printContent, filename);
    }

    onClose();
  }, [selectedStaff, printOptions, generateIndividualPrintContent, generateBulkPrintContent, exportToPDF, onClose]);

  const renderPreview = () => {
    if (selectedStaff.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-16 w-16 mx-auto mb-4" />
          <p>No staff selected for preview</p>
        </div>
      );
    }

    if (printOptions.templateType === 'individual') {
      return (
        <div className="print-preview">
          <PrintTemplate
            staff={selectedStaff[0]}
            includePhoto={printOptions.includePhoto}
            includePersonalDetails={printOptions.includePersonalDetails}
            includeEmploymentDetails={printOptions.includeEmploymentDetails}
            includeSalaryDetails={printOptions.includeSalaryDetails}
          />
          {selectedStaff.length > 1 && (
            <div className="text-center mt-4 text-sm text-gray-600">
              Preview showing first staff member. {selectedStaff.length - 1} more will be printed.
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="print-preview">
          <BulkPrintTemplate
            staffList={selectedStaff}
            title="Staff List"
            selectedColumns={selectedColumns}
            includeImages={printOptions.includePhoto}
          />
        </div>
      );
    }
  };

  const availableColumns = [
    { key: 'appointmentNumber', label: 'Appointment Number' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'designation', label: 'Designation' },
    { key: 'gender', label: 'Gender' },
    { key: 'age', label: 'Age' },
    { key: 'nicNumber', label: 'NIC Number' },
    { key: 'maritalStatus', label: 'Marital Status' },
    { key: 'contactNumber', label: 'Contact Number' },
    { key: 'email', label: 'Email' },
    { key: 'dateOfFirstAppointment', label: 'Appointment Date' },
    { key: 'dateOfRetirement', label: 'Retirement Date' },
    { key: 'salaryCode', label: 'Salary Code' },
    { key: 'basicSalary', label: 'Basic Salary' },
    { key: 'incrementAmount', label: 'Increment Amount' },
    { key: 'totalSalary', label: 'Total Monthly Salary' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Printer
            Print & Export Options
          </DialogTitle>
          <DialogDescription>
            Configure print settings for {selectedStaff.length} selected staff member{selectedStaff.length !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={previewMode ? 'preview' : 'settings'} onValueChange={(value) => setPreviewMode(value === 'preview')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Print Template Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Template Type</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="individual"
                        checked={printOptions.templateType === 'individual'}
                        onChange={() => handleOptionChange('templateType', 'individual')}
                        className="rounded"
                      />
                      <Label htmlFor="individual" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Individual Templates
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">
                      Print separate detailed pages for each staff member
                    </p>

                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="bulk"
                        checked={printOptions.templateType === 'bulk'}
                        onChange={() => handleOptionChange('templateType', 'bulk')}
                        className="rounded"
                      />
                      <Label htmlFor="bulk" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Bulk Table
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">
                      Print all staff in a single table format
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Content Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Include Sections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includePhoto"
                      checked={printOptions.includePhoto}
                      onCheckedChange={(checked) => handleOptionChange('includePhoto', checked)}
                    />
                    <Label htmlFor="includePhoto">Staff Photos</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includePersonalDetails"
                      checked={printOptions.includePersonalDetails}
                      onCheckedChange={(checked) => handleOptionChange('includePersonalDetails', checked)}
                    />
                    <Label htmlFor="includePersonalDetails">Personal Details</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeEmploymentDetails"
                      checked={printOptions.includeEmploymentDetails}
                      onCheckedChange={(checked) => handleOptionChange('includeEmploymentDetails', checked)}
                    />
                    <Label htmlFor="includeEmploymentDetails">Employment Details</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeSalaryDetails"
                      checked={printOptions.includeSalaryDetails}
                      onCheckedChange={(checked) => handleOptionChange('includeSalaryDetails', checked)}
                    />
                    <Label htmlFor="includeSalaryDetails">Salary Information</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Bulk Table Columns (only show for bulk template) */}
              {printOptions.templateType === 'bulk' && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Table Columns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableColumns.map(column => (
                        <div key={column.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={column.key}
                            checked={selectedColumns.includes(column.key)}
                            onCheckedChange={(checked) => handleColumnToggle(column.key, !!checked)}
                          />
                          <Label htmlFor={column.key} className="text-sm">
                            {column.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="overflow-auto max-h-[60vh]">
            {renderPreview()}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedStaff.length} staff member{selectedStaff.length !== 1 ? 's' : ''} selected
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Settings' : 'Preview'}
            </Button>

            <Button
              variant="outline"
              onClick={handleExport}
              loading={printLoading}
              disabled={selectedStaff.length === 0}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export PDF
            </Button>

            <Button
              onClick={handlePrint}
              loading={printLoading}
              disabled={selectedStaff.length === 0}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrintDialog;