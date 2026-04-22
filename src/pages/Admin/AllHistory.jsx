import React, { useState, useMemo } from 'react';
import { FiHome, FiClock, FiBox, FiRefreshCcw } from 'react-icons/fi';
import PageHeader from '../../components/UI/PageHeader';
import FilterDropdown from '../../components/UI/FilterDropdown';
import FilterBar from '../../components/UI/FilterBar';
import DataTable from '../../components/UI/DataTable';
import Button from '../../components/UI/Button';
import { useAllHistory } from '../../hooks/api/useDashboardQueries';
import { useHierarchy } from '../../hooks/api/useHierarchy';
import { useSites, useFloors } from '../../hooks/api/useHierarchyQueries';
import TableSkeleton from '../../components/UI/TableSkeleton';
import { mapToActivityFeed } from '../../utils/dashboardCalculations';

// STATIC DATA

// Roles are static — never change at runtime, no API call needed
const USER_ROLES = [
    { value: 'admin', label: 'Admin' },
    { value: 'coordinator', label: 'Coordinator' },
    { value: 'field_officer', label: 'Field Officer' },
];
const OPERATION_TYPES = [
    { value: 'CREATE', label: 'Create / Add' },
    { value: 'UPDATE', label: 'Update / Edit' },
    { value: 'DELETE', label: 'Delete / Remove' },
    { value: 'BLOCK', label: 'Block / Suspend' },
    { value: 'BULK_UPDATE', label: 'Bulk Action' }
];

const EVENT_CATEGORIES = [
    { value: 'USER', label: 'User Activity' },
    { value: 'ORGANISATION', label: 'Organization Logs' },
    { value: 'SITE', label: 'Site / Infra Activity' },
    { value: 'INVENTORY', label: 'Inventory Logs' },
    { value: 'REPORT', label: 'Audit Reports' }
];

