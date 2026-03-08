import { create } from 'zustand';

export const useUIStore = create((set) => ({
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
}));
