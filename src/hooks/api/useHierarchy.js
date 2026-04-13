import { useOrganizations } from './useOrgQueries';
import { useSites } from './useHierarchyQueries';
import { useCoordinators } from './useUserQueries';
import { useFilterStore } from '../../store/useFilterStore';

/**
 * ── UNIFIED HIERARCHY HOOK ──
 * This hook acts as a single point of truth for Organizations, Sites, and Coordinators.
 * It ensures that these entities are fetched with consistent query keys across the entire app,
 * preventing redundant API calls seen in the network tab.
 * 
 * @param {Object} options - { includeOrgs, includeSites, includeCoords }
 */
export const useHierarchy = (options = {}) => {
    const { 
        includeOrgs = true, 
        includeSites = true, 
        includeCoords = true 
    } = options;

    const { selectedOrg } = useFilterStore();

    // 1. Organizations (Top level)
    const orgsQuery = useOrganizations({}, '', { enabled: includeOrgs });

    // 2. Coordinators (Cascading: only if org is selected)
    const coordsQuery = useCoordinators(
        selectedOrg.length > 0 ? selectedOrg : undefined, 
        { enabled: includeCoords }
    );

    // 3. Sites (Cascading: only if org is selected)
    const sitesQuery = useSites(
        { organisation: selectedOrg.length > 0 ? selectedOrg : undefined },
        { enabled: includeSites }
    );

    return {
        // Data
        organizations: orgsQuery.data || [],
        coordinators: coordsQuery.data || [],
        sites: sitesQuery.data?.results || [],
        
        // Loading States
        isLoading: (includeOrgs && orgsQuery.isLoading) || 
                   (includeCoords && coordsQuery.isLoading) || 
                   (includeSites && sitesQuery.isLoading),
                   
        isFetching: (includeOrgs && orgsQuery.isFetching) || 
                    (includeCoords && coordsQuery.isFetching) || 
                    (includeSites && sitesQuery.isFetching),
        
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
