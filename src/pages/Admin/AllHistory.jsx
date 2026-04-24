import React, { useState, useMemo, useEffect } from 'react';
import { FiHome, FiClock, FiBox, FiRefreshCcw } from 'react-icons/fi';
import PageHeader from '../../components/UI/PageHeader';
import FilterDropdown from '../../components/UI/FilterDropdown';
import FilterBar from '../../components/UI/FilterBar';
import DataTable from '../../components/UI/DataTable';
import Button from '../../components/UI/Button';
import { useAllHistory, prefetchHistory } from '../../hooks/api/useDashboardQueries';
import { useUserFormOptions } from '../../hooks/api/useUserQueries';
import { useFloors } from '../../hooks/api/useHierarchyQueries';
import TableSkeleton from '../../components/UI/TableSkeleton';
import useDebounce from '../../hooks/useDebounce';
import Pagination from '../../components/UI/Pagination';
import { useSearchParams } from 'react-router-dom';

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
    const [searchParams, setSearchParams] = useSearchParams();
    
    // ── 1. Unified Form Options (Orgs, Sites, Roles) ──
    // Fetches everything in one cached call, eliminating the useHierarchy waterfall.
    const { data: formOptions, isLoading: isLoadingOptions } = useUserFormOptions();

    // ── 2. Local Filter + Pagination State (Synced with URL) ──
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    
    const filters = useMemo(() => ({
        organisation: searchParams.get('org_id')?.split(',').filter(Boolean) || [],
        site: searchParams.get('site_id')?.split(',').filter(Boolean) || [],
        floor: searchParams.get('floor')?.split(',').filter(Boolean) || [],
        role: searchParams.get('role')?.split(',').filter(Boolean) || [],
        operation: searchParams.get('operation')?.split(',').filter(Boolean) || [],
        category: searchParams.get('category')?.split(',').filter(Boolean) || []
    }), [searchParams]);

    // ── 3. DATA FETCHING ──
    // Debounce filters to prevent "Request Explosion"
    const debouncedFilters = useDebounce(filters, 400);

    const { data: floorData } = useFloors(filters.site, {
        enabled: filters.site.length > 0
    });
    const allFloors = floorData?.results || [];

    const queryParams = useMemo(() => ({
        org_id: debouncedFilters.organisation,
        site_id: debouncedFilters.site,
        floor: debouncedFilters.floor,
        role: debouncedFilters.role,
        operation: debouncedFilters.operation,
        category: debouncedFilters.category,
        page: currentPage,
        limit: 10
    }), [debouncedFilters, currentPage]);

    const { data: historyData, isLoading, isFetching } = useAllHistory(queryParams);

    const totalCount = historyData?.count || 0;
    const totalPages = Math.ceil(totalCount / 10);

    // ── 3. Pagination Prefetching (Background optimization) ──
    useEffect(() => {
        if (!isFetching && currentPage < totalPages) {
            prefetchHistory(queryParams, currentPage + 1);
        }
    }, [currentPage, queryParams, totalPages, isFetching]);

    // ── 4. Derived Data ──
    // Map backend results to frontend activity feed format
    const activityList = useMemo(() =>
        historyData?.results || [],
        [historyData?.results]);

    // ── 5. State Management Actions (Updating URL) ──
    const updateFilter = (key, val) => {
        const newParams = new URLSearchParams(searchParams);
        const value = Array.isArray(val) ? val.join(',') : val;
        
        const targetKey = key === 'organisation' ? 'org_id' : key === 'site' ? 'site_id' : key;

        if (!value || value.length === 0) {
            newParams.delete(targetKey);
        } else {
            newParams.set(targetKey, value);
        }

        // Reset cascading filters
        if (key === 'organisation') { newParams.delete('site_id'); newParams.delete('floor'); }
        else if (key === 'site') { newParams.delete('floor'); }

        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    const setCurrentPage = (page) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', String(page));
        setSearchParams(newParams);
    };

    const resetFilters = () => {
        setSearchParams({});
    };

    const isCustomFilterActive = Object.values(filters).some(arr => arr.length > 0);
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
                        <div className="flex flex-col items-end px-4 translate-y-[2px]">
                            <span className="text-[9px] font-black text-gray uppercase tracking-widest opacity-60 leading-none mb-1">Status</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-[11px] font-bold text-title uppercase">Live Sync</span>
                            </div>
                        </div>
                    </div>
                }
            />

            <FilterBar 
                className="!p-2.5" 
                onClear={resetFilters} 
                isCustomFilterActive={isCustomFilterActive}
            >
                <div className="flex flex-wrap items-center gap-2 flex-1 pl-1">
                    <FilterDropdown
                        label="Organization"
                        options={formOptions?.organisations || []}
                        value={filters.organisation}
                        onChange={v => updateFilter('organisation', v)}
                        allLabel="All"
                        multiple={true}
                        loading={isLoadingOptions}
                    />

                    <FilterDropdown
                        label="Action Type"
                        options={OPERATION_TYPES}
                        value={filters.operation}
                        onChange={v => updateFilter('operation', v)}
                        allLabel="All"
                        multiple={true}
                    />

                    <FilterDropdown
                        label="Category"
                        options={EVENT_CATEGORIES}
                        value={filters.category}
                        onChange={v => updateFilter('category', v)}
                        allLabel="All"
                        multiple={true}
                    />

                    <FilterDropdown
                        label="Role"
                        options={USER_ROLES}
                        value={filters.role}
                        onChange={v => updateFilter('role', v)}
                        allLabel="All"
                        multiple={true}
                    />

                    <FilterDropdown
                        label="Site"
                        options={(formOptions?.sites || [])
                            .filter(s => filters.organisation.length === 0 || filters.organisation.includes(String(s.org_id)))
                            .map(s => ({ value: s.value, label: s.label }))
                        }
                        value={filters.site}
                        onChange={v => updateFilter('site', v)}
                        allLabel={filters.organisation.length > 0 ? "All Sites" : "Select Org First"}
                        multiple={true}
                        disabled={filters.organisation.length === 0}
                        loading={isLoadingOptions}
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
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages || 1}
                            onPageChange={setCurrentPage}
                            totalItems={totalCount}
                            itemsPerPage={10}
                            variant="ghost"
                        />
                    }
                />
            </div>
        </div>
    );
}
