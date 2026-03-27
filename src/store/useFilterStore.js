import { create } from 'zustand';

/**
 * FILTER STORE
 * Manages global filtering state for Organizations, Sites, and Inventory.
 */
export const useFilterStore = create((set) => ({
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

  // --- ACTIONS ---
  setOrg: (id) => set({ 
    selectedOrg: id, 
    selectedCoord: '', 
    selectedSite: '', 
    selectedFloor: '', 
    selectedZone: '',
    page: 1
  }),
  
  setCoord: (id) => set({ 
    selectedCoord: id, 
    selectedSite: '', 
    selectedFloor: '', 
    selectedZone: '',
    page: 1
  }),
  
  setSite: (id) => set({ 
    selectedSite: id, 
    selectedFloor: '', 
    selectedZone: '',
    page: 1
  }),
  
  setFloor: (id) => set({ 
    selectedFloor: id, 
    selectedZone: '',
    page: 1
  }),
  
  setZone: (id) => set({ 
    selectedZone: id,
    page: 1
  }),
  
  setStatus: (status) => set({ 
    selectedStatus: status,
    page: 1
  }),
  
  setSearch: (term) => set({ 
    searchTerm: term,
    page: 1
  }),
  
  setPage: (page) => set({ page }),
  
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
