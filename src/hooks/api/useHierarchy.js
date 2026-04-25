import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useOrganizations, mapOrgToFrontend, useAllOrganizations } from './useOrgQueries';
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
        includeFloors = false,
        includeZones = false,
        includeCoords = true,
        enabled = true,
        orgId = null
    } = options;

    const { selectedOrg } = useFilterStore();
    const activeOrgs = orgId !== null ? (Array.isArray(orgId) ? orgId : [orgId]) : selectedOrg;

    // 1. Organizations (Top level) - Uses shared cache
    const orgsQuery = useAllOrganizations({ 
        enabled: includeOrgs && enabled 
    });

    // 2. Coordinators (Cascading: only if org is selected)
    const coordsQuery = useCoordinators(
        activeOrgs.length > 0 ? activeOrgs : undefined,
        { enabled: includeCoords && enabled }
    );

    // 3. Sites (Global Fetch for FE Filtering)
    const sitesQuery = useQuery({
        queryKey: ['hierarchy', 'sites', 'all'],
        queryFn: async ({ signal }) => {
            const response = await hierarchyService.getSites({}, signal);
            return response.results || response.data || response || [];
        },
        enabled: includeSites && enabled,
        staleTime: 30 * 60 * 1000,
    });

    // 4. Floors (Global Fetch for FE Filtering)
    const floorsQuery = useQuery({
        queryKey: ['hierarchy', 'floors', 'all'],
        queryFn: async ({ signal }) => {
            const response = await hierarchyService.getFloors(null, { page_size: 1000 }, signal);
            return response.results || response.data || response || [];
        },
        enabled: includeFloors && enabled,
        staleTime: 30 * 60 * 1000,
    });

    // 5. Zones (Global Fetch for FE Filtering)
    const zonesQuery = useQuery({
        queryKey: ['hierarchy', 'zones', 'all'],
        queryFn: async ({ signal }) => {
            const response = await hierarchyService.getZones(null, { page_size: 2000 }, signal);
            return response.results || response.data || response || [];
        },
        enabled: includeZones && enabled,
        staleTime: 30 * 60 * 1000,
    });

    return React.useMemo(() => ({
        // Data
        organizations: Array.isArray(orgsQuery.data) ? orgsQuery.data : EMPTY_ARRAY,
        coordinators: Array.isArray(coordsQuery.data?.results) ? coordsQuery.data.results : (Array.isArray(coordsQuery.data) ? coordsQuery.data : EMPTY_ARRAY),
        sites: Array.isArray(sitesQuery.data) ? sitesQuery.data : EMPTY_ARRAY,
        floors: Array.isArray(floorsQuery.data) ? floorsQuery.data : EMPTY_ARRAY,
        zones: Array.isArray(zonesQuery.data) ? zonesQuery.data : EMPTY_ARRAY,

        // Loading States
        isLoading: (includeOrgs && orgsQuery.isLoading) ||
            (includeCoords && coordsQuery.isLoading) ||
            (includeSites && sitesQuery.isLoading) ||
            (includeFloors && floorsQuery.isLoading) ||
            (includeZones && zonesQuery.isLoading),

        isFetching: (includeOrgs && orgsQuery.isFetching) ||
            (includeCoords && coordsQuery.isFetching) ||
            (includeSites && sitesQuery.isFetching) ||
            (includeFloors && floorsQuery.isFetching) ||
            (includeZones && zonesQuery.isFetching),

        // Error States
        error: orgsQuery.error || coordsQuery.error || sitesQuery.error || floorsQuery.error || zonesQuery.error,

        // Raw Queries
        queries: {
            orgs: orgsQuery,
            coords: coordsQuery,
            sites: sitesQuery,
            floors: floorsQuery,
            zones: zonesQuery
        }
    }), [
        orgsQuery.data, orgsQuery.isLoading, orgsQuery.isFetching, orgsQuery.error,
        coordsQuery.data, coordsQuery.isLoading, coordsQuery.isFetching, coordsQuery.error,
        sitesQuery.data, sitesQuery.isLoading, sitesQuery.isFetching, sitesQuery.error,
        floorsQuery.data, floorsQuery.isLoading, floorsQuery.isFetching, floorsQuery.error,
        zonesQuery.data, zonesQuery.isLoading, zonesQuery.isFetching, zonesQuery.error,
        includeOrgs, includeCoords, includeSites, includeFloors, includeZones
    ]);
};
