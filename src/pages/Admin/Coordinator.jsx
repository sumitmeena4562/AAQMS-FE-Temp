import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import useUserStore from '../../store/userStore';
import UserPeekView from '../../components/Dashboard/UserPeekView';
const UserFormModal = React.lazy(() => import('../../components/Dashboard/UserFormModal'));
const ConfirmModal = React.lazy(() => import('../../components/UI/ConfirmModal'));
import PageHeader from '../../components/UI/PageHeader';
import DataTable from '../../components/UI/DataTable';
import {
    FiUsers, FiUser, FiRefreshCw, FiHome, FiActivity, FiLayers, FiMail, FiPhone, FiBriefcase
} from 'react-icons/fi';
import FilterDropdown from '../../components/UI/FilterDropdown';
import Button from '../../components/UI/Button';
import UserCard from '../../components/UI/UserCard';
import UserAvatar from '../../components/UI/UserAvatar';
import FilterBar from '../../components/UI/FilterBar';
import { useUserManagementData } from '../../hooks/api/useUserQueries';
import useSearchStore from '../../store/useSearchStore';
import TableSkeleton from '../../components/UI/TableSkeleton';
import CardSkeleton from '../../components/UI/CardSkeleton';
import { useResponsiveLimit } from '../../hooks/useWindowSize';
import Pagination from '../../components/UI/Pagination';
import { DESIGN_TOKENS } from '../../constants/designTokens';

/**
 * COORDINATOR MANAGEMENT PAGE
 * Optimized for 100% Production Readiness.
 * Features: URL-based filtering (org_id), Role-locked view, and standard Personnel UI.
 */
