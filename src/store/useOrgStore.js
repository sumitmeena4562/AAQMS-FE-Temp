import { create } from 'zustand';
import { organizationService } from '../services/organizationService';
import { inventoryService } from '../services/inventoryService';
import toast from 'react-hot-toast';

// Helper to clean mangled Cloudinary URLs (400 Bad Request Fix)
const cleanImageUrl = (url) => {
    if (typeof url !== 'string') return url;
    // Pattern: https://res.cloudinary.com/.../media/https://...
    if (url.includes('http') && url.split('http').length > 2) {
        const parts = url.split('http');
        return 'http' + parts[parts.length - 1]; // Take the last absolute URL part
    }
    return url;
};

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
      const cleanedUrl = cleanImageUrl(img.image_url);

      if (['north', 'south', 'east', 'west', 'profile'].includes(type)) {
        imagery[type] = cleanedUrl;
      } else if (type === 'extra') {
        imagery.extra.push(cleanedUrl);
      }
    });
  }

  const profileImg = imagery.profile || cleanImageUrl(data.image) || '';

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
    plannedSites: data.planned_sites || 0,
    otherInfo: data.description || data.otherInfo || '',
    isBlocked: data.is_blocked || false,
    imagery: { ...imagery, profile: profileImg },
    stats: {
      sites: data.sites_count || 0,
      floors: data.floors_count || 0,
      coordinators: data.coordinators_count || 0,
      coordinatorNames: data.coordinator_names || []
    }
  };
};
/**
 * ORGANIZATION STORE
 * Connects to the real backend via organizationService, with robust error handling and loading states.
 */
export const useOrgStore = create((set, get) => ({
  // --- UI STATE ---
  filters: { industry: 'all', status: 'all' },
  viewMode: 'grid',
  isSubmitting: false,
  error: null,

  // --- UI ACTIONS ---
  setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  setViewMode: (mode) => set({ viewMode: mode }),
  resetFilters: () => set({ filters: { industry: 'all', status: 'all' } }),

  // --- CRUD ACTIONS (MUTATIONS) ---
  addOrg: async (newOrg) => {
    set({ isSubmitting: true, error: null });
    try {
      await organizationService.createOrganization(newOrg);
      set({ isSubmitting: false });
      toast.success("Success! The organization has been added.");
      return true; 
    } catch (err) {
      set({ error: err.message, isSubmitting: false });
      toast.error("Oops! We couldn't add the organization.");
      return false;
    }
  },

  updateOrg: async (id, updatedOrg) => {
    set({ isSubmitting: true, error: null });
    try {
      await organizationService.updateOrganization(id, updatedOrg);
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

