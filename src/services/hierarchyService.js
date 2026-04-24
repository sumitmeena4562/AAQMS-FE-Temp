import api from './api';
import { extractError } from '../utils/errorUtils';

/**
 * ── HIERARCHY (SITE, FLOOR, ZONE) API SERVICE ──
 */
export const hierarchyService = {
    // --- SITES ---
    getSites: async (filters = {}, signal = null) => {
        try {
            const params = { ...filters };
            
            // Handle multi-select arrays for backend compatibility
            if (Array.isArray(params.organisation)) {
                params.organisation = params.organisation.join(',');
            }
            if (Array.isArray(params.coord_id)) {
                params.coord_id = params.coord_id.join(',');
            }

            const response = await api.get('organisations/sites/', { params, signal });
            return response.data;
        } catch (error) {
            if (error.name === 'CanceledError') throw error;
            throw new Error(extractError(error, 'Failed to load sites.'));
        }
    },

    createSite: async (siteData) => {
        try {
            const response = await api.post('organisations/sites/', siteData);
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'Failed to create site.'));
        }
    },

    // --- FLOORS ---
    getFloors: async (siteId = null, params = {}, signal = null) => {
        try {
            const isMulti = Array.isArray(siteId) && siteId.length > 1;
            const singleId = Array.isArray(siteId) ? siteId[0] : siteId;

            const queryParams = { ...params };
            if (isMulti) {
                queryParams.site_id = siteId.join(',');
                const response = await api.get('organisations/all-floors/', { 
                    params: queryParams,
                    signal
                });
                return response.data;
            }

            const isValidId = singleId && typeof singleId === 'string' && singleId.trim() !== '';
            const url = isValidId ? `organisations/floors/${singleId}/` : `organisations/all-floors/`;
            const response = await api.get(url, { params: queryParams, signal });
            return response.data;
        } catch (error) {
            if (error.name === 'CanceledError') throw error;
            throw new Error(extractError(error, 'Failed to load floors.'));
        }
    },

    createFloor: async (siteId, floorData) => {
        try {
            const response = await api.post(`organisations/floors/${siteId}/`, floorData);
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'Failed to create floor.'));
        }
    },

    // --- ZONES ---
    getZones: async (floorId = null, filters = {}, signal = null) => {
        try {
            const isMultiFloor = Array.isArray(floorId) && floorId.length > 1;
            const singleFloorId = (Array.isArray(floorId) && floorId.length > 0) ? floorId[0] : (floorId === 'all' ? null : floorId);
            
            const params = { ...filters };
            
            if (Array.isArray(params.site_id)) params.site_id = params.site_id.join(',');
            if (Array.isArray(params.org_id)) params.org_id = params.org_id.join(',');
            if (Array.isArray(params.organisation_id)) params.organisation_id = params.organisation_id.join(',');
            if (isMultiFloor) params.floor_id = floorId.join(',');

            let url = 'organisations/all-zones/';
            const isValidId = singleFloorId && typeof singleFloorId === 'string' && singleFloorId.trim() !== '' && !Array.isArray(singleFloorId);
            
            if (!isMultiFloor && isValidId) {
                url = `organisations/floors/${singleFloorId}/zones/`;
            }

            const response = await api.get(url, { params, signal });
            return response.data;
        } catch (error) {
            if (error.name === 'CanceledError') throw error;
            throw new Error(extractError(error, 'Failed to load zones.'));
        }
    },

    createZone: async (floorId, zoneData) => {
        try {
            const response = await api.post(`organisations/floors/${floorId}/zones/`, zoneData);
            return response.data;
        } catch (error) {
            throw new Error(extractError(error, 'Failed to create zone.'));
        }
    }
};
