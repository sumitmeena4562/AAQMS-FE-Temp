import api from './api';
import { extractError } from "../utils/errorUtils";

/**
 * ── ORGANISATION API SERVICE ──
 * Unified service for handling all operational units (Org, Site, Floor, Zone).
 * Note: Using 'organisations' (with 's') to match backend URL structure.
 */

// Helper to map frontend data to backend fields for Organisation
const mapOrgFrontendToBackend = (data) => {
    return {
        organisation_name: data.name,
        industry_type: data.industry,
        occupancy_type: data.occupancyType,
        classification: data.classification,
        contact_person_name: data.contactPerson,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        description: data.otherInfo,
        status: (data.status || 'PENDING').toUpperCase(),
        planned_sites: data.plannedSites || 0,
        is_active: data.is_active !== undefined ? data.is_active : true
    };
};

// Helper to create FormData for uploads (Org)
const createOrgFormData = (data) => {
    const formData = new FormData();
    const backendFields = mapOrgFrontendToBackend(data);

    // Append basic fields
    Object.entries(backendFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value);
        }
    });

    // Handle files if they exist
    if (data.imageFiles) {
        Object.entries(data.imageFiles).forEach(([key, file]) => {
            if (key === 'extra' && Array.isArray(file)) {
                file.forEach((item, index) => {
                    if (item instanceof File) {
                        formData.append(`image_extra_${index}`, item);
                    }
                });
                return;
            }
            if (file instanceof File) {
                formData.append(`image_${key}`, file); // Specific key for each image view (e.g., image_north)
            }
        });
    }

    return formData;
};

export const organizationService = {
    // Get all organisations (with search/filtering)
    getOrganizations: async (filters = {}) => {
        try {
            const params = { ...filters };
            
            // Handle multi-select arrays for backend compatibility
            if (Array.isArray(params.status)) {
                params.status = params.status.join(',').toUpperCase();
            } else if (typeof params.status === 'string') {
                params.status = params.status.toUpperCase();
            }

            if (Array.isArray(params.industry)) {
                params.industry = params.industry.join(',');
            }

            const response = await api.get('organisations/', { params });
            return response.data;
        } catch (err) {
            throw new Error(extractError(err, "Failed to load organisations"));
        }
    },

    // Get single organisation details
    getOrganizationById: async (id) => {
        try {
            const response = await api.get(`organisations/${id}/`);
            return response.data;
        } catch (err) {
            throw new Error(extractError(err, "Organisation details not found"));
        }
    },

    // Create a new organisation
    createOrganization: async (orgData) => {
        try {
            const formData = createOrgFormData(orgData);
            const response = await api.post('organisations/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (err) {
            throw new Error(extractError(err, "Failed to create organisation"));
        }
    },

    // Update an existing organisation
    updateOrganization: async (id, orgData) => {
        try {
            const formData = createOrgFormData(orgData);
            const response = await api.patch(`organisations/${id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (err) {
            throw new Error(extractError(err, "Failed to update organisation"));
        }
    },

    blockOrganization: async (id) => {
        try {
            const response = await api.patch(`organisations/${id}/block/`);
            return response.data;
        } catch (err) {
            throw new Error(extractError(err, "Failed to block organisation"));
        }
    },

    // --- SUB-UNITS (SITES, FLOORS, ZONES) ---

    // Get all sites
    getSites: async (organizationId = null, coordinatorId = null) => {
        const params = {};
        if (organizationId) params.organisation = organizationId;
        if (coordinatorId) params.coord_id = coordinatorId;
        try {
            const response = await api.get('organisations/sites/', { params });
            return response.data;
        } catch (err) {
            throw new Error(extractError(err, "Failed to load sites"));
        }
    },

    // Get floors for a site
    getFloors: async (siteId) => {
        if (!siteId) return [];
        try {
            const response = await api.get(`organisations/floors/${siteId}/`);
            return response.data;
        } catch (err) {
            throw new Error(extractError(err, "Failed to load floors"));
        }
    },

    // Get zones for a floor
    getZones: async (floorId) => {
        if (!floorId) return [];
        try {
            const response = await api.get(`organisations/floors/${floorId}/zones/`);
            return response.data;
        } catch (err) {
            throw new Error(extractError(err, "Failed to load zones"));
        }
    },

    // Generic delete for any unit
    deleteUnit: async (type, id) => {
        try {
            const endpointMap = {
                'organisation': 'organisations',
                'site': 'organisations/sites',
                'floor': 'organisations/floors',
                'zone': 'organisations/zones'
            };
            const endpoint = endpointMap[type] || type;
            await api.delete(`${endpoint}/${id}/`);
            return true;
        } catch (err) {
            throw new Error(extractError(err, `Failed to delete ${type}`));
        }
    }
};
