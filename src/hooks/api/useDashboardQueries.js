import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as dashboardService from '../../services/dashboardService';
import { queryClient } from '../../lib/queryClient';

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

/**
 * prefetchHistory
 * Prefetches the next page of history in the background for instant navigation.
 */
export const prefetchHistory = async (filters = {}, nextPage) => {
    if (!nextPage) return;

    const nextFilters = { ...filters, page: nextPage };
    const cleanFilters = Object.fromEntries(
        Object.entries(nextFilters).filter(([, v]) => 
            v !== undefined && 
            v !== null && 
            v !== 'all' && 
            v !== '' && 
            !(Array.isArray(v) && v.length === 0)
        )
    );

    await queryClient.prefetchQuery({
        queryKey: ['dashboard', 'history', cleanFilters],
        queryFn: ({ signal }) => dashboardService.getAllHistory(cleanFilters, signal),
        staleTime: 2 * 60 * 1000,
    });
};