const Coordinator = React.memo(() => {
    const [searchParams, setSearchParams] = useSearchParams();
    const orgIdFromUrl = searchParams.get('org_id');
    const orgNameFromUrl = searchParams.get('org_name');

    // ── STORES (UI state only) ──
    const {
        filters, sortKey, sortDir, selectedIds, page, limit, loading: storeLoading,
        setPage, setFilters, setSelectedIds, resetFilters, setLimit
    } = useUserStore();
    const { query: search } = useSearchStore();

    const { updateUser, createUser, bulkAction } = useUserStore();
    const queryClient = useQueryClient();

    // ── 1. DATA ORCHESTRATION (FE-SIDE) ──
    // Fetch a large set once to enable instant FE filtering without further network delay
    const { 
        users: allUsers, formOptions,
        isLoading, isFetching, refetchAll 
    } = useUserManagementData(
        {}, // Get everyone to filter locally
        '', 
        1,  
        500, // Balanced limit for speed + FE filtering coverage
        { enabled: true }
    );

    // ── SYNC URL PARAMS → GLOBAL FILTERS (Reactive) ──
    useEffect(() => {
        const pOrg = searchParams.get('org_id') || searchParams.get('org');
        const pCoord = searchParams.get('coord_id') || searchParams.get('coord');

        // Extract current state to compare
        const currentOrgs = filters.organization || [];
        const newOrgs = pOrg ? pOrg.split(',') : [];

        // Logic Review: "Admin direct aaye to sari dikh"
        // Only update store if URL params differ from current state to prevent loops
        if (JSON.stringify(currentOrgs) !== JSON.stringify(newOrgs)) {
            if (!pOrg && !pCoord) {
                resetFilters();
                setFilters({ role: ['coordinator'] });
            } else {
                setFilters({ organization: newOrgs, role: ['coordinator'] });
            }
        }
    }, [searchParams, setFilters, resetFilters]); // eslint-disable-line react-hooks/exhaustive-deps

    // --- Responsive Pagination Sync ---
    const responsiveLimit = useResponsiveLimit(12);
    useEffect(() => {
        if (responsiveLimit !== limit) {
            setLimit(responsiveLimit);
        }
    }, [responsiveLimit, limit, setLimit]);

    // ── 2. LOCAL FILTERING & SEARCH ──
    // Derived labels for fallback matching when IDs might mismatch
    const selectedOrgLabels = useMemo(() => {
        if (!filters.organization?.length || !formOptions?.organisations) return [];
        const orgList = formOptions.organisations || [];
        return orgList
            .filter(o => filters.organization.some(id => String(id) === String(o.value)))
            .map(o => o.label?.toLowerCase().trim());
    }, [filters.organization, formOptions.organisations]);

    const filteredUsers = useMemo(() => {
        if (!allUsers || !Array.isArray(allUsers)) return [];
        
        return allUsers.filter(user => {
            // 1. Role Filter
            const userRole = (user.role_name || user.role?.role_name || (typeof user.role === 'string' ? user.role : '') || '').toLowerCase();
            const isCoordinator = userRole.includes('coordinator') || userRole.includes('coord');
            if (!isCoordinator) return false;

            // 2. Search Match
            const searchStr = search?.toLowerCase().trim();
            const matchesSearch = !searchStr || 
                user.name?.toLowerCase().includes(searchStr) ||
                user.email?.toLowerCase().includes(searchStr) ||
                user.mobile_number?.toLowerCase().includes(searchStr) ||
                user.org_name?.toLowerCase().includes(searchStr);
            
            if (!matchesSearch) return false;

            // 3. Organization Filter (Robust ID + Label Fallback)
            const userOrgId = user.organisation_id || user.org_id || 
                             (typeof user.organisation === 'object' ? user.organisation?.id : user.organisation);
            const userOrgName = (user.org_name || user.organisation?.name || '').toLowerCase().trim();
            
            const matchesOrg = filters.organization?.length === 0 || 
                filters.organization.some(id => String(id) === String(userOrgId)) ||
                selectedOrgLabels.includes(userOrgName);
            
            if (!matchesOrg) return false;

            // 4. Status Filter
            const matchesStatus = filters.status?.length === 0 || 
                filters.status.some(s => s.toLowerCase() === user.status?.toLowerCase());
            
            return matchesStatus;
        });
    }, [allUsers, search, filters, selectedOrgLabels]);

    // Local Pagination & Sorting
    const totalCount = filteredUsers.length;

    const sortedUsers = useMemo(() => {
        if (!Array.isArray(filteredUsers)) return [];
        return [...filteredUsers].sort((a, b) => {
            const av = (a[sortKey] || '').toString().toLowerCase();
            const bv = (b[sortKey] || '').toString().toLowerCase();
            return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
        });
    }, [filteredUsers, sortKey, sortDir]);

    const paginatedUsers = useMemo(() => {
        const start = (page - 1) * limit;
        return sortedUsers.slice(start, start + limit);
    }, [sortedUsers, page, limit]);

    // Auto-reset to page 1 when filter/search changes
    useEffect(() => {
        setPage(1);
    }, [search, filters, setPage]);

    // Roles are static for the product
    const filterOptions = useMemo(() => ({
        organizations: (formOptions?.organisations || []).map(o => ({ value: o.value, label: o.label })),
        roles: [{ value: 'coordinator', label: 'Coordinator' }]
    }), [formOptions]);


    // ── Modal & UI state ──
    const [peekUser, setPeekUser] = useState(null);
    const [isPeekOpen, setIsPeekOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [statusTarget, setStatusTarget] = useState(null);
    const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
    const [selectionMode, setSelectionMode] = useState(false);
    const [viewMode] = useState('list');

    // ── 3. STATE SYNC & DERIVED DATA ──
    // Sync peekUser with latest list data (prevents stale snapshot in modal)
    const livePeekUser = useMemo(() => {
        if (!peekUser?.id || !allUsers) return peekUser;
        return allUsers.find(u => String(u.id) === String(peekUser.id)) || peekUser;
    }, [peekUser, allUsers]);



    // ── Handlers ──
    // Default values for new coordinator (no id = modal treats as "Add" mode)
    const defaultNewCoordinator = useMemo(() => ({
        role: 'coordinator',
        organisation_id: orgIdFromUrl || '',
        org_name: orgNameFromUrl || ''
    }), [orgIdFromUrl, orgNameFromUrl]);

    const handleAddUser = useCallback(() => {
        setEditingUser(defaultNewCoordinator);
        setIsFormOpen(true);
    }, [defaultNewCoordinator]);

    const handleEditUser = useCallback((user) => {
        setEditingUser(user);
        setIsFormOpen(true);
        setIsPeekOpen(false);
    }, []);

    const handleFormSubmit = useCallback(async (data) => {
        // Force role as coordinator (data is FormData — use .set(), NOT spread)
        // data is FormData — append role directly
        if (data instanceof FormData) {
            data.set('role', 'COORDINATOR');
        }
        const res = editingUser?.id
            ? await updateUser(editingUser.id, data)
            : await createUser(data);

        if (res.success) {
            const userName = res.data?.name || data.name || 'User';
            const isEmailSent = res.data?.email_sent;

            if (isEmailSent === true) {
                toast.success(`Email sent successfully: ${userName} ${editingUser?.id ? 'updated' : 'added'}`);
            } else if (isEmailSent === false) {
                toast.error(`${editingUser?.id ? 'Profile updated' : 'Coordinator added'}, but email could not be sent`);
            } else {
                toast.success(editingUser?.id ? 'Profile updated' : 'Coordinator added');
            }

            // --- INSTANT CACHE SYNC ---
            // Manual update to React Query cache so UI changes in 1ms
            if (editingUser?.id) {
                // Determine new status from formData or response
                const updatedStatus = res.data?.status || (data instanceof FormData ? data.get('status') : data.status);
                
                queryClient.setQueriesData({ queryKey: ['users', 'admin-orchestrator'] }, (oldData) => {
                    if (!oldData || !oldData.users) return oldData;
                    return {
                        ...oldData,
                        users: oldData.users.map(u => 
                            String(u.id) === String(editingUser.id) 
                                ? { ...u, ...res.data, status: updatedStatus } 
                                : u
                        )
                    };
                });
            }

            setIsFormOpen(false);
            setEditingUser(null);

            // Background refresh for eventual consistency
            setTimeout(() => refetchAll(), 100);
        } else {
            toast.error(res.error || 'Failed to save');
        }
        return res;
    }, [editingUser, updateUser, createUser, queryClient, refetchAll]);
    const handleBulkActivate = async () => {
        const res = await bulkAction('activate', selectedIds);
        if (res.success) toast.success(`Activated ${selectedIds.length} profiles`);
    };

    const handleConfirmDeactivate = async () => {
        const targets = statusTarget ? [statusTarget.id] : selectedIds;
        const res = await bulkAction('deactivate', targets);
        if (res.success) {
            toast.success(`Deactivated records`);
            setStatusTarget(null);
            setBulkStatusOpen(false);
        }
    };

    const handleResetAll = () => {
        setSearchParams({});
        resetFilters();
        // Explicitly set coordinator role as a fallback to bypass any race conditions
        setFilters({ role: ['coordinator'], organization: [], status: [], region: [] });
    };

    const navigate = useNavigate();
    const handleViewSites = (user) => {
        const orgId = user.organisation_id || '';
        const orgName = user.org_name || '';
        navigate(`/admin/site-plan?org_id=${orgId}&org_name=${encodeURIComponent(orgName)}&coord_id=${user.id}&coord=${encodeURIComponent(user.name)}`);
    };

    const columns = useMemo(() => [
        {
            header: 'COORDINATOR',
            accessor: 'name',
            width: '25%',
            render: (_, row) => (
                <div className="flex items-center gap-3 py-1.5">
                    <UserAvatar name={row.name} avatar={row?.avatar} size="40px" className="border-2 border-white ring-1 ring-border-main" />
                    <div className="flex flex-col min-w-0">
                        <span className="text-[14px] font-black text-title leading-tight truncate">{row.name || 'User'}</span>
                        <span className="text-[9px] font-bold text-gray uppercase tracking-widest bg-base px-1.5 py-0.5 rounded border border-border-main/50 self-start mt-1">COORDINATOR</span>
                    </div>
                </div>
            )
        },
        {
            header: 'CONTACT',
            accessor: 'email',
            width: '20%',
            render: (value, row) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5"><FiMail size={11} className="text-gray/40" /><span className="text-[12px] font-medium text-title truncate">{value}</span></div>
                    <div className="flex items-center gap-1.5 mt-1"><FiPhone size={11} className="text-gray/40" /><span className="text-[11px] font-bold text-gray">{row?.mobile_number || 'No Phone'}</span></div>
                </div>
            )
        },
        {
            header: 'ORGANIZATION',
            accessor: 'org_name',
            width: '20%',
            render: (value, row) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5"><FiLayers size={12} className="text-primary/60" /><span className="text-[13px] font-black text-title truncate">{value || 'Unassigned'}</span></div>
                    <span className="text-[9px] text-gray/60 font-bold uppercase tracking-wider mt-1">{row?.region || 'National Fleet'}</span>
                </div>
            )
        },
        {
            header: 'STATUS',
            accessor: 'status',
            width: '120px',
            align: 'center',
            render: (value) => {
                const status = (value || 'deactive').toLowerCase();
                const isActive = status === 'active';
                return (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold tracking-wide uppercase ${
                        isActive 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {isActive ? 'ACTIVE' : 'DEACTIVE'}
                    </div>
                );
            }
        },
        {
            header: 'ACTIONS',
            accessor: 'id',
            width: '100px',
            align: 'right',
            render: (_, row) => (
                <div className="flex items-center justify-end gap-1.5 pr-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const orgId = row.organisation_id || '';
                            const orgName = row.org_name || '';
                            navigate(`/admin/site-plan?org_id=${orgId}&org_name=${encodeURIComponent(orgName)}&coord_id=${row.id}&coord=${encodeURIComponent(row.name)}`);
                        }}
                        className="w-8 h-8 flex items-center justify-center text-primary border border-primary/20 hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm bg-primary/5"
                        title="View Managed Sites"
                    >
                        <FiLayers size={12} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setPeekUser(row); setIsPeekOpen(true); }} className="w-8 h-8 flex items-center justify-center text-gray border border-border-main hover:bg-primary/5 hover:text-primary hover:border-primary/30 rounded-xl transition-all shadow-sm" title="View Profile"><FiUser size={13} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleEditUser(row); }} className="px-3 h-8 flex items-center justify-center text-gray border border-border-main hover:bg-primary hover:text-white rounded-xl transition-all text-[9px] font-black uppercase">Edit</button>
                </div>
            )
        }
    ], [handleEditUser, navigate]);



    const paginationFooter = (
        <Pagination
            currentPage={page}
            totalPages={Math.ceil(totalCount / limit) || 1}
            onPageChange={setPage}
            totalItems={totalCount}
            itemsPerPage={limit}
            variant="ghost"
        />
    );

    const currentOrg = filters.organization?.length === 1 ? filterOptions.organizations.find(o => String(o.value) === String(filters.organization[0])) : null;
    const orgLabel = (filters.organization?.length > 1) ? `Organizations (${filters.organization.length})` : currentOrg?.label || orgNameFromUrl;

    const breadcrumbs = useMemo(() => {
        const base = [
            { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
            { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
        ];
        if (orgLabel) {
            base.push({
                label: orgLabel,
                path: `/admin/coordinators?org_id=${filters.organization?.join(',') || ''}`
            });
        }
        base.push({ label: "Management", path: "#", isActive: true });
        return base;
    }, [filters.organization, orgLabel]);

    return (
        <div className="flex flex-col gap-6 w-full pb-10 animate-in fade-in duration-500">
            <PageHeader
                title={orgNameFromUrl ? (
                    <div className="flex items-center gap-3">
                        <span className="text-primary/70 font-black">Personnel:</span>
                        <span>{orgNameFromUrl}</span>
                        <div className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20 animate-pulse">
                            Context Active
                        </div>
                    </div>
                ) : "Coordinator Management"}
                subtitle={orgNameFromUrl ? `Authorized staff assigned to ${orgNameFromUrl}` : "System-wide administrative resource control"}
                onAdd={handleAddUser}
                addButtonText="Add Coordinator"
                breadcrumbs={breadcrumbs}
                rightContent={
                    <button 
                        onClick={() => refetchAll()}
                        disabled={isFetching}
                        className={`flex items-center gap-2 px-4 py-2 bg-white border border-border-main/80 rounded-full shadow-sm hover:shadow-md hover:border-primary/30 transition-all group ${isFetching ? 'opacity-70' : ''}`}
                    >
                        <div className={`text-primary/40 group-hover:text-primary transition-colors ${isFetching ? 'animate-spin' : ''}`}>
                            <FiRefreshCw size={14} />
                        </div>
                        <span className="text-[11px] font-black text-title uppercase tracking-widest">
                            {isFetching ? 'Syncing...' : 'Refresh'}
                        </span>
                    </button>
                }
            />



            <FilterBar className="!p-2.5">
                <div className="flex items-center gap-2 pr-3 border-r border-border-main/40">
                    <Button variant={selectionMode ? "primary" : "outline"} onClick={() => setSelectionMode(!selectionMode)} className="!h-9 !px-3 !text-[11px] !font-black !uppercase flex items-center gap-1.5 tracking-widest">
                        <FiActivity size={13} /> Select
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2 flex-1 pl-3">
                    <FilterDropdown label="Organization" options={filterOptions.organizations} value={filters.organization} onChange={v => setFilters({ ...filters, organization: v })} allLabel="All" multiple={true} loading={isLoading} />
                    <FilterDropdown label="Status" options={[{ value: 'active', label: 'Active' }, { value: 'deactive', label: 'Inactive' }]} value={filters.status} onChange={v => setFilters({ ...filters, status: v })} allLabel="All" multiple={true} />
                </div>
            </FilterBar>

            {selectionMode && selectedIds.length > 0 && (
                <div className="flex items-center justify-between py-3 px-6 bg-primary/[0.04] border border-primary/20 rounded-2xl animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center text-[12px] font-black">{selectedIds.length}</div>
                        <span className="text-[13px] font-black text-title uppercase tracking-tight">Records Selected</span>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleBulkActivate} variant="outline" className="!h-9 !px-4 !text-[10px] !font-black !rounded-xl uppercase tracking-widest bg-emerald-50 text-emerald-700">Activate</Button>
                        <Button onClick={() => setBulkStatusOpen(true)} variant="outline" className="!h-9 !px-4 !text-[10px] !font-black !rounded-xl uppercase tracking-widest bg-rose-50 text-rose-700">Deactivate</Button>
                    </div>
                </div>
            )}

            {isLoading ? (
                viewMode === 'grid' ? <CardSkeleton count={8} columns={5} /> : <TableSkeleton rows={10} />
            ) : filteredUsers.length > 0 ? (
                <DataTable columns={columns} data={paginatedUsers} loading={isLoading} selectable={selectionMode} selectedIds={selectedIds} onSelectionChange={(ids) => setSelectedIds(ids)} footer={paginationFooter} />
            ) : (
                <div className="flex flex-col items-center justify-center py-20 px-6 bg-card/30 border-2 border-dashed border-border-main rounded-[24px]">
                    <div className="w-20 h-20 rounded-full bg-base border border-border-main/50 flex items-center justify-center mb-6 shadow-sm">
                        <FiLayers className="w-8 h-8 text-gray/20" />
                    </div>
                    <h3 className="text-xl font-bold text-title mb-2">No Personnel Located</h3>
                    <p className="text-gray text-[13px] mb-8 font-medium italic max-w-[300px] text-center">
                        We couldn't find any coordinators {orgNameFromUrl ? `assigned to ${orgNameFromUrl}` : 'in the system'}.
                    </p>
                    <div className="flex gap-4">
                        {orgNameFromUrl && (
                            <Button onClick={handleResetAll} variant="outline" className="!px-8 !font-black !uppercase !tracking-widest !rounded-xl">View All Profiles</Button>
                        )}
                        <Button onClick={handleAddUser} variant="primary" className="!px-8 !font-black !uppercase !tracking-widest !rounded-xl shadow-lg shadow-primary/20">Add Coordinator</Button>
                    </div>
                </div>
            )}

            <UserPeekView isOpen={isPeekOpen} onClose={() => setIsPeekOpen(false)} user={livePeekUser} onEdit={handleEditUser} onViewSites={handleViewSites} />
            <React.Suspense fallback={null}>
                <UserFormModal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingUser(null); }} onSubmit={handleFormSubmit} user={editingUser} loading={storeLoading} formOptions={formOptions} />
                <ConfirmModal isOpen={!!statusTarget} onClose={() => setStatusTarget(null)} onConfirm={handleConfirmDeactivate} title="Status Lock" message={`Are you sure you want to change status?`} confirmText="Confirm" danger={true} />
                <ConfirmModal isOpen={bulkStatusOpen} onClose={() => setBulkStatusOpen(false)} onConfirm={handleConfirmDeactivate} title="Bulk Deactivation" message={`Are you sure you want to deactivate ${selectedIds.length} profiles? This will suspend their access immediately.`} confirmText="Deactivate All" danger={true} />
            </React.Suspense>
        </div>
    );
});

Coordinator.displayName = 'Coordinator';
export default Coordinator;