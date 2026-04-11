import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useOrgStore } from '../../store/useOrgStore';
import { useOrganizations } from '../../hooks/api/useOrgQueries';

import OrganizationCard from '../../components/UI/OrganizationCard';
import CreateOrganization from '../../components/UI/CreateOrganization';
import OrganizationDetailsModal from '../../components/UI/OrganizationDetailsModal';
import FilterDropdown from '../../components/UI/FilterDropdown';
import PageHeader from '../../components/UI/PageHeader';
import DataTable from '../../components/UI/DataTable';
import DotStatus from '../../components/UI/DotStatus';
import Badge from '../../components/UI/Badge';
import FilterBar from '../../components/UI/FilterBar';
import TableSkeleton from '../../components/UI/TableSkeleton';

import { FiBriefcase, FiInbox, FiRefreshCcw, FiHome, FiEdit2, FiShieldOff, FiEye } from 'react-icons/fi';
import useSearchStore from '../../store/useSearchStore';

/**
 * OrgLogo Component
 * Renders an organization logo with a resilient fallback mechanism.
 */
const OrgLogo = ({ org }) => {
    const [imgError, setImgError] = useState(false);
    const name = org?.name || 'OR';

    return (
        <div className="w-9 h-9 bg-base border border-border-main/50 rounded-xl flex items-center justify-center font-black text-[12px] text-gray overflow-hidden shadow-sm uppercase tracking-tighter shrink-0 select-none">
            {org?.imagery?.profile && !imgError ? (
                <img
                    src={org.imagery.profile}
                    alt={name}
                    className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all"
                    onError={() => setImgError(true)}
                />
            ) : (
                <span className="bg-gradient-to-br from-base to-page w-full h-full flex items-center justify-center">
                    {name.substring(0, 2)}
                </span>
            )}
        </div>
    );
};

