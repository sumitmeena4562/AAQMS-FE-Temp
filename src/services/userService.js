import api from "./api";
import { extractError } from "../utils/errorUtils";

// --- SERVICE IMPLEMENTATION ---
export const userService = {
    /**
     * GET USERS: Fetch with search & filters
     * Optimized: Consolidated list and stats into a single request.
     */
    getUsers: async (filters = {}, search = '', page = 1, pageSize = 20, signal = null) => {
        try {
            const params = {
                page_size: pageSize,
                page: page,
                search: search?.trim() || undefined,
                include_stats: 'true',
                include_options: 'true' // One-call optimization
            };

            Object.entries(filters).forEach(([key, value]) => {
                if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) return;
                
                let targetKey = key;
                if (key === 'organization') targetKey = 'organisation_id';
                if (key === 'region') targetKey = 'site_id';
                
                // Ensure value is a clean string/number for the API
                params[targetKey] = Array.isArray(value) ? value.filter(Boolean).join(',') : value;
            });

            const response = await api.get('users/admin/', { params, signal });
            const data = response.data;

            return {
                users: data?.results || [],
                totalCount: data?.count || 0,
                stats: data?.stats,
                options: data?.options // Consolidated dropdown data
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
            // Check if userData is FormData (for binary uploads)
            const isFormData = userData instanceof FormData;
            const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
            
            const response = await api.post('users/admin/', userData, config);
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'Failed to create user.'));
        }
    },

    getUserById: async (id, signal = null) => {
        try {
            const response = await api.get(`users/admin/${id}/`, { signal });
            return response.data;
        } catch (error) {
            if (error.name === 'CanceledError') throw error;
            throw new Error(extractError(error, 'Failed to fetch user details.'));
        }
    },

    updateUser: async (id, updates) => {
        try {
            const isFormData = updates instanceof FormData;
            const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
            
            const response = await api.patch(`users/admin/${id}/`, updates, config);
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
     * ANALYTICS & OPTIONS (LEGACY - use stats from getUsers where possible)
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

    getCoordinators: async (orgId = null, signal = null) => {
        try {
            const filters = { role: 'coordinator' };
            if (orgId) filters.organization = orgId;
            
            // Reuse the robust getUsers method to ensure consistent data mapping
            const result = await userService.getUsers(filters, '', 1, 100, signal);
            return result.users || [];
        } catch (error) {
            if (error.name === 'CanceledError') throw error;
            return [];
        }
    },
    
    /**
     * UNIFIED FORM OPTIONS
     * Fetch all dropdown data in a single request for optimized modal loading.
     */
    getFormOptions: async (signal = null) => {
        try {
            const response = await api.get('users/form-options/', { signal });
            return response.data || { organizations: [], sites: [], coordinators: [], roles: [] };
        } catch (error) {
            if (error.name === 'CanceledError') throw error;
            console.error("[AAQMS-UI] Failed to load form options", error);
            return { organizations: [], sites: [], coordinators: [], roles: [] };
        }
    },
};
