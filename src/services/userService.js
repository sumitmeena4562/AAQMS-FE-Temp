/**
 * USER SERVICE
 * Handles User Management CRUD via real REST API integration.
 */

import api from "./api";

/**
 * Extract readable error message from API error response.
 */
const extractError = (error, fallback) => {
    const data = error.response?.data;
    if (!data) return error.message || fallback;
    if (data.detail) return data.detail;
    if (typeof data === 'object') {
        const firstEntry = Object.entries(data).find(([, v]) => v);
        if (firstEntry) {
            const [key, val] = firstEntry;
            const msg = Array.isArray(val) ? val[0] : val;
            return key === 'non_field_errors' ? msg : `${key}: ${msg}`;
        }
    }
    return fallback;
};

// --- SERVICE IMPLEMENTATION ---
export const userService = {
    /**
     * GET USERS: Fetch with search & filters
     */
    getUsers: async (filters = {}, search = '') => {
        try {
            const response = await api.get('accounts/users/', {
                params: {
                    ...filters,
                    search: search 
                }
            });
            return response.data.results || response.data; 
        } catch (error) {
            throw new Error(extractError(error, 'Failed to load user list. Please refresh the page.'));
        }
    },

    /**
     * CRUD ACTIONS
     */
    createUser: async (userData) => {
        try {
            const response = await api.post('accounts/users/', userData);
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'Failed to create user. Please check all fields.'));
        }
    },

    updateUser: async (id, updates) => {
        try {
            const response = await api.patch(`accounts/users/${id}/`, updates);
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'Failed to update user profile.'));
        }
    },

    deleteUser: async (id) => {
        try {
            await api.delete(`accounts/users/${id}/`);
            return true;
        } catch (error) {
            throw new Error(extractError(error, 'Failed to delete user.'));
        }
    },

    /**
     * BULK ACTIONS
     */
    bulkAction: async (ids, action) => {
        try {
            // Map frontend action names to backend expected values
            const actionMap = { 'activate': 'active', 'deactivate': 'deactive' };
            const backendAction = actionMap[action] || action;
            const response = await api.post('accounts/users/bulk-action/', { ids, action: backendAction });
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'Bulk action failed. Please try again.'));
        }
    },

    /**
     * ANALYTICS & OPTIONS
     */
    getUserStats: async () => {
        try {
            const response = await api.get('accounts/users/stats/');
            return response.data;
        } catch (error) {
            return { total: 0, active: 0, inactive: 0, unassigned: 0 };
        }
    },

    getFilterOptions: async (filters = {}, existingUsers = null) => {
        try {
            // Use existing users data if available, avoid duplicate API call
            const users = existingUsers || await userService.getUsers(filters);
            const getUnique = (arr, key) => [...new Set(arr.map(u => u[key]).filter(Boolean))].sort();
            const roles = [
                { value: 'admin', label: 'Admin' },
                { value: 'coordinator', label: 'Coordinator' },
                { value: 'field_officer', label: 'Field Officer' }
            ];
            return {
                organizations: getUnique(users, 'organization'),
                roles: roles,
                regions: [...new Set([...getUnique(users, 'region'), ...getUnique(users, 'zone')])].sort(),
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
            const response = await api.get('accounts/users/export/', { responseType: 'blob' });
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'CSV export failed. Please try again.'));
        }
    }
};
