import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import { StatsRow } from '../../components/Dashboard/StatsCard';
import DataTable from '../../components/UI/DataTable';
import Badge from '../../components/UI/Badge';
import {
    FiHome, FiBriefcase, FiBox, FiCheckCircle,
    FiAlertCircle, FiClock, FiGrid,
    FiMonitor, FiLayout, FiRefreshCcw,
} from 'react-icons/fi';
import AssetIcon from '../../components/Admin/inventory/AssetIcon';
import Button from '../../components/UI/Button';
import FilterBar from '../../components/UI/FilterBar';
import FilterDropdown from '../../components/UI/FilterDropdown';
import TableSkeleton from '../../components/UI/TableSkeleton';
import CardSkeleton from '../../components/UI/CardSkeleton';
import { useQueryClient } from '@tanstack/react-query';
import { inventoryService } from '../../services/inventoryService';


import { useFilterStore } from '../../store/useFilterStore';
import { useHierarchy } from '../../hooks/api/useHierarchy';
import { useFloors, useZones } from '../../hooks/api/useHierarchyQueries';
import { useInventory } from '../../hooks/api/useInventoryQueries';
import AssetInventoryModal from '../../components/Admin/inventory/AssetInventoryModal';
import EmptyState from '../../components/Admin/inventory/EmptyState';
import AssetCard from '../../components/Admin/inventory/AssetCard';
import useSearchStore from '../../store/useSearchStore';
import useDebounce from '../../hooks/useDebounce';
import { useResponsiveLimit } from '../../hooks/useWindowSize';
import Pagination from '../../components/UI/Pagination';
import { DESIGN_TOKENS } from '../../constants/designTokens';



