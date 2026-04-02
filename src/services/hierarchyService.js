import api from './api';

/**
 * ── HIERARCHY (SITE, FLOOR, ZONE) API SERVICE ──
 * Aligned with standardized Backend path: api/organizations/
 */
export const hierarchyService = {
    // --- SITES ---
    getSites: async (filters = {}) => {
        /**
         * Standardized: Use the organizations/sites/ path.
         */
        const response = await api.get('organizations/sites/', { params: filters });
        return response.data;
    },

    createSite: async (siteData) => {
        const response = await api.post('organizations/sites/', siteData);
        return response.data;
    },

    // --- FLOORS ---
    getFloors: async (filters = {}) => {
        const response = await api.get('organizations/floors/', { params: filters });
        return response.data;
    },

    createFloor: async (floorData) => {
        /**
         * Note: Usually involves uploading a floor map/blueprint image.
         * Ensure multipart header if necessary.
         */
        const response = await api.post('organizations/floors/', floorData);
        return response.data;
    },

    // --- ZONES ---
    getZones: async (filters = {}) => {
        const response = await api.get('organizations/zones/', { params: filters });
        return response.data;
    },

    createZone: async (zoneData) => {
        const response = await api.post('organizations/zones/', zoneData);
        return response.data;
    }
};
