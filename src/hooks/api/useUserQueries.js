import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/userService';

/**
 * ── USER & COORDINATOR QUERIES ──
 */

export const useCoordinators = (orgId = null, options = {}) => {
  return useQuery({
    queryKey: ['coordinators', orgId],
    queryFn: () => userService.getCoordinators(orgId),
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useUsers = (filters = {}, search = '', page = 1) => {
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
    queryKey: ['users', { filters: cleanFilters, search, page }],
    queryFn: () => userService.getUsers(cleanFilters, search, page),
    staleTime: 2 * 60 * 1000,
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: ['users', 'stats'],
    queryFn: userService.getUserStats,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCoordinatorStats = (orgId = null) => {
  return useQuery({
    queryKey: ['coordinators', 'stats', orgId],
    queryFn: () => userService.getCoordinatorStats(orgId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserFilterOptions = () => {
    return useQuery({
        queryKey: ['users', 'filter-options'],
        queryFn: userService.getFilterOptions,
        staleTime: 10 * 60 * 1000,
    });
};