const Inventory = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isSynced, setIsSynced] = useState(false);

    const {
        selectedOrg, selectedSite, selectedFloor, selectedZone,
        setOrg, setCoord, setSite, setFloor, setZone, resetFilters
    } = useFilterStore();

    // ── LOCAL STATE ──
    const { query: searchQuery, clearSearch } = useSearchStore();
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = useResponsiveLimit(12);

    // ── DEFENSIVE HELPERS ──
    const getID = useCallback((obj) => {
        if (!obj) return null;
        if (typeof obj === 'string' || typeof obj === 'number') return String(obj);
        return String(obj.id || obj.pk || obj.organisation_id || obj.site_id || obj.floor_id || obj.zone_id || '');
    }, []);

    // ── DATA FETCHING (Zero-Latency Pattern) ──
    const { 
        organizations: orgs, 
        sites: allSites,
        floors: allFloors,
        zones: allZones
    } = useHierarchy({ 
        includeSites: true, 
        includeFloors: true, 
        includeZones: true,
        includeCoords: false 
    });

    // ── DATA FETCHING (Full FE Filtering Pattern) ──
    // We fetch a large batch once to enable instant local filtering
    const { data: inventoryData, isLoading } = useInventory({}, 1, 5000, { enabled: isSynced });

    // ── FRONTEND FILTERING HELPERS (Robust matching) ──
    const selectedOrgLabels = useMemo(() => {
        if (!selectedOrg.length || !orgs) return [];
        return orgs.filter(o => selectedOrg.some(id => String(id) === getID(o))).map(o => o.name?.toLowerCase().trim());
    }, [selectedOrg, orgs, getID]);

    const selectedSiteLabels = useMemo(() => {
        if (!selectedSite.length || !allSites) return [];
        return allSites.filter(s => selectedSite.some(id => String(id) === getID(s))).map(s => s.name?.toLowerCase().trim());
    }, [selectedSite, allSites, getID]);

    const selectedFloorLabels = useMemo(() => {
        if (!selectedFloor.length || !allFloors) return [];
        return allFloors.filter(f => selectedFloor.some(id => String(id) === getID(f))).map(f => f.name?.toLowerCase().trim());
    }, [selectedFloor, allFloors, getID]);

    const selectedZoneLabels = useMemo(() => {
        if (!selectedZone.length || !allZones) return [];
        return allZones.filter(z => selectedZone.some(id => String(id) === getID(z))).map(z => z.name?.toLowerCase().trim());
    }, [selectedZone, allZones, getID]);

    // ── COMPREHENSIVE FRONTEND FILTERING (ZERO-LATENCY) ──
    const displayedInventory = useMemo(() => {
        let list = inventoryData?.results || [];
        
        return list.filter(a => {
            // 1. Organization Match
            const orgId = getID(a.organisation_id || a.org_id || a.organisation);
            const orgName = (a.organisation_name || a.org_name || a.organisation?.name || '').toLowerCase().trim();
            const matchesOrg = selectedOrg.length === 0 || selectedOrg.includes(orgId) || selectedOrgLabels.includes(orgName);

            // 2. Site Match
            const siteId = getID(a.site_id || a.site);
            const siteName = (a.site_name || a.site?.name || '').toLowerCase().trim();
            const matchesSite = selectedSite.length === 0 || selectedSite.includes(siteId) || selectedSiteLabels.includes(siteName);

            // 3. Floor Match
            const floorId = getID(a.floor_id || a.floor);
            const floorName = (a.floor_name || a.floor?.name || '').toLowerCase().trim();
            const matchesFloor = selectedFloor.length === 0 || selectedFloor.includes(floorId) || selectedFloorLabels.includes(floorName);

            // 4. Zone Match
            const zoneId = getID(a.zone_id || a.zone);
            const zoneName = (a.zone_name || a.zone?.name || '').toLowerCase().trim();
            const matchesZone = selectedZone.length === 0 || selectedZone.includes(zoneId) || selectedZoneLabels.includes(zoneName);

            // 5. Search Match
            const term = searchQuery.toLowerCase().trim();
            const matchesSearch = !term || 
                (a.asset_name || '').toLowerCase().includes(term) ||
                (a.unique_id || '').toLowerCase().includes(term) ||
                (a.category || '').toLowerCase().includes(term) ||
                orgName.includes(term) ||
                siteName.includes(term);

            return matchesOrg && matchesSite && matchesFloor && matchesZone && matchesSearch;
        });
    }, [inventoryData, selectedOrg, selectedSite, selectedFloor, selectedZone, searchQuery, getID, selectedOrgLabels, selectedSiteLabels, selectedFloorLabels, selectedZoneLabels]);

    const localStats = useMemo(() => {
        return {
            total: displayedInventory.length,
            verified: displayedInventory.filter(a => a.status === 'Verified').length,
            mismatches: displayedInventory.filter(a => a.status === 'Mismatch').length,
            pending: displayedInventory.filter(a => a.status === 'Pending' || !a.status).length
        };
    }, [displayedInventory]);

    const inventoryTotalCount = displayedInventory.length;
    const totalPages = Math.ceil(inventoryTotalCount / PAGE_SIZE);

    // Slice for local pagination
    const paginatedInventory = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return displayedInventory.slice(start, start + PAGE_SIZE);
    }, [displayedInventory, currentPage, PAGE_SIZE]);

    const [selectedAsset, setSelectedAsset] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('list');

    // Reset to page 1 if page size changes to avoid 'Invalid page' errors
    useEffect(() => {
        setCurrentPage(1);
    }, [PAGE_SIZE]);

    // ── SYNC GLOBAL FILTERS → URL PARAMS ──
    useEffect(() => {
        if (!isSynced) return;
        
        const params = new URLSearchParams();
        if (selectedOrg.length > 0) params.set('org_id', selectedOrg.join(','));
        if (selectedSite.length > 0) params.set('site_id', selectedSite.join(','));
        if (selectedFloor.length > 0) params.set('floor_id', selectedFloor.join(','));
        if (selectedZone.length > 0) params.set('zone_id', selectedZone.join(','));
        if (searchQuery) params.set('search', searchQuery);

        setSearchParams(params, { replace: true });
    }, [selectedOrg, selectedSite, selectedFloor, selectedZone, searchQuery, isSynced]);

    // ── SYNC URL PARAMS → GLOBAL FILTERS (mount-only guard) ──
    useEffect(() => {
        const pOrg = searchParams.get('org_id') || searchParams.get('org');
        const pSite = searchParams.get('site_id') || searchParams.get('site');
        const pFloor = searchParams.get('floor_id') || searchParams.get('floor');
        const pZone = searchParams.get('zone_id') || searchParams.get('zone');
        const pSearch = searchParams.get('search') || searchParams.get('q');

        if (pOrg) setOrg(pOrg.split(','));
        if (pSite) setSite(pSite.split(','));
        if (pFloor) setFloor(pFloor.split(','));
        if (pZone) setZone(pZone.split(','));
        
        setIsSynced(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Reset to page 1 if filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedOrg, selectedSite, selectedFloor, selectedZone, searchQuery, PAGE_SIZE]);

    const queryClient = useQueryClient();

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // ── BREADCRUMBS ──
    const currentOrg = selectedOrg.length === 1 ? (orgs || []).find(o => getID(o) === String(selectedOrg[0])) : null;
    const currentSite = selectedSite.length === 1 ? (allSites || []).find(s => getID(s) === String(selectedSite[0])) : null;
    const currentFloor = selectedFloor.length === 1 ? (allFloors || []).find(f => getID(f) === String(selectedFloor[0])) : null;
    const currentZone = selectedZone.length === 1 ? (allZones || []).find(z => getID(z) === String(selectedZone[0])) : null;

    const breadcrumbs = useMemo(() => {
        const orgLabel = selectedOrg.length > 1 ? `Organizations (${selectedOrg.length})` : currentOrg?.name;
        const siteLabel = selectedSite.length > 1 ? `Sites (${selectedSite.length})` : currentSite?.name;
        const floorLabel = selectedFloor.length > 1 ? `Floors (${selectedFloor.length})` : currentFloor?.name;
        const zoneLabel = selectedZone.length > 1 ? `Zones (${selectedZone.length})` : currentZone?.name;

        const base = [
            { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
            { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
        ];
        if (orgLabel) base.push({ label: orgLabel, path: `/admin/inventory?org_id=${selectedOrg.join(',')}` });
        if (siteLabel) base.push({ label: siteLabel, path: `/admin/inventory?site_id=${selectedSite.join(',')}` });
        if (floorLabel) base.push({ label: floorLabel, path: `/admin/inventory?floor_id=${selectedFloor.join(',')}` });
        if (zoneLabel) base.push({ label: zoneLabel, path: `/admin/inventory?zone_id=${selectedZone.join(',')}` });

        base.push({ label: "Inventory", path: "#", isActive: true });
        return base;
    }, [currentOrg, currentSite, currentFloor, currentZone, selectedOrg, selectedSite, selectedFloor, selectedZone, getID]);

    // ── HANDLERS ──
    const handleReset = () => {
        resetFilters();
        setSearchParams({}, { replace: true });
        clearSearch();
        setCurrentPage(1);
    };

    const handleAssetClick = (asset) => {
        setSelectedAsset(asset);
        setIsModalOpen(true);
    };

    const columns = useMemo(() => [
        {
            header: 'ASSET NAME', accessor: 'name', width: '24%',
            render: (name, row) => (
                <div className="flex items-center gap-3.5 py-1.5 pr-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-card text-title shrink-0 border border-border-main shadow-sm group-hover:border-primary/30 transition-all overflow-hidden">
                        {row.media?.[0]?.media_url ? (
                            <img src={row.media[0].media_url} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <AssetIcon type={row.icon || row.category} className="w-5 h-5 text-title/80" />
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[14px] font-black text-title leading-tight truncate">{name || row.asset_name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] font-bold text-gray uppercase tracking-tighter bg-base px-1.5 py-0.5 rounded border border-border-main/50">
                            {row.organisation_name || (orgs || []).find(o => getID(o) === getID(row.organisation))?.name || 'Enterprise'}
                        </span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'UNIQUE ID', accessor: 'unique_id', width: '14%',
            render: (id) => (
                <span className="px-2.5 py-1 bg-base border border-border-main/60 rounded-md text-[10px] font-black text-gray/80 tracking-widest font-mono uppercase">
                    {id || 'N/A'}
                </span>
            )
        },
        {
            header: 'LOCATION', accessor: 'location', width: '18%',
            render: (_, row) => (
                <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-black text-title truncate tracking-tight uppercase leading-none mb-1">
                        {row.site_name || (allSites || []).find(s => getID(s) === getID(row.site))?.name || 'Main Site'}
                    </span>
                    <span className="text-[10px] font-bold text-gray/60 truncate uppercase tracking-tighter">
                        {row.floor_name || (allFloors || []).find(f => getID(f) === getID(row.floor))?.name || 'Floor'} • {row.zone_name || (allZones || []).find(z => getID(z) === getID(row.zone))?.name || 'Zone'}
                    </span>
                </div>
            )
        },
        {
            header: 'AI STATUS', accessor: 'status', width: '14%', align: 'center',
            render: (status) => {
                const color = status === 'Verified' ? 'success' : status === 'Mismatch' ? 'danger' : 'warning';
                return (
                    <div className="flex justify-center">
                        <Badge variant="light" color={color} className="text-[9px] px-3 py-1.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1.5">
                            <span className={`w-1 h-1 rounded-full ${status === 'Verified' ? 'bg-emerald-500' : status === 'Mismatch' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                            {status || 'Pending'}
                        </Badge>
                    </div>
                );
            }
        },
        {
            header: 'ACTIONS', accessor: 'id', width: '10%', align: 'right',
            render: (_, row) => (
                <div className="flex justify-end pr-2">
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleAssetClick(row); }}
                        className="h-7 px-3 text-[10px] font-black uppercase tracking-widest text-primary border-primary/20 hover:bg-primary/5"
                    >
                        VIEW
                    </Button>
                </div>
            )
        }
    ], []);

    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-16">
            <PageHeader
                title={currentZone ? `Assets in ${currentZone.name}` : currentFloor ? `Assets on ${currentFloor.name}` : "Inventory Analytics"}
                subtitle={currentOrg ? `Enterprise asset monitoring for ${currentOrg.name}` : "Comprehensive cross-organization asset tracking and AI verification"}
                hideAddButton={true}
                breadcrumbs={breadcrumbs}
                rightContent={
                    <div className="flex items-center gap-3">
                         {inventoryTotalCount > 0 && <span className="text-[10px] font-black text-gray uppercase tracking-widest bg-base/50 px-3 py-1.5 rounded-lg border border-border-main/50">{inventoryTotalCount} Asset{inventoryTotalCount !== 1 ? 's' : ''}</span>}
                    </div>
                }
            />

            {isLoading && inventoryTotalCount === 0 ? (
                <div className="grid grid-cols-4 gap-4 w-full h-[108px]">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-card rounded-2xl border border-border-main p-4 flex flex-col gap-2 relative overflow-hidden">
                            <div className="w-8 h-8 bg-base rounded-lg animate-pulse" />
                            <div className="h-4 w-20 bg-base rounded animate-pulse" />
                            <div className="absolute right-4 top-4 h-6 w-10 bg-base rounded-md animate-pulse" />
                        </div>
                    ))}
                </div>
            ) : (
                <StatsRow items={[
                    { label: "Assets", value: localStats.total, icon: FiBox, iconBgClass: "bg-blue-50", iconColorClass: "text-blue-600", description: "Filtered Total" },
                    { label: "Verified", value: localStats.verified, icon: FiCheckCircle, iconBgClass: "bg-emerald-50", iconColorClass: "text-emerald-600", description: "AI Confirmed" },
                    { label: "Mismatches", value: localStats.mismatches, icon: FiAlertCircle, iconBgClass: "bg-rose-50", iconColorClass: "text-rose-600", description: "Needs Attention" },
                    { label: "Pending", value: localStats.pending, icon: FiClock, iconBgClass: "bg-amber-50", iconColorClass: "text-amber-600", description: "In Queue" },
                ]} columns={4} />
            )}

            <div className="flex flex-col w-full gap-4 mt-2">
                <FilterBar 
                    activeLevel="inventory" 
                    showSearch={false} 
                    externalFloors={allFloors}
                    externalZones={allZones}
                >
                    <FilterBar.Separator />
                    <FilterBar.ViewToggle mode={viewMode} onChange={setViewMode} />
                </FilterBar>

                {viewMode === 'list' ? (
                    isLoading ? <TableSkeleton rows={10} /> : (
                        <DataTable
                            columns={columns}
                            data={paginatedInventory}
                            loading={isLoading}
                            onRowClick={handleAssetClick}
                            emptyMessage={<EmptyState onReset={handleReset} />}
                            footer={
                                <Pagination 
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    totalItems={inventoryTotalCount}
                                    itemsPerPage={PAGE_SIZE}
                                    variant="ghost"
                                />
                            }
                        />
                    )
                ) : (
                    <div className="flex flex-col gap-6">
                        {isLoading ? (
                            <CardSkeleton count={8} columns={4} />
                        ) : paginatedInventory.length > 0 ? (
                            <div className="flex flex-col gap-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                                    {paginatedInventory.map(asset => (
                                        <AssetCard 
                                            key={asset.id} 
                                            asset={asset} 
                                            onClick={handleAssetClick} 
                                        />
                                    ))}
                                </div>
                                <Pagination 
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    totalItems={inventoryTotalCount}
                                    itemsPerPage={PAGE_SIZE}
                                />
                            </div>
                        ) : (
                            <EmptyState onReset={handleReset} />
                        )}
                    </div>
                )}
            </div>

            <AssetInventoryModal asset={selectedAsset} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Inventory;
