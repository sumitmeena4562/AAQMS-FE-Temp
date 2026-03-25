import React, { useState, useMemo } from 'react';
import { FiHome, FiClock, FiBox, FiRefreshCcw } from 'react-icons/fi';
import PageHeader from '../../components/UI/PageHeader';
import FilterBar from '../../components/UI/FilterBar';
import FilterDropdown from '../../components/UI/FilterDropdown';
import DataTable from '../../components/UI/DataTable';
import { useAllHistory } from '../../hooks/useDashboardQueries';

// ── Dropdown Mock Options ──
const filterOptions = {
    organizations: ['Acme Corp', 'Stark Industries', 'Wayne Enterprises', 'Globex', 'Initech'],
    roles: ['Admin', 'Coordinator', 'Field Officer', 'System AI'],
    sites: ['Site Alpha', 'Site Beta', 'Site Gamma', 'HQ'],
    floors: ['Ground Floor', 'Level 1', 'Level 2', 'Level 3'],
    zones: ['Zone 15-12', 'Zone B-12', 'Restricted Area', 'Loading Dock'],
    inventory: ['Fire Extinguisher', 'Safety Gear', 'First Aid Kit', 'Hard Hats'],
    eventTypes: ['Inventory Mismatch', 'User Onboarding', 'Inventory Update', 'Report Approval', 'System Config']
};

export default function AllHistory() {
    // ── Local Filter State ──
    const [filters, setFilters] = useState({
        organization: '',
        role: '',
        site: '',
        floor: '',
        zone: '',
        inventory: '',
        eventType: ''
    });

    // ── Fetching Data ──
    const { data: activityList, isLoading, isError } = useAllHistory(filters);

    const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

    const resetFilters = () => {
        setFilters({
            organization: '', role: '', site: '', floor: '', zone: '', inventory: '', eventType: ''
        });
    };

    // ── Exact Same Columns as RecentActivityTable ──
    const columns = useMemo(() => [
        {
            header: 'Event Type',
            accessor: 'type',
            render: (_, row) => {
                const Icon = row.icon;
                return (
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${row.iconBgClass} ${row.iconTextClass}`}>
                            {Icon && <Icon size={16} />}
                        </div>
                        <span className="text-[13px] font-semibold text-title whitespace-nowrap">
                            {row.type}
                        </span>
                    </div>
                );
            },
        },
        {
            header: 'User / Source',
            accessor: 'user',
            render: (value) => (
                <span className="text-[13px] text-body font-medium whitespace-nowrap">{value}</span>
            ),
        },
        {
            header: 'Entity',
            accessor: 'entity',
            render: (value) => (
                <span className="text-[13px] text-body whitespace-nowrap">{value}</span>
            ),
        },
        {
            header: 'Details',
            accessor: 'details',
            render: (value) => (
                <span className="text-[13px] text-gray min-w-[200px] block">{value}</span>
            ),
        },
        {
            header: 'Time',
            accessor: 'time',
            render: (value) => (
                <span className="text-[13px] text-gray font-medium whitespace-nowrap">{value}</span>
            ),
        },
    ], []);

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
            {/* 1. Page Header */}
            <PageHeader
                title="All History"
                subtitle="Complete audit trail and system activity logs"
                breadcrumbs={[
                    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
                    { label: "History", path: "/admin/history", icon: <FiClock size={14} />, isActive: true }
                ]}
            />

            {/* 2. Advanced Reusable Filter Bar */}
            <FilterBar>
                <div className="flex flex-wrap items-center gap-2 flex-1">
                    <FilterDropdown
                        label="Organization"
                        options={filterOptions.organizations}
                        value={filters.organization}
                        onChange={v => setFilters({ ...filters, organization: v })}
                        allLabel="All Orgs"
                    />
                    <FilterDropdown
                        label="Role"
                        options={filterOptions.roles}
                        value={filters.role}
                        onChange={v => setFilters({ ...filters, role: v })}
                        allLabel="All Roles"
                    />
                    <FilterDropdown
                        label="Site"
                        options={filterOptions.sites}
                        value={filters.site}
                        onChange={v => setFilters({ ...filters, site: v })}
                        allLabel="All Sites"
                    />
                    <FilterDropdown
                        label="Floor"
                        options={filterOptions.floors}
                        value={filters.floor}
                        onChange={v => setFilters({ ...filters, floor: v })}
                        allLabel="All Floors"
                    />
                    <FilterDropdown
                        label="Zone"
                        options={filterOptions.zones}
                        value={filters.zone}
                        onChange={v => setFilters({ ...filters, zone: v })}
                        allLabel="All Zones"
                    />
                    <FilterDropdown
                        label="Inventory"
                        options={filterOptions.inventory}
                        value={filters.inventory}
                        onChange={v => setFilters({ ...filters, inventory: v })}
                        allLabel="All Items"
                    />
                    <FilterDropdown
                        label="Event Type"
                        options={filterOptions.eventTypes}
                        value={filters.eventType}
                        onChange={v => setFilters({ ...filters, eventType: v })}
                        allLabel="All Events"
                    />
                </div>

                {activeFilterCount > 0 && (
                    <div className="flex items-center shrink-0 border-l border-border-main/40 pl-3 ml-auto">
                        <button
                            onClick={resetFilters}
                            className="h-9 flex items-center gap-1.5 px-3 text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase tracking-widest transition-all rounded-xl bg-title/5 hover:bg-rose-50 shadow-sm border border-transparent hover:border-rose-100 animate-in zoom-in duration-300 group"
                        >
                            <FiRefreshCcw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                            Reset Filters
                            <span className="w-4 h-4 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center text-[9px] ml-1">{activeFilterCount}</span>
                        </button>
                    </div>
                )}
            </FilterBar>

            {/* 3. History Data Table Card */}
            {/* The user specifically asked for "px 8 py 8 of history card give shadow make ui very clean and good" */}
            <div className="bg-card w-full border border-border-main rounded-[var(--radius-card)] shadow-md p-6 sm:p-8 flex flex-col gap-4">
                
                <h2 className="text-lg font-black text-title tracking-tight mb-2">History Records</h2>
                
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-20 bg-base/50 rounded-xl border border-dashed border-border-main group transition-all duration-300 cursor-wait">
                        <FiBox className="text-primary animate-pulse mb-3 group-hover:scale-110 transition-transform duration-300" size={44} />
                        <span className="text-sm font-semibold text-gray-500 group-hover:text-primary transition-colors">Fetching History Logs...</span>
                    </div>
                ) : !isError && activityList ? (
                    // Adding a max-height and custom scrollbar utility class to make it nicely scrollable for exactly 100 items
                    <div className="w-full relative overflow-y-auto overflow-x-auto max-h-[600px] border border-border-main/50 rounded-lg custom-scrollbar">
                        <DataTable
                            columns={columns}
                            data={activityList}
                            emptyMessage="No historical records found for the selected filters."
                            className="border-none shadow-none !rounded-none" // Removing DataTable internal wrapper styles so the parent card shines
                        />
                    </div>
                ) : null}

                {/* Status Footer */}
                {activityList && (
                    <div className="flex items-center justify-between w-full pt-4 border-t border-border-main/50 mt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-gray uppercase tracking-widest">
                                {activityList.length} records retrieved
                            </span>
                        </div>
                        <span className="text-[10px] font-black text-gray/40 uppercase tracking-widest">
                            Database Sync: Live
                        </span>
                    </div>
                )}
            </div>
            
        </div>
    );
}
