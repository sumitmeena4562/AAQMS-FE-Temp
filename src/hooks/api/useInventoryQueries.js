import { useQuery } from '@tanstack/react-query';
import { inventoryService } from '../../services/inventoryService';

/**
 * ── INVENTORY QUERIES ──
 */

export const useInventory = (filters = {}, page = 1) => {
  // Map frontend filters to API params (consistent with useOrgStore logic)
  const params = {
    organisation: filters.org !== 'all' ? filters.org : undefined,
    site: filters.site !== 'all' ? filters.site : undefined,
    floor: filters.floor !== 'all' ? filters.floor : undefined,
    zone: filters.zone !== 'all' ? filters.zone : undefined,
    category: filters.type?.length ? filters.type[0] : undefined,
    search: filters.search || undefined,
    page: page,
    page_size: 20,
  };

  return useQuery({
    queryKey: ['inventory', params],
    queryFn: async () => {
      const response = await inventoryService.getInventory(params);
      return {
        results: response.results || response,
        stats: response.stats || null,
        count: response.count || 0,
      };
    },
    // We can set a shorter staleTime for inventory if it's highly dynamic
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
