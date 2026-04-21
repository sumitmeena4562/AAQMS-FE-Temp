import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/userService';

/**
 * ── USER & COORDINATOR QUERIES ──
 */

/**
 * ── CONSTANTS & CONFIG ──
 */
const STALE_TIME = 60 * 1000; // 1 minute
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes (gcTime)

/**
 * ── INDIVIDUAL QUERIES ──
 */

export const useUsers = (filters = {}, search = '', page = 1, limit = 20, options = {}) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => 
      v !== undefined && v !== null && v !== 'all' && v !== '' && !(Array.isArray(v) && v.length === 0)
    )
  );

  return useQuery({
    queryKey: ['users', 'list', { filters: cleanFilters, search, page, limit }],
    queryFn: ({ signal }) => userService.getUsers(cleanFilters, search, page, limit, signal),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
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
 * ── OPTIMIZED ORCHESTRATOR HOOK ──
 * Combines Users, Stats, and Filter Hierarchy into a single optimized lifecycle.
 */
export const useUserManagementData = (filters, search, page, limit, options = {}) => {
    // 1. Core Users Query
    const usersQuery = useUsers(filters, search, page, limit, options);

    // 2. Global Stats Query
    const statsQuery = useUserStats(options);

    // 3. Conditional Hierarchy Querying
    // Only fetch sites if organizations are selected (Cascading logic)
    const orgIds = filters?.organization || [];
    const hasOrgSelected = Array.isArray(orgIds) && orgIds.length > 0;

    return {
        users: usersQuery.data?.users || [],
        totalCount: usersQuery.data?.totalCount || 0,
        stats: statsQuery.data || { total: 0, active: 0, inactive: 0, unassigned: 0 },
        isLoading: usersQuery.isLoading || statsQuery.isLoading,
        isFetching: usersQuery.isFetching || statsQuery.isFetching,
        isError: usersQuery.isError || statsQuery.isError,
        refetchAll: () => {
            usersQuery.refetch();
            statsQuery.refetch();
        }
    };
};

export const useUserFilterOptions = () => {
    // Roles are static, don't need a query, but keeping for compatibility
    return {
        roles: [
            { value: 'admin', label: 'Admin' },
            { value: 'coordinator', label: 'Coordinator' },
            { value: 'field_officer', label: 'Field Officer' }
        ]
    };
};

