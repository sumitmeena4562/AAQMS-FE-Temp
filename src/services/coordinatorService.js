import api from './api';

/**
 * ── COORDINATOR API SERVICE ──
 * 
 * TODO [BACKEND INTEGRATION]: Update the URLs below once the backend is ready.
 */
export const coordinatorService = {
    // Get all assigned coordinators (For Assigned Coordinators Page)
    getCoordinators: async (filters = {}) => {
        /**
         * @ENDPOINT: GET /api/v1/coordinators
         * @QUERY_PARAMS: ?orgId=123&status=active&search=John
         * @EXPECTED_RESPONSE: { data: [{ id, name, email, orgId, status ... }] }
         */
        const response = await api.get('/api/v1/coordinators', { params: filters });
        return response.data;
    },

    // Assign a new coordinator to an organization
    assignCoordinator: async (coordinatorData) => {
        /**
         * @ENDPOINT: POST /api/v1/coordinators/assign
         * @EXPECTED_BODY: { name, email, phone, orgId, roleId, ... }
         */
        const response = await api.post('/api/v1/coordinators/assign', coordinatorData);
        return response.data;
    },

    // Update coordinator details
    updateCoordinator: async (id, coordinatorData) => {
        /**
         * @ENDPOINT: PUT /api/v1/coordinators/:id
         */
        const response = await api.put(`/api/v1/coordinators/${id}`, coordinatorData);
        return response.data;
    },

    // Remove or unassign a coordinator
    removeCoordinator: async (id) => {
        /**
         * @ENDPOINT: DELETE /api/v1/coordinators/:id
         */
        const response = await api.delete(`/api/v1/coordinators/${id}`);
        return response.data;
    }
};
