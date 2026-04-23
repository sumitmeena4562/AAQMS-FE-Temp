import { create } from 'zustand';
import { organizationService } from '../services/organizationService';
import { mapOrgToFrontend } from '../hooks/api/useOrgQueries';
import toast from 'react-hot-toast';
import { queryClient } from '../lib/queryClient.js';




export const useOrgStore = create((set) => ({
  filters: { industry: [], status: [] },
  viewMode: 'grid',
  isSubmitting: false,
  error: null,
  setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  setViewMode: (mode) => set({ viewMode: mode }),
  resetFilters: () => set({ filters: { industry: [], status: [] } }),

  addOrg: async (newOrg) => {
    set({ isSubmitting: true, error: null });
    try {
      await organizationService.createOrganization(newOrg);
      await queryClient.invalidateQueries(['organizations']);

      set({ isSubmitting: false });
      toast.success("Success! The organization has been added.");
      return true; 
    } catch (err) {
      set({ error: err.message, isSubmitting: false });
      toast.error("Oops! We couldn't add the organization.");
      return false;
    }
  },

  blockOrg: async (id) => {
    set({ isSubmitting: true, error: null });
    try {
      await organizationService.blockOrganization(id);
      await queryClient.invalidateQueries(['organizations']);

      set({ isSubmitting: false });
      toast.success("Organization state updated.");
      return true;
    } catch (err) {
      set({ error: err.message, isSubmitting: false });
      toast.error("Failed to update organization state.");
      return false;
    }
  },

  updateOrg: async (id, updatedOrg) => {
    set({ isSubmitting: true, error: null });
    try {
      const raw = await organizationService.updateOrganization(id, updatedOrg);
      const updated = mapOrgToFrontend(raw);

      // Update only the specific org in all list queries (no refetch)
      queryClient.setQueriesData({ queryKey: ['organizations'], exact: false }, (old) => {
        if (!old?.results) return old;
        return {
          ...old,
          results: old.results.map((o) => (o.id === id ? { ...o, ...updated } : o))
        };
      });

      // Update the single org detail cache if it exists
      queryClient.setQueryData(['organization', id], (old) =>
        old ? { ...old, ...updated } : old
      );

      set({ isSubmitting: false });
      toast.success("Changes saved successfully!");
      return true;
    } catch (err) {
      set({ error: err.message, isSubmitting: false });
      toast.error("We couldn't save your changes.");
      return false;
    }
  },

  removeOrg: async (id) => {
    set({ isSubmitting: true, error: null });
    try {
      await organizationService.deleteOrganization(id);
      await queryClient.invalidateQueries(['organizations']);

      set({ isSubmitting: false });
      toast.success("Organization deleted successfully.");
      return true;
    } catch (err) {
      set({ error: err.message, isSubmitting: false });
      toast.error("Could not delete organization.");
      return false;
    }
  },
}));
