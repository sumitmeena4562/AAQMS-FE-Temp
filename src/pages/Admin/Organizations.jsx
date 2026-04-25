import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useOrgStore } from '../../store/useOrgStore';
import { getOrgStatus } from '../../utils/orgUtils';
import { 
    useAllOrganizations,
    useIndustryTypes, 
    useCreateOrganization, 
    useUpdateOrganization
} from '../../hooks/api/useOrgQueries';
import Button from '../../components/UI/Button';

import OrganizationCard from '../../components/UI/OrganizationCard';
const CreateOrganization = React.lazy(() => import('../../components/UI/CreateOrganization'));
const OrganizationDetailsModal = React.lazy(() => import('../../components/UI/OrganizationDetailsModal'));
import FilterDropdown from '../../components/UI/FilterDropdown';
import PageHeader from '../../components/UI/PageHeader';
import DataTable from '../../components/UI/DataTable';
import FilterBar from '../../components/UI/FilterBar';
import TableSkeleton from '../../components/UI/TableSkeleton';
import CardSkeleton from '../../components/UI/CardSkeleton';
import ConfirmModal from '../../components/UI/ConfirmModal';

import { FiBriefcase, FiInbox, FiRefreshCcw, FiHome, FiEdit2, FiEye, FiShield, FiShieldOff } from 'react-icons/fi';
import useSearchStore from '../../store/useSearchStore';
import { useResponsiveLimit } from '../../hooks/useWindowSize';
import Pagination from '../../components/UI/Pagination';
import { DESIGN_TOKENS } from '../../constants/designTokens';

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
OrgLogo.displayName = 'OrgLogo';

