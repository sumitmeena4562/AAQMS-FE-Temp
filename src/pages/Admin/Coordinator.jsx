import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useUserStore from '../../store/userStore';
import UserPeekView from '../../components/Dashboard/UserPeekView';
import UserFormModal from '../../components/Dashboard/UserFormModal';
import ConfirmModal from '../../components/UI/ConfirmModal';
import { StatsRow } from '../../components/Dashboard/StatsCard';
import PageHeader from '../../components/UI/PageHeader';
import DataTable from '../../components/UI/DataTable';
import {
    FiUsers, FiUser, FiRefreshCw, FiRefreshCcw, FiCheckCircle, FiAlertCircle, FiClock,
    FiExternalLink, FiHome, FiShield,  FiActivity, FiLayers, FiMail, FiPhone, FiX
} from 'react-icons/fi';
import FilterDropdown from '../../components/UI/FilterDropdown';
import Button from '../../components/UI/Button';
import UserCard from '../../components/UI/UserCard';
import useDebounce from '../../hooks/useDebounce';
import UserAvatar from '../../components/UI/UserAvatar';
import FilterBar from '../../components/UI/FilterBar';
import { useUsers, useCoordinatorStats } from '../../hooks/api/useUserQueries';
import { useHierarchy } from '../../hooks/api/useHierarchy';
import useSearchStore from '../../store/useSearchStore';
import TableSkeleton from '../../components/UI/TableSkeleton';
import CardSkeleton from '../../components/UI/CardSkeleton';

/**
 * COORDINATOR MANAGEMENT PAGE
 * Optimized for 100% Production Readiness.
 * Features: URL-based filtering (org_id), Role-locked view, and standard Personnel UI.
 */
