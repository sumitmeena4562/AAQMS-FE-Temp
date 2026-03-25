import api from './api';

/**
 * ── HIERARCHY (SITE, FLOOR, ZONE) API SERVICE ──
 * 
 * TODO [BACKEND INTEGRATION]: Update the URLs below once the backend is ready.
 */
export const hierarchyService = {
    // --- SITES ---
    getSites: async (filters = {}) => {
        /**
         * @ENDPOINT: GET /api/v1/sites
         * @QUERY_PARAMS: ?orgId=12&coordId=45
         * @EXPECTED_RESPONSE: [{ id, name, location, orgId, coordId ... }]
         */
        const response = await api.get('/api/v1/sites', { params: filters });
        return response.data;
    },

    createSite: async (siteData) => {
        const response = await api.post('/api/v1/sites', siteData);
        return response.data;
    },

    // --- FLOORS ---
    getFloors: async (filters = {}) => {
        /**
         * @ENDPOINT: GET /api/v1/floors
         * @QUERY_PARAMS: ?siteId=89
         * @EXPECTED_RESPONSE: [{ id, name, level, siteId, floorPlanImage ... }]
         */
        const response = await api.get('/api/v1/floors', { params: filters });
        return response.data;
    },

    createFloor: async (floorData) => {
        /**
         * @ENDPOINT: POST /api/v1/floors
         * Note: Usually involves uploading a floor map/blueprint image.
         */
        const response = await api.post('/api/v1/floors', floorData);
        return response.data;
    },

    // --- ZONES ---
    getZones: async (filters = {}) => {
        /**
         * @ENDPOINT: GET /api/v1/zones
         * @QUERY_PARAMS: ?floorId=102
         * @EXPECTED_RESPONSE: [{ id, name, type, coordinates, floorId ... }]
         */
        const response = await api.get('/api/v1/zones', { params: filters });
        return response.data;
    },

    createZone: async (zoneData) => {
        const response = await api.post('/api/v1/zones', zoneData);
        return response.data;
    }
};
