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
    const response = await api.get('/users/history/', {
        params: {
            ...filters,
            page: filters.page || 1,
            page_size: filters.page_size || 50,
        }
    });
    return {
        results: mapToActivityFeed(response.data.results || []),
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous,
    };
};
