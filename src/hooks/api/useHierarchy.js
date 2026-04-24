import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useOrganizations, mapOrgToFrontend } from './useOrgQueries';
import { useSites } from './useHierarchyQueries';
import { useCoordinators } from './useUserQueries';
import { useFilterStore } from '../../store/useFilterStore';
import { organizationService } from '../../services/organizationService';
import { hierarchyService } from '../../services/hierarchyService';

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
        includeCoords = true,
        enabled = true,
        orgId = null
    } = options;

    const { selectedOrg } = useFilterStore();
    const activeOrgs = orgId !== null ? (Array.isArray(orgId) ? orgId : [orgId]) : selectedOrg;

    // 1. Organizations (Top level)
    const orgsQuery = useQuery({
        queryKey: ['hierarchy', 'orgs'],
        queryFn: async ({ signal }) => {
            const response = await organizationService.getOrganizations({ dropdown: 'true', page: 1, pageSize: 1000 }, signal);
            return (response.results || response.data || response).map(mapOrgToFrontend) || [];
        },
        enabled: includeOrgs && enabled,
        staleTime: 30 * 60 * 1000, // 30 mins
    });

    // 2. Coordinators (Cascading: only if org is selected)
    const coordsQuery = useCoordinators(
        activeOrgs.length > 0 ? activeOrgs : undefined,
        { enabled: includeCoords && enabled }
    );

    // 3. Sites (Cascading: only if org is selected)
    const sitesQuery = useQuery({
        queryKey: ['hierarchy', 'sites', activeOrgs],
        queryFn: async ({ signal }) => {
            const siteFilters = { organisation: activeOrgs.length > 0 ? activeOrgs : undefined };
            const response = await hierarchyService.getSites(siteFilters, signal);
            return response.results || response.data || response || [];
        },
        enabled: includeSites && enabled,
        staleTime: 30 * 60 * 1000,
    });

    return React.useMemo(() => ({
        // Data
        organizations: orgsQuery.data?.results || (Array.isArray(orgsQuery.data) ? orgsQuery.data : EMPTY_ARRAY),
        coordinators: coordsQuery.data?.results || (Array.isArray(coordsQuery.data) ? coordsQuery.data : EMPTY_ARRAY),
        sites: sitesQuery.data?.results || (Array.isArray(sitesQuery.data) ? sitesQuery.data : EMPTY_ARRAY),

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
