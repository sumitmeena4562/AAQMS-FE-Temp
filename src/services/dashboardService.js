import api from './api';
import { extractError } from '../utils/errorUtils';
import { mapToActivityFeed } from '../utils/dashboardCalculations';

/**
 * ── DASHBOARD API SERVICE ──
 */

// ─── NEW UNIFIED BOOTSTRAP ENDPOINT (Replaces everything for Dashboard) ───
export const getDashboardBootstrap = async (signal = null) => {
    try {
        const response = await api.get('/users/dashboard/summary/', { signal });
        const data = response.data;
        
        return {
            stats: data.stats || {},
            metrics: data.metrics || [],
            recent_history: mapToActivityFeed(data.recent_activity || []),
            organisations: data.organisations || []
        };
    } catch (error) {
        if (error.name === 'CanceledError') throw error;
        throw new Error(extractError(error, 'Failed to load dashboard summary.'));
    }
};

// ─── UNIFIED DASHBOARD ENDPOINT (Legacy - will be deprecated) ───
export const getDashboardSummary = async (signal = null) => {
    try {
        const response = await api.get('/users/dashboard/summary/', { signal });
        return response.data; // { stats, metrics, recent_activity }
    } catch (error) {
        if (error.name === 'CanceledError') throw error;
        throw new Error(extractError(error, 'Failed to load dashboard summary.'));
    }
};

// ─── HISTORY (server-side paginated) ───
export const getAllHistory = async (filters = {}, signal = null) => {
    try {
        const finalFilters = {};
        Object.keys(filters).forEach(key => {
            const value = filters[key];
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    let targetKey = key;
                    if (key === 'organisation') targetKey = 'organisation_id';
                    else if (key === 'site') targetKey = 'site_id';
                    else if (key === 'floor') targetKey = 'floor_id';
                    
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
    } catch (error) {
        if (error.name === 'CanceledError') throw error;
        throw new Error(extractError(error, 'Failed to load activity history.'));
    }
};
