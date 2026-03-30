/**
 * USER SERVICE
 * Handles User Management CRUD via real REST API integration.
 */

import api from "./api";
import { organizationService } from "./organizationService";

/**
 * Extract readable error message from API error response.
 */
const extractError = (error, fallback) => {
    const data = error.response?.data;
    if (!data) return error.message || fallback;
    if (data.detail) return data.detail;
    if (typeof data === 'string') return data;
    
    if (typeof data === 'object') {
        const errors = Object.entries(data).map(([key, val]) => {
            const msg = Array.isArray(val) ? val[0] : val;
            if (key === 'non_field_errors' || key === 'error') return msg;
            const field = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `${field}: ${msg}`;
        });
        return errors.length > 0 ? errors[0] : fallback;
    }
    return fallback;
};

// --- SERVICE IMPLEMENTATION ---
export const userService = {
    /**
     * GET USERS: Fetch with search & filters
     */
    getUsers: async (filters = {}, search = '', limit = 20, offset = 0) => {
        try {
            const response = await api.get('users/', {
                params: {
                    ...filters,
                    search: search,
                    limit: limit,
                    offset: offset
                }
            });
            // Handle DRF Pagination response format
            if (response.data.results) {
                return {
                    users: response.data.results,
                    totalCount: response.data.count
                };
            }
            return {
                users: response.data,
                totalCount: response.data.length
            };
        } catch (error) {
            throw new Error(extractError(error, 'Failed to load user list. Please refresh the page.'));
        }
    },

    /**
     * CRUD ACTIONS
     */
    createUser: async (userData) => {
        try {
            const response = await api.post('users/', userData);
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'Failed to create user. Please check all fields.'));
        }
    },

    updateUser: async (id, updates) => {
        try {
            const response = await api.patch(`users/${id}/`, updates);
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'Failed to update user profile.'));
        }
    },

    deleteUser: async (id) => {
        try {
            await api.delete(`users/${id}/`);
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
            const actionMap = { 
                'activate': 'active', 
                'deactivate': 'deactive',
                'delete': 'delete'
            };
            const backendAction = actionMap[action] || action;
            const response = await api.post('users/bulk-action/', { ids, action: backendAction });
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
            const response = await api.get('users/stats/');
            return response.data;
        } catch (error) {
            return { total: 0, active: 0, inactive: 0, unassigned: 0 };
        }
    },

    getFilterOptions: async () => {
        try {
            // Fetch real organizations and sites from backend
            const [orgsData, sitesData] = await Promise.all([
                organizationService.getOrganizations({ dropdown: 'true' }),
                organizationService.getSites()
            ]);

            const orgs = Array.isArray(orgsData) ? orgsData : (orgsData.results || []);
            const sites = Array.isArray(sitesData) ? sitesData : (sitesData.results || []);

            const roles = [
                { value: 'admin', label: 'Admin' },
                { value: 'coordinator', label: 'Coordinator' },
                { value: 'field_officer', label: 'Field Officer' }
            ];

            return {
                organizations: orgs.map(o => ({ value: o.id, label: o.name })),
                roles: roles,
                regions: sites.map(s => ({ value: s.id, label: s.site_name })),
            };
        } catch (error) {
            console.error("Failed to fetch filter options:", error);
            return { organizations: [], roles: [], regions: [] };
        }
    },

    /**
     * EXPORT
     */
    exportCSV: async () => {
        try {
            const response = await api.get('users/export/', { responseType: 'blob' });
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'CSV export failed. Please try again.'));
        }
    }
};
