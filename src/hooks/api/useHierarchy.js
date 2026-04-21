import React from 'react';
import { useOrganizations } from './useOrgQueries';
import { useSites } from './useHierarchyQueries';
import { useCoordinators } from './useUserQueries';
import { useFilterStore } from '../../store/useFilterStore';

const EMPTY_ARRAY = [];

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

    return React.useMemo(() => ({
        // Data
        organizations: orgsQuery.data || EMPTY_ARRAY,
        coordinators: coordsQuery.data || EMPTY_ARRAY,
        sites: sitesQuery.data?.results || EMPTY_ARRAY,
        
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
    }), [
        orgsQuery.data, orgsQuery.isLoading, orgsQuery.isFetching, orgsQuery.error,
        coordsQuery.data, coordsQuery.isLoading, coordsQuery.isFetching, coordsQuery.error,
        sitesQuery.data, sitesQuery.isLoading, sitesQuery.isFetching, sitesQuery.error,
        includeOrgs, includeCoords, includeSites
    ]);
};
