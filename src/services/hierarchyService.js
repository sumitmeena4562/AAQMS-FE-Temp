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
         * @ENDPOINT: GET /api/organization/sites/
         * @QUERY_PARAMS: ?org_id=12&coord_id=45
         * @EXPECTED_RESPONSE: [{ id, name, location, org_id, coord_id ... }]
         */
        const response = await api.get('organization/sites/', { params: filters });
        return response.data;
    },

    createSite: async (siteData) => {
        const response = await api.post('organization/sites/', siteData);
        return response.data;
    },

    // --- FLOORS ---
    getFloors: async (filters = {}) => {
        /**
         * @ENDPOINT: GET /api/organization/floors/
         * @QUERY_PARAMS: ?site_id=89
         * @EXPECTED_RESPONSE: [{ id, name, level, site_id, floorPlanImage ... }]
         */
        const response = await api.get('organization/floors/', { params: filters });
        return response.data;
    },

    createFloor: async (floorData) => {
        /**
         * @ENDPOINT: POST /api/organization/floors/
         * Note: Usually involves uploading a floor map/blueprint image.
         */
        const response = await api.post('organization/floors/', floorData);
        return response.data;
    },

    // --- ZONES ---
    getZones: async (filters = {}) => {
    
        const response = await api.get('organization/zones/', { params: filters });
        return response.data;
    },

    createZone: async (zoneData) => {
        const response = await api.post('organization/zones/', zoneData);
        return response.data;
    }
};
