import { create } from 'zustand';
import { hierarchyService } from '../services/hierarchyService';
import toast from 'react-hot-toast';

/**
 * ── ASSET HIERARCHY STORE ──
 * Manages Sites, Floors, and Zones with real backend integration.
 */
export const useHierarchyStore = create((set, get) => ({
    sites: [],
    floors: [],
    zones: [],
    loading: false,
    error: null,
    allSites: [], // Lookup list for FilterBar
    allFloors: [], // Lookup list for FilterBar

    // --- SITES ---
    fetchSites: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const data = await hierarchyService.getSites(filters);
            // Backend returns list of sites
            const sites = Array.isArray(data) ? data : (data.results || []);
            set({ sites, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false, sites: [] });
            console.error("Failed to fetch sites:", err);
        }
    },
    
    // --- LOOKUPS FOR FILTERBAR ---
    fetchLookupSites: async (orgId = null) => {
        try {
            const data = await hierarchyService.getSites({ organisation: orgId });
            const sites = Array.isArray(data) ? data : (data.results || []);
            set({ allSites: sites });
        } catch (err) {
            console.error("FilterBar Site Fetch Failed", err);
        }
    },

    fetchLookupFloors: async (siteId = null) => {
        if (!siteId) {
            set({ allFloors: [] });
            return;
        }
        try {
            const data = await hierarchyService.getFloors(siteId);
            const floors = Array.isArray(data) ? data : (data.results || []);
            set({ allFloors: floors });
        } catch (err) {
            console.error("FilterBar Floor Fetch Failed", err);
        }
    },

    // --- FLOORS ---
    fetchFloors: async (siteId = null) => {
        set({ loading: true, error: null });
        try {
            const data = await hierarchyService.getFloors(siteId);
            const floors = Array.isArray(data) ? data : (data.results || []);
            set({ floors, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false, floors: [] });
            console.error("Failed to fetch floors:", err);
        }
    },

    // --- ZONES ---
    fetchZones: async (floorId = null, filters = {}) => {
        set({ loading: true, error: null });
        try {
            const data = await hierarchyService.getZones(floorId, filters);
            const zones = Array.isArray(data) ? data : (data?.results || []);
            set({ zones, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false, zones: [] });
            console.error("Failed to fetch zones:", err);
        }
    },

    // --- RESET ---
    clearHierarchy: () => set({ sites: [], floors: [], zones: [], error: null })
}));
