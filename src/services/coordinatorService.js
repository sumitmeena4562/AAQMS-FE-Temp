import api from './api';
import { extractError } from '../utils/errorUtils';

/**
 * ── COORDINATOR API SERVICE ──
 * Aligned with the unified User Management API.
 * Coordinators are just Users with a 'coordinator' role.
 */
export const coordinatorService = {
    // Get all assigned coordinators (For Assigned Coordinators Page)
    getCoordinators: async (filters = {}, signal = null) => {
        try {
            const response = await api.get('users/admin/', {
                params: { ...filters, role: 'coordinator' },
                signal
            });
            return response.data.results || response.data;
        } catch (error) {
            if (error.name === 'CanceledError') throw error;
            throw new Error(extractError(error, 'Failed to fetch coordinators.'));
        }
    },

    // Assign a new coordinator to an organization (Creation)
    assignCoordinator: async (coordinatorData) => {
        try {
            // Enforce coordinator role during creation
            const payload = { ...coordinatorData, role: 'coordinator' };
            const response = await api.post('users/admin/', payload);
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'Failed to assign coordinator.'));
        }
    },

    // Update coordinator details
    updateCoordinator: async (id, coordinatorData) => {
        try {
            const response = await api.patch(`users/admin/${id}/`, coordinatorData);
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'Failed to update coordinator.'));
        }
    },

    // Remove or unassign a coordinator (Deactivate or Delete user)
    removeCoordinator: async (id) => {
        try {
            const response = await api.delete(`users/admin/${id}/`);
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'Failed to remove coordinator.'));
        }
    }
};
