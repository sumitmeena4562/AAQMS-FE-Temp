import api from './api';
import { mapToActivityFeed } from '../utils/dashboardCalculations';

/**
 * ── DASHBOARD API SERVICE ──
 */

// ─── NEW UNIFIED BOOTSTRAP ENDPOINT (Replaces everything for Dashboard) ───
export const getDashboardBootstrap = async (signal = null) => {
    const response = await api.get('/users/dashboard/summary/', { signal });
    const data = response.data;
    
    return {
        stats: data.stats || {},
        metrics: data.metrics || [],
        recent_history: mapToActivityFeed(data.recent_activity || []),
        organisations: data.organisations || []
    };
};

// ─── UNIFIED DASHBOARD ENDPOINT (Legacy - will be deprecated) ───
export const getDashboardSummary = async (signal = null) => {
    const response = await api.get('/users/dashboard/summary/', { signal });
    return response.data; // { stats, metrics, recent_activity }
};

// ─── HISTORY (server-side paginated) ───
export const getAllHistory = async (filters = {}, signal = null) => {
    const finalFilters = {};
    Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (Array.isArray(value)) {
            if (value.length > 0) {
                // Map FE 'organisation' to BE 'organisation_id' if needed
                const targetKey = key === 'organisation' ? 'organisation_id' : key;
                finalFilters[targetKey] = value.join(',');
            }
        } else if (value !== undefined && value !== null && value !== '') {
            finalFilters[key] = value;
        }
    });

    const response = await api.get('/users/history/', {
        params: {
            ...finalFilters,
            page: finalFilters.page || 1,
            page_size: finalFilters.page_size || 10,
        },
        signal
    });
    return {
        results: mapToActivityFeed(response.data.results || []),
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous,
    };
};
