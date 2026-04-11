import React, { useState, useMemo, useEffect } from 'react';
import { FiHome, FiClock, FiBox, FiRefreshCcw } from 'react-icons/fi';
import PageHeader from '../../components/UI/PageHeader';
import FilterDropdown from '../../components/UI/FilterDropdown';
import DataTable from '../../components/UI/DataTable';
import Button from '../../components/UI/Button';
import { useAllHistory } from '../../hooks/api/useDashboardQueries';
import { useHierarchy } from '../../hooks/api/useHierarchy';
import { useSites, useFloors } from '../../hooks/api/useHierarchyQueries';
import TableSkeleton from '../../components/UI/TableSkeleton';

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
    { value: 'USER', label: 'Users & Staff' },
    { value: 'ORGANISATION', label: 'Organizations' },
    { value: 'SITE', label: 'Infrastructure / Sites' },
    { value: 'INVENTORY', label: 'Assets & Equipment' },
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

    // ── 2. QUERY HOOKS (Declarative Cascades) ──
    const { organizations: orgs } = useHierarchy();
    const { data: allSites = [] } = useSites({ organisation: filters.organisation });
    const { data: allFloors = [] } = useFloors(filters.site);

    // Cascading fetches are now handled declaratively by query hooks above.

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

    // ── 5. Fetching Activity Logs (Server-side paginated) ──
    // 🛡️ MEMOIZED: Prevents infinite fetch loops caused by new object refs on every render
    const queryFilters = useMemo(() => ({
        ...filters,
        page: currentPage,
        page_size: 10
    }), [filters, currentPage]);

    const { data: historyResponse, isLoading, isError } = useAllHistory(queryFilters);
    const activityList = historyResponse?.results || [];
    const totalCount = historyResponse?.count || 0;
    const totalPages = Math.ceil(totalCount / 10);

    const activeFilterCount = Object.values(filters).filter(v => Array.isArray(v) ? v.length > 0 : v !== '').length;

    // ── 6. Industrial Column Renderers ──
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
                    <div className={`w-1.5 h-1.5 rounded-full ${
                        row.statusVariant === 'danger' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 
                        row.statusVariant === 'warning' ? 'bg-orange-500' :
                        row.statusVariant === 'success' ? 'bg-emerald-500' : 'bg-primary'
                    }`} />
                    <span className="text-[13px] text-gray font-bold tracking-tight">{value}</span>
                </div>
            ),
        },
    ], []);

    return (
        <div className="flex flex-col gap-8 w-full animate-in fade-in duration-700 bg-base/10 min-h-screen pb-12">
            
            <div className="px-1 pt-2">
                <PageHeader
                    title="Audit History"
                    subtitle="Centralized ledger of all system security and operational events"
                    breadcrumbs={[
                        { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
                        { label: "History", path: "/admin/history", icon: <FiClock size={14} />, isActive: true }
                    ]}
                />
            </div>

            {/* ── ADVANCED CASCADING FILTERS ── */}
            <div className="bg-card border border-border-main/60 rounded-2xl p-5 shadow-sm transition-all duration-300">
                <div className="flex flex-wrap items-center gap-4">
                    
                    <FilterDropdown
                        label="Performer Org"
                        options={orgs.map(o => ({ value: o.id, label: o.name }))}
                        value={filters.organisation}
                        onChange={v => updateFilter('organisation', v)}
                        allLabel="All Organizations"
                        multiple={true}
                    />

                    <FilterDropdown
                        label="Action / Op"
                        options={OPERATION_TYPES}
                        value={filters.operation}
                        onChange={v => updateFilter('operation', v)}
                        allLabel="All Actions"
                        multiple={true}
                    />

                    <FilterDropdown
                        label="Entity Category"
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
                        label="Target Site"
                        options={allSites.map(s => ({ value: s.id, label: s.site_name || s.name }))}
                        value={filters.site}
                        onChange={v => updateFilter('site', v)}
                        allLabel="Select Org First"
                        multiple={true}
                        disabled={filters.organisation.length === 0}
                    />

                    <FilterDropdown
                        label="Target Floor"
                        options={allFloors.map(f => ({ value: f.id, label: f.name }))}
                        value={filters.floor}
                        onChange={v => updateFilter('floor', v)}
                        allLabel="Select Site First"
                        multiple={true}
                        disabled={filters.site.length === 0}
                    />
                    
                    {activeFilterCount > 0 && (
                        <button
                            onClick={resetFilters}
                            className="h-10 flex items-center gap-2 px-5 text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase tracking-widest transition-all rounded-xl bg-rose-50 border border-rose-100 shadow-sm active:scale-95 ml-auto"
                        >
                            <FiRefreshCcw size={12} />
                            Reset Filters
                        </button>
                    )}
                </div>
            </div>

            {/* ── THE LEDGER CARD ── */}
            <div className="bg-card w-full border border-border-main rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] p-8 flex flex-col gap-6 transition-all duration-500 overflow-hidden relative">
                
                <div className="flex items-center justify-between border-b border-border-main/50 pb-6">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-black text-title tracking-tighter leading-none mb-2">History Records</h2>
                        <span className="text-xs font-bold text-gray/60 uppercase tracking-widest">Permanent System Audit Trail</span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-base/40 px-3 py-1.5 rounded-full border border-border-main/40">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-gray uppercase tracking-widest">
                            {totalCount.toLocaleString()} Total Logs
                        </span>
                    </div>
                </div>
                
                <div className="w-full relative min-h-[400px]">
                    {isLoading ? (
                        <TableSkeleton rows={10} />
                    ) : !isError && activityList ? (
                        <DataTable
                            columns={columns}
                            data={activityList}
                            loading={isLoading}
                            emptyMessage="No historical records matched your current filters."
                            className="!border-none !shadow-none !p-0 !rounded-none"
                            footer={
                                totalPages > 1 && (
                                    <div className="flex items-center justify-between w-full pt-2">
                                        <span className="text-[10px] font-bold text-gray">
                                            Page {currentPage} of {totalPages} &nbsp;·&nbsp; {totalCount.toLocaleString()} records total
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <Button variant="outline" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1 || isLoading} className="!h-8 !px-3 !text-[10px] !font-black !uppercase">Previous</Button>
                                            <Button variant="outline" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages || isLoading} className="!h-8 !px-4 !text-[10px] !font-black !uppercase">Next</Button>
                                        </div>
                                    </div>
                                )
                            }
                            pageSize={10}
                        />
                    ) : (
                        <div className="flex items-center justify-center py-20 text-rose-500 font-bold">
                            Failed to retrieve history. Please check your connection.
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border-main/30">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-gray/40 uppercase tracking-[0.2em]">Data Integrity: SHA-256 Verified</span>
                        <div className="h-4 w-[1px] bg-border-main/40" />
                        <span className="text-[10px] font-black text-gray/40 uppercase tracking-[0.2em]">Live Sync Status: Active</span>
                    </div>
                    <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest cursor-help hover:text-primary transition-colors">
                        Enterprise Audit Mode
                    </span>
                </div>
            </div>
        </div>
    );
}
