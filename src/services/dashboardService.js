import api from './api';
import { mapToActivityFeed } from '../utils/dashboardCalculations';

/**
 * \u2500\u2500 DASHBOARD API SERVICE \u2500\u2500
 */

// \u2500\u2500\u2500 UNIFIED DASHBOARD ENDPOINT (1 call replaces 3) \u2500\u2500\u2500
export const getDashboardSummary = async () => {
    const response = await api.get('/users/dashboard/summary/');
    return response.data; // { stats, metrics, recent_activity }
};

// \u2500\u2500\u2500 HISTORY (server-side paginated) \u2500\u2500\u2500
export const getAllHistory = async (filters = {}) => {
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
        }
    });
    return {
        results: mapToActivityFeed(response.data.results || []),
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous,
    };
};
