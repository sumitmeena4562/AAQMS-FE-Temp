import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useOrgStore } from '../../store/useOrgStore';
import { getOrgStatus } from '../../utils/orgUtils';
import { useOrganizations } from '../../hooks/api/useOrgQueries';
import Button from '../../components/UI/Button';

import OrganizationCard from '../../components/UI/OrganizationCard';
const CreateOrganization = React.lazy(() => import('../../components/UI/CreateOrganization'));
const OrganizationDetailsModal = React.lazy(() => import('../../components/UI/OrganizationDetailsModal'));
import FilterDropdown from '../../components/UI/FilterDropdown';
import PageHeader from '../../components/UI/PageHeader';
import DataTable from '../../components/UI/DataTable';
import DotStatus from '../../components/UI/DotStatus';
import Badge from '../../components/UI/Badge';
import FilterBar from '../../components/UI/FilterBar';
import TableSkeleton from '../../components/UI/TableSkeleton';

import { FiBriefcase, FiInbox, FiRefreshCcw, FiHome, FiEdit2, FiShieldOff, FiEye } from 'react-icons/fi';
import useSearchStore from '../../store/useSearchStore';
import { useResponsiveLimit } from '../../hooks/useWindowSize';
import Pagination from '../../components/UI/Pagination';

/**
 * Helper for consistent status calculation
 * Used by both Table and Cards for identical behavior.
 */


/**
 * OrgLogo Component
 * Renders an organization logo with a resilient fallback mechanism.
 */
const OrgLogo = React.memo(({ org }) => {
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
                    loading="lazy"
                />
            ) : (
                <span className="bg-gradient-to-br from-base to-page w-full h-full flex items-center justify-center">
                    {name.substring(0, 2)}
                </span>
            )}
        </div>
    );
});

const Organizations = React.memo(() => {
    // --- Global State ---
    const {
        filters, viewMode,
        addOrg, updateOrg, blockOrg,
        setFilters, setViewMode, resetFilters,
        isSubmitting
    } = useOrgStore();
    const { query: searchQuery, clearSearch } = useSearchStore();

    // --- QUERY HOOK (NEW) ---
    // Note: We use the global filters and search directly in the query key for automatic refetching
    const { data: orgs = [], isLoading } = useOrganizations(filters, searchQuery);

    // --- Local State ---
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingOrg, setEditingOrg] = useState(null);
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // --- Memoized Computations ---
    const enrichedOrgs = useMemo(() => {
        return orgs.map(org => ({
            ...org,
            stats: {
                ...org.stats,
                coordinators: org.coordinators_count || (org.stats && org.stats.coordinators) || 0,
                sites: org.sites_count || (org.stats && org.stats.sites) || 0,
                floors: org.floors_count || (org.stats && org.stats.floors) || 0,
                assets: org.assets_count || (org.stats && org.stats.assets) || 0
            }
        }));
    }, [orgs]);

    // LOCAL FILTERING: Ensure computed statuses like 'PENDING' are exactly matched
    const filteredOrgs = useMemo(() => {
        let result = enrichedOrgs;
        if (filters.status && filters.status.length > 0 && !filters.status.includes('all')) {
            result = result.filter(org => {
                const computedStatus = getOrgStatus(org);
                return filters.status.some(s => s.toUpperCase() === computedStatus);
            });
        }
        return result;
    }, [enrichedOrgs, filters.status]);


    const itemsPerPage = useResponsiveLimit(12);
    
    // Auto-reset to page 1 when criteria or page size changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, searchQuery, itemsPerPage]);

    const totalPages = Math.ceil(filteredOrgs.length / itemsPerPage);
    const paginatedOrgs = filteredOrgs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                const computedStatus = getOrgStatus(org);

                const isActive = computedStatus === 'ACTIVE';
                const isPending = computedStatus === 'PENDING';
                const isBlocked = computedStatus === 'BLOCKED';

                const bgClass = isActive
                    ? 'bg-[#e6f4ea] border-[#137333]/20 text-[#137333]'
                    : isPending
                        ? 'bg-amber-50 border-amber-200/50 text-amber-600'
                        : isBlocked
                            ? 'bg-rose-100 border-rose-600/20 text-rose-600'
                            : 'bg-[#fce8e6] border-[#c5221f]/20 text-[#c5221f]';

                return (
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${bgClass}`}>
                        <DotStatus status={isActive ? 'active' : isPending ? 'pending' : (isBlocked ? 'inactive' : 'inactive')} />
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
                <FilterBar hideClearButton={true}>
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
                                { value: 'ACTIVE', label: 'Active' },
                                { value: 'PENDING', label: 'Pending' },
                                { value: 'BLOCKED', label: 'Blocked' },
                                { value: 'INACTIVE', label: 'Inactive' }
                            ]}
                            value={filters.status}
                            onChange={(v) => setFilters({ status: v })}
                            allLabel="All Statuses"
                            multiple={true}
                        />
                    </div>

                    <div className="flex items-center gap-2 shrink-0 border-l border-border-main/40 pl-3 ml-auto mt-3 sm:mt-0">
                        <FilterBar.ViewToggle mode={viewMode} onChange={setViewMode} />

                        {(activeFiltersCount > 0 || searchQuery) && (
                            <button
                                onClick={() => { resetFilters(); clearSearch(); }}
                                className="h-9 flex items-center gap-1.5 px-3 text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase tracking-widest transition-all rounded-xl bg-title/5 hover:bg-rose-50 shadow-sm border border-transparent hover:border-rose-100 group"
                            >
                                <FiRefreshCcw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                                Reset Filters
                                <span className="w-4 h-4 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center text-[9px] ml-1">
                                    {activeFiltersCount + (searchQuery ? 1 : 0)}
                                </span>
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
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                                {paginatedOrgs.map((org, index) => (
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
                            <Pagination 
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                totalItems={filteredOrgs.length}
                                itemsPerPage={itemsPerPage}
                            />
                        </div>
                    ) : (
                        <DataTable
                            columns={tableColumns}
                            data={paginatedOrgs}
                            onRowClick={handleView}
                            footer={
                                <Pagination 
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                    totalItems={filteredOrgs.length}
                                    itemsPerPage={itemsPerPage}
                                    className="!bg-transparent !border-none !shadow-none !px-0 !py-2"
                                />
                            }
                        />
                    )
                ) : (
                    <div className="w-full flex flex-col items-center justify-center py-32 bg-card/40 border-2 border-dashed border-border-main rounded-3xl animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-base rounded-2xl flex items-center justify-center mb-5 rotate-3">
                            <FiInbox className="w-7 h-7 text-gray/40" />
                        </div>
                        <h3 className="text-lg font-black text-title mb-1">No Organizations Found</h3>
                        <p className="text-gray text-xs mb-8 text-center max-w-[340px] px-4 font-medium leading-relaxed whitespace-normal break-words">
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
            <React.Suspense fallback={null}>
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
            </React.Suspense>
        </div>
    );
});

export default Organizations;
