/**
 * USER SERVICE
 * Handles User Management CRUD via real REST API integration.
 */

import api from "./api";

// --- SERVICE IMPLEMENTATION ---
export const userService = {
    /**
     * GET USERS: Fetch with search & filters
     */
    getUsers: async (filters = {}, search = '') => {
        try {
            const response = await api.get('/accounts/users/', {
                params: {
                    ...filters,
                    search: search 
                }
            });
            // Backend se data 'results' array mein aata hai (standard DRF format)
            return response.data.results || response.data; 
        } catch (error) {
            console.error("User list fetch failed:", error);
            throw error;
        }
    },

    /**
     * CRUD ACTIONS
     */
    createUser: async (userData) => {
        try {
            const response = await api.post('/accounts/users/', userData);
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.detail || error.response?.data?.email?.[0] || 'Email already exists';
            throw new Error(msg);
        }
    },

    updateUser: async (id, updates) => {
        try {
            const response = await api.patch(`/accounts/users/${id}/`, updates);
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.detail || 'Failed to update user';
            throw new Error(msg);
        }
    },

    deleteUser: async (id) => {
        try {
            await api.delete(`/accounts/users/${id}/`);
            return true;
        } catch (error) {
            console.error("Delete failed:", error);
            throw error;
        }
    },

    /**
     * BULK ACTIONS
     */
    bulkAction: async (ids, action) => {
        try {
            const response = await api.post('/accounts/users/bulk-action/', { ids, action });
            return response.data;
        } catch (error) {
            console.error("Bulk action failed:", error);
            throw error;
        }
    },

    /**
     * ANALYTICS & OPTIONS
     */
    getUserStats: async () => {
        try {
            const response = await api.get('/accounts/users/stats/');
            return response.data;
        } catch (error) {
            console.error("Stats fetch failed:", error);
            return { total: 0, active: 0, inactive: 0, unassigned: 0 };
        }
    },

    getFilterOptions: async (filters = {}) => {
        try {
            // Hum users list se hi unique values nikal lete hain (ya BE se mangwa sakte hain)
            const users = await userService.getUsers(filters);
            
            const getUnique = (arr, key) => [...new Set(arr.map(u => u[key]).filter(Boolean))].sort();

            const roles = [
                { value: 'admin', label: 'Admin' },
                { value: 'coordinator', label: 'Coordinator' },
                { value: 'field_officer', label: 'Field Officer' }
            ];

            return {
                organizations: getUnique(users, 'organization'),
                roles: roles,
                regions: getUnique(users, 'region'),
            };
        } catch (error) {
            return { organizations: [], roles: [], regions: [] };
        }
    },

    /**
     * EXPORT
     */
    exportCSV: async () => {
        try {
            const response = await api.get('/accounts/users/export/', { responseType: 'blob' });
            return response.data;
        } catch (error) {
            console.error("Export failed:", error);
            throw error;
        }
    }
};
