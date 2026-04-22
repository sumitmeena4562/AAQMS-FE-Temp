import api from './api';

/**
 * ── UNIFIED DATA SERVICE ──
 * Implements 'Single Page, Single Call' architecture.
 */
export const unifiedService = {
    /**
     * Fetches consolidated data for a page (Hierarchy + Stats + Table Data).
     * @param {string} pageType - 'inventory' or 'floorplan'
     * @param {Object} params - Filters, pagination, etc.
     */
    getPageSummary: async (pageType, params = {}, signal = null) => {
        const response = await api.get('organisations/unified-summary/', { 
            params: { ...params, page_type: pageType }, 
            signal 
        });
        return response.data;
    }
};
