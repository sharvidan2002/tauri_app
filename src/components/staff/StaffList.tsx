import React, { useState, useCallback, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  Search,
  SortAsc,
  SortDesc,
  Download,
  Print,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Filter,
  UserPlus,
  Grid3X3,
  List
} from 'lucide-react';
import { Staff } from '@/types/staff';
import {
  DESIGNATIONS,
  SALARY_CODES,
  GENDERS,
  TABLE_COLUMNS
} from '@/lib/constants';
import { useStaffList, useDeleteStaff } from '@/hooks/useStaff';
import { usePrint } from '@/hooks/usePrint';
import { sortArray, filterArray, formatCurrency } from '@/lib/utils';
import StaffDetails from './StaffDetails';
import EditStaff from './EditStaff';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type SortField = keyof Staff;
type SortDirection = 'asc' | 'desc';
type ViewMode = 'table' | 'grid';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

interface FilterConfig {
  search: string;
  designation: string;
  gender: string;
  salaryCode: string;
}

const StaffList: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'fullName',
    direction: 'asc',
  });
  const [filters, setFilters] = useState<FilterConfig>({
    search: '',
    designation: '',
    gender: '',
    salaryCode: '',
  });
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'details' | 'edit'>('list');
  const [deleteConfirm, setDeleteConfirm] = useState<Staff | null>(null);
  const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: allStaff = [],
    isLoading,
    error,
    refetch
  } = useStaffList();

  const deleteStaff = useDeleteStaff();
  const {
    generateBulkPrintContent,
    generateIndividualPrintContent,
    printHTML,
    exportToPDF,
    isLoading: printLoading
  } = usePrint();

  // Filtered and sorted staff list
  const processedStaff = useMemo(() => {
    let result = [...allStaff];

    // Apply filters
    if (filters.search) {
      result = filterArray(result, filters.search, ['fullName', 'appointmentNumber', 'nicNumber']);
    }

    if (filters.designation) {
      result = result.filter(staff => staff.designation === filters.designation);
    }

    if (filters.gender) {
      result = result.filter(staff => staff.gender === filters.gender);
    }

    if (filters.salaryCode) {
      result = result.filter(staff => staff.salaryCode === filters.salaryCode);
    }

    // Apply sorting
    result = sortArray(result, sortConfig.field, sortConfig.direction);

    return result;
  }, [allStaff, filters, sortConfig]);

  const handleSort = useCallback((field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const handleFilterChange = useCallback((field: keyof FilterConfig, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      designation: '',
      gender: '',
      salaryCode: '',
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== '');
  }, [filters]);

  const handleStaffSelect = useCallback((staff: Staff, view: 'details' | 'edit') => {
    setSelectedStaff(staff);
    setCurrentView(view);
  }, []);

  const handleStaffUpdate = useCallback(() => {
    setCurrentView('list');
    setSelectedStaff(null);
    refetch();
  }, [refetch]);

  const handleDeleteClick = useCallback((staff: Staff) => {
    setDeleteConfirm(staff);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirm) return;

    try {
      await deleteStaff.mutateAsync(deleteConfirm.id!);
      setDeleteConfirm(null);
      refetch();
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  }, [deleteConfirm, deleteStaff, refetch]);

  const handleBulkSelect = useCallback((staffId: number, selected: boolean) => {
    setSelectedStaffIds(prev =>
      selected
        ? [...prev, staffId]
        : prev.filter(id => id !== staffId)
    );
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    setSelectedStaffIds(
      selected ? processedStaff.map(staff => staff.id!).filter(Boolean) : []
    );
  }, [processedStaff]);

  const handleBulkPrint = useCallback(async () => {
    const selectedStaffList = processedStaff.filter(staff =>
      selectedStaffIds.includes(staff.id!)
    );

    if (selectedStaffList.length === 0) return;

    const printContent = generateBulkPrintContent(selectedStaffList, {
      title: 'Staff Directory',
    });

    await printHTML(printContent);
  }, [processedStaff, selectedStaffIds, generateBulkPrintContent, printHTML]);

  const handleBulkExport = useCallback(async () => {
    const selectedStaffList = processedStaff.filter(staff =>
      selectedStaffIds.includes(staff.id!)
    );

    if (selectedStaffList.length === 0) return;

    const printContent = generateBulkPrintContent(selectedStaffList, {
      title: 'Staff Directory Export',
    });

    const filename = `staff-directory-${new Date().toISOString().split('T')[0]}.pdf`;
    await exportToPDF(printContent, filename);
  }, [processedStaff, selectedStaffIds, generateBulkPrintContent, exportToPDF]);

  const handlePrintIndividual = useCallback(async (staff: Staff) => {
    const printContent = generateIndividualPrintContent(staff);
    await printHTML(printContent);
  }, [generateIndividualPrintContent, printHTML]);

  const renderSortButton = (field: SortField, label: string) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-semibold text-gray-700 hover:text-blue-600"
    >
      {label}
      {sortConfig.field === field && (
        sortConfig.direction === 'asc' ?
        <SortAsc className="h-3 w-3 ml-1" /> :
        <SortDesc className="h-3 w-3 ml-1" />
      )}
    </Button>
  );

  const renderTableView = () => (
    <div className="data-table glass">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                type="checkbox"
                checked={selectedStaffIds.length === processedStaff.length && processedStaff.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded"
              />
            </TableHead>
            <TableHead>
              {renderSortButton('appointmentNumber', 'App. No.')}
            </TableHead>
            <TableHead>
              {renderSortButton('fullName', 'Full Name')}
            </TableHead>
            <TableHead>
              {renderSortButton('designation', 'Designation')}
            </TableHead>
            <TableHead>
              {renderSortButton('gender', 'Gender')}
            </TableHead>
            <TableHead>
              {renderSortButton('age', 'Age')}
            </TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>
              {renderSortButton('basicSalary', 'Salary')}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processedStaff.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedStaffIds.includes(staff.id!)}
                  onChange={(e) => handleBulkSelect(staff.id!, e.target.checked)}
                  className="rounded"
                />
              </TableCell>
              <TableCell className="font-medium">
                {staff.appointmentNumber}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{staff.fullName}</div>
                  <div className="text-xs text-gray-500">{staff.nicNumber}</div>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {staff.designation}
                </span>
              </TableCell>
              <TableCell>{staff.gender}</TableCell>
              <TableCell>{staff.age} years</TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{staff.contactNumber}</div>
                  {staff.email && (
                    <div className="text-xs text-gray-500">{staff.email}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium">{formatCurrency(staff.basicSalary)}</div>
                  <div className="text-xs text-gray-500">Code: {staff.salaryCode}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleStaffSelect(staff, 'details')}
                    className="action-btn action-btn-print"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleStaffSelect(staff, 'edit')}
                    className="action-btn action-btn-edit"
                    title="Edit Staff"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handlePrintIndividual(staff)}
                    className="action-btn action-btn-print"
                    title="Print Individual"
                  >
                    <Print className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteClick(staff)}
                    className="action-btn action-btn-delete"
                    title="Delete Staff"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {processedStaff.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {hasActiveFilters ? 'No Results Found' : 'No Staff Members'}
          </h3>
          <p className="text-gray-500 mb-4">
            {hasActiveFilters
              ? 'Try adjusting your search criteria'
              : 'Add staff members to get started'
            }
          </p>
          {hasActiveFilters ? (
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          ) : (
            <Button variant="default">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          )}
        </div>
      )}
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {processedStaff.map((staff) => (
        <Card key={staff.id} className="glass card-hover">
          <CardContent className="p-6">
            <div className="text-center">
              {/* Profile Image */}
              <div className="w-20 h-24 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                {staff.imagePath ? (
                  <img
                    src={staff.imagePath}
                    alt={staff.fullName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Users className="h-8 w-8 text-gray-400" />
                )}
              </div>

              {/* Staff Info */}
              <h3 className="font-semibold text-gray-900 mb-1">{staff.fullName}</h3>
              <p className="text-sm text-gray-600 mb-2">{staff.designation}</p>
              <p className="text-xs text-gray-500 mb-4">{staff.appointmentNumber}</p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="bg-blue-50 rounded px-2 py-1">
                  <div className="text-gray-600">Age</div>
                  <div className="font-semibold">{staff.age}</div>
                </div>
                <div className="bg-green-50 rounded px-2 py-1">
                  <div className="text-gray-600">Salary</div>
                  <div className="font-semibold">{staff.salaryCode}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStaffSelect(staff, 'details')}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStaffSelect(staff, 'edit')}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePrintIndividual(staff)}
                >
                  <Print className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {processedStaff.length === 0 && (
        <div className="col-span-full text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {hasActiveFilters ? 'No Results Found' : 'No Staff Members'}
          </h3>
          <p className="text-gray-500">
            {hasActiveFilters
              ? 'Try adjusting your search criteria'
              : 'Add staff members to get started'
            }
          </p>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <Card className="glass">
        <CardContent className="py-12">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
            <span className="text-gray-600">Loading staff list...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass border-red-200">
        <CardContent className="py-12 text-center">
          <div className="space-y-4">
            <div className="text-red-500">
              <Users className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Failed to Load Staff</h3>
              <p className="text-sm mt-2">{error.message}</p>
            </div>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentView === 'details' && selectedStaff) {
    return (
      <StaffDetails
        staff={selectedStaff}
        onBack={() => setCurrentView('list')}
        onEdit={() => setCurrentView('edit')}
      />
    );
  }

  if (currentView === 'edit' && selectedStaff) {
    return (
      <EditStaff
        staff={selectedStaff}
        onBack={() => setCurrentView('list')}
        onSave={handleStaffUpdate}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Staff Directory ({processedStaff.length})
            </div>
            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('table')}
                  className="h-8"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="h-8"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>

              {/* Bulk Actions */}
              {selectedStaffIds.length > 0 && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkPrint}
                    loading={printLoading}
                  >
                    <Print className="h-4 w-4 mr-2" />
                    Print ({selectedStaffIds.length})
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkExport}
                    loading={printLoading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export ({selectedStaffIds.length})
                  </Button>
                </>
              )}

              {/* Filter Toggle */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              {/* Refresh */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        {/* Filters */}
        {showFilters && (
          <CardContent className="pt-0">
            <div className="filter-panel">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Search staff..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="search-input"
                  />
                </div>

                <div className="space-y-2">
                  <Select
                    value={filters.designation}
                    onValueChange={(value) => handleFilterChange('designation', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All designations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Designations</SelectItem>
                      {DESIGNATIONS.map(designation => (
                        <SelectItem key={designation.value} value={designation.value}>
                          {designation.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Select
                    value={filters.gender}
                    onValueChange={(value) => handleFilterChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All genders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Genders</SelectItem>
                      {GENDERS.map(gender => (
                        <SelectItem key={gender.value} value={gender.value}>
                          {gender.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Select
                    value={filters.salaryCode}
                    onValueChange={(value) => handleFilterChange('salaryCode', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All salary codes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Codes</SelectItem>
                      {SALARY_CODES.map(code => (
                        <SelectItem key={code.value} value={code.value}>
                          {code.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex justify-end mt-4">
                  <Button onClick={clearFilters} variant="outline" size="sm">
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Staff List/Grid */}
      {viewMode === 'table' ? renderTableView() : renderGridView()}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteConfirm?.fullName}</strong>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              loading={deleteStaff.isPending}
            >
              Delete Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffList;