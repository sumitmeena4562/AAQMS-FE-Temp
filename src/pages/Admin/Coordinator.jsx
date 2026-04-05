import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useUserStore from '../../store/userStore';
import UserPeekView from '../../components/Dashboard/UserPeekView';
import UserFormModal from '../../components/Dashboard/UserFormModal';
import ConfirmModal from '../../components/UI/ConfirmModal';
import { StatsRow } from '../../components/Dashboard/StatsCard';
import PageHeader from '../../components/UI/PageHeader';
import DataTable from '../../components/UI/DataTable';
import {
    FiUsers, FiRefreshCw, FiRefreshCcw, FiCheckCircle, FiAlertCircle, FiClock,
    FiExternalLink, FiHome, FiShield,  FiActivity, FiLayers, FiMail, FiPhone
} from 'react-icons/fi';
import FilterDropdown from '../../components/UI/FilterDropdown';
import Button from '../../components/UI/Button';
import UserCard from '../../components/UI/UserCard';
import useDebounce from '../../hooks/useDebounce';
import UserAvatar from '../../components/UI/UserAvatar';
import FilterBar from '../../components/UI/FilterBar';

/**
 * COORDINATOR MANAGEMENT PAGE
 * Optimized for 100% Production Readiness.
 * Features: URL-based filtering (org_id), Role-locked view, and standard Personnel UI.
 */
