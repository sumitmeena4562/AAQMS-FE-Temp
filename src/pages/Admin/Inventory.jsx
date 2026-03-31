import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import { StatsRow } from '../../components/Dashboard/StatsCard';
import DataTable from '../../components/UI/DataTable';
import Badge from '../../components/UI/Badge';
import {
    FiHome, FiBriefcase, FiBox, FiCheckCircle,
    FiAlertCircle, FiClock, FiExternalLink, FiGrid,
    FiMonitor, FiLayout, FiRefreshCcw, FiPrinter,
    FiCpu, FiHardDrive, FiSmartphone, FiTablet,
    FiZap, FiMousePointer, FiMaximize2
} from 'react-icons/fi';
// import { generateGlobalInventory } from '../../utils/mockSiteData';
import Button from '../../components/UI/Button';
import FilterBar from '../../components/UI/FilterBar';
import FilterDropdown from '../../components/UI/FilterDropdown';

import { useOrgStore } from '../../store/useOrgStore';
import AssetInventoryModal from '../../components/Admin/Inventory/AssetInventoryModal';
import EmptyState from '../../components/Admin/Inventory/EmptyState';
import AssetCard from '../../components/Admin/Inventory/AssetCard';

const ASSET_ICONS = {
    chair: FiGrid,
    furniture: FiGrid,
    monitor: FiMonitor,
    display: FiMonitor,
    screen: FiMonitor,
    peripheral: FiCpu,
    network: FiLayout,
    router: FiLayout,
    switch: FiLayout,
    printer: FiPrinter,
    scanner: FiPrinter,
    copier: FiPrinter,
    safety: FiBox,
    server: FiHardDrive,
    storage: FiHardDrive,
    mobile: FiSmartphone,
    phone: FiSmartphone,
    tablet: FiTablet,
    laptop: FiMonitor,
    cpu: FiCpu,
    ups: FiZap,
    system: FiCpu,
    keyboard: FiMousePointer,
    mouse: FiMousePointer,
    box: FiBox
};

export const AssetIcon = ({ type, className = "" }) => {
    const Icon = ASSET_ICONS[type?.toLowerCase()] || ASSET_ICONS.box;
    return <Icon className={className} />;
};

