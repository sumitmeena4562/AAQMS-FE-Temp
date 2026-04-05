import api from './api';
import { mapToStatsGrid, mapToMetricCards } from '../utils/dashboardCalculations';

/**
 * ── DASHBOARD API SERVICE ──
 * All dashboard-related API calls belonging in this file are now 
 * connected to the standardized backend endpoints.
 */

export const getDashboardMetrics = async () => {
    try {
        const response = await api.get('users/dashboard-metrics/');
        // Backend returns: { inventory: {...}, approvals: {...}, aiFlags: {...} }
        return mapToMetricCards(response.data);
    } catch (error) {
        console.error("Dashboard Metrics Fetch Error:", error);
        return [];
    }
};

export const getDashboardStats = async () => {
    try {
        const response = await api.get('users/dashboard/');
        // Backend returns: { status: true, message: "...", data: { organisations: {...}, ...} }
        if (response.data && response.data.status) {
            return mapToStatsGrid(response.data.data);
        }
        return mapToStatsGrid(response.data);
    } catch (error) {
        console.error("Dashboard Stats Fetch Error:", error);
        return [];
    }
};

export const getRecentActivity = async () => {
    try {
        const response = await api.get('users/dashboard-activity/');
        return response.data;
    } catch (error) {
        console.error("Recent Activity Fetch Error:", error);
        return [];
    }
};

export const getAllHistory = async (params = {}) => {
    try {
        const response = await api.get('users/history/', { params });
        // Handle DRF Pagination if present
        return response.data.results || response.data;
    } catch (error) {
        console.error("History Fetch Error:", error);
        return [];
    }
};
