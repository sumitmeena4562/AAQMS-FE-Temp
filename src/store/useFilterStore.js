import { create } from 'zustand';

/**
 * FILTER STORE
 * Manages global filtering state for Organizations, Sites, and Inventory.
 */
export const useFilterStore = create((set, get) => ({
  // --- STATE ---
  selectedOrg: '',
  selectedCoord: '',
  selectedSite: '',
  selectedFloor: '',
  selectedZone: '',
  selectedStatus: 'all',
  selectedCoordinator: 'all', // Legacy state preserved
  searchTerm: '',
  page: 1,

  // --- ACTIONS (with same-value guards to prevent re-render loops) ---
  setOrg: (id) => {
    if (get().selectedOrg === id) return;
    set({ 
      selectedOrg: id, 
      selectedCoord: '', 
      selectedSite: '', 
      selectedFloor: '', 
      selectedZone: '',
      page: 1
    });
  },
  
  setCoord: (id) => {
    if (get().selectedCoord === id) return;
    set({ 
      selectedCoord: id, 
      selectedSite: '', 
      selectedFloor: '', 
      selectedZone: '',
      page: 1
    });
  },
  
  setSite: (id) => {
    if (get().selectedSite === id) return;
    set({ 
      selectedSite: id, 
      selectedFloor: '', 
      selectedZone: '',
      page: 1
    });
  },
  
  setFloor: (id) => {
    if (get().selectedFloor === id) return;
    set({ 
      selectedFloor: id, 
      selectedZone: '',
      page: 1
    });
  },
  
  setZone: (id) => {
    if (get().selectedZone === id) return;
    set({ 
      selectedZone: id,
      page: 1
    });
  },
  
  setStatus: (status) => {
    if (get().selectedStatus === status) return;
    set({ 
      selectedStatus: status,
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
    selectedOrg: '',
    selectedCoord: '',
    selectedSite: '',
    selectedFloor: '',
    selectedZone: '',
    selectedStatus: 'all',
    searchTerm: '',
    page: 1
  })
}));

export default useFilterStore;
