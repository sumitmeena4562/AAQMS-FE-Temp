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
  searchTerm: '',

  // --- ACTIONS ---
  setOrg: (id) => set({ 
    selectedOrg: id, 
    selectedCoord: '', 
    selectedSite: '', 
    selectedFloor: '', 
    selectedZone: '' 
  }),
  
  setCoord: (id) => set({ 
    selectedCoord: id, 
    selectedSite: '', 
    selectedFloor: '', 
    selectedZone: '' 
  }),
  
  setSite: (id) => set({ 
    selectedSite: id, 
    selectedFloor: '', 
    selectedZone: '' 
  }),
  
  setFloor: (id) => set({ 
    selectedFloor: id, 
    selectedZone: '' 
  }),
  
  setZone: (id) => set({ 
    selectedZone: id 
  }),
  
  setStatus: (status) => set({ 
    selectedStatus: status 
  }),
  
  setSearch: (term) => set({ 
    searchTerm: term 
  }),
  
  resetFilters: () => set({
    selectedOrg: '',
    selectedCoord: '',
    selectedSite: '',
    selectedFloor: '',
    selectedZone: '',
    selectedStatus: 'all',
    searchTerm: ''
  })
}));

export default useFilterStore;
