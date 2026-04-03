import api from './api';
import { extractError } from '../utils/errorUtils';

/**
 * ── ORGANIZATION API SERVICE ──
 * Standardized for Production with full error handling.
 */
export const organizationService = {
    // Get all organizations (For Dropdowns and Listing)
    getOrganizations: async (filters = {}) => {
        try {
            const response = await api.get('organizations/', { params: filters });
            return response.data;
        } catch (err) {
            throw new Error(extractError(err, "Failed to load organizations"));
        }
    },

    // Get sites for a specific organization (For Assignment Dropdowns)
    getSites: async (orgId = null) => {
        try {
            const params = orgId ? { organization: orgId, dropdown: 'true' } : { dropdown: 'true' };
            const response = await api.get('organizations/sites/', { params });
            return response.data;
        } catch (err) {
            throw new Error(extractError(err, "Failed to load sites"));
        }
    },

    // Get single organization details
    getOrganizationById: async (id) => {
        try {
            const response = await api.get(`organizations/${id}/`);
            return response.data;
        } catch (err) {
            throw new Error(extractError(err, "Organization details not found"));
        }
    },

    // Create a new organization
    createOrganization: async (orgData) => {
        try {
            const response = await api.post('organizations/', orgData);
            return response.data;
        } catch (err) {
            throw new Error(extractError(err, "Failed to create organization"));
        }
    },

    // Update an existing organization
    updateOrganization: async (id, orgData) => {
        try {
            const response = await api.patch(`organizations/${id}/`, orgData);
            return response.data;
        } catch (err) {
            throw new Error(extractError(err, "Failed to update organization"));
        }
    },

    // Delete an organization
    deleteOrganization: async (id) => {
        try {
            const response = await api.delete(`organizations/${id}/`);
            return response.data;
        } catch (err) {
            throw new Error(extractError(err, "Failed to delete organization"));
        }
    }
};
