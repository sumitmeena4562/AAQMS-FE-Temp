import api from './api';

/**
 * ── COORDINATOR API SERVICE ──
 * Aligned with the unified User Management API.
 * Coordinators are just Users with a 'coordinator' role.
 */
export const coordinatorService = {
    // Get all assigned coordinators (For Assigned Coordinators Page)
    getCoordinators: async (filters = {}) => {
        /**
         * Standardized: Use the 'users/' endpoint with its built-in role filter.
         */
        const response = await api.get('users/', { 
            params: { ...filters, role: 'coordinator' } 
        });
        return response.data;
    },

    // Assign a new coordinator (Create a User with coordinator role)
    assignCoordinator: async (coordinatorData) => {
        /**
         * For simplicity in AAQMS, assigning a coordinator means creating a user with the role set.
         */
        const payload = { ...coordinatorData, role: 'COORDINATOR' };
        const response = await api.post('users/', payload);
        return response.data;
    },

    // Update coordinator details
    updateCoordinator: async (id, coordinatorData) => {
        const response = await api.patch(`users/${id}/`, coordinatorData);
        return response.data;
    },

    // Remove or unassign a coordinator (Deactivate or Delete user)
    removeCoordinator: async (id) => {
        const response = await api.delete(`users/${id}/`);
        return response.data;
    }
};
