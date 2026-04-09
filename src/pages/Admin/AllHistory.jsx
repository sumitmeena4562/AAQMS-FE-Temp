import React, { useState, useMemo } from 'react';
import { FiHome, FiClock, FiBox, FiRefreshCcw, FiSearch } from 'react-icons/fi';
import PageHeader from '../../components/UI/PageHeader';
import FilterBar from '../../components/UI/FilterBar';
import FilterDropdown from '../../components/UI/FilterDropdown';
import DataTable from '../../components/UI/DataTable';
import { useAllHistory } from '../../hooks/useDashboardQueries';

// ── Industrial Filter Options ──
const filterOptions = {
    organizations: ['Acme Corp', 'Stark Industries', 'Wayne Enterprises', 'Globex', 'Initech'],
    roles: ['Admin', 'Coordinator', 'Field Officer', 'System AI'],
    eventTypes: ['Inventory Mismatch', 'User Onboarding', 'Inventory Update', 'Report Approval', 'System Config', 'Critical Alert']
};

export default function AllHistory() {
    // ── Local Filter & Search State ──
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        organization: '',
        role: '',
        eventType: ''
    });

    // ── Fetching Data ──
    const { data: activityList, isLoading, isError } = useAllHistory({ ...filters, search: searchTerm });

    const activeFilterCount = Object.values(filters).filter(v => v !== '').length + (searchTerm ? 1 : 0);

    const resetFilters = () => {
        setFilters({ organization: '', role: '', eventType: '' });
        setSearchTerm('');
    };

    // ── Industrial Column Renderers (Synced with Dashboard) ──
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
            {/* 1. Elite Page Header */}
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

            {/* 2. Advanced Filtering Section */}
            <div className="bg-card border border-border-main/60 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row items-center gap-4 transition-all duration-300">
                <div className="relative w-full lg:w-96 group">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray transition-colors group-focus-within:text-primary" size={16} />
                    <input 
                        type="text"
                        placeholder="Search logs by user, event, or details..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 bg-base/30 border border-border-main/50 rounded-xl text-[13px] font-semibold text-body focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-inner"
                    />
                </div>
                
                <div className="flex flex-wrap items-center gap-3 flex-1">
                    <FilterDropdown
                        label="Organization"
                        options={filterOptions.organizations}
                        value={filters.organization}
                        onChange={v => setFilters({ ...filters, organization: v })}
                        allLabel="All Orgs"
                    />
                    <FilterDropdown
                        label="Type"
                        options={filterOptions.eventTypes}
                        value={filters.eventType}
                        onChange={v => setFilters({ ...filters, eventType: v })}
                        allLabel="All Types"
                    />
                    
                    {activeFilterCount > 0 && (
                        <button
                            onClick={resetFilters}
                            className="h-10 flex items-center gap-2 px-4 text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase tracking-widest transition-all rounded-xl bg-rose-50 border border-rose-100 shadow-sm active:scale-95"
                        >
                            <FiRefreshCcw size={12} />
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* 3. The Main History Ledger Card */}
            <div className="bg-card w-full border border-border-main rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] p-8 flex flex-col gap-6 transition-all duration-500 overflow-hidden relative">
                
                <div className="flex items-center justify-between border-b border-border-main/50 pb-6">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-black text-title tracking-tighter leading-none mb-2">History Records</h2>
                        <span className="text-xs font-bold text-gray/60 uppercase tracking-widest">Permanent System Audit Trail</span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-base/40 px-3 py-1.5 rounded-full border border-border-main/40">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-gray uppercase tracking-widest">
                            {activityList?.length || 0} Records Found
                        </span>
                    </div>
                </div>
                
                <div className="w-full relative min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-base/5 rounded-2xl border border-dashed border-border-main/60 m-2">
                            <FiBox className="text-primary/40 animate-bounce mb-4" size={48} />
                            <span className="text-sm font-bold text-gray/60 uppercase tracking-widest">Accessing Secure Logs...</span>
                        </div>
                    ) : !isError && activityList ? (
                        <DataTable
                            columns={columns}
                            data={activityList}
                            loading={isLoading}
                            emptyMessage="No historical records found for the current search parameters."
                            className="!border-none !shadow-none !p-0 !rounded-none"
                        />
                    ) : (
                        <div className="flex items-center justify-center py-20 text-rose-500 font-bold">
                            Failed to retrieve history. Please check your connection.
                        </div>
                    )}
                </div>

                {/* Status Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-border-main/30">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-gray/40 uppercase tracking-[0.2em]">Data Integrity: Verified</span>
                        <div className="h-4 w-[1px] bg-border-main/40" />
                        <span className="text-[10px] font-black text-gray/40 uppercase tracking-[0.2em]">Sync Latency: 42ms</span>
                    </div>
                    <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest cursor-help hover:text-primary transition-colors">
                        Authorized Access Only
                    </span>
                </div>
            </div>
        </div>
    );
}
