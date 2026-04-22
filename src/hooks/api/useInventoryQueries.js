import { useQuery, useMutation } from '@tanstack/react-query';
import { inventoryService } from '../../services/inventoryService';
import api from '../../services/api';
import { queryClient } from '../../lib/queryClient';
import toast from 'react-hot-toast';

/**
 * ── INVENTORY QUERIES ──
 */

export const useInventory = (filters = {}, page = 1, pageSize = 20) => {
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

  // Map frontend filters to API params
  const params = {
    org_id: Array.isArray(cleanFilters.org) ? cleanFilters.org.join(',') : cleanFilters.org,
    site_id: Array.isArray(cleanFilters.site) ? cleanFilters.site.join(',') : cleanFilters.site,
    floor_id: Array.isArray(cleanFilters.floor) ? cleanFilters.floor.join(',') : cleanFilters.floor,
    zone_id: Array.isArray(cleanFilters.zone) ? cleanFilters.zone.join(',') : cleanFilters.zone,
    category: cleanFilters.type?.length ? cleanFilters.type[0] : undefined,
    search: cleanFilters.search || undefined,
    page: page,
    page_size: pageSize,
  };

  return useQuery({
    queryKey: ['inventory', cleanFilters, page, pageSize],
    queryFn: async () => {
      const response = await inventoryService.getInventory(params);
      return {
        results: response.results || response,
        stats: response.stats || null,
        count: response.count || 0,
      };
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: (prev) => prev,
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
export const useVerifyAsset = () => {
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`organisations/inventory/${id}/verify/`);
      return response.data;
    },
    onSuccess: (data) => {
      // SINGLE-CALL OPTIMIZATION: Update global dashboard counters
      if (data.updated_stats) {
        queryClient.setQueryData(['dashboard', 'summary'], old => {
            if (!old) return old;
            return {
                ...old,
                stats: { ...old.stats, ...data.updated_stats }
            };
        });
      }

      // Update specific asset status in the list cache
      queryClient.setQueriesData({ queryKey: ['inventory'] }, (oldData) => {
        if (!oldData?.results) return oldData;
        return {
          ...oldData,
          results: oldData.results.map(a => String(a.id) === String(data.id) ? { ...a, ...data } : a)
        };
      });

      toast.success("Asset verified successfully");
    }
  });
};
