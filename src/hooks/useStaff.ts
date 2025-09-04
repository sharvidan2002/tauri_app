import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TauriAPI } from '@/lib/tauri';
import { Staff, StaffSearch } from '@/types/staff';

// Query keys
const QUERY_KEYS = {
  staff: ['staff'] as const,
  staffList: ['staff', 'list'] as const,
  staffById: (id: number) => ['staff', 'detail', id] as const,
  staffSearch: (search: StaffSearch) => ['staff', 'search', search] as const,
  staffCount: ['staff', 'count'] as const,
} as const;

// Custom hook for fetching all staff
export function useStaffList() {
  return useQuery({
    queryKey: QUERY_KEYS.staffList,
    queryFn: async () => {
      const response = await TauriAPI.getAllStaff();
      if (response.error) throw new Error(response.error);
      return response.data!;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Custom hook for fetching staff by ID
export function useStaffById(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.staffById(id),
    queryFn: async () => {
      const response = await TauriAPI.getStaffById(id);
      if (response.error) throw new Error(response.error);
      return response.data!;
    },
    enabled: !!id,
  });
}

// Custom hook for searching staff
export function useStaffSearch(search: StaffSearch, enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.staffSearch(search),
    queryFn: async () => {
      const response = await TauriAPI.searchStaff(search);
      if (response.error) throw new Error(response.error);
      return response.data!;
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Custom hook for staff statistics
export function useStaffCount() {
  return useQuery({
    queryKey: QUERY_KEYS.staffCount,
    queryFn: async () => {
      const response = await TauriAPI.getStaffCount();
      if (response.error) throw new Error(response.error);
      return response.data!;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Custom hook for adding staff
export function useAddStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (staff: Staff) => {
      const response = await TauriAPI.addStaff(staff);
      if (response.error) throw new Error(response.error);
      return response.data!;
    },
    onSuccess: () => {
      // Invalidate and refetch staff list and count
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffList });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffCount });
    },
  });
}

// Custom hook for updating staff
export function useUpdateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (staff: Staff) => {
      const response = await TauriAPI.updateStaff(staff);
      if (response.error) throw new Error(response.error);
      return response.data!;
    },
    onSuccess: (_data, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffList });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffCount });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffById(variables.id) });
      }
    },
  });
}

// Custom hook for deleting staff
export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await TauriAPI.deleteStaff(id);
      if (response.error) throw new Error(response.error);
      return response.data!;
    },
    onSuccess: (_data, variables) => {
      // Remove the deleted staff from cache and invalidate queries
      queryClient.removeQueries({ queryKey: QUERY_KEYS.staffById(variables) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffList });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffCount });
    },
  });
}

// Custom hook for exporting staff to PDF
export function useExportStaffToPdf() {
  return useMutation({
    mutationFn: async ({
      staffIds,
      templateType,
    }: {
      staffIds: number[];
      templateType: 'individual' | 'bulk';
    }) => {
      const response = await TauriAPI.exportStaffToPdf(staffIds, templateType);
      if (response.error) throw new Error(response.error);
      return response.data!;
    },
  });
}

// Custom hook for bulk operations
export function useBulkStaffOperations() {
  const queryClient = useQueryClient();

  const bulkDelete = useMutation({
    mutationFn: async (ids: number[]) => {
      const results = await Promise.allSettled(
        ids.map(id => TauriAPI.deleteStaff(id))
      );

      const failures = results
        .map((result, index) => ({ result, id: ids[index] }))
        .filter(({ result }) => result.status === 'rejected')
        .map(({ id }) => id);

      if (failures.length > 0) {
        throw new Error(`Failed to delete ${failures.length} staff members`);
      }

      return `Successfully deleted ${ids.length} staff members`;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffList });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffCount });
    },
  });

  return {
    bulkDelete,
  };
}

// Custom hook for staff form management
export function useStaffForm() {
  const addStaff = useAddStaff();
  const updateStaff = useUpdateStaff();

  const saveStaff = useMutation({
    mutationFn: async (staff: Staff) => {
      if (staff.id) {
        return updateStaff.mutateAsync(staff);
      } else {
        return addStaff.mutateAsync(staff);
      }
    },
  });

  return {
    saveStaff,
    isLoading: saveStaff.isPending,
    error: saveStaff.error,
    isSuccess: saveStaff.isSuccess,
  };
}

// Custom hook for real-time staff updates
export function useStaffUpdates() {
  const queryClient = useQueryClient();

  const refreshStaffData = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staff });
  };

  const refreshStaffList = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffList });
  };

  const refreshStaffById = (id: number) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffById(id) });
  };

  const refreshStaffCount = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffCount });
  };

  return {
    refreshStaffData,
    refreshStaffList,
    refreshStaffById,
    refreshStaffCount,
  };
}

// Custom hook for optimistic updates
export function useOptimisticStaffUpdates() {
  const queryClient = useQueryClient();

  const optimisticUpdateStaff = (staffId: number, updatedData: Partial<Staff>) => {
    queryClient.setQueryData(
      QUERY_KEYS.staffById(staffId),
      (oldData: Staff | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...updatedData };
      }
    );

    queryClient.setQueryData(
      QUERY_KEYS.staffList,
      (oldData: Staff[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(staff =>
          staff.id === staffId ? { ...staff, ...updatedData } : staff
        );
      }
    );
  };

  const optimisticAddStaff = (newStaff: Staff) => {
    const tempId = Date.now(); // Temporary ID for optimistic update
    const optimisticStaff = { ...newStaff, id: tempId };

    queryClient.setQueryData(
      QUERY_KEYS.staffList,
      (oldData: Staff[] | undefined) => {
        if (!oldData) return [optimisticStaff];
        return [...oldData, optimisticStaff];
      }
    );

    return tempId;
  };

  const optimisticDeleteStaff = (staffId: number) => {
    queryClient.setQueryData(
      QUERY_KEYS.staffList,
      (oldData: Staff[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.filter(staff => staff.id !== staffId);
      }
    );
  };

  return {
    optimisticUpdateStaff,
    optimisticAddStaff,
    optimisticDeleteStaff,
  };
}