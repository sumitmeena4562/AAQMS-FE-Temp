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

export const getAllHistory = async (filters = {}) => {
    // 🚀 REAL BACKEND CALL:
    // const response = await api.get('/history', { params: filters });
    // return response.data;
    
    // 🧪 SIMULATED BACKEND CALL (Generates 100 items from the dummy 5):
    return new Promise((resolve) => {
        setTimeout(() => {
            const largeHistory = [];
            
            // To make mock filtering work realistically, we distribute these mock values among the 100 items.
            const mockOrgs = ['Acme Corp', 'Stark Industries', 'Wayne Enterprises', 'Globex', 'Initech'];
            const mockRoles = ['Admin', 'Coordinator', 'Field Officer', 'System AI'];
            const mockSites = ['Site Alpha', 'Site Beta', 'Site Gamma', 'HQ'];
            const mockFloors = ['Ground Floor', 'Level 1', 'Level 2', 'Level 3'];
            const mockZones = ['Zone 15-12', 'Zone B-12', 'Restricted Area', 'Loading Dock'];
            const mockInventory = ['Fire Extinguisher', 'Safety Gear', 'First Aid Kit', 'Hard Hats'];
            
            for (let i = 0; i < 20; i++) {
                DUMMY_RECENT_ACTIVITY.forEach((item, index) => {
                    const absIndex = i * 5 + index;
                    // Inject mock fields into the object so we can filter by them
                    const mockRecord = {
                        ...item,
                        id: `${i}-${item.id}`,
                        time: i === 0 ? item.time : `${(i * 3) + 1} hours ago`,
                        details: i % 3 === 0 ? item.details : `${item.details} (Auto-resolved)`,
                        // Hidden mock fields for filtering
                        _mockOrg: mockOrgs[absIndex % mockOrgs.length],
                        _mockRole: mockRoles[absIndex % mockRoles.length],
                        _mockSite: mockSites[absIndex % mockSites.length],
                        _mockFloor: mockFloors[absIndex % mockFloors.length],
                        _mockZone: mockZones[absIndex % mockZones.length],
                        _mockInventory: mockInventory[absIndex % mockInventory.length],
                    };
                    largeHistory.push(mockRecord);
                });
            }

            // Apply filters to the generated dataset
            let filteredHistory = largeHistory;

            if (filters.organization) {
                filteredHistory = filteredHistory.filter(item => item._mockOrg === filters.organization);
            }
            if (filters.role) {
                filteredHistory = filteredHistory.filter(item => item._mockRole === filters.role);
            }
            if (filters.site) {
                filteredHistory = filteredHistory.filter(item => item._mockSite === filters.site);
            }
            if (filters.floor) {
                filteredHistory = filteredHistory.filter(item => item._mockFloor === filters.floor);
            }
            if (filters.zone) {
                filteredHistory = filteredHistory.filter(item => item._mockZone === filters.zone);
            }
            if (filters.inventory) {
                filteredHistory = filteredHistory.filter(item => item._mockInventory === filters.inventory);
            }
            if (filters.eventType) {
                filteredHistory = filteredHistory.filter(item => item.type === filters.eventType);
            }

            resolve(filteredHistory);
        }, 500); // reduced timeout slightly to make filtering feel snappy
    });
};
