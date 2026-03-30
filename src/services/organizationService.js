import api from './api';

/**
 * ── ORGANIZATION API SERVICE ──
 * 
 * TODO [BACKEND INTEGRATION]: Update the URLs below once the backend is ready.
 * Just replace '/api/v1/organizations' with the actual endpoint your backend developer provides.
 */
export const organizationService = {
    // Get all organizations (For Dropdowns and Listing)
    getOrganizations: async (filters = {}) => {
        const response = await api.get('organization/organisations/', { params: filters });
        return response.data;
    },

    // Get sites for a specific organization (For Assignment Dropdowns)
    getSites: async (orgId = null) => {
        const params = orgId ? { organization: orgId, dropdown: 'true' } : { dropdown: 'true' };
        const response = await api.get('organization/sites/', { params });
        return response.data;
    },

    // Get single organization details
    getOrganizationById: async (id) => {
        const response = await api.get(`organization/organisations/${id}/`);
        return response.data;
    },

    // Create a new organization
    createOrganization: async (orgData) => {
        const response = await api.post('organization/organisations/', orgData);
        return response.data;
    },

    // Update an existing organization
    updateOrganization: async (id, orgData) => {
        const response = await api.put(`organization/organisations/${id}/`, orgData);
        return response.data;
    },

    // Delete an organization
    deleteOrganization: async (id) => {
        const response = await api.delete(`organization/organisations/${id}/`);
        return response.data;
    }
};
