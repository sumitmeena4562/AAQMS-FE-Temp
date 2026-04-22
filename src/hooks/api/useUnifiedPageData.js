import { useQuery } from '@tanstack/react-query';
import { unifiedService } from '../../services/unifiedService';
import { useMemo } from 'react';

/**
 * ── UNIFIED PAGE DATA HOOK ──
 * Consolidates all page requirements into one react-query lifecycle.
 */
export const useUnifiedPageData = (pageType, filters = {}, options = {}) => {
    // Normalize filters for stable keys
    const cleanFilters = useMemo(() => Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => 
            v !== undefined && v !== null && v !== 'all' && v !== '' && !(Array.isArray(v) && v.length === 0)
        )
    ), [filters]);

    return useQuery({
        queryKey: ['unified-summary', pageType, JSON.stringify(cleanFilters)],
        queryFn: ({ signal }) => unifiedService.getPageSummary(pageType, cleanFilters, signal),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000,
        placeholderData: (prev) => prev,
        ...options
    });
};