export default function AllHistory() {
    // ── 1. Local Filter + Pagination State ──
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        organisation: [],
        site: [],
        floor: [],
        role: [],
        operation: [],
        category: []
    });

    // ── 2. DATA FETCHING (Restored Granular Hooks) ──
    const { organizations: orgs } = useHierarchy({ includeSites: false, includeCoords: false });
    
    const siteQueryParams = useMemo(() => ({ organisation: filters.organisation }), [filters.organisation]);
    const { data: siteData } = useSites(siteQueryParams, { 
        enabled: filters.organisation.length > 0 
    });
    const allSites = siteData?.results || [];

    const { data: floorData } = useFloors(filters.site, { 
        enabled: filters.site.length > 0 
    });
    const allFloors = floorData?.results || [];

    const queryParams = useMemo(() => ({
        org_id: filters.organisation,
        site_id: filters.site,
        floor: filters.floor,
        role: filters.role,
        operation: filters.operation,
        category: filters.category,
        page: currentPage,
        limit: 10
    }), [filters, currentPage]);

    const { data: historyData, isLoading } = useAllHistory(queryParams);

    // ── 3. Derived Data ──
    // Map backend results to frontend activity feed format
    const activityList = useMemo(() => 
        mapToActivityFeed(historyData?.results || []), 
    [historyData?.results]);
    
    const totalCount = historyData?.count || 0;
    const totalPages = Math.ceil(totalCount / 10);

    // ── 4. State Management Actions ──
    const updateFilter = (key, val) => {
        const newFilters = { ...filters, [key]: Array.isArray(val) ? val : [val].filter(Boolean) };
        if (key === 'organisation') { newFilters.site = []; newFilters.floor = []; }
        else if (key === 'site') { newFilters.floor = []; }
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setFilters({
            organisation: [],
            site: [],
            floor: [],
            role: [],
            operation: [],
            category: []
        });
        setCurrentPage(1);
    };
    const columns = useMemo(() => [
        {
            header: 'Operation',
            accessor: 'type',
            render: (_, row) => {
                const Icon = row.icon;
                return (
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-black/5 ${row.iconBgClass} ${row.iconTextClass}`}>
                            {Icon && <Icon size={14} />}
                        </div>
                        <span className="text-[13px] font-bold text-title whitespace-nowrap tracking-tight">
                            {row.type}
                        </span>
                    </div>
                );
            },
        },
        {
            header: 'Context',
            accessor: 'user',
            render: (_, row) => (
                <div className="flex flex-col min-w-[140px]">
                    <span className="text-[13px] text-title font-bold leading-none">{row.user}</span>
                    <span className="text-[11px] text-gray font-medium mt-1 uppercase tracking-wider">{row.entity}</span>
                </div>
            ),
        },
        {
            header: 'Audit Details',
            accessor: 'details',
            render: (value) => (
                <span className="text-[13px] text-body/80 font-medium min-w-[250px] max-w-[500px] break-words line-clamp-2">
                    {value}
                </span>
            ),
        },
        {
            header: 'Timestamp',
            accessor: 'time',
            render: (value, row) => (
                <div className="flex items-center gap-2.5 whitespace-nowrap">
                    <div className={`w-1.5 h-1.5 rounded-full ${row.statusVariant === 'danger' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' :
                            row.statusVariant === 'warning' ? 'bg-orange-500' :
                                row.statusVariant === 'success' ? 'bg-emerald-500' : 'bg-primary'
                        }`} />
                    <span className="text-[13px] text-gray font-bold tracking-tight">{value}</span>
                </div>
            ),
        },
    ], []);

    return (
        <div className="flex flex-col gap-6 w-full pb-10 animate-in fade-in duration-500">
            <PageHeader
                title="Audit History"
                subtitle="Centralized ledger of all system security and operational events"
                breadcrumbs={[
                    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
                    { label: "History", path: "/admin/history", isActive: true }
                ]}
                rightContent={
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end px-4 border-r border-border-main/50 translate-y-[2px]">
                            <span className="text-[9px] font-black text-gray uppercase tracking-widest opacity-60 leading-none mb-1">Status</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-[11px] font-bold text-title uppercase">Live Sync</span>
                            </div>
                        </div>
                        <Button onClick={resetFilters} variant="outline" size="sm" className="!h-[38px] bg-card flex items-center gap-2 px-4 border-dashed border-primary/30 hover:border-primary/60 transition-all">
                            <FiRefreshCcw size={14} className={isLoading ? 'animate-spin' : ''} />
                            <span className="font-black text-[10px] uppercase tracking-widest text-primary">Reset Filter</span>
                        </Button>
                    </div>
                }
            />

            <FilterBar className="!p-2.5">
                <div className="flex flex-wrap items-center gap-2 flex-1 pl-1">
                    <FilterDropdown
                        label="Organization"
                        options={orgs.map(o => ({ value: o.id, label: o.name }))}
                        value={filters.organisation}
                        onChange={v => updateFilter('organisation', v)}
                        allLabel="All Organizations"
                        multiple={true}
                    />

                    <FilterDropdown
                        label="Action Type"
                        options={OPERATION_TYPES}
                        value={filters.operation}
                        onChange={v => updateFilter('operation', v)}
                        allLabel="All Actions"
                        multiple={true}
                    />

                    <FilterDropdown
                        label="Category"
                        options={EVENT_CATEGORIES}
                        value={filters.category}
                        onChange={v => updateFilter('category', v)}
                        allLabel="All Categories"
                        multiple={true}
                    />

                    <FilterDropdown
                        label="Role"
                        options={USER_ROLES}
                        value={filters.role}
                        onChange={v => updateFilter('role', v)}
                        allLabel="All Roles"
                        multiple={true}
                    />

                    <FilterDropdown
                        label="Site"
                        options={allSites.map(s => ({ value: s.id, label: s.site_name || s.name }))}
                        value={filters.site}
                        onChange={v => updateFilter('site', v)}
                        allLabel={filters.organisation.length > 0 ? "All Sites" : "Select Org First"}
                        multiple={true}
                        disabled={filters.organisation.length === 0}
                    />

                    <FilterDropdown
                        label="Floor"
                        options={allFloors.map(f => ({ value: f.id, label: f.name }))}
                        value={filters.floor}
                        onChange={v => updateFilter('floor', v)}
                        allLabel={filters.site.length > 0 ? "All Floors" : "Select Site First"}
                        multiple={true}
                        disabled={filters.site.length === 0}
                    />
                </div>
            </FilterBar>

            <div className="w-full relative">
                <DataTable
                    title={
                        <div className="flex flex-col">
                            <span className="text-[14px] font-black text-title leading-tight">System Ledger</span>
                            <span className="text-[10px] font-bold text-gray uppercase tracking-widest mt-1">SHA-256 Integrity Verified</span>
                        </div>
                    }
                    subtitle="Audit Trail"
                    columns={columns}
                    data={activityList}
                    loading={isLoading || !activityList}
                    emptyMessage="No historical records matched your current filters."
                    footer={
                        <div className="flex justify-between items-center w-full py-2 px-1">
                            <div className="text-[12px] text-gray font-medium uppercase tracking-tight">Records Found: <span className="font-black text-title">{totalCount.toLocaleString()}</span></div>
                            {totalPages > 1 && (
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-bold text-gray/60">Page {currentPage} of {totalPages}</span>
                                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1 || isLoading} className="px-6 font-black tracking-widest uppercase text-[10px] h-10">Previous</Button>
                                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages || isLoading} className="px-6 font-black tracking-widest uppercase text-[10px] h-10">Next</Button>
                                </div>
                            )}
                        </div>
                    }
                />
            </div>
        </div>
    );
}
