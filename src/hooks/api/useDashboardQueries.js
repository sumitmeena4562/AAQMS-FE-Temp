import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as dashboardService from '../../services/dashboardService';

/**
 * useDashboardSummary
 * Fetches the unified dashboard summary (stats, metrics, recent_activity)
 */
export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: ({ signal }) => dashboardService.getDashboardSummary(signal),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,   // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });
};

/**
 * useAllHistory
 * Fetches paginated activity history with filters
 */
export const useAllHistory = (filters = {}) => {
  // Normalize filters for query key stability
  const cleanFilters = useMemo(() => Object.fromEntries(
    Object.entries(filters).filter(([, v]) => 
      v !== undefined && 
      v !== null && 
      v !== 'all' && 
      v !== '' && 
      !(Array.isArray(v) && v.length === 0)
    )
  ), [filters]);

  return useQuery({
    queryKey: ['dashboard', 'history', cleanFilters],
    queryFn: ({ signal }) => dashboardService.getAllHistory(cleanFilters, signal),
    staleTime: 2 * 60 * 1000, // History is more dynamic, 2 mins is safer
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

