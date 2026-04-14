import { useQuery } from '@tanstack/react-query';
import { hierarchyService } from '../../services/hierarchyService';
import { mapOrgToFrontend } from './useOrgQueries';

/**
 * ── HIERARCHY QUERIES (SITES, FLOORS, ZONES) ──
 */

export const useSites = (filters = {}, options = {}) => {
  // Normalize filters to ensure stable Query Keys
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => 
        v !== undefined && 
        v !== null && 
        v !== 'all' && 
        v !== '' && 
        !(Array.isArray(v) && v.length === 0)
    )
  );

  return useQuery({
    queryKey: ['sites', cleanFilters],
    queryFn: async () => {
      const response = await hierarchyService.getSites(cleanFilters);
      
      // Standardize response handling for pagination
      const results = response.results || (Array.isArray(response) ? response : (response.data || []));
      const count = response.count || (Array.isArray(response) ? response.length : 0);
      
      return {
          results: Array.isArray(results) ? results.map(mapOrgToFrontend) : [],
          total: count
      };
    },
    // Only fetch if org_id is present in filters, OR if no filters (get all)
    // Actually, in this app, we usually fetch by Org-id for lookups.
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useFloors = (siteId = null, options = {}) => {
  return useQuery({
    queryKey: ['floors', siteId],
    queryFn: async () => {
      const response = await hierarchyService.getFloors(siteId);
      
      const results = response.results || (Array.isArray(response) ? response : (response.data || []));
      const count = response.count || (Array.isArray(response) ? response.length : 0);

      return {
          results: Array.isArray(results) ? results : [],
          total: count
      };
    },
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useZones = (floorId = null, filters = {}, options = {}) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== 'all' && v !== '')
  );

  return useQuery({
    queryKey: ['zones', floorId, cleanFilters],
    queryFn: async () => {
      const response = await hierarchyService.getZones(floorId, cleanFilters);
      
      const results = response.results || (Array.isArray(response) ? response : (response.data || []));
      const count = response.count || (Array.isArray(response) ? response.length : 0);

      return {
          results: Array.isArray(results) ? results : [],
          total: count
      };
    },
    staleTime: 5 * 60 * 1000, 
    ...options
  });
};
