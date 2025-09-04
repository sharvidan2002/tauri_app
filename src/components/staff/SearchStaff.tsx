import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Search,
  X,
  Download,
  Eye,
  Edit,
  Trash2,
  Printer, // Fixed: Changed from Print to Printer
  Users,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { Staff, StaffSearch } from '@/types/staff';
import {
  DESIGNATIONS,
  SALARY_CODES,
  MARITAL_STATUSES,
  GENDERS,
  SEARCH_FILTERS
} from '@/lib/constants';
import { useStaffSearch, useDeleteStaff } from '@/hooks/useStaff';
import { usePrint } from '@/hooks/usePrint';
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

const SearchStaff: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState<StaffSearch>({
    query: '',
    designation: undefined,
    gender: undefined,
    maritalStatus: undefined,
    salaryCode: undefined,
    ageMin: undefined,
    ageMax: undefined,
    nicNumber: undefined,
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'details' | 'edit' | null>('list');
  const [deleteConfirm, setDeleteConfirm] = useState<Staff | null>(null);
  const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);

  // Debounced search
  const [debouncedFilters, setDebouncedFilters] = useState(searchFilters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(searchFilters);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchFilters]);

  const {
    data: staffList = [],
    isLoading,
    error,
    refetch
  } = useStaffSearch(
    debouncedFilters,
    // Only search if we have some criteria
    !!(debouncedFilters.query ||
       debouncedFilters.designation ||
       debouncedFilters.gender ||
       debouncedFilters.maritalStatus ||
       debouncedFilters.salaryCode ||
       debouncedFilters.ageMin ||
       debouncedFilters.ageMax ||
       debouncedFilters.nicNumber)
  );

  const deleteStaff = useDeleteStaff();
  const {
    generateBulkPrintContent,
    printHTML,
    exportToPDF,
    isLoading: printLoading
  } = usePrint();

  const handleFilterChange = useCallback((field: keyof StaffSearch, value: any) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value || undefined,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchFilters({
      query: '',
      designation: undefined,
      gender: undefined,
      maritalStatus: undefined,
      salaryCode: undefined,
      ageMin: undefined,
      ageMax: undefined,
      nicNumber: undefined,
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.values(searchFilters).some(value =>
      value !== undefined && value !== null && value !== ''
    );
  }, [searchFilters]);

  const handleStaffSelect = useCallback((staff: Staff, mode: 'details' | 'edit') => {
    setSelectedStaff(staff);
    setViewMode(mode);
  }, []);

  const handleStaffUpdate = useCallback(() => {
    setViewMode('list');
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
      selected ? staffList.map(staff => staff.id!).filter(Boolean) : []
    );
  }, [staffList]);

  const handleBulkPrint = useCallback(async () => {
    const selectedStaffList = staffList.filter(staff =>
      selectedStaffIds.includes(staff.id!)
    );

    if (selectedStaffList.length === 0) return;

    const printContent = generateBulkPrintContent(selectedStaffList, {
      title: 'Search Results - Staff List',
      filters: searchFilters,
    });

    await printHTML(printContent);
  }, [staffList, selectedStaffIds, generateBulkPrintContent, printHTML, searchFilters]);

  const handleBulkExport = useCallback(async () => {
    const selectedStaffList = staffList.filter(staff =>
      selectedStaffIds.includes(staff.id!)
    );

    if (selectedStaffList.length === 0) return;

    const printContent = generateBulkPrintContent(selectedStaffList, {
      title: 'Search Results - Staff List',
      filters: searchFilters,
    });

    const filename = `staff-search-results-${new Date().toISOString().split('T')[0]}.pdf`;
    await exportToPDF(printContent, filename);
  }, [staffList, selectedStaffIds, generateBulkPrintContent, exportToPDF, searchFilters]);

  const renderFilters = () => (
    <Card className="glass mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Staff
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Advanced
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="search-container">
          <Input
            className="search-input"
            placeholder="Search by name, appointment number, or NIC..."
            value={searchFilters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
          />
          <Search className="search-icon" />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          {SEARCH_FILTERS.QUICK_FILTERS.map(filter => (
            <Button
              key={filter.label}
              variant={
                (filter.value === null && !hasActiveFilters) ||
                (Array.isArray(filter.value) &&
                 filter.value.includes(searchFilters.designation as string))
                ? 'default' : 'outline'
              }
              size="sm"
              onClick={() => {
                if (filter.value === null) {
                  clearFilters();
                } else if (Array.isArray(filter.value)) {
                  // Set designation filter for grouped options
                  setSearchFilters(prev => ({
                    ...prev,
                    designation: filter.value[0] as any,
                  }));
                }
              }}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="filter-panel">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Select
                  value={searchFilters.designation || ''}
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
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={searchFilters.gender || ''}
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
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Select
                  value={searchFilters.maritalStatus || ''}
                  onValueChange={(value) => handleFilterChange('maritalStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    {MARITAL_STATUSES.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryCode">Salary Code</Label>
                <Select
                  value={searchFilters.salaryCode || ''}
                  onValueChange={(value) => handleFilterChange('salaryCode', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All codes" />
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

              <div className="space-y-2">
                <Label htmlFor="ageMin">Min Age</Label>
                <Input
                  id="ageMin"
                  type="number"
                  min="0"
                  max="100"
                  value={searchFilters.ageMin || ''}
                  onChange={(e) => handleFilterChange('ageMin', parseInt(e.target.value) || undefined)}
                  placeholder="Min age"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ageMax">Max Age</Label>
                <Input
                  id="ageMax"
                  type="number"
                  min="0"
                  max="100"
                  value={searchFilters.ageMax || ''}
                  onChange={(e) => handleFilterChange('ageMax', parseInt(e.target.value) || undefined)}
                  placeholder="Max age"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nicNumber">NIC Number</Label>
                <Input
                  id="nicNumber"
                  value={searchFilters.nicNumber || ''}
                  onChange={(e) => handleFilterChange('nicNumber', e.target.value)}
                  placeholder="Enter NIC number"
                />
              </div>

              <div className="space-y-2">
                <Label>Age Range</Label>
                <Select
                  onValueChange={(value) => {
                    const range = SEARCH_FILTERS.AGE_RANGES.find(r => r.label === value);
                    if (range?.value) {
                      handleFilterChange('ageMin', range.value.min);
                      handleFilterChange('ageMax', range.value.max);
                    } else {
                      handleFilterChange('ageMin', undefined);
                      handleFilterChange('ageMax', undefined);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEARCH_FILTERS.AGE_RANGES.map(range => (
                      <SelectItem key={range.label} value={range.label}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderResults = () => {
    if (!hasActiveFilters) {
      return (
        <Card className="glass text-center py-12">
          <div className="space-y-4">
            <Search className="h-16 w-16 text-gray-400 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Start Your Search
              </h3>
              <p className="text-gray-500 mb-4">
                Enter search criteria above to find staff members
              </p>
              <div className="text-sm text-gray-400 space-y-1">
                <p>• Search by name, appointment number, or NIC</p>
                <p>• Use filters to narrow down results</p>
                <p>• Select multiple staff for bulk actions</p>
              </div>
            </div>
          </div>
        </Card>
      );
    }

    if (isLoading) {
      return (
        <Card className="glass">
          <CardContent className="py-12">
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
              <span className="text-gray-600">Searching...</span>
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
                <X className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Search Error</h3>
                <p className="text-sm mt-2">{error.message}</p>
              </div>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (staffList.length === 0) {
      return (
        <Card className="glass text-center py-12">
          <div className="space-y-4">
            <Users className="h-16 w-16 text-gray-400 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-500 mb-4">
                No staff members match your search criteria
              </p>
              <Button onClick={clearFilters} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card className="data-table glass">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Search Results ({staffList.length})
            </div>
            <div className="flex items-center gap-2">
              {selectedStaffIds.length > 0 && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkPrint}
                    loading={printLoading}
                  >
                    <Printer className="h-4 w-4 mr-2" />
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
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedStaffIds.length === staffList.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded"
                  />
                </TableHead>
                <TableHead>App. No.</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList.map((staff) => (
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
                  <TableCell>{staff.fullName}</TableCell>
                  <TableCell>{staff.designation}</TableCell>
                  <TableCell>{staff.gender}</TableCell>
                  <TableCell>{staff.age}</TableCell>
                  <TableCell>{staff.contactNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStaffSelect(staff, 'details')}
                        className="action-btn action-btn-print"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStaffSelect(staff, 'edit')}
                        className="action-btn action-btn-edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(staff)}
                        className="action-btn action-btn-delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  if (viewMode === 'details' && selectedStaff) {
    return (
      <StaffDetails
        staff={selectedStaff}
        onBack={() => setViewMode('list')}
        onEdit={() => setViewMode('edit')}
      />
    );
  }

  if (viewMode === 'edit' && selectedStaff) {
    return (
      <EditStaff
        staff={selectedStaff}
        onBack={() => setViewMode('list')}
        onSave={handleStaffUpdate}
      />
    );
  }

  return (
    <div className="space-y-6">
      {renderFilters()}
      {renderResults()}

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

export default SearchStaff;