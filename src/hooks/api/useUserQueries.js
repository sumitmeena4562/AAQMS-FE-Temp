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
  const cleanFilters = useMemo(() => Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => 
      v !== undefined && v !== null && v !== 'all' && v !== '' && !(Array.isArray(v) && v.length === 0)
    )
  ), [filters]);

  return useQuery({
    queryKey: ['users', 'list', { filters: cleanFilters, search, page, limit }],
    queryFn: ({ signal }) => userService.getUsers(cleanFilters, search, page, limit, signal),
    staleTime: 15000, // 15 seconds guard to stop double calls on mount/init
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
    // 1. Fetch ALL users once (Optimized for client-side filtering)
    // We pass empty filters to the API so it returns everything it can,
    // and we use a stable queryKey that doesn't change when filters change.
    const usersQuery = useUsers({}, '', 1, 1000, options); // Fetch a large batch once

    // 2. Perform Client-side Filtering
    const filteredData = useMemo(() => {
        const allUsers = usersQuery.data?.users || [];
        const stats = usersQuery.data?.stats || { total: 0, active: 0, inactive: 0, unassigned: 0 };
        const formOptions = usersQuery.data?.options || { organisations: [], sites: [], coordinators: [], roles: [] };

        let result = [...allUsers];

        // Search Filter
        if (search) {
            const s = search.toLowerCase();
            result = result.filter(u => 
                u.name?.toLowerCase().includes(s) || 
                u.email?.toLowerCase().includes(s) ||
                (u.org_name || u.organisation_name || '').toLowerCase().includes(s)
            );
        }

        // Dropdown Filters (Robust ID & Name matching)
        if (filters.organization?.length > 0) {
            const filterIds = filters.organization.map(String);
            
            // Get the names associated with these IDs to match against org_name/organisation_name
            const selectedOrgNames = (formOptions?.organisations || [])
                .filter(o => filterIds.includes(String(o.value)))
                .map(o => o.label?.toLowerCase());

            result = result.filter(u => {
                // 1. Try matching by ID directly
                const orgId = u.organisation_id || u.org_id || u.organisation?.id || u.organisation;
                if (orgId && filterIds.includes(String(orgId))) return true;

                // 2. Try matching by Name (Fallback for backend responses that only send names in list)
                const orgName = (u.org_name || u.organisation_name || u.organisation || '').toLowerCase();
                return orgName && selectedOrgNames.some(name => orgName.includes(name) || name.includes(orgName));
            });
        }
        
        if (filters.role?.length > 0) {
            const filterRoles = filters.role.map(r => r.toLowerCase());
            result = result.filter(u => {
                const userRole = (u.role?.role_name || u.role_name || (typeof u.role === 'string' ? u.role : '') || '').toLowerCase();
                return filterRoles.some(f => userRole.includes(f));
            });
        }

        if (filters.status?.length > 0) {
            const filterStatuses = filters.status.map(s => s.toLowerCase());
            result = result.filter(u => {
                const s = (u.status || (u.is_active ? 'active' : 'deactive')).toLowerCase();
                return filterStatuses.includes(s);
            });
        }

        // Pagination (Client-side)
        const totalCount = result.length;
        const startIndex = (page - 1) * limit;
        const paginatedUsers = result.slice(startIndex, startIndex + limit);

        return {
            users: paginatedUsers,
            totalCount,
            stats,
            formOptions
        };
    }, [usersQuery.data, filters, search, page, limit]);

    return {
        ...filteredData,
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
