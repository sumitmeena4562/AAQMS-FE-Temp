import api from "./api";
import { organizationService } from "./organizationService";
import { extractError } from "../utils/errorUtils";

// --- SERVICE IMPLEMENTATION ---
export const userService = {
    /**
     * GET USERS: Fetch with search & filters
     */
    getUsers: async (filters = {}, search = '', limit = 20, offset = 0) => {
        try {
            // Map FE 'organization' filter to BE 'organisation_id' if needed
            const finalFilters = { ...filters };
            if (finalFilters.organization) {
                finalFilters.organisation_id = finalFilters.organization;
                delete finalFilters.organization;
            }

            const response = await api.get('users/admin/', {
                params: {
                    ...finalFilters,
                    search: search,
                    limit: limit,
                    offset: offset
                }
            });

            // Robust Pagination Handling (DRF results/count or flat array)
            const data = response.data;
            if (data && typeof data === 'object' && 'results' in data) {
                return {
                    users: Array.isArray(data.results) ? data.results : [],
                    totalCount: data.count || 0
                };
            }
            
            return {
                users: Array.isArray(data) ? data : [],
                totalCount: Array.isArray(data) ? data.length : 0
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
            const response = await api.post('users/admin/', userData);
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'Failed to create user. Please check all fields.'));
        }
    },

    updateUser: async (id, updates) => {
        try {
            const response = await api.patch(`users/admin/${id}/`, updates);
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'Failed to update user profile.'));
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
            // Map frontend action names to backend expected values
            const actionMap = { 
                'activate': 'activate', 
                'deactivate': 'deactivate',
                'delete': 'delete',
                'block': 'block'
            };
            const backendAction = actionMap[action] || action;
            const response = await api.post('users/admin/bulk-action/', { ids, action: backendAction });
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
            const response = await api.get('users/admin/stats/');
            return response.data;
        } catch (error) {
            return { total: 0, active: 0, inactive: 0, unassigned: 0 };
        }
    },

    getCoordinatorStats: async (orgId = null) => {
        try {
            const response = await api.get('users/coordinator/stats/', {
                params: orgId ? { organisation_id: orgId } : {}
            });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch coordinator stats:", error);
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
                organizations: orgs.map(o => ({ value: o.id, label: o.organisation_name || o.name || 'Unnamed Org' })),
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
            const response = await api.get('users/admin/export/', { responseType: 'blob' });
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'CSV export failed. Please try again.'));
        }
    },

    /**
     * FETCH SUPERVISORS (COORDINATORS)
     */
    getCoordinators: async (orgId = null) => {
        try {
            const response = await api.get('users/coordinators/', { 
                params: orgId ? { organisation_id: orgId } : {} 
            });
            return response.data;
        } catch (error) {
            console.error("Failed to load coordinators for role mapping:", error);
            return [];
        }
    },


};
