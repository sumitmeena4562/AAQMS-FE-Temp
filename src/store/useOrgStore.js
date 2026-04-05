import { create } from 'zustand';
import { organizationService } from '../services/organizationService';
import { inventoryService } from '../services/inventoryService';
import toast from 'react-hot-toast';

// Helper to map Backend data to Frontend format globally
const mapOrgToFrontend = (data) => {
  if (!data) return null;
  
  // Map imagery array back to form object
  const imagery = {
    north: '', south: '', east: '', west: '', profile: '', extra: []
  };
  
  if (Array.isArray(data.images)) {
    data.images.forEach(img => {
      const type = (img.image_type || '').toLowerCase();
      if (['north', 'south', 'east', 'west', 'profile'].includes(type)) {
        imagery[type] = img.image_url;
      } else if (type === 'extra') {
        imagery.extra.push(img.image_url);
      }
    });
  }

  return {
    ...data,
    name: data.organisation_name || data.name || '',
    industry: data.industry_type || data.industry || 'General',
    occupancyType: data.occupancy_type || data.occupancyType || '',
    classification: data.classification || '',
    contactPerson: data.contact_person_name || data.contactPerson || '',
    contactEmail: data.contact_email || data.contactEmail || '',
    contactPhone: data.contact_phone || data.contactPhone || '',
    address: data.address || '',
    city: data.city || '',
    state: data.state || '',
    country: data.country || '',
    otherInfo: data.description || data.otherInfo || '',
    imagery: imagery.profile ? imagery : { ...imagery, profile: data.image || '' }
  };
};
/**
 * ORGANIZATION STORE
 * Connects to the real backend via organizationService, with robust error handling and loading states.
 */
export const useOrgStore = create((set, get) => ({
  // --- STATE ---
  orgs: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  inventory: [],
  inventoryStats: null,
  filters: { industry: 'all', status: 'all' },
  viewMode: 'grid',

  // --- UI ACTIONS ---
  setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  setViewMode: (mode) => set({ viewMode: mode }),
  resetFilters: () => set({ filters: { industry: 'all', status: 'all' } }),

  // --- ACTIONS ---
  fetchOrgs: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await organizationService.getOrganizations(filters);
      // Backend should return a list or { results: [] }
      const data = response.data || response.results || response;
      const mappedOrgs = Array.isArray(data) ? data.map(mapOrgToFrontend) : [];
      set({ orgs: mappedOrgs, isLoading: false });
    } catch (err) {
      set({ 
        error: "We couldn't load the organizations. Please refresh the page.", 
        orgs: [], 
        isLoading: false 
      });
      console.error("Organization fetch failed:", err);
    }
  },

  addOrg: async (newOrg) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await organizationService.createOrganization(newOrg);
      const data = mapOrgToFrontend(response.data || response);
      set((state) => ({ orgs: [...state.orgs, data], isSubmitting: false }));
      toast.success("Success! The organization has been added.");
      return true; 
    } catch (err) {
      set({ error: err.message, isSubmitting: false });
      toast.error("Oops! We couldn't add the organization. Please check the details.");
      return false;
    }
  },

  updateOrg: async (id, updatedOrg) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await organizationService.updateOrganization(id, updatedOrg);
      const data = mapOrgToFrontend(response.data || response);
      set((state) => ({
        orgs: state.orgs.map(org => org.id === id ? { ...org, ...data } : org),
        isSubmitting: false
      }));
      toast.success("Changes saved successfully!");
      return true;
    } catch (err) {
      set({ error: err.message, isSubmitting: false });
      toast.error("We couldn't save your changes. Please try again.");
      return false;
    }
  },

  removeOrg: async (id) => {
    set({ isSubmitting: true, error: null });
    try {
      await organizationService.deleteOrganization(id);
      set((state) => ({
        orgs: state.orgs.filter(org => org.id !== id),
        isSubmitting: false
      }));
      toast.success("Organization deleted successfully.");
    } catch (err) {
      set({ error: err.message, isSubmitting: false });
      toast.error("Could not delete organization. Please try again.");
    }
  },

  // --- INVENTORY ACTIONS ---
  fetchInventory: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      // Map frontend filters to backend API params
      const params = {
        organisation: filters.org !== 'all' ? filters.org : undefined,
        site: filters.site !== 'all' ? filters.site : undefined,
        floor: filters.floor !== 'all' ? filters.floor : undefined,
        zone: filters.zone !== 'all' ? filters.zone : undefined,
        category: filters.type?.length ? filters.type[0] : undefined, 
        search: filters.search || undefined
      };
      
      const response = await inventoryService.getInventory(params);
      set({ 
        inventory: response.results || response, 
        isLoading: false 
      });
    } catch (err) {
      const msg = err.message || "Failed to fetch inventory";
      set({ error: msg, isLoading: false, inventory: [] });
      toast.error(msg);
      console.error("Inventory fetch failed:", err);
    }
  },

  fetchInventoryStats: async (filters = {}) => {
    try {
      const params = {
        organisation: filters.org !== 'all' ? filters.org : undefined,
        site: filters.site !== 'all' ? filters.site : undefined,
        floor: filters.floor !== 'all' ? filters.floor : undefined,
        zone: filters.zone !== 'all' ? filters.zone : undefined
      };
      const data = await inventoryService.getInventoryStats(params);
      set({ inventoryStats: data });
    } catch (err) {
      set({ inventoryStats: null });
      console.warn("Inventory stats fetch failed:", err);
    }
  }
}));

