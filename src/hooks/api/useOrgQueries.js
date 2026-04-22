import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { organizationService } from '../../services/organizationService';

// Helper to clean mangled Cloudinary URLs (from useOrgStore logic)
// Helper to clean mangled Cloudinary URLs and ensure relative paths are prefixed
const cleanImageUrl = (url) => {
    if (!url || typeof url !== 'string') return url;
    
    // 1. Handle double http (mangled by some stores)
    if (url.includes('http') && url.split('http').length > 2) {
        const parts = url.split('http');
        url = 'http' + parts[parts.length - 1]; 
    }

    // 2. Handle relative paths (e.g. media/organisations/...)
    if (!url.startsWith('http') && !url.startsWith('data:')) {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const cleanPath = url.startsWith('/') ? url : `/${url}`;
        return `${cleanBase}${cleanPath}`;
    }

    return url;
};

// Map Backend data to Frontend format (consistent with useOrgStore)
export const mapOrgToFrontend = (data) => {
  if (!data) return null;
  
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
    name: data.organisation_name || data.site_name || data.name || '',
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
      zones: data.zones_count || 0,
      assets: data.inventory_count || 0,
      coordinators: data.coordinators_count || 0,
      coordinatorNames: data.coordinator_names || []
    }
  };
};

/**
 * ── ORGANIZATION QUERIES ──
 */

export const useOrganizations = (filters = {}, search = '', page = 1, pageSize = 10, options = {}) => {
  // Normalize filters to ensure stable Query Keys
  const cleanFilters = useMemo(() => Object.fromEntries(
    Object.entries(filters).filter(([, v]) => 
        v !== undefined && 
        v !== null && 
        v !== 'all' && 
        v !== '' && 
        !(Array.isArray(v) && v.length === 0)
    )
  ), [filters]);

  return useQuery({
    queryKey: ['organizations', { filters: cleanFilters, search, page, pageSize }],
    queryFn: async ({ signal }) => {
      const response = await organizationService.getOrganizations({ ...cleanFilters, search, page, pageSize }, signal);
      
      // 1. Direct results in response (Handled by service/StandardPagination)
      if (response && response.results) {
        return {
          results: Array.isArray(response.results) ? response.results.map(mapOrgToFrontend) : [],
          count: response.count || 0
        };
      }
      
      // 2. Direct data array (Fallback for non-paginated or error states)
      const data = response?.data || response;
      if (Array.isArray(data)) {
        return {
          results: data.map(mapOrgToFrontend),
          count: data.length
        };
      }

      // 3. Absolute Fallback
      return { results: [], count: 0 };
    },
    staleTime: 10 * 60 * 1000, 
    gcTime: 15 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    ...options
  });
};

export const useOrganizationDetails = (id, options = {}) => {
  return useQuery({
    queryKey: ['organization', id],
    queryFn: async ({ signal }) => {
      const data = await organizationService.getOrganizationById(id, signal);
      return mapOrgToFrontend(data);
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    ...options
  });
};
