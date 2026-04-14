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
        const params = { ...filters };
        
        // Handle multi-select arrays for backend compatibility
        if (Array.isArray(params.organisation)) {
            params.organisation = params.organisation.join(',');
        }
        if (Array.isArray(params.coord_id)) {
            params.coord_id = params.coord_id.join(',');
        }

        const response = await api.get('organisations/sites/', { params });
        return response.data;
    },

    createSite: async (siteData) => {
        const response = await api.post('organisations/sites/', siteData);
        return response.data;
    },

    // --- FLOORS ---
    getFloors: async (siteId = null) => {
        // If siteId is an array with multiple values, use the 'all-floors' endpoint with query params
        const isMulti = Array.isArray(siteId) && siteId.length > 1;
        const singleId = Array.isArray(siteId) ? siteId[0] : siteId;

        if (isMulti) {
            return (await api.get('organisations/all-floors/', { 
                params: { site_id: siteId.join(',') } 
            })).data;
        }

        const isValidId = singleId && typeof singleId === 'string' && singleId.trim() !== '';
        const url = isValidId ? `organisations/floors/${singleId}/` : `organisations/all-floors/`;
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
        // Handle multi-select for floors: if it's an array with multiple values, use the 'all-zones' endpoint
        const isMultiFloor = Array.isArray(floorId) && floorId.length > 1;
        const singleFloorId = (Array.isArray(floorId) && floorId.length > 0) ? floorId[0] : (floorId === 'all' ? null : floorId);
        
        const params = { ...filters };
        
        // Ensure cascading filters are joined for backend compatibility
        if (Array.isArray(params.site_id)) params.site_id = params.site_id.join(',');
        if (Array.isArray(params.org_id)) params.org_id = params.org_id.join(',');
        if (Array.isArray(params.organisation_id)) params.organisation_id = params.organisation_id.join(',');
        if (isMultiFloor) params.floor_id = floorId.join(',');

        let url = 'organisations/all-zones/';
        // Strict validation: Must be a non-empty string and NOT an array (to avoid //zones/ crash)
        const isValidId = singleFloorId && typeof singleFloorId === 'string' && singleFloorId.trim() !== '' && !Array.isArray(singleFloorId);
        
        if (!isMultiFloor && isValidId) {
            url = `organisations/floors/${singleFloorId}/zones/`;
        }

        const response = await api.get(url, { params });
        return response.data;
    },

    createZone: async (floorId, zoneData) => {
        const response = await api.post(`organisations/floors/${floorId}/zones/`, zoneData);
        return response.data;
    }
};
