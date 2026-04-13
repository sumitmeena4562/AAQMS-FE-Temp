import { create } from 'zustand';

/**
 * ── ASSET HIERARCHY STORE ──
 * Manages Sites, Floors, and Zones with real backend integration.
 */
export const useHierarchyStore = create((set) => ({
    // Resetting state (useful on logout or manual refresh)
    clearHierarchy: () => set({})
}));
