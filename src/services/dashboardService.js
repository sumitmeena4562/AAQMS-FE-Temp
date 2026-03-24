import api from './api';
import { DUMMY_METRIC_CARDS, DUMMY_STATS_GRID, DUMMY_RECENT_ACTIVITY } from '../data/dashboardData';
import { mapToStatsGrid, mapToMetricCards } from '../utils/dashboardCalculations';

/**
 * ── DASHBOARD API SERVICE ──
 * All dashboard-related API calls belong in this file.
 * We use artificial delays (setTimeout) to return dummy data so it feels like a real API.
 * When your backend is ready, simply uncomment the api.get() lines!
 */

export const getDashboardMetrics = async () => {
    
    // 🚀 REAL BACKEND CALL:
    // const response = await api.get('/dashboard/metrics');
    // return mapToMetricCards(response.data); // This dynamically calculates Warning/Danger labels!
    
    // 🧪 SIMULATED BACKEND CALL (Will be deleted when real API is ready):
    return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_METRIC_CARDS), 600);
    });
};

export const getDashboardStats = async () => {
    // 🚀 REAL BACKEND CALL:
    // const response = await api.get('/dashboard/stats');
    // return mapToStatsGrid(response.data); // This magically handles +12% growths and 98% Active calculations!
    
    // 🧪 SIMULATED BACKEND CALL (Will be deleted when real API is ready):
    return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_STATS_GRID), 800);
    });
};

export const getRecentActivity = async () => {
    // 🚀 REAL BACKEND CALL:
    // const response = await api.get('/dashboard/activity');
    // return response.data;
    
    // 🧪 SIMULATED BACKEND CALL:
    return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_RECENT_ACTIVITY), 700);
    });
};
