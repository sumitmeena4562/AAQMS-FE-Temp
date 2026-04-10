import { useQuery } from '@tanstack/react-query';
import { hierarchyService } from '../../services/hierarchyService';

/**
 * ── HIERARCHY QUERIES (SITES, FLOORS, ZONES) ──
 */

export const useSites = (filters = {}) => {
  // Normalize filters to ensure stable Query Keys
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== 'all' && v !== '')
  );

  return useQuery({
    queryKey: ['sites', cleanFilters],
    queryFn: async () => {
      const data = await hierarchyService.getSites(cleanFilters);
      return Array.isArray(data) ? data : (data.results || []);
    },
    // Only fetch if org_id is present in filters, OR if no filters (get all)
    // Actually, in this app, we usually fetch by Org-id for lookups.
    staleTime: 5 * 60 * 1000,
  });
};

export const useFloors = (siteId = null) => {
  return useQuery({
    queryKey: ['floors', siteId],
    queryFn: async () => {
      const data = await hierarchyService.getFloors(siteId);
      return Array.isArray(data) ? data : (data.results || []);
    },
    enabled: !!siteId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useZones = (floorId = null, filters = {}) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== 'all' && v !== '')
  );

  return useQuery({
    queryKey: ['zones', floorId, cleanFilters],
    queryFn: async () => {
      const data = await hierarchyService.getZones(floorId, cleanFilters);
      return Array.isArray(data) ? data : (data?.results || []);
    },
    enabled: !!floorId && floorId !== 'all',
    staleTime: 5 * 60 * 1000,
  });
};