const Organizations = React.memo(() => {
    // --- Global State ---
    const {
        filters, viewMode,
        setFilters, setViewMode, resetFilters,
    } = useOrgStore();
    const { query: searchQuery, clearSearch } = useSearchStore();

    // --- QUERY HOOK (OPTIMIZED: SINGLE FETCH) ---
    const { data: allOrgs, isLoading, isError, error, refetch } = useAllOrganizations(); 
    const industryOptions = useIndustryTypes(); // Now returns the options array directly
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = useResponsiveLimit(12);

    // --- Mutations ---
    const createMutation = useCreateOrganization();
    const updateMutation = useUpdateOrganization();
    const isMutating = createMutation.isPending || updateMutation.isPending;

    // --- Local State ---
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingOrg, setEditingOrg] = useState(null);
    const [isViewOnly, setIsViewOnly] = useState(false);

    // --- 🔹 ADVANCED LOCAL FILTERING & SEARCH 🔹 ---
    const filteredOrgs = useMemo(() => {
        if (!allOrgs) return [];
        
        return allOrgs.filter(org => {
            // 1. Search Query Match
            const matchesSearch = !searchQuery || 
                org.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                org.industry?.toLowerCase().includes(searchQuery.toLowerCase());

            // 2. Industry Filter Match
            const matchesIndustry = !filters.industry || filters.industry.length === 0 || 
                filters.industry.includes(org.industry);

            // 3. Status Filter Match
            const orgStatus = (getOrgStatus(org) || '').toUpperCase();
            const matchesStatus = !filters.status || filters.status.length === 0 || 
                filters.status.includes(orgStatus);

            return matchesSearch && matchesIndustry && matchesStatus;
        });
    }, [allOrgs, searchQuery, filters]);

    // Derived counts and pagination
    const totalCount = filteredOrgs.length;
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    // Local Pagination Slice
    const paginatedOrgs = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredOrgs.slice(start, start + itemsPerPage);
    }, [filteredOrgs, currentPage, itemsPerPage]);

    // Auto-reset to page 1 when filter/search changes
    useEffect(() => {
        if (currentPage !== 1) {
            setTimeout(() => setCurrentPage(1), 0);
        }
    }, [filters, searchQuery, currentPage]);

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

    const handleCreateOrUpdate = useCallback(async (formData) => {
        try {
            if (editingOrg) {
                await updateMutation.mutateAsync({ id: editingOrg.id, data: formData });
            } else {
                await createMutation.mutateAsync(formData);
            }
            setIsCreateModalOpen(false);
            setEditingOrg(null);
        } catch (err) {
            console.error("Mutation failed", err);
        }
    }, [editingOrg, updateMutation, createMutation]);

    const handleAddClick = useCallback(() => {
        setEditingOrg(null);
        setIsViewOnly(false);
        setIsCreateModalOpen(true);
    }, []);



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
                            <span className="truncate">
                                {org.industry ? `${org.industry}${org.region ? ` • ${org.region}` : ''}` : (org.region || 'Global')}
                            </span>
                        </div>
                    </div>
                </div>
            )
        },

        {
            header: 'Oversight',
            accessor: 'stats',
            width: '18%',
            align: 'center',
            className: 'hidden md:table-cell',
            render: (stats) => (
                <div className="flex items-center justify-center gap-5 mt-1">
                    <div className="flex flex-col items-center">
                        <span className="text-[14px] font-black text-title leading-none">{stats?.sites || 0}</span>
                        <span className="text-[8px] font-black text-gray uppercase tracking-widest mt-1">Sites</span>
                    </div>
                    <div className="h-6 w-[1px] bg-border-main/40 shrink-0" />
                    <div className="flex flex-col items-center">
                        <span className="text-[14px] font-black text-title leading-none">{stats?.coordinators || 0}</span>
                        <span className="text-[8px] font-black text-gray uppercase tracking-widest mt-1">Coordinator</span>
                    </div>
                    <div className="h-6 w-[1px] bg-border-main/40 shrink-0" />
                    <div className="flex flex-col items-center">
                        <span className="text-[14px] font-black text-title leading-none">{stats?.floors || 0}</span>
                        <span className="text-[8px] font-black text-gray uppercase tracking-widest mt-1">Floors</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            width: '15%',
            align: 'center',
            className: 'hidden sm:table-cell',
            render: (status, org) => {
                const computedStatus = getOrgStatus(org);
                const isActive = computedStatus === 'ACTIVE';
                const isPending = computedStatus === 'PENDING';

                return (
                    <div className="flex justify-center mt-1">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 border transition-all duration-300 shadow-sm
                            ${isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50 shadow-emerald-100/20'
                                : isPending 
                                    ? 'bg-amber-50 text-amber-700 border-amber-100/50 shadow-amber-100/20'
                                    : 'bg-rose-50 text-rose-700 border-rose-100/50 shadow-rose-100/20'}`}>
                            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : isPending ? 'bg-amber-500' : 'bg-rose-500 hover:scale-110 transition-transform'}`} />
                            {computedStatus}
                        </div>
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
                <div className="flex items-center justify-end gap-1.5 pr-1 mt-1">
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
                </div>
            )
        }
    ], [handleEdit, handleView]);

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-12">

            {/* Header Section */}
            <PageHeader
                title="Organizations"
                subtitle={`Managing ${totalCount} strategic client entities and operational density`}
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
                            onChange={(v) => setFilters({ industry: v })}
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
                                className="h-9 flex items-center gap-1.5 px-3 text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase tracking-[0.15em] transition-all rounded-xl bg-rose-50/30 hover:bg-rose-50 shadow-sm border border-rose-100/50 hover:border-rose-200 group"
                            >
                                <FiRefreshCcw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                                Reset
                            </button>
                        )}
                    </div>
                </FilterBar>

                {/* Main Content Area */}
                {isLoading ? (
                    <div className="w-full">
                        {viewMode === 'grid' ? (
                            <CardSkeleton count={itemsPerPage} columns={5} />
                        ) : (
                            <div className="bg-card rounded-3xl p-6 border border-border-main shadow-sm w-full">
                                <TableSkeleton rows={5} />
                            </div>
                        )}
                    </div>
                ) : isError ? (
                    <div className="w-full flex flex-col items-center justify-center py-24 bg-rose-50/30 border-2 border-dashed border-rose-200 rounded-3xl animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mb-5 rotate-3">
                            <FiShieldOff className="w-7 h-7 text-rose-500" />
                        </div>
                        <h3 className="text-lg font-black text-rose-900 mb-1">Failed to Load Data</h3>
                        <p className="text-rose-600/70 text-xs mb-8 text-center max-w-[340px] px-4 font-medium leading-relaxed">
                            {error?.message || "There was an error connecting to the server. Please check your connection and try again."}
                        </p>
                        <button
                            onClick={() => refetch()}
                            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-rose-200 rounded-xl text-xs font-black text-rose-600 hover:bg-rose-50 transition-all shadow-sm active:scale-95"
                        >
                            <FiRefreshCcw className="w-3.5 h-3.5" />
                            Retry Connection
                        </button>
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
                                        />
                                    </div>
                                ))}
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                totalItems={totalCount}
                                itemsPerPage={itemsPerPage}
                                variant="ghost"
                                className="mt-6"
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
                                    totalItems={totalCount}
                                    itemsPerPage={itemsPerPage}
                                    variant="ghost"
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
                        isSubmitting={isMutating}
                        onSubmit={handleCreateOrUpdate}
                        onEdit={handleEdit}
                        onClose={() => { setIsCreateModalOpen(false); setEditingOrg(null); }}
                    />
                )}
            </React.Suspense>


        </div>
    );
});
Organizations.displayName = 'Organizations';

export default Organizations;
