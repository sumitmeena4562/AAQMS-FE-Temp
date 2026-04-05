import api from './api';
import { DUMMY_METRIC_CARDS, DUMMY_STATS_GRID, DUMMY_RECENT_ACTIVITY } from '../data/dashboardData';
import { mapToStatsGrid, mapToMetricCards, mapToActivityFeed } from '../utils/dashboardCalculations';

/**
 * ΓöÇΓöÇ DASHBOARD API SERVICE ΓöÇΓöÇ

 */
export const getDashboardStats = async () => {

    const response = await api.get('/users/dashboard/');
    
    // Use the professional mapping utility to format it for the UI
    return mapToStatsGrid(response.data.data);
};

export const getDashboardMetrics = async () => {
    const response = await api.get('/users/dashboard/metrics/');
    return mapToMetricCards(response.data);
};

export const getRecentActivity = async () => {
    const response = await api.get('/users/dashboard/activity/');
    return mapToActivityFeed(response.data);
};

export const getAllHistory = async (filters = {}) => {
    const response = await api.get('/users/history/', { params: filters });
    return mapToActivityFeed(response.data.results || response.data);
};
