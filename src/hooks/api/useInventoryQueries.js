import { useQuery } from '@tanstack/react-query';
import { inventoryService } from '../../services/inventoryService';

/**
 * ── INVENTORY QUERIES ──
 */

export const useInventory = (filters = {}, page = 1) => {
  // Normalize filters to ensure stable Query Keys
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => 
        v !== undefined && 
        v !== null && 
        v !== 'all' && 
        v !== '' && 
        !(Array.isArray(v) && v.length === 0)
    )
  );

  // Map frontend filters to API params
  const params = {
    org_id: cleanFilters.org,
    site_id: cleanFilters.site,
    floor_id: cleanFilters.floor,
    zone_id: cleanFilters.zone,
    category: cleanFilters.type?.length ? cleanFilters.type[0] : undefined,
    search: cleanFilters.search || undefined,
    page: page,
    page_size: 20,
  };

  return useQuery({
    queryKey: ['inventory', cleanFilters, page],
    queryFn: async () => {
      const response = await inventoryService.getInventory(params);
      return {
        results: response.results || response,
        stats: response.stats || null,
        count: response.count || 0,
      };
    },
    staleTime: 30 * 1000, 
  });
};

export const useAssetDetails = (id) => {
  return useQuery({
    queryKey: ['asset', id],
    queryFn: () => inventoryService.getAssetById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};
