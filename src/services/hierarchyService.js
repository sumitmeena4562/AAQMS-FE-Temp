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
         * @ENDPOINT: GET /api/organisations/sites/
         * @QUERY_PARAMS: ?organisation=uuid&org_id=uuid&coord_id=uuid
         */
        const response = await api.get('organisations/sites/', { params: filters });
        return response.data;
    },

    createSite: async (siteData) => {
        const response = await api.post('organisations/sites/', siteData);
        return response.data;
    },

    // --- FLOORS ---
    getFloors: async (siteId = null) => {
        // If siteId is an array, take the first one or use all-floors if supported
        const id = Array.isArray(siteId) ? siteId[0] : siteId;
        const url = id ? `organisations/floors/${id}/` : `organisations/all-floors/`;
        const response = await api.get(url);
        return response.data;
    },

    createFloor: async (siteId, floorData) => {
        /**
         * @ENDPOINT: POST /api/organisations/floors/<site_id>/
         */
        const response = await api.post(`organisations/floors/${siteId}/`, floorData);
        return response.data;
    },

    // --- ZONES ---
    getZones: async (floorId = null, filters = {}) => {
        // Handle array floorId or 'all'
        const id = Array.isArray(floorId) ? floorId[0] : floorId;
        const url = (id && id !== 'all') ? `organisations/floors/${id}/zones/` : `organisations/all-zones/`;
        const response = await api.get(url, { params: filters });
        return response.data;
    },

    createZone: async (floorId, zoneData) => {
        const response = await api.post(`organisations/floors/${floorId}/zones/`, zoneData);
        return response.data;
    }
};
