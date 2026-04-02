import api from './api';

/**
 * ── ORGANIZATION API SERVICE ──
 * Standardized for Production.
 */
export const organizationService = {
    // Get all organizations (For Dropdowns and Listing)
    getOrganizations: async (filters = {}) => {
        const response = await api.get('organizations/', { params: filters });
        return response.data;
    },

    // Get sites for a specific organization (For Assignment Dropdowns)
    getSites: async (orgId = null) => {
        const params = orgId ? { organization: orgId, dropdown: 'true' } : { dropdown: 'true' };
        const response = await api.get('organizations/sites/', { params });
        return response.data;
    },

    // Get single organization details
    getOrganizationById: async (id) => {
        const response = await api.get(`organizations/${id}/`);
        return response.data;
    },

    // Create a new organization
    createOrganization: async (orgData) => {
        const response = await api.post('organizations/', orgData);
        return response.data;
    },

    // Update an existing organization
    updateOrganization: async (id, orgData) => {
        const response = await api.put(`organizations/${id}/`, orgData);
        return response.data;
    },

    // Delete an organization
    deleteOrganization: async (id) => {
        const response = await api.delete(`organizations/${id}/`);
        return response.data;
    }
};
