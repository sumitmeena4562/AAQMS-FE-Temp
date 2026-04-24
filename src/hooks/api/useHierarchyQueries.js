import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hierarchyService } from '../../services/hierarchyService';
import { mapOrgToFrontend } from './useOrgQueries';

/**
 * ── HIERARCHY QUERIES (SITES, FLOORS, ZONES) ──
 */

export const useSites = (filters = {}, options = {}) => {
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
    queryKey: ['sites', JSON.stringify(cleanFilters)],
    queryFn: async ({ signal }) => {
      const response = await hierarchyService.getSites(cleanFilters, signal);
      
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
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    placeholderData: (prev) => prev,
    ...options
  });
};

export const useFloors = (siteId = null, params = {}, options = {}) => {
  // Ensure we don't pass React Query options as backend params
  const { enabled, staleTime, gcTime, ...backendParams } = params;
  const actualParams = Object.keys(backendParams).length > 0 ? backendParams : params;

  return useQuery({
    queryKey: ['floors', Array.isArray(siteId) ? siteId.join(',') : siteId, JSON.stringify(actualParams)],
    queryFn: async ({ signal }) => {
      const response = await hierarchyService.getFloors(siteId, actualParams, signal);
      
      const results = response.results || (Array.isArray(response) ? response : (response.data || []));
      const count = response.count || (Array.isArray(response) ? response.length : 0);

      return {
          results: Array.isArray(results) ? results : [],
          total: count
      };
    },
    ...options
  });
};

export const useZones = (floorId = null, filters = {}, options = {}) => {
  const cleanFilters = useMemo(() => Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== 'all' && v !== '')
  ), [filters]);

  return useQuery({
    queryKey: ['zones', Array.isArray(floorId) ? floorId.join(',') : floorId, JSON.stringify(cleanFilters)],
    queryFn: async ({ signal }) => {
      const response = await hierarchyService.getZones(floorId, cleanFilters, signal);
      
      const results = response.results || (Array.isArray(response) ? response : (response.data || []));
      const count = response.count || (Array.isArray(response) ? response.length : 0);

      return {
          results: Array.isArray(results) ? results : [],
          total: count
      };
    },
    staleTime: 5 * 60 * 1000, // Zones are slightly more dynamic
    gcTime: 30 * 60 * 1000,
    placeholderData: (prev) => prev,
    ...options
  });
};
