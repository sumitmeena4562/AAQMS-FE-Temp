import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/userService';

/**
 * ── USER & COORDINATOR QUERIES ──
 */

/**
 * ── CONSTANTS & CONFIG ──
 */
const STALE_TIME = 10 * 60 * 1000; // 10 minutes (Data remains fresh for much longer)
const CACHE_TIME = 60 * 60 * 1000; // 60 minutes cache retention

export const useUserDetails = (id, options = {}) => {
  return useQuery({
    queryKey: ['users', 'detail', id],
    queryFn: ({ signal }) => userService.getUserById(id, signal),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!id,
    ...options
  });
};

/**
 * ── INDIVIDUAL QUERIES ──
 */

export const useUsers = (filters = {}, search = '', page = 1, limit = 20, options = {}) => {
  return useQuery({
    queryKey: ['users', 'list', { filters, search, page, limit }],
    queryFn: ({ signal }) => userService.getUsers(filters, search, page, limit, signal),
    staleTime: 30000, // 30 seconds
    gcTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev, // Standard for v5 keepPreviousData behavior
    ...options
  });
};

export const useUserStats = (options = {}) => {
  return useQuery({
    queryKey: ['users', 'stats'],
    queryFn: ({ signal }) => userService.getUserStats(signal),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    ...options
  });
};

export const useCoordinators = (orgId = null, options = {}) => {
  return useQuery({
    queryKey: ['coordinators', orgId],
    queryFn: ({ signal }) => userService.getCoordinators(orgId, signal),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    ...options
  });
};

export const useCoordinatorStats = (orgId = null, options = {}) => {
  return useQuery({
    queryKey: ['coordinators', 'stats', orgId],
    queryFn: ({ signal }) => userService.getCoordinatorStats(orgId, signal),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    ...options
  });
};

/**
 * ── OPTIMIZED ORCHESTRATOR HOOK (ZERO-LATENCY) ──
 * Fetches a large batch of users once and enables high-speed frontend filtering.
 */
export const useUserManagementData = (options = {}) => {
    // Stable query key for the entire batch to maximize cache hits
    const queryKey = ['users', 'admin-batch'];

    const usersQuery = useQuery({
        queryKey,
        queryFn: ({ signal }) => userService.getUsers({}, '', 1, 1000, signal), 
        staleTime: 10 * 60 * 1000, // 10 minutes - perfectly fresh for admin workflows
        gcTime: 60 * 60 * 1000,   // 60 minutes retention
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
        ...options,
    });

    // Memoized data extraction to prevent unnecessary re-renders
    const consolidatedData = useMemo(() => {
        return {
            users: usersQuery.data?.users || [],
            totalCount: usersQuery.data?.totalCount || 0,
            stats: usersQuery.data?.stats || { total: 0, active: 0, inactive: 0, unassigned: 0 },
            formOptions: usersQuery.data?.options || { organisations: [], sites: [], coordinators: [], roles: [] }
        };
    }, [usersQuery.data]);

    return {
        ...consolidatedData,
        isLoading: usersQuery.isLoading,
        isFetching: usersQuery.isFetching,
        isError: usersQuery.isError,
        refetchAll: () => usersQuery.refetch()
    };
};

export const useUserFilterOptions = () => {
    return {
        roles: [
            { value: 'admin', label: 'Admin' },
            { value: 'coordinator', label: 'Coordinator' },
            { value: 'field_officer', label: 'Field Officer' }
        ]
    };
};

export const useUserFormOptions = (options = {}) => {
  return useQuery({
    queryKey: ['users', 'form-options'],
    queryFn: ({ signal }) => userService.getFormOptions(signal),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options
  });
};
