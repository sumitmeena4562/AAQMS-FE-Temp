import { useQuery } from '@tanstack/react-query';
import { getDashboardMetrics, getDashboardStats, getRecentActivity } from '../services/dashboardService';

/**
 * ── DASHBOARD CUSTOM QUERY HOOKS ──
 * These hooks are the ONLY things your UI components will ever interact with.
 * They magically provide: `data`, `isLoading`, and `isError`.
 */

export const useDashboardMetrics = () => {
    return useQuery({
        // The queryKey is like an ID card for the cache.
        queryKey: ['dashboard', 'metrics'], 
        
        // The function that actually gets the data
        queryFn: getDashboardMetrics,
        
        // This means: "Keep this data fresh in memory for 5 minutes." 
        // If the user leaves the page and comes back in 3 mins, it loads instantly without fetching again!
        staleTime: 5 * 60 * 1000, 
        
        // PRO LEVEL: Automatically fetch new data in the background every 30 seconds implicitly!
        refetchInterval: 30000,
    });
};

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard', 'stats'],
        queryFn: getDashboardStats,
        staleTime: 5 * 60 * 1000,
        refetchInterval: 30000,
    });
};

export const useRecentActivity = () => {
    return useQuery({
        queryKey: ['dashboard', 'activity'],
        queryFn: getRecentActivity,
        // Activity feeds change often, so maybe we only cache it for 1 minute before refetching in the background.
        staleTime: 1 * 60 * 1000, 
        refetchInterval: 15000, // Background updates for activity every 15 seconds!
    });
};
