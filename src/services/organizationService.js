import api from './api';

/**
 * ── ORGANIZATION API SERVICE ──
 * 
 * TODO [BACKEND INTEGRATION]: Update the URLs below once the backend is ready.
 * Just replace '/api/v1/organizations' with the actual endpoint your backend developer provides.
 */
export const organizationService = {
    // Get all organizations (For Organization Listing Page)
    getOrganizations: async (filters = {}) => {
        /**
         * @ENDPOINT: GET /api/v1/organizations
         * @QUERY_PARAMS: ?page=1&limit=10&search=Acme&status=active
         * @EXPECTED_RESPONSE: { data: [{ id, name, industry, status ... }], total: 100 }
         */
        const response = await api.get('/api/v1/organizations', { params: filters });
        return response.data;
    },

    // Get single organization details
    getOrganizationById: async (id) => {
        const response = await api.get(`/api/v1/organizations/${id}`);
        return response.data;
    },

    // Create a new organization (For Add Organization Page)
    createOrganization: async (orgData) => {
        /**
         * @ENDPOINT: POST /api/v1/organizations
         * Note: If 'orgData' contains images (like site imagery or profile logo),
         * the backend should support 'multipart/form-data'. You might need to pass FormData here.
         * @EXPECTED_BODY: { name, email, phone, industry, ... }
         */
        const response = await api.post('/api/v1/organizations', orgData);
        return response.data;
    },

    // Update an existing organization
    updateOrganization: async (id, orgData) => {
        const response = await api.put(`/api/v1/organizations/${id}`, orgData);
        return response.data;
    },

    // Delete an organization
    deleteOrganization: async (id) => {
        const response = await api.delete(`/api/v1/organizations/${id}`);
        return response.data;
    }
};
