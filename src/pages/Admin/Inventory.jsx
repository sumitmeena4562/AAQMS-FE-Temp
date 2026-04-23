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
import AssetIcon from '../../components/Admin/Inventory/AssetIcon';
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
import AssetInventoryModal from '../../components/Admin/Inventory/AssetInventoryModal';
import EmptyState from '../../components/Admin/Inventory/EmptyState';
import AssetCard from '../../components/Admin/Inventory/AssetCard';
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
    const debouncedSearch = useDebounce(searchQuery, 400);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = useResponsiveLimit(12);

    // ── DATA FETCHING (Unified Super-API for Dropdowns) ──
    const { organizations: orgs, sites: allSites } = useHierarchy({ 
        includeSites: true, 
        includeCoords: false 
    });
    
    // Debounce the entire filter set to prevent "Request Waterfall" and cancellations
    const debouncedOrg = useDebounce(selectedOrg, 400);
    const debouncedSite = useDebounce(selectedSite, 400);
    const debouncedFloor = useDebounce(selectedFloor, 400);
    const debouncedZone = useDebounce(selectedZone, 400);

    const { data: floorData } = useFloors(debouncedSite, { enabled: debouncedSite.length > 0 });
    const allFloors = floorData?.results || [];

    const { data: zoneData } = useZones(debouncedFloor, {}, { enabled: debouncedFloor.length > 0 });
    const allZones = zoneData?.results || [];

    const activeFilters = useMemo(() => ({
        org: debouncedOrg.length > 0 ? debouncedOrg : 'all',
        site: debouncedSite.length > 0 ? debouncedSite : 'all',
        floor: debouncedFloor.length > 0 ? debouncedFloor : 'all',
        zone: debouncedZone.length > 0 ? debouncedZone : 'all',
        search: debouncedSearch
    }), [debouncedOrg, debouncedSite, debouncedFloor, debouncedZone, debouncedSearch]);

    const { data: inventoryData, isLoading } = useInventory(activeFilters, currentPage, PAGE_SIZE);

    const inventory = inventoryData?.results || [];
    const inventoryStats = inventoryData?.stats || null;
    const inventoryTotalCount = inventoryData?.count || 0;

    const [selectedAsset, setSelectedAsset] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('list');

    // Reset to page 1 if page size changes to avoid 'Invalid page' errors
    useEffect(() => {
        setCurrentPage(1);
    }, [PAGE_SIZE]);

    // ── SYNC URL PARAMS → GLOBAL FILTERS (mount-only guard) ──
    useEffect(() => {
        const pOrg = searchParams.get('org_id') || searchParams.get('org');
        const pSite = searchParams.get('site_id') || searchParams.get('site');
        const pFloor = searchParams.get('floor_id') || searchParams.get('floor');
        const pZone = searchParams.get('zone_id') || searchParams.get('zone');
        const pCoord = searchParams.get('coord_id') || searchParams.get('coord');

        if (!pOrg && !pSite && !pFloor && !pZone && !pCoord) {
            resetFilters();
            clearSearch();
        } else {
            if (pOrg) setOrg(pOrg.split(','));
            if (pSite) setSite(pSite.split(','));
            if (pFloor) setFloor(pFloor.split(','));
            if (pZone) setZone(pZone.split(','));
            if (pCoord) setCoord(pCoord.split(','));
        }

        setIsSynced(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const queryClient = useQueryClient();

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // ── BREADCRUMBS ──
    const currentOrg = selectedOrg.length === 1 ? orgs?.find(o => String(o.id) === String(selectedOrg[0])) : null;
    const currentSite = selectedSite.length === 1 ? allSites?.find(s => String(s.id) === String(selectedSite[0])) : null;
    const currentFloor = selectedFloor.length === 1 ? allFloors?.find(f => String(f.id) === String(selectedFloor[0])) : null;
    const currentZone = selectedZone.length === 1 ? allZones?.find(z => String(z.id) === String(selectedZone[0])) : null;

    const breadcrumbs = useMemo(() => {
        const orgLabel = selectedOrg.length > 1 ? `Organizations (${selectedOrg.length})` : currentOrg?.name;
        const siteLabel = selectedSite.length > 1 ? `Sites (${selectedSite.length})` : currentSite?.name;
        const floorLabel = selectedFloor.length > 1 ? `Floors (${selectedFloor.length})` : currentFloor?.name;
        const zoneLabel = selectedZone.length > 1 ? `Zones (${selectedZone.length})` : currentZone?.name;

        const base = [
            { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
            { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
        ];
        if (orgLabel) base.push({ label: orgLabel, path: `/admin/coordinators?org_id=${selectedOrg.join(',')}` });
        if (siteLabel) base.push({ label: siteLabel, path: `/admin/site-plan?site_id=${selectedSite.join(',')}` });
        if (floorLabel) base.push({ label: floorLabel, path: `/admin/floor-plan?floor_id=${selectedFloor.join(',')}` });
        if (zoneLabel) base.push({ label: zoneLabel, path: `/admin/inventory?zone_id=${selectedZone.join(',')}` });

        base.push({ label: "Inventory", path: "#", isActive: true });
        return base;
    }, [currentOrg, currentSite, currentFloor, currentZone, selectedOrg, selectedSite, selectedFloor, selectedZone]);

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
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-card text-title shrink-0 border border-border-main shadow-sm group-hover:border-primary/30 transition-all">
                        <AssetIcon type={row.icon || row.category} className="w-5 h-5 text-title/80" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[14px] font-black text-title leading-tight truncate">{name || row.asset_name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-bold text-gray uppercase tracking-tighter bg-base px-1.5 py-0.5 rounded border border-border-main/50">
                                {row.organisation_name || 'Enterprise'}
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
                        {row.site_name || 'Main Depot'}
                    </span>
                    <span className="text-[10px] font-bold text-gray/60 truncate uppercase tracking-tighter">
                        {row.floor_name || 'L0'} • {row.zone_name || 'General'}
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
                            <span className={`w-1 h-1 rounded-full ${status === 'Verified' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
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

    const displayedInventory = inventory || [];
    const totalPages = Math.ceil(inventoryTotalCount / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-16">
            <PageHeader
                title={currentZone ? `Assets in ${currentZone.name}` : currentFloor ? `Assets on ${currentFloor.name}` : "Inventory Analytics"}
                subtitle={currentOrg ? `Enterprise asset monitoring for ${currentOrg.name}` : "Comprehensive cross-organization asset tracking and AI verification"}
                hideAddButton={true}
                breadcrumbs={breadcrumbs}
            />

            {isLoading && !inventoryStats ? (
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
                    { label: "Assets", value: inventoryStats?.total || 0, icon: FiBox, iconBgClass: "bg-blue-50", iconColorClass: "text-blue-600", description: "System Total" },
                    { label: "Verified", value: inventoryStats?.verified || 0, icon: FiCheckCircle, iconBgClass: "bg-emerald-50", iconColorClass: "text-emerald-600", description: "AI Confirmed" },
                    { label: "Mismatches", value: inventoryStats?.mismatches || 0, icon: FiAlertCircle, iconBgClass: "bg-rose-50", iconColorClass: "text-rose-600", description: "Needs Attention" },
                    { label: "Pending", value: inventoryStats?.pending || 0, icon: FiClock, iconBgClass: "bg-amber-50", iconColorClass: "text-amber-600", description: "In Queue" },
                ]} columns={4} />
            )}

            <div className="flex flex-col w-full gap-4 mt-2">
                <FilterBar className="!p-2.5">
                    <div className="flex flex-wrap items-center gap-2 flex-1">
                        <FilterDropdown label="Organization" options={orgs.map(o => ({ value: o.id, label: o.name }))} value={selectedOrg} onChange={setOrg} allLabel="All Orgs" multiple={true} />
                        <FilterDropdown label="Site" options={allSites.map(s => ({ value: s.id, label: s.name }))} value={selectedSite} onChange={setSite} allLabel="All Sites" multiple={true} disabled={selectedOrg.length === 0} />
                        <FilterDropdown label="Floor" options={allFloors.map(f => ({ value: f.id, label: f.name }))} value={selectedFloor} onChange={setFloor} allLabel="All Floors" multiple={true} disabled={selectedSite.length === 0} />
                        <FilterDropdown label="Zone" options={allZones.map(z => ({ value: z.id, label: z.name }))} value={selectedZone} onChange={setZone} allLabel="All Zones" multiple={true} disabled={selectedFloor.length === 0} />

                        <div className="w-[1.5px] h-6 bg-border-main/40 mx-2" />

                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-base p-1 rounded-lg border border-border-main">
                                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-card text-primary shadow-sm' : 'text-gray/40'}`} title="List View"><FiLayout size={16} /></button>
                                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-card text-primary shadow-sm' : 'text-gray/40'}`} title="Grid View"><FiGrid size={16} /></button>
                            </div>
                        </div>
                    </div>

                    {/* Global search is now handled in the Navbar */}
                </FilterBar>

                {viewMode === 'list' ? (
                    isLoading ? <TableSkeleton rows={10} /> : (
                        <DataTable
                            columns={columns}
                            data={displayedInventory}
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
                        ) : displayedInventory.length > 0 ? (
                            <div className="flex flex-col gap-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                                    {displayedInventory.map(asset => (
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