const Coordinator = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const orgIdFromUrl = searchParams.get('org_id');
    const orgNameFromUrl = searchParams.get('org_name');

    // ── STORES (UI state only) ──
    const { 
        filters, sortKey, sortDir, selectedIds, page, limit, loading: storeLoading,
        setPage, setFilters, toggleSelectRow, setSelectedIds, resetFilters,
        setLoading, setError
    } = useUserStore();
    const { query: search } = useSearchStore();

    const { updateUser, createUser, bulkAction } = useUserStore();

    // ── QUERY HOOKS (NEW) ──
    const debouncedSearch = useDebounce(search, 400);
    
    // URL Sync for Org Context
    useEffect(() => {
        if (orgIdFromUrl) {
            setFilters({ organization: [orgIdFromUrl], role: ['coordinator'] });
        } else {
            setFilters({ role: ['coordinator'] });
        }
    }, [orgIdFromUrl]);

    // Role-locked Users Query
    const queryFilters = { ...filters, role: 'coordinator' };
    const { data: usersData, isLoading: isUsersLoading } = useUsers(queryFilters, debouncedSearch, page);
    const { data: stats = { total: 0, active: 0, inactive: 0, unassigned: 0 } } = useCoordinatorStats(filters.organization);
    
    // ── HIERARCHY DATA (UNIFIED) ──
    const { organizations } = useHierarchy();
    
    // Roles are static for the product
    const filterOptions = {
        organizations: organizations.map(o => ({ value: o.id, label: o.name })),
        roles: [{ value: 'coordinator', label: 'Coordinator' }]
    };

    const users = usersData?.users || [];
    const totalCount = usersData?.totalCount || 0;

    // ── Modal & UI state ──
    const [peekUser, setPeekUser] = useState(null);
    const [isPeekOpen, setIsPeekOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [statusTarget, setStatusTarget] = useState(null);
    const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
    const [selectionMode, setSelectionMode] = useState(false);
    const [viewMode, setViewMode] = useState('list');



    const sortedUsers = useMemo(() => {
        if (!Array.isArray(users)) return [];
        return [...users].sort((a, b) => {
            const av = (a[sortKey] || '').toString().toLowerCase();
            const bv = (b[sortKey] || '').toString().toLowerCase();
            return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
        });
    }, [users, sortKey, sortDir]);

    // ── Handlers ──
    const handleAddUser = () => {
        setEditingUser({ role: 'coordinator', organisation_id: orgIdFromUrl });
        setIsFormOpen(true);
    };

    const handleEditUser = useCallback((user) => {
        setEditingUser(user);
        setIsFormOpen(true);
        setIsPeekOpen(false);
    }, []);

    const handleFormSubmit = async (data) => {
        // Force role as coordinator
        const finalData = { ...data, role: 'coordinator' };
        const res = editingUser?.id
            ? await updateUser(editingUser.id, finalData)
            : await createUser(finalData);

        if (res.success) {
            toast.success(editingUser?.id ? 'Profile updated' : 'Coordinator added');
            setIsFormOpen(false);
            setEditingUser(null);
        } else {
            toast.error(res.error || 'Failed to save');
        }
        return res;
    };

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
                    <div className="flex items-center gap-1.5"><FiMail size={11} className="text-gray/40"/><span className="text-[12px] font-medium text-title truncate">{value}</span></div>
                    <div className="flex items-center gap-1.5 mt-1"><FiPhone size={11} className="text-gray/40"/><span className="text-[11px] font-bold text-gray">{row?.mobile_number || 'No Phone'}</span></div>
                </div>
            )
        },
        {
            header: 'ORGANIZATION',
            accessor: 'org_name',
            width: '20%',
            render: (value, row) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5"><FiLayers size={12} className="text-primary/60"/><span className="text-[13px] font-black text-title truncate">{value || 'Unassigned'}</span></div>
                    <span className="text-[9px] text-gray/60 font-bold uppercase tracking-wider mt-1">{row?.region || 'National Fleet'}</span>
                </div>
            )
        },
        {
            header: 'STATUS',
            accessor: 'status',
            width: '15%',
            align: 'center',
            render: (value) => {
                const isActive = value?.toLowerCase() === 'active';
                return (
                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border mx-auto shadow-sm transition-all
                        ${isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50' : 'bg-rose-50 text-rose-700 border-rose-100/50'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                        {isActive ? 'Active' : 'Deactive'}
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

    const statsData = [
        { title: 'Total Coordinators', value: stats.total || 0, icon: FiUsers, iconColorClass: 'text-primary', iconBgClass: 'bg-primary/10', description: 'Assigned personnel' },
        { title: 'Active Units', value: stats.active || 0, icon: FiCheckCircle, iconColorClass: 'text-success', iconBgClass: 'bg-emerald-50', description: 'Ready for ops' },
        { title: 'Inactive', value: stats.inactive || 0, icon: FiAlertCircle, iconColorClass: 'text-danger', iconBgClass: 'bg-rose-50', description: 'Requires review' },
        { title: 'Unassigned', value: stats.unassigned || 0, icon: FiClock, iconColorClass: 'text-warning', iconBgClass: 'bg-amber-50', description: 'Pending org linkage' },
    ];

    const paginationFooter = (
        <div className="flex justify-between items-center w-full bg-card py-6 px-8 rounded-b-2xl border-t border-border-main/50">
            <div className="text-[12px] text-gray font-medium uppercase tracking-tight">Personnel Records Found: <span className="font-black text-title">{totalCount}</span></div>
            <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-gray/60">Page {page} of {Math.ceil(totalCount / limit) || 1}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page <= 1 || isUsersLoading} className="px-6 font-black tracking-widest uppercase text-[10px] h-10">Previous</Button>
                <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page * limit >= totalCount || isUsersLoading} className="px-6 font-black tracking-widest uppercase text-[10px] h-10">Next</Button>
            </div>
        </div>
    );

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
                breadcrumbs={[
                    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
                    { label: "Organizations", path: "/admin/organizations" },
                    { label: orgNameFromUrl ? `Personnel Records` : "Coordinators", path: "/admin/coordinators", isActive: true }
                ]}
                rightContent={
                    <div className="flex items-center gap-3">
                         <div className="flex flex-col items-end px-4 border-r border-border-main/50 translate-y-[2px]">
                            <span className="text-[9px] font-black text-gray uppercase tracking-widest opacity-60 leading-none mb-1">Status</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-[11px] font-bold text-title uppercase">Live Ops</span>
                            </div>
                        </div>
                        <Button onClick={handleResetAll} variant="outline" size="sm" className="!h-[38px] bg-card flex items-center gap-2 px-4 border-dashed border-primary/30 hover:border-primary/60 transition-all">
                            <FiRefreshCcw size={14} className={isUsersLoading ? 'animate-spin' : ''} />
                            <span className="font-black text-[10px] uppercase tracking-widest text-primary">Clear Context</span>
                        </Button>
                    </div>
                }
            />



            <FilterBar className="!p-2.5">
                <div className="flex items-center gap-2 pr-3 border-r border-border-main/40">
                    <Button variant={selectionMode ? "primary" : "outline"} onClick={() => setSelectionMode(!selectionMode)} className="!h-9 !px-3 !text-[11px] !font-black !uppercase flex items-center gap-1.5 tracking-widest">
                        <FiActivity size={13} /> Select
                    </Button>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 flex-1 pl-3">
                    <FilterDropdown label="Organization" options={filterOptions.organizations} value={filters.organization} onChange={v => setFilters({ ...filters, organization: v })} allLabel="All Organizations" multiple={true} />
                    <FilterDropdown label="Status" options={[{ value: 'active', label: 'Active' }, { value: 'deactive', label: 'Deactive' }]} value={filters.status} onChange={v => setFilters({ ...filters, status: v })} allLabel="All Statuses" multiple={true} />
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

            {isUsersLoading ? (
                viewMode === 'grid' ? <CardSkeleton count={8} columns={5} /> : <TableSkeleton rows={10} />
            ) : sortedUsers.length > 0 ? (
                <DataTable columns={columns} data={sortedUsers} loading={isUsersLoading} selectable={selectionMode} selectedIds={selectedIds} onSelectionChange={(ids) => setSelectedIds(ids)} footer={paginationFooter} />
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

            <UserPeekView isOpen={isPeekOpen} onClose={() => setIsPeekOpen(false)} user={peekUser} onEdit={handleEditUser} onViewSites={handleViewSites} />
            <UserFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} user={editingUser} loading={storeLoading} />
            <ConfirmModal isOpen={!!statusTarget} onClose={() => setStatusTarget(null)} onConfirm={handleConfirmDeactivate} title="Status Lock" message={`Are you sure you want to change status?`} confirmText="Confirm" danger={true} />
            <ConfirmModal isOpen={bulkStatusOpen} onClose={() => setBulkStatusOpen(false)} onConfirm={handleConfirmDeactivate} title="Bulk Change" message={`Update ${selectedIds.length} profiles?`} confirmText="Confirm All" danger={true} />
        </div>
    );
};

export default Coordinator;