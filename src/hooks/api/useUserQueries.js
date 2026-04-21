import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/userService';

/**
 * ── USER & COORDINATOR QUERIES ──
 */

export const useCoordinators = (orgId = null, options = {}) => {
  return useQuery({
    queryKey: ['coordinators', orgId],
    queryFn: ({ signal }) => userService.getCoordinators(orgId, signal),
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useUsers = (filters = {}, search = '', page = 1, limit = 20) => {
  // Normalize filters for stable keys
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => 
      v !== undefined && 
      v !== null && 
      v !== 'all' && 
      v !== '' && 
      !(Array.isArray(v) && v.length === 0)
    )
  );

  return useQuery({
    queryKey: ['users', { filters: cleanFilters, search, page, limit }],
    queryFn: ({ signal }) => userService.getUsers(cleanFilters, search, page, limit, signal),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: ['users', 'stats'],
    queryFn: ({ signal }) => userService.getUserStats(signal),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCoordinatorStats = (orgId = null) => {
  return useQuery({
    queryKey: ['coordinators', 'stats', orgId],
    queryFn: ({ signal }) => userService.getCoordinatorStats(orgId, signal),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserFilterOptions = () => {
    return useQuery({
        queryKey: ['users', 'filter-options'],
        queryFn: ({ signal }) => userService.getFilterOptions(signal),
        staleTime: 10 * 60 * 1000,
    });
};