const Coordinator = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const orgIdFromUrl = searchParams.get('org_id');
    const orgNameFromUrl = searchParams.get('org_name');

    const store = useUserStore();
    const {
        users, stats, filterOptions, loading, totalCount, limit, offset,
        search, filters, sortKey, sortDir, selectedIds,
        fetchUsers, fetchInitialData, setPage,
        setFilters, toggleSelectRow,
        setSelectedIds, resetFilters,
    } = store;

    // ── Modal & UI state ──
    const [peekUser, setPeekUser] = useState(null);
    const [isPeekOpen, setIsPeekOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [statusTarget, setStatusTarget] = useState(null);
    const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
    const [selectionMode, setSelectionMode] = useState(false);
    const [viewMode, setViewMode] = useState('list');

    // Search Debounce
    const debouncedSearch = useDebounce(search, 300);

    // ── DATA FETCHING ──
    useEffect(() => {
        // Initialize with Coordinator role and Org ID from URL if provided
        const initialFilters = { 
            role: 'coordinator', 
            organization: orgIdFromUrl || '', 
            status: '', 
            region: '' 
        };
        setFilters(initialFilters);
        fetchInitialData();
        
        // Cleanup on unmount
        return () => resetFilters();
    }, [fetchInitialData, orgIdFromUrl, setFilters, resetFilters]);

    useEffect(() => {
        if (!loading) fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, JSON.stringify(filters), offset]);

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
            ? await store.updateUser(editingUser.id, finalData)
            : await store.createUser(finalData);

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
        const res = await store.bulkAction('activate', selectedIds);
        if (res.success) toast.success(`Activated ${selectedIds.length} profiles`);
    };

    const handleConfirmDeactivate = async () => {
        const targets = statusTarget ? [statusTarget.id] : selectedIds;
        const res = await store.bulkAction('deactivate', targets);
        if (res.success) {
            toast.success(`Deactivated records`);
            setStatusTarget(null);
            setBulkStatusOpen(false);
        }
    };

    const handleResetAll = () => {
        setSearchParams({});
        resetFilters();
        setFilters({ role: 'coordinator', organization: '', status: '', region: '' });
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
            accessor: 'organization',
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
                    <button onClick={(e) => { e.stopPropagation(); setPeekUser(row); setIsPeekOpen(true); }} className="w-8 h-8 flex items-center justify-center text-gray border border-border-main hover:bg-title hover:text-white rounded-xl transition-all shadow-sm"><FiExternalLink size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleEditUser(row); }} className="px-3 h-8 flex items-center justify-center text-gray border border-border-main hover:bg-primary hover:text-white rounded-xl transition-all text-[9px] font-black uppercase">Edit</button>
                </div>
            )
        }
    ], [handleEditUser]);

    const statsData = [
        { title: 'Total Coordinators', value: stats.total || 0, icon: FiUsers, iconColorClass: 'text-primary', iconBgClass: 'bg-primary/10', description: 'Assigned personnel' },
        { title: 'Active Units', value: stats.active || 0, icon: FiCheckCircle, iconColorClass: 'text-success', iconBgClass: 'bg-emerald-50', description: 'Ready for ops' },
        { title: 'Inactive', value: stats.inactive || 0, icon: FiAlertCircle, iconColorClass: 'text-danger', iconBgClass: 'bg-rose-50', description: 'Requires review' },
        { title: 'Unassigned', value: stats.unassigned || 0, icon: FiClock, iconColorClass: 'text-warning', iconBgClass: 'bg-amber-50', description: 'Pending org linkage' },
    ];

    const paginationFooter = (
        <div className="flex justify-between items-center w-full bg-card py-6 px-8 rounded-b-2xl border-t border-border-main/50">
            <div className="text-[12px] text-gray font-medium uppercase tracking-tight">Personnel Records Found: <span className="font-black text-title">{totalCount}</span></div>
            <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={() => setPage(Math.floor(offset / limit))} disabled={offset === 0 || loading} className="px-6 font-black tracking-widest uppercase text-[10px] h-10">Previous</Button>
                <Button variant="outline" size="sm" onClick={() => setPage(Math.floor(offset / limit) + 2)} disabled={offset + limit >= totalCount || loading} className="px-6 font-black tracking-widest uppercase text-[10px] h-10">Next</Button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-6 w-full pb-10 animate-in fade-in duration-500">
            <PageHeader
                title={orgNameFromUrl ? `Personnel: ${orgNameFromUrl}` : "Coordinator Management"}
                subtitle={orgNameFromUrl ? `Viewing staff assigned to this organization` : "System-wide administrative resource control"}
                onAdd={handleAddUser}
                addButtonText="Add Coordinator"
                breadcrumbs={[
                    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
                    { label: "Personnel", path: "/admin/users" },
                    { label: "Coordinators", path: "/admin/coordinators", isActive: true }
                ]}
                rightContent={
                    <Button onClick={handleResetAll} variant="outline" size="sm" className="!h-[38px] bg-card flex items-center gap-2 px-4 border-dashed border-primary/30">
                        <FiRefreshCcw size={14} />
                        <span className="font-black text-[10px] uppercase tracking-widest">Reset All</span>
                    </Button>
                }
            />

            <StatsRow items={statsData} />

            <FilterBar className="!p-2.5">
                <div className="flex items-center gap-2 pr-3 border-r border-border-main/40">
                    <Button variant={selectionMode ? "primary" : "outline"} onClick={() => setSelectionMode(!selectionMode)} className="!h-9 !px-3 !text-[11px] !font-black !uppercase flex items-center gap-1.5 tracking-widest">
                        <FiActivity size={13} /> Select
                    </Button>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 flex-1 pl-3">
                    <FilterDropdown label="Organization" options={filterOptions.organizations} value={filters.organization} onChange={v => setFilters({ ...filters, organization: v })} allLabel="All Organizations" />
                    <FilterDropdown label="Status" options={[{ value: 'active', label: 'Active' }, { value: 'deactive', label: 'Deactive' }]} value={filters.status} onChange={v => setFilters({ ...filters, status: v })} allLabel="All Statuses" />
                </div>

                <div className="ml-auto">
                    <FilterBar.ViewToggle mode={viewMode} onChange={setViewMode} />
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

            {sortedUsers.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {sortedUsers.map(user => (
                                <UserCard key={user.id} user={user} selectable={selectionMode} isSelected={selectedIds.includes(user.id)} onSelect={(id) => store.toggleSelectRow(id)} onEdit={handleEditUser} onView={(u) => { setPeekUser(u); setIsPeekOpen(true); }} />
                            ))}
                        </div>
                        {paginationFooter}
                    </div>
                ) : (
                    <DataTable columns={columns} data={sortedUsers} loading={loading} selectable={selectionMode} selectedIds={selectedIds} onSelectionChange={(ids) => setSelectedIds(ids)} footer={paginationFooter} />
                )
            ) : (
                <div className="flex flex-col items-center justify-center py-20 px-6 bg-card/30 border-2 border-dashed border-border-main rounded-2xl">
                    <FiLayers className="w-12 h-12 text-gray/20 mb-4" />
                    <h3 className="text-lg font-bold text-title mb-1">No Personnel Located</h3>
                    <p className="text-gray text-[12px] mb-8 font-medium italic">Refine search parameters or reset context.</p>
                    <Button onClick={handleResetAll} variant="primary" size="md" className="!px-8 !font-black !uppercase !tracking-widest">View All Profiles</Button>
                </div>
            )}

            <UserPeekView isOpen={isPeekOpen} onClose={() => setIsPeekOpen(false)} user={peekUser} onEdit={handleEditUser} />
            <UserFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} user={editingUser} loading={loading} />
            <ConfirmModal isOpen={!!statusTarget} onClose={() => setStatusTarget(null)} onConfirm={handleConfirmDeactivate} title="Status Lock" message={`Are you sure you want to change status?`} confirmText="Confirm" danger={true} />
            <ConfirmModal isOpen={bulkStatusOpen} onClose={() => setBulkStatusOpen(false)} onConfirm={handleConfirmDeactivate} title="Bulk Change" message={`Update ${selectedIds.length} profiles?`} confirmText="Confirm All" danger={true} />
        </div>
    );
};

export default Coordinator;