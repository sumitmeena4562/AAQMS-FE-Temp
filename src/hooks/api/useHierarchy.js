import { useOrganizations } from './useOrgQueries';
import { useSites } from './useHierarchyQueries';
import { useCoordinators } from './useUserQueries';
import { useFilterStore } from '../../store/useFilterStore';

/**
 * ── UNIFIED HIERARCHY HOOK ──
 * This hook acts as a single point of truth for Organizations, Sites, and Coordinators.
 * It ensures that these entities are fetched with consistent query keys across the entire app,
 * preventing redundant API calls seen in the network tab.
 */
export const useHierarchy = () => {
    const { selectedOrg, selectedCoord, selectedSite } = useFilterStore();

    // 1. Organizations (Top level - always fetched once and cached)
    const orgsQuery = useOrganizations();

    // 2. Coordinators (Cascading: only if org is selected)
    // We use a stable key structure to ensure FilterBar and Pages share the same cache.
    const coordsQuery = useCoordinators(selectedOrg);

    // 3. Sites (Cascading: only if org is selected)
    // IMPORTANT: We standardize the filters object to ensure key stability.
    const sitesQuery = useSites({ 
        organisation: selectedOrg || undefined 
    });

    return {
        // Data
        organizations: orgsQuery.data || [],
        coordinators: coordsQuery.data || [],
        sites: sitesQuery.data || [],
        
        // Loading States
        isLoading: orgsQuery.isLoading || coordsQuery.isLoading || sitesQuery.isLoading,
        isFetching: orgsQuery.isFetching || coordsQuery.isFetching || sitesQuery.isFetching,
        
        // Error States
        error: orgsQuery.error || coordsQuery.error || sitesQuery.error,
        
        // Raw Queries (for more control if needed)
        queries: {
            orgs: orgsQuery,
            coords: coordsQuery,
            sites: sitesQuery
        }
    };
};
