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
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false, // Explicitly disable polling
  });
};

/**
 * useAllHistory
 * Fetches paginated activity history with filters
 */
export const useAllHistory = (filters = {}) => {
  // Normalize filters for query key stability
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => 
      v !== undefined && 
      v !== null && 
      v !== 'all' && 
      v !== '' && 
      !(Array.isArray(v) && v.length === 0)
    )
  );

  return useQuery({
    queryKey: ['dashboard', 'history', cleanFilters],
    queryFn: ({ signal }) => dashboardService.getAllHistory(cleanFilters, signal),
    staleTime: 5 * 60 * 1000,
  });
};