const Inventory = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { 
        orgs, inventory, inventoryStats, isLoading,
        fetchInventory, fetchInventoryStats 
    } = useOrgStore();

    // Modal State
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    

    // Initial data load: Use real inventory from store
    const initialData = inventory || [];

    // Filter State
    const [filters, setFilters] = useState({
        org: 'all',
        site: 'all',
        floor: 'all',
        zone: 'all',
        type: [],
        status: []
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

    // Handle URL Parameters (Initial Load)
    useEffect(() => {
        const siteParam = searchParams.get('site');
        const zoneParam = searchParams.get('zone');
        const orgParam = searchParams.get('org');
        const floorParam = searchParams.get('floor');
        const typeParam = searchParams.get('type');
        const statusParam = searchParams.get('status');

        if (siteParam || zoneParam || orgParam || floorParam || typeParam || statusParam) {
            setFilters(prev => ({
                ...prev,
                site: siteParam || prev.site,
                zone: zoneParam || prev.zone,
                org: orgParam || prev.org,
                floor: floorParam || prev.floor,
                type: typeParam ? typeParam.split(',') : prev.type,
                status: statusParam ? statusParam.split(',') : prev.status
            }));
        }
    }, [searchParams]);



    // Dropdown Options - Enhanced Hierarchical Filtering
    const orgOptions = useMemo(() => orgs.map(o => ({ value: o.name, label: o.name })), [orgs]);

    const siteOptions = useMemo(() => {
        const relevantData = initialData.filter(i => !filters.org || filters.org === 'all' || i.org === filters.org);
        const sites = [...new Set(relevantData.map(i => i.site).filter(Boolean))];
        return sites.map(s => ({ value: s, label: s }));
    }, [initialData, filters.org]);

    const floorOptions = useMemo(() => {
        const relevantData = initialData.filter(i =>
            (!filters.org || filters.org === 'all' || i.org === filters.org) &&
            (!filters.site || filters.site === 'all' || i.site === filters.site)
        );
        const floors = [...new Set(relevantData.map(i => i.floor).filter(Boolean))];
        return floors.map(f => ({ value: f, label: f }));
    }, [initialData, filters.org, filters.site]);

    const zoneOptions = useMemo(() => {
        const relevantData = initialData.filter(i =>
            (!filters.org || filters.org === 'all' || i.org === filters.org) &&
            (!filters.site || filters.site === 'all' || i.site === filters.site) &&
            (!filters.floor || filters.floor === 'all' || i.floor === filters.floor)
        );
        const zonesList = [...new Set(relevantData.map(i => i.zone).filter(Boolean))];
        return zonesList.map(z => ({ value: z, label: z }));
    }, [initialData, filters.org, filters.site, filters.floor]);

    const typeOptions = useMemo(() => {
        const types = [...new Set(initialData.map(i => i.type).filter(Boolean))];
        return types.map(t => ({ value: t, label: t }));
    }, [initialData]);

    const statusOptions = useMemo(() => {
        const statuses = [...new Set(initialData.map(i => i.status).filter(Boolean))];
        return statuses.map(s => ({ value: s, label: s }));
    }, [initialData]);

    // ═══════════════════════════════════════════════════════════════
    //  Fetch Data (Production Grade: Server-Side Sync)
    // ═══════════════════════════════════════════════════════════════
    useEffect(() => {
        // Fetch stats always (filtered by org/site/floor/zone)
        fetchInventoryStats(filters);
        
        // Fetch inventory (Server-side filtering & search)
        const fetchTimeout = setTimeout(() => {
            fetchInventory({
                ...filters,
                search: searchQuery
            });
        }, 300); // Debounce search

        return () => clearTimeout(fetchTimeout);
    }, [filters, searchQuery, fetchInventory, fetchInventoryStats]);

    // Derived Data for Display
    const displayedInventory = inventory || []; 

    // Handle Quick Filter Reset
    const handleReset = () => {
        setFilters({ org: 'all', site: 'all', floor: 'all', zone: 'all', type: [], status: [] });
        setSearchQuery("");
    };

    // ═══════════════════════════════════════════════════════════════
    //  UI Helpers — Skeletons for Production Polish
    // ═══════════════════════════════════════════════════════════════
    const StatsSkeleton = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-card px-6 py-5 rounded-[var(--radius-card)] border border-border-main animate-pulse h-[148px]">
                    <div className="h-2 w-16 bg-slate-200/50 rounded mb-4" />
                    <div className="h-6 w-24 bg-slate-200/50 rounded mb-4" />
                    <div className="h-[1.5px] w-full bg-slate-100 my-4" />
                    <div className="h-2 w-full bg-slate-100 rounded" />
                </div>
            ))}
        </div>
    );

    const handleRowStyle = (row) => {
        if (row.status === 'Mismatch') return 'bg-rose-50/30';
        if (row.status === 'Pending') return 'bg-amber-50/30';
        return '';
    };

    const handleAssetClick = (asset) => {
        setSelectedAsset(asset);
        setIsModalOpen(true);
    };


    const columns = useMemo(() => [
        {
            header: 'ASSET NAME',
            accessor: 'name',
            width: '24%',
            render: (name, row) => (
                <div className="flex items-center gap-3.5 py-1.5 pr-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-card text-title shrink-0 border border-border-main shadow-sm">
                        <AssetIcon type={row.icon} className="w-5 h-5 text-title/80" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[14px] font-black text-title leading-tight truncate">{name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-bold text-gray uppercase tracking-tighter bg-base px-1 rounded">{row.org}</span>
                            <span className="text-[10px] font-medium text-gray/60 truncate">• {row.model}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'UNIQUE ID',
            accessor: 'uniqueId',
            width: '14%',
            render: (id) => (
                <span className="px-2.5 py-1 bg-base border border-border-main/60 rounded-md text-[11px] font-black text-gray/80 tracking-wide font-mono uppercase">
                    {id}
                </span>
            )
        },
        {
            header: 'LOCATION',
            accessor: 'zoneId',
            width: '14%',
            render: (_, row) => (
                <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-black text-title truncate tracking-tight">{row.site || 'Main Depot'}</span>
                    <span className="text-[10px] font-bold text-gray/80 mt-0.5 truncate uppercase tracking-tighter">
                        {row.floor} • {row.zone}
                    </span>
                </div>
            )
        },
        {
            header: 'QR CODE',
            accessor: 'qr',
            width: '8%',
            align: 'center',
            render: () => (
                <div className="flex justify-center w-full text-gray/40 hover:text-title transition-colors cursor-pointer border border-transparent hover:border-border-main p-1 rounded-md" title="View QR Code">
                    <FiMaximize2 size={18} />
                </div>
            )
        },
        {
            header: 'AI STATUS',
            accessor: 'status',
            width: '14%',
            align: 'center',
            render: (status) => {
                const color = status === 'Verified' ? 'success' : status === 'Mismatch' ? 'danger' : 'warning';
                return (
                    <div className="flex justify-center">
                        <Badge
                            variant="light"
                            color={color}
                            className="text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${status === 'Verified' ? 'bg-emerald-500' : status === 'Mismatch' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                            {status}
                        </Badge>
                    </div>
                );
            }
        },
        {
            header: 'LAST AUDIT',
            accessor: 'lastAudit',
            width: '16%',
            render: (date, row) => (
                <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-bold text-title truncate tracking-tight">{date}</span>
                    <span className="text-[11px] font-medium text-gray mt-0.5 truncate italic">By {row.auditor}</span>
                </div>
            )
        },
        {
            header: 'ACTIONS',
            accessor: 'id',
            width: '10%',
            align: 'right',
            render: (_, row) => (
                <div className="flex justify-end pr-2">
                    <Button
                        variant="outline"
                        icon={FiExternalLink}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAssetClick(row);
                        }}
                        className="h-7 px-3 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 border-rose-200"
                    >
                        VIEW
                    </Button>
                </div>
            )
        }
    ], []);

    // Pagination State (Controlled by Server params in next phase, local for now)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, searchQuery]);

    const totalPages = Math.ceil(displayedInventory.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-16">
            <PageHeader
                title="Inventory Analytics"
                subtitle={filters.org !== 'all' ? `Managing assets for ${filters.org}` : "Enterprise-wide asset monitoring and AI detection"}
                hideAddButton={true}
                breadcrumbs={[
                    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
                    { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
                    { label: "Inventory", path: "#", isActive: true }
                ]}
            />

            {isLoading && !inventoryStats ? <StatsSkeleton /> : (
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
                        <FilterDropdown
                            label="Organization"
                            options={orgOptions}
                            value={filters.org}
                            onChange={(v) => setFilters(prev => ({ ...prev, org: v, site: 'all', floor: 'all', zone: 'all' }))}
                            allLabel="All Org"
                        />

                        <FilterDropdown
                            label="Site"
                            options={siteOptions}
                            value={filters.site}
                            onChange={(v) => setFilters(prev => ({ ...prev, site: v, floor: 'all', zone: 'all' }))}
                            allLabel="All Sites"
                        />

                        <FilterDropdown
                            label="Floor"
                            options={floorOptions}
                            value={filters.floor}
                            onChange={(v) => setFilters(prev => ({ ...prev, floor: v, zone: 'all' }))}
                            allLabel="All Floors"
                        />

                        <FilterDropdown
                            label="Zone"
                            options={zoneOptions}
                            value={filters.zone}
                            onChange={(v) => setFilters(prev => ({ ...prev, zone: v }))}
                            allLabel="All Zones"
                        />

                        <Separator />

                        <FilterDropdown
                            label="Type"
                            options={typeOptions}
                            value={filters.type}
                            onChange={(v) => setFilters(prev => ({ ...prev, type: v }))}
                            allLabel="All Types"
                            multiple={true}
                        />

                        <FilterDropdown
                            label="Status"
                            options={statusOptions}
                            value={filters.status}
                            onChange={(v) => setFilters(prev => ({ ...prev, status: v }))}
                            allLabel="All Statuses"
                            multiple={true}
                        />
                    </div>

                    <div className="flex items-center gap-2 shrink-0 border-l border-border-main/40 pl-3 ml-auto">
                        <div className="flex items-center bg-base p-1 rounded-lg border border-border-main mr-2">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-card text-primary shadow-sm ring-1 ring-border-main' : 'text-gray/40 hover:text-title'}`}
                                title="List View"
                            >
                                <FiLayout size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-card text-primary shadow-sm ring-1 ring-border-main' : 'text-gray/40 hover:text-title'}`}
                                title="Grid View"
                            >
                                <FiGrid size={16} />
                            </button>
                        </div>

                        {(filters.org !== 'all' || filters.site !== 'all' || filters.floor !== 'all' || filters.zone !== 'all' || filters.type.length > 0 || filters.status.length > 0 || searchQuery !== '') && (
                            <button
                                onClick={handleReset}
                                className="h-8 flex items-center gap-1.5 px-3 text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase tracking-widest transition-all rounded-lg bg-rose-50/50 shadow-sm border border-rose-100"
                            >
                                <FiRefreshCcw size={12} />
                                Reset
                            </button>
                        )}
                    </div>
                </FilterBar>

                {viewMode === 'list' ? (
                    <DataTable
                        columns={columns}
                        data={displayedInventory}
                        loading={isLoading}
                        onRowClick={handleAssetClick}
                        rowClassName={handleRowStyle}
                        emptyMessage={<EmptyState onReset={handleReset} />}
                        footer={
                            <div className="flex items-center justify-between w-full px-1">
                                <span className="text-[11px] font-bold text-gray tracking-tight">
                                    Showing <span className="text-title font-bold">{displayedInventory.length > 0 ? startIndex + 1 : 0} to {startIndex + displayedInventory.length}</span> of <span className="text-title font-bold">{displayedInventory.length}</span> results
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className={`!h-8 !px-3 !text-[10px] !font-black !uppercase !tracking-widest ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className={`!h-8 !px-4 !text-[10px] !font-black !uppercase !tracking-widest ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        }
                    />
                ) : (
                    <div className="flex flex-col gap-6">
                        {displayedInventory.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-5">
                                {displayedInventory.map(asset => (
                                    <AssetCard
                                        key={asset.id}
                                        asset={asset}
                                        onClick={handleAssetClick}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState onReset={handleReset} />
                        )}

                        {/* Grid Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between bg-card p-4 rounded-2xl border border-border-main shadow-sm">
                                <span className="text-[11px] font-bold text-gray tracking-tight">
                                    Showing <span className="text-title font-bold">{startIndex + 1} to {startIndex + displayedInventory.length}</span> of <span className="text-title font-bold">{displayedInventory.length}</span> results
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="!h-9 !px-4 !text-[11px]"
                                    >
                                        Previous
                                    </Button>
                                    <div className="flex items-center gap-1 px-2 font-black text-[11px] text-title bg-base h-9 rounded-lg border border-border-main">
                                        {currentPage} / {totalPages}
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="!h-9 !px-4 !text-[11px]"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Unified Asset Modal */}
            <AssetInventoryModal
                asset={selectedAsset}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

const Separator = FilterBar.Separator;

export default Inventory;
