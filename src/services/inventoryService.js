import api from './api';

/**
 * ── INVENTORY API SERVICE ──
 * Standardized for Production.
 */
export const inventoryService = {
    // Get all inventory items (with optional filters)
    getInventory: async (params = {}) => {
        const response = await api.get('organizations/inventory/', { params });
        return response.data;
    },

    // Get inventory analytics stats
    getInventoryStats: async (params = {}) => {
        const response = await api.get('organizations/inventory/stats/', { params });
        return response.data;
    },

    // Get single asset details
    getAssetById: async (id) => {
        const response = await api.get(`organizations/inventory/${id}/`);
        return response.data;
    }
};
