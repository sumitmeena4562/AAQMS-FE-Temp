import api from './api';
import { DUMMY_METRIC_CARDS, DUMMY_STATS_GRID, DUMMY_RECENT_ACTIVITY } from '../data/dashboardData';

/**
 * ── DASHBOARD API SERVICE ──
 * All dashboard-related API calls belong in this file.
 * We use artificial delays (setTimeout) to return dummy data so it feels like a real API.
 * When your backend is ready, simply uncomment the api.get() lines!
 */

export const getDashboardMetrics = async () => {
    // 🚀 REAL BACKEND CALL:
    // const response = await api.get('/dashboard/metrics');
    // return response.data;
    
    // 🧪 SIMULATED BACKEND CALL:
    return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_METRIC_CARDS), 600);
    });
};

export const getDashboardStats = async () => {
    // 🚀 REAL BACKEND CALL:
    // const response = await api.get('/dashboard/stats');
    // return response.data;
    
    // 🧪 SIMULATED BACKEND CALL:
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
