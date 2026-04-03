import api from './api';

/**
 * ── HIERARCHY (SITE, FLOOR, ZONE) API SERVICE ──
 * Aligned with standardized Backend path: api/organisations/
 */
export const hierarchyService = {
    // --- SITES ---
    getSites: async (filters = {}) => {
        /**
         * Standardized: Use the organisations/sites/ path.
         */
        const response = await api.get('organisations/sites/', { params: filters });
        return response.data;
    },

    createSite: async (siteData) => {
        const response = await api.post('organisations/sites/', siteData);
        return response.data;
    },

    // --- FLOORS ---
    getFloors: async (filters = {}) => {
        const response = await api.get('organisations/floors/', { params: filters });
        return response.data;
    },

    createFloor: async (floorData) => {
        /**
         * Note: Usually involves uploading a floor map/blueprint image.
         * Ensure multipart header if necessary.
         */
        const response = await api.post('organisations/floors/', floorData);
        return response.data;
    },

    // --- ZONES ---
    getZones: async (filters = {}) => {
        const response = await api.get('organisations/zones/', { params: filters });
        return response.data;
    },

    createZone: async (zoneData) => {
        const response = await api.post('organisations/zones/', zoneData);
        return response.data;
    }
};