const Organizations = () => {
    // --- Global State ---
    const {
        filters, viewMode,
        addOrg, updateOrg, blockOrg,
        setFilters, setViewMode, resetFilters,
        isSubmitting
    } = useOrgStore();
    const { query: searchQuery, clearSearch } = useSearchStore();

    // --- QUERY HOOK (NEW) ---
    // Note: We use the global filters directly in the query key for automatic refetching
    const { data: orgs = [], isLoading } = useOrganizations(filters);

    // --- Local State ---
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingOrg, setEditingOrg] = useState(null);
    const [isViewOnly, setIsViewOnly] = useState(false);

    // --- Lifecycle / Effects ---
    // fetchOrgs is now handled by useOrganizations hook automatically

    // --- Memoized Computations ---
    // Coordinator counts come from org.stats (provided by backend API)
    // No need to cross-join with user list client-side
    const enrichedOrgs = useMemo(() => {
        return orgs.map(org => ({
            ...org,
            stats: {
                ...org.stats,
                coordinators: org.stats?.coordinators || org.stats?.coordinators_count || 0,
                coordinatorNames: org.stats?.coordinatorNames || org.stats?.coordinator_names || []
            }
        }));
    }, [orgs]);

    const filteredOrgs = useMemo(() => {
        return enrichedOrgs.filter(org => {
            const matchesIndustry = filters.industry.length === 0 || filters.industry.includes(org.industry);
            const matchesStatus = filters.status.length === 0 || filters.status.includes(org.status || (org.isBlocked ? 'INACTIVE' : 'ACTIVE'));
            
            const searchLower = searchQuery.toLowerCase().trim();
            const matchesSearch = !searchLower || 
                org.name?.toLowerCase().includes(searchLower) || 
                org.industry?.toLowerCase().includes(searchLower);

            return matchesIndustry && matchesStatus && matchesSearch;
        });
    }, [enrichedOrgs, filters, searchQuery]);

    const industryOptions = useMemo(() => {
        const uniqueIndustries = [...new Set(orgs.map(o => o.industry).filter(Boolean))];
        return uniqueIndustries.map(i => ({
            value: i,
            label: i.charAt(0).toUpperCase() + i.slice(1)
        }));
    }, [orgs]);

    const activeFiltersCount = useMemo(() => {
        return Object.values(filters).filter(v => Array.isArray(v) ? v.length > 0 : v !== 'all' && v !== '').length;
    }, [filters]);

    // --- Handlers ---
    const handleEdit = useCallback((org) => {
        setEditingOrg(org);
        setIsViewOnly(false);
        setIsCreateModalOpen(true);
    }, []);

    const handleView = useCallback((org) => {
        setEditingOrg(org);
        setIsViewOnly(true);
        setIsCreateModalOpen(true);
    }, []);

    const handleCreateOrUpdate = useCallback(async (data) => {
        let success = false;
        if (editingOrg) {
            success = await updateOrg(editingOrg.id, data);
        } else {
            success = await addOrg(data);
        }
        if (success) {
            setIsCreateModalOpen(false);
            setEditingOrg(null);
        }
    }, [editingOrg, updateOrg, addOrg]);

    const handleAddClick = useCallback(() => {
        setEditingOrg(null);
        setIsViewOnly(false);
        setIsCreateModalOpen(true);
    }, []);

    const handleBlock = useCallback(async (org) => {
        const confirmed = window.confirm(`Block ${org.name}? This will deactivate the organization.`);
        if (!confirmed) return;
        await blockOrg(org.id);
    }, [blockOrg]);

    // --- Data Table Columns ---
    const tableColumns = useMemo(() => [
        {
            header: 'Organization',
            accessor: 'name',
            width: '25%',
            render: (name, org) => (
                <div className="flex items-center gap-3 py-0.5">
                    <OrgLogo org={org} />
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 line-clamp-1">
                            <span className="text-[13px] font-black text-title leading-tight tracking-tight truncate">{name}</span>
                            {org.stats?.sites > 5 && (
                                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0" title="High Activity" />
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-gray uppercase tracking-widest leading-none mt-1">
                            <span className="truncate">{org.industry || 'General'}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Industry',
            accessor: 'industry',
            width: '15%',
            className: 'hidden xl:table-cell',
            render: (val) => (
                <div className="flex">
                    <Badge variant="soft" className={`!text-[9px] !px-2 !py-0.5 !font-black !uppercase !tracking-widest border border-current/10 ${!val ? 'text-gray bg-base' : 'text-primary bg-primary/5'}`}>
                        {val || 'General'}
                    </Badge>
                </div>
            )
        },
        {
            header: 'Oversight',
            accessor: 'stats',
            width: '18%',
            className: 'text-center hidden md:table-cell',
            render: (stats) => (
                <div className="flex items-center justify-center gap-4">
                    <div className="flex flex-col items-center">
                        <span className="text-[14px] font-black text-title leading-none">{stats?.sites || 0}</span>
                        <span className="text-[8px] font-black text-gray uppercase tracking-widest mt-1">Sites</span>
                    </div>
                    <div className="h-5 w-[1px] bg-border-main/60 shrink-0" />
                    <div className="flex flex-col items-center">
                        <span className="text-[14px] font-black text-title leading-none">{stats?.coordinators || 0}</span>
                        <span className="text-[8px] font-black text-gray uppercase tracking-widest mt-1">Units</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            width: '15%',
            className: 'hidden sm:table-cell',
            render: (status, org) => {
                let computedStatus = org.isBlocked ? 'INACTIVE' : (status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE');
                if ((org.stats?.coordinators || 0) === 0) {
                    computedStatus = 'PENDING';
                }
                if (org.isBlocked) {
                    computedStatus = 'INACTIVE';
                }

                const isActive = computedStatus === 'ACTIVE';
                const isPending = computedStatus === 'PENDING';

                const bgClass = isActive
                    ? 'bg-success-bg/50 border-success/10 text-success'
                    : isPending
                        ? 'bg-amber-50 border-amber-200/50 text-amber-600'
                        : 'bg-danger-bg/50 border-danger/10 text-danger';

                return (
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${bgClass}`}>
                        <DotStatus status={isActive ? 'active' : isPending ? 'pending' : 'inactive'} />
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                            {computedStatus}
                        </span>
                    </div>
                );
            }
        },
        {
            header: 'Actions',
            accessor: 'id',
            width: '12%',
            className: 'text-right',
            render: (_, org) => (
                <div className="flex items-center justify-end gap-1.5 pr-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleView(org); }}
                        className="w-8 h-8 flex items-center justify-center text-gray hover:text-white hover:bg-primary transition-all rounded-xl shadow-sm active:scale-95"
                        title="View Details"
                    >
                        <FiEye size={13} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(org); }}
                        className="w-8 h-8 flex items-center justify-center text-gray hover:text-white hover:bg-title transition-all rounded-xl shadow-sm active:scale-95"
                        title="Edit"
                        disabled={org.isBlocked}
                    >
                        <FiEdit2 size={13} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleBlock(org); }}
                        className="w-8 h-8 flex items-center justify-center text-gray hover:text-amber-600 transition-all rounded-xl hover:bg-amber-50/60 active:scale-95"
                        title="Block"
                        disabled={org.isBlocked}
                    >
                        <FiShieldOff size={13} />
                    </button>
                </div>
            )
        }
    ], [handleBlock, handleEdit, handleView]);

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-12">

            {/* Header Section */}
            <PageHeader
                title="Organizations"
                subtitle={`Managing ${filteredOrgs.length} strategic client entities and operational density`}
                onAdd={handleAddClick}
                addButtonText="Add Organization"
                hideAddButton={false}
                breadcrumbs={[
                    { label: 'Dashboard', path: '/admin/dashboard', icon: <FiHome size={14} /> },
                    { label: 'Organizations', path: '/admin/organizations', icon: <FiBriefcase size={14} />, isActive: true }
                ]}
            />

            {/* Filter & View Mode Bar */}
            <div className="flex flex-col gap-6">
                <FilterBar>
                    <div className="flex flex-wrap items-center gap-3 flex-1">
                        <FilterDropdown
                            label="Industry"
                            options={industryOptions}
                            value={filters.industry}
                            onChange={(v) => setFilters({ ...filters, industry: v })}
                            allLabel="All Industries"
                            multiple={true}
                        />

                        <FilterDropdown
                            label="Status"
                            options={[
                                { value: 'ACTIVE', label: 'Active Only' },
                                { value: 'INACTIVE', label: 'Inactive Only' }
                            ]}
                            value={filters.status}
                            onChange={(v) => setFilters({ status: v })}
                            allLabel="All Statuses"
                            multiple={true}
                        />
                    </div>

                    <div className="flex items-center gap-2 shrink-0 border-l border-border-main/40 pl-3 ml-auto mt-3 sm:mt-0">
                        <FilterBar.ViewToggle mode={viewMode} onChange={setViewMode} />

                        {activeFiltersCount > 0 && (
                            <button
                                onClick={resetFilters}
                                className="h-9 flex items-center gap-1.5 px-3 text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase tracking-widest transition-all rounded-xl bg-title/5 hover:bg-rose-50 shadow-sm border border-transparent hover:border-rose-100 group"
                            >
                                <FiRefreshCcw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                                Reset
                                <span className="w-4 h-4 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center text-[9px] ml-1">
                                    {activeFiltersCount}
                                </span>
                            </button>
                        )}
                        {searchQuery && (
                             <button
                                onClick={clearSearch}
                                className="h-9 flex items-center gap-1.5 px-3 text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase tracking-widest transition-all rounded-xl bg-title/5 hover:bg-rose-50 border border-transparent hover:border-rose-100"
                            >
                                <FiRefreshCcw size={12} />
                                Clear Search
                            </button>
                        )}
                    </div>
                </FilterBar>

                {/* Main Content Area */}
                {isLoading ? (
                    <div className="bg-card rounded-3xl p-6 border border-border-main shadow-sm w-full">
                        <TableSkeleton rows={5} />
                    </div>
                ) : filteredOrgs.length > 0 ? (
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {filteredOrgs.map((org, index) => (
                                <div key={org.id || `org-${index}`} className="w-full">
                                    <OrganizationCard
                                        org={org}
                                        onEdit={() => handleEdit(org)}
                                        onView={() => handleView(org)}
                                        onBlock={() => handleBlock(org)}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <DataTable
                            columns={tableColumns}
                            data={filteredOrgs}
                            onRowClick={handleView}
                        />
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-card/40 border-2 border-dashed border-border-main rounded-3xl animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-base rounded-2xl flex items-center justify-center mb-5 rotate-3">
                            <FiInbox className="w-7 h-7 text-gray/40" />
                        </div>
                        <h3 className="text-lg font-black text-title mb-1">No Organizations Found</h3>
                        <p className="text-gray text-xs mb-8 text-center max-w-xs px-6 font-medium leading-relaxed">
                            We couldn&apos;t find any organization matching your selection. Try clearing your filters.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-2 px-6 py-2.5 bg-card border border-border-main rounded-xl text-xs font-black text-body hover:bg-base hover:border-border-hover transition-all shadow-sm active:scale-95"
                        >
                            <FiRefreshCcw className="w-3.5 h-3.5" />
                            Clear Criteria
                        </button>
                    </div>
                )}
            </div>

            {/* Modal Sub-components */}
            {isViewOnly ? (
                <OrganizationDetailsModal
                    isOpen={isCreateModalOpen}
                    org={editingOrg}
                    onEdit={handleEdit}
                    onClose={() => { setIsCreateModalOpen(false); setEditingOrg(null); }}
                />
            ) : (
                <CreateOrganization
                    isOpen={isCreateModalOpen}
                    org={editingOrg}
                    isViewOnly={isViewOnly}
                    isSubmitting={isSubmitting}
                    onSubmit={handleCreateOrUpdate}
                    onEdit={handleEdit}
                    onClose={() => { setIsCreateModalOpen(false); setEditingOrg(null); }}
                />
            )}
        </div>
    );
};

export default Organizations;
