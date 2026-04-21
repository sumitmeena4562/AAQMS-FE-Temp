import api from "./api";
import { organizationService } from "./organizationService";
import { extractError } from "../utils/errorUtils";

// --- SERVICE IMPLEMENTATION ---
export const userService = {
    /**
     * GET USERS: Fetch with search & filters
     * Optimized: Removed redundant loops, ensured clean params, supported signal cancellation.
     */
    getUsers: async (filters = {}, search = '', page = 1, pageSize = 20, signal = null) => {
        try {
            const params = {
                page_size: pageSize,
                page: page,
                search: search?.trim() || undefined
            };

            // Map and clean filters in a single pass
            Object.entries(filters).forEach(([key, value]) => {
                if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) return;
                
                const targetKey = key === 'organization' ? 'organisation_id' : key;
                params[targetKey] = Array.isArray(value) ? value.join(',') : value;
            });

            const response = await api.get('users/admin/', { params, signal });
            const data = response.data;

            // Normalize response structure
            const results = data?.results || (Array.isArray(data) ? data : []);
            const count = data?.count || (Array.isArray(data) ? data.length : 0);

            return {
                users: results,
                totalCount: count
            };
        } catch (error) {
            if (error.name === 'CanceledError') throw error;
            throw new Error(extractError(error, 'Failed to load user list.'));
        }
    },

    /**
     * CRUD ACTIONS
     */
    createUser: async (userData) => {
        try {
            const response = await api.post('users/admin/', userData);
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'Failed to create user.'));
        }
    },

    updateUser: async (id, updates) => {
        try {
            const response = await api.patch(`users/admin/${id}/`, updates);
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'Failed to update user.'));
        }
    },

    deleteUser: async (id) => {
        try {
            await api.delete(`users/admin/${id}/`);
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
            const response = await api.post('users/admin/bulk-action/', { ids, action });
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'Bulk action failed.'));
        }
    },

    /**
     * ANALYTICS & OPTIONS
     */
    getUserStats: async (signal = null) => {
        try {
            const response = await api.get('users/admin/stats/', { signal });
            return response.data || { total: 0, active: 0, inactive: 0, unassigned: 0 };
        } catch (error) {
            if (error.name === 'CanceledError') throw error;
            return { total: 0, active: 0, inactive: 0, unassigned: 0 };
        }
    },

    getCoordinatorStats: async (orgId = null, signal = null) => {
        try {
            const params = orgId ? { organisation_id: Array.isArray(orgId) ? orgId.join(',') : orgId } : {};
            const response = await api.get('users/coordinator/stats/', { params, signal });
            return response.data || { total: 0, active: 0, inactive: 0, unassigned: 0 };
        } catch (error) {
            if (error.name === 'CanceledError') throw error;
            return { total: 0, active: 0, inactive: 0, unassigned: 0 };
        }
    },

    /**
     * EXPORT
     */
    exportCSV: async (filters = {}, search = '') => {
        try {
            const response = await api.get('users/admin/export/', { 
                params: { ...filters, search },
                responseType: 'blob' 
            });
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'Export failed.'));
        }
    },

    /**
     * FETCH SUPERVISORS (COORDINATORS)
     */
    getCoordinators: async (orgId = null, signal = null) => {
        try {
            const params = orgId ? { organisation_id: Array.isArray(orgId) ? orgId.join(',') : orgId } : {};
            const response = await api.get('users/coordinators/', { params, signal });
            return response.data || [];
        } catch (error) {
            if (error.name === 'CanceledError') throw error;
            return [];
        }
    },
};


};
