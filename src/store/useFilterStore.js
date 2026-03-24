import { create } from 'zustand';

export const useFilterStore = create((set) => ({
  selectedOrg: '',
  selectedCoord: '',
  selectedSite: '',
  selectedFloor: '',
  
  selectedStatus: 'all',
  selectedCoordinator: 'all', // Legacy state preserved
  searchTerm: '',
  page: 1,

  // Actions
  setOrg: (orgId) => set({ selectedOrg: orgId, selectedCoord: '', selectedSite: '', selectedFloor: '', page: 1 }),
  setCoord: (coordId) => set({ selectedCoord: coordId, selectedSite: '', selectedFloor: '', page: 1 }),
  setSite: (siteId) => set({ selectedSite: siteId, selectedFloor: '', page: 1 }),
  setFloor: (floorId) => set({ selectedFloor: floorId, page: 1 }),
  
  setStatus: (status) => set({ selectedStatus: status, page: 1 }),
  setSearch: (term) => set({ searchTerm: term, page: 1 }),
  setPage: (page) => set({ page }),

  // Reset all filters but keep pagination base
  resetFilters: () => set({
    selectedOrg: '',
    selectedCoord: '',
    selectedSite: '',
    selectedFloor: '',
    selectedStatus: 'all',
    searchTerm: '',
    page: 1
  })
}));
