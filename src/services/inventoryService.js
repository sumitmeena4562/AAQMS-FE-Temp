import api from './api';

/**
 * ── INVENTORY API SERVICE ──
 * 
 * Minimalist service to handle production-grade inventory data and stats.
 */
export const inventoryService = {
    // Get all inventory items (with optional filters)
    getInventory: async (params = {}) => {
        const response = await api.get('organization/inventory/', { params });
        return response.data;
    },

    // Get inventory analytics stats
    getInventoryStats: async (params = {}) => {
        const response = await api.get('organization/inventory/stats/', { params });
        return response.data;
    },

    // Get single asset details
    getAssetById: async (id) => {
        const response = await api.get(`organization/inventory/${id}/`);
        return response.data;
    }
};
