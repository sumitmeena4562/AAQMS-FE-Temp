import { create } from 'zustand';

/**
 * FILTER STORE
 * Manages global filtering state for Organizations, Sites, and Inventory.
 */
export const useFilterStore = create((set, get) => ({
  // --- STATE ---
  selectedOrg: [],
  selectedCoord: [],
  selectedSite: [],
  selectedFloor: [],
  selectedStatus: [],
  selectedZone: [],
  selectedCoordinator: 'all', // Legacy state preserved
  searchTerm: '',
  page: 1,

  // --- ACTIONS (with same-value guards to prevent re-render loops) ---
  setOrg: (ids) => {
    const newIds = Array.isArray(ids) ? ids : (typeof ids === 'string' ? ids.split(',').filter(Boolean) : [ids].filter(Boolean));
    if (JSON.stringify(get().selectedOrg) === JSON.stringify(newIds)) return;
    set({ 
      selectedOrg: newIds, 
      selectedCoord: [], 
      selectedSite: [], 
      selectedFloor: [], 
      selectedZone: [],
      page: 1
    });
  },
  
  setCoord: (ids) => {
    const newIds = Array.isArray(ids) ? ids : (typeof ids === 'string' ? ids.split(',').filter(Boolean) : [ids].filter(Boolean));
    if (JSON.stringify(get().selectedCoord) === JSON.stringify(newIds)) return;
    set({ 
      selectedCoord: newIds, 
      selectedSite: [], 
      selectedFloor: [], 
      selectedZone: [],
      page: 1
    });
  },
  
  setSite: (ids) => {
    const newIds = Array.isArray(ids) ? ids : (typeof ids === 'string' ? ids.split(',').filter(Boolean) : [ids].filter(Boolean));
    if (JSON.stringify(get().selectedSite) === JSON.stringify(newIds)) return;
    set({ 
      selectedSite: newIds, 
      selectedFloor: [], 
      selectedZone: [],
      page: 1
    });
  },
  
  setFloor: (ids) => {
    const newIds = Array.isArray(ids) ? ids : (typeof ids === 'string' ? ids.split(',').filter(Boolean) : [ids].filter(Boolean));
    if (JSON.stringify(get().selectedFloor) === JSON.stringify(newIds)) return;
    set({ 
      selectedFloor: newIds, 
      selectedZone: '',
      page: 1
    });
  },
  
  setZone: (ids) => {
    const newIds = Array.isArray(ids) ? ids : (typeof ids === 'string' ? ids.split(',').filter(Boolean) : [ids].filter(Boolean));
    if (JSON.stringify(get().selectedZone) === JSON.stringify(newIds)) return;
    set({ 
      selectedZone: newIds,
      page: 1
    });
  },
  
  setStatus: (ids) => {
    const newIds = Array.isArray(ids) ? ids : (typeof ids === 'string' ? ids.split(',').filter(Boolean) : [ids].filter(Boolean));
    if (JSON.stringify(get().selectedStatus) === JSON.stringify(newIds)) return;
    set({ 
      selectedStatus: newIds,
      page: 1
    });
  },
  
  setSearch: (term) => {
    if (get().searchTerm === term) return;
    set({ 
      searchTerm: term,
      page: 1
    });
  },
  
  setPage: (page) => {
    if (get().page === page) return;
    set({ page });
  },
  
  resetFilters: () => set({
    selectedOrg: [],
    selectedCoord: [],
    selectedSite: [],
    selectedFloor: [],
    selectedZone: [],
    selectedStatus: [],
    searchTerm: '',
    page: 1
  })
}));

export default useFilterStore;
