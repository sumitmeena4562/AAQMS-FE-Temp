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
    // Support for array of org IDs
    const coordsQuery = useCoordinators(selectedOrg.length > 0 ? selectedOrg : undefined);

    // 3. Sites (Cascading: only if org is selected)
    const sitesQuery = useSites({ 
        organisation: selectedOrg.length > 0 ? selectedOrg : undefined 
    });

    return {
        // Data
        organizations: orgsQuery.data || [],
        coordinators: coordsQuery.data || [],
        sites: sitesQuery.data?.results || [],
        
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
