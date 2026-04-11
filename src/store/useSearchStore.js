import { create } from 'zustand';

/**
 * GLOBAL SEARCH STORE
 * Manages the search state for the entire Admin Dashboard Navbar.
 */
export const useSearchStore = create((set, get) => ({
  query: '',
  results: { personnel: [], inventory: [], organizations: [], pages: [] },
  isGlobalLoading: false,
  
  setQuery: (newQuery) => {
    if (get().query === newQuery) return;
    set({ query: newQuery });
  },
  
  setResults: (results) => set({ results }),
  setGlobalLoading: (isLoading) => set({ isGlobalLoading: isLoading }),
  
  clearSearch: () => set({ 
    query: '', 
    results: { personnel: [], inventory: [], organizations: [], pages: [] },
    isGlobalLoading: false 
  }),
  
  // Helper to determine if we are searching
  isSearching: () => get().query.trim().length > 0
}));

export default useSearchStore;
