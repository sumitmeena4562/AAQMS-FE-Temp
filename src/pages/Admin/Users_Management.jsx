import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import useUserStore from '../../store/userStore';
import UserPeekView from '../../components/Dashboard/UserPeekView';
import UserFormModal from '../../components/Dashboard/UserFormModal';
import ConfirmModal from '../../components/UI/ConfirmModal';
import { StatsRow } from '../../components/Dashboard/StatsCard';
import PageHeader from '../../components/UI/PageHeader';
import DataTable from '../../components/UI/DataTable';
import {
    FiDownload, FiUsers, FiRefreshCw, FiRefreshCcw, FiCalendar, FiCheckCircle, FiAlertCircle, FiClock,
    FiExternalLink, FiSquare, FiCheckSquare, FiHome, FiBriefcase, FiShield, FiUserCheck, FiUserX,
    FiMail, FiPhone, FiLayers, FiActivity
} from 'react-icons/fi';
import FilterDropdown from '../../components/UI/FilterDropdown';
import Button from '../../components/UI/Button';
import UserAvatar from '../../components/UI/UserAvatar';
import Badge from '../../components/UI/Badge';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import FilterBar from '../../components/UI/FilterBar';
import useDebounce from '../../hooks/useDebounce';
import TableSkeleton from '../../components/UI/TableSkeleton';
import CardSkeleton from '../../components/UI/CardSkeleton';
import UserCard from '../../components/UI/UserCard';
import { useUsers, useUserStats } from '../../hooks/api/useUserQueries';
import { useHierarchy } from '../../hooks/api/useHierarchy';
import useSearchStore from '../../store/useSearchStore';

export default function Users() {
    // ── STORES (UI state only) ──
    const { 
        filters, sortKey, sortDir, selectedIds, page, limit, loading: storeLoading,
        setPage, setFilters, toggleSelectRow, clearSelection, resetFilters,
        setSelectedIds, setLoading, setError // Keeping for mutations
    } = useUserStore();
    const { query: search } = useSearchStore();

    const { updateUser, createUser, bulkAction, exportPDF } = useUserStore();

    // ── QUERY HOOKS (NEW) ──
    const debouncedSearch = useDebounce(search, 400);
    
    // Sync React Query with local state
    const { data: usersData, isLoading: isUsersLoading } = useUsers(filters, debouncedSearch, page);
    const { data: stats = { total: 0, active: 0, inactive: 0, unassigned: 0 } } = useUserStats();
    
    // ── HIERARCHY DATA (UNIFIED) ──
    const { organizations, sites } = useHierarchy();
    
    // Roles are static for the product
    const STATIC_ROLES = [
        { value: 'admin', label: 'Admin' },
        { value: 'coordinator', label: 'Coordinator' },
        { value: 'field_officer', label: 'Field Officer' }
    ];

    const filterOptions = {
        organizations: organizations.map(o => ({ value: o.id, label: o.name })),
        regions: sites.map(s => ({ value: s.id, label: s.site_name || s.name })),
        roles: STATIC_ROLES
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
        const list = [...users];
        list.sort((a, b) => {
            const av = (a[sortKey] || '').toString().toLowerCase();
            const bv = (b[sortKey] || '').toString().toLowerCase();
            return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
        });
        return list;
    }, [users, sortKey, sortDir]);

    const activeFilterCount = Object.values(filters).filter(v => v && v !== '' && v !== 'all').length;

    // ── Handlers ──

    const handleAddUser = () => {
        setEditingUser(null);
        setIsFormOpen(true);
    };

    const handleEditUser = useCallback((user) => {
        setEditingUser(user);
        setIsFormOpen(true);
        setIsPeekOpen(false);
    }, []);

    const handleFormSubmit = async (data) => {
        const res = editingUser
            ? await updateUser(editingUser.id, data)
            : await createUser(data);

        if (res.success) {
            toast.success(editingUser ? 'Changes to user profile have been saved' : 'New personnel successfully added to the system');
            setIsFormOpen(false);
            setEditingUser(null);
        } else {
            toast.error(res.error || 'Failed to save user');
        }
        return res;
    };

    const handleBulkActivate = async () => {
        const res = await bulkAction('activate', selectedIds);
        if (res.success) toast.success(`Selected ${selectedIds.length} users have been activated`);
    };

    const handleConfirmDeactivate = async () => {
        const targets = statusTarget ? [statusTarget.id] : selectedIds;
        const res = await bulkAction('deactivate', targets);
        if (res.success) {
            toast.success(`Selected ${targets.length} personnel have been deactivated`);
            setStatusTarget(null);
            setBulkStatusOpen(false);
        }
    };

    // Columns - Inventory Style
    const columns = useMemo(() => [
        {
            header: 'PERSONNEL PROFILE',
            accessor: 'name',
            width: '20%',
            render: (_, row) => {
                const displayName = row.name || 'System User';
                return (
                    <div className="flex items-center gap-3.5 py-1.5 pr-2 group-hover:px-1 transition-all">
                        <div className="relative shrink-0">
                            <UserAvatar name={displayName} avatar={row?.avatar} size="42px" className="shadow-sm border-2 border-white ring-1 ring-border-main" />
                            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${row?.status?.toLowerCase() === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[14px] font-black text-title leading-tight truncate">{displayName}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[9px] font-bold text-gray uppercase tracking-tighter bg-base px-1.5 py-0.5 rounded leading-none shrink-0 border border-border-main/40">{row?.role || 'user'}</span>
                                <span className="text-[9px] font-medium text-gray/60 truncate italic leading-none">• system entity</span>
                            </div>
                        </div>
                    </div>
                );
            }
        },

        {
            header: 'CONTACT',
            accessor: 'email',
            width: '18%',
            render: (value, row) => (
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                        <FiMail size={12} className="text-gray/40 shrink-0" />
                        <span className="text-[12px] font-medium text-title truncate leading-none">{value}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                        <FiPhone size={11} className="text-gray/40 shrink-0" />
                        <span className="text-[11px] font-bold text-gray leading-none tracking-tight">{row?.mobile_number || 'No Phone'}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'ORGANIZATION',
            accessor: 'organization',
            width: '15%',
            render: (value, row) => (
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                        <FiBriefcase size={12} className="text-gray/40 shrink-0" />
                        <span className="text-[13px] font-black text-title truncate leading-none">{value || 'Unassigned'}</span>
                    </div>
                    <span className="text-[9px] text-gray/60 font-bold uppercase tracking-wider mt-1 truncate pl-4">
                        {row?.region || row?.zone || 'Master Unit'}
                    </span>
                </div>
            )
        },
        {
            header: 'PERSONNEL ROLE',
            accessor: 'role',
            width: '15%',
            align: 'center',
            render: (value) => {
                const role = value?.toLowerCase();
                const config = {
                    admin: { color: 'text-amber-700 bg-amber-50 border-amber-100', icon: <FiShield size={10} />, label: 'Administrator' },
                    coordinator: { color: 'text-sky-700 bg-sky-50 border-sky-100', icon: <FiLayers size={10} />, label: 'Coordinator' },
                    field_officer: { color: 'text-teal-700 bg-teal-50 border-teal-100', icon: <FiActivity size={10} />, label: 'Field Officer' }
                }[role] || { color: 'text-gray bg-base border-border-main', icon: <FiShield size={10} />, label: value };

                return (
                    <div className="flex justify-center">
                        <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border shadow-sm ${config.color}`}>
                            {config.icon}
                            {config.label}
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'ACCOUNT STATUS',
            accessor: 'status',
            width: '15%',
            align: 'center',
            render: (value) => {
                const isActive = value?.toLowerCase() === 'active';
                return (
                    <div className="flex justify-center">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 border transition-all duration-300 shadow-sm
                            ${isActive 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50 shadow-emerald-100/20' 
                                : 'bg-rose-50 text-rose-700 border-rose-100/50 shadow-rose-100/20'}`}>
                            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 hover:scale-110 transition-transform'}`} />
                            {isActive ? 'Active' : 'Inactive'}
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'ACTIONS',
            accessor: 'id',
            width: '120px',
            align: 'right',
            render: (_, row) => (
                <div className="flex items-center justify-end gap-1.5 pr-2">
                    <button onClick={(e) => { e.stopPropagation(); setPeekUser(row); setIsPeekOpen(true); }} className="w-8 h-8 flex items-center justify-center text-gray border border-border-main hover:text-white hover:bg-title transition-all rounded-xl active:scale-95 bg-card shadow-sm"><FiExternalLink size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleEditUser(row); }} className="px-4 h-8 flex items-center justify-center text-gray border border-border-main hover:text-white hover:bg-primary transition-all rounded-xl active:scale-95 bg-card font-black uppercase tracking-widest text-[9px] hidden md:flex">Edit</button>
                </div>
            )
        }
    ], [handleEditUser]);

    const statsData = [
        { title: 'Total Users', value: stats.total || 0, icon: FiUsers, iconColorClass: 'text-primary', iconBgClass: 'bg-primary/10', change: `${stats.active || 0} Active`, changeType: 'neutral', description: 'platform users' },
        { title: 'Active Users', value: stats.active || 0, icon: FiCheckCircle, iconColorClass: 'text-success', iconBgClass: 'bg-emerald-50', description: 'Currently Active' },
        { title: 'Deactive', value: stats.inactive || 0, icon: FiAlertCircle, iconColorClass: 'text-danger', iconBgClass: 'bg-rose-50', description: 'Account Disabled' },
        { title: 'Unassigned', value: stats.unassigned || 0, icon: FiClock, iconColorClass: 'text-warning', iconBgClass: 'bg-amber-50', description: 'pending assignment' },
    ];

    const paginationFooter = (
        <div className="flex justify-between items-center w-full bg-card py-6 px-8 rounded-b-2xl border-t border-border-main/50">
            <div className="text-sm text-gray font-medium">
                Showing <span className="font-bold text-title">{totalCount > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalCount)}</span> of <span className="font-bold text-title">{totalCount.toLocaleString()}</span> results
            </div>

            <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-gray/60">Page {page} of {Math.ceil(totalCount / limit) || 1}</span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1 || isUsersLoading}
                    className="px-6 font-bold tracking-wider uppercase text-[11px] h-10 border-border-main hover:bg-base"
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page * limit >= totalCount || isUsersLoading}
                    className="px-6 font-bold tracking-wider uppercase text-[11px] h-10 border-border-main hover:bg-base"
                >
                    Next
                </Button>
            </div>
        </div>
    );


    return (
        <div className="flex flex-col gap-6 w-full pb-10 animate-in fade-in duration-500 relative">
            <PageHeader
                title="User Management"
                subtitle={`Managing ${stats.total || 0} registered identities`}
                onAdd={handleAddUser}
                addButtonText="Add User"
                hideAddButton={false}
                breadcrumbs={[
                    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
                    { label: "User Management", path: "/admin/users", isActive: true }
                ]}
                rightContent={
                    <Button onClick={exportPDF} variant="outline" size="sm" className="!h-[38px] bg-card flex items-center gap-2 px-4 shadow-sm border-dashed border-primary/30">
                        <FiDownload size={14} className="text-primary/70" />
                        <span className="font-black text-[10px] uppercase tracking-widest text-title">PDF Report</span>
                    </Button>
                }
            />

            <StatsRow items={statsData} />

            <FilterBar className="!p-2.5">
                <div className="flex items-center gap-3">
                    <Button
                        variant={selectionMode ? "primary" : "outline"}
                        onClick={() => setSelectionMode(!selectionMode)}
                        className={`!h-9 !px-3 !text-[11px] !font-black !uppercase !tracking-widest flex items-center gap-1.5 shrink-0 ${selectionMode ? 'shadow-md shadow-primary/20' : ''}`}
                    >
                        {selectionMode ? <FiCheckSquare size={13} /> : <FiSquare size={13} />}
                        Select
                    </Button>
                    <FilterBar.Separator />
                </div>
                
                <div className="flex flex-wrap items-center gap-2 flex-1">
                    <FilterDropdown label="Role" options={filterOptions.roles} value={filters.role} onChange={v => setFilters({ ...filters, role: v })} allLabel="All Roles" />
                    <FilterDropdown label="Organization" options={filterOptions.organizations} value={filters.organization} onChange={v => setFilters({ ...filters, organization: v, region: '' })} allLabel="All Orgs" />
                    <FilterDropdown label="Zone" options={filterOptions.regions} value={filters.region} onChange={v => setFilters({ ...filters, region: v })} allLabel="All Zones" />
                    <FilterDropdown label="Status" options={[{ value: 'active', label: 'Active' }, { value: 'deactive', label: 'Deactive' }]} value={filters.status} onChange={v => setFilters({ ...filters, status: v })} allLabel="All Statuses" />
                </div>

                <div className="flex items-center gap-2 shrink-0 border-l border-border-main/40 pl-3 ml-auto">
                    <FilterBar.ViewToggle mode={viewMode} onChange={setViewMode} />
                    {activeFilterCount > 0 && <button onClick={resetFilters} className="h-9 flex items-center gap-1.5 px-3 text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase tracking-widest bg-title/5 rounded-xl group"><FiRefreshCcw size={12} className={`group-hover:rotate-180 transition-transform duration-500 ${isUsersLoading ? 'animate-spin' : ''}`} />Reset</button>}
                </div>
            </FilterBar>

            {selectionMode && selectedIds.length > 0 && (
                <div className="flex items-center justify-between py-3 px-6 bg-primary/[0.04] border border-primary/20 rounded-2xl">
                    <div className="flex flex-col md:flex-row items-center justify-between w-full gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center text-[12px] font-black shadow-lg">{selectedIds.length}</div>
                            <div className="flex flex-col">
                                <span className="text-[13px] font-black text-title uppercase tracking-tight leading-none">Personnel Selected</span>
                                <span className="text-[9px] font-bold text-gray uppercase tracking-widest mt-0.5">Bulk Operational Control</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-end gap-1.5">
                            <Button onClick={handleBulkActivate} icon={FiUserCheck} variant="outline" className="!h-9 !px-4 !text-[11px] !font-bold !bg-emerald-50 !text-emerald-700 !border-emerald-100/50 hover:!bg-emerald-100 !rounded-xl">Activate Accounts</Button>
                            <Button onClick={() => setBulkStatusOpen(true)} icon={FiUserX} variant="outline" className="!h-9 !px-4 !text-[11px] !font-bold !bg-rose-50 !text-rose-700 !border-rose-100/50 hover:!bg-rose-100 !rounded-xl">Deactivate</Button>
                        </div>
                    </div>
                </div>
            )}
        

            {/* Main Content Area */}
            {isUsersLoading ? (
                viewMode === 'grid' ? <CardSkeleton count={8} columns={5} /> : <TableSkeleton rows={10} />
            ) : users.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="flex flex-col gap-6 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {sortedUsers.map(user => (
                                <UserCard key={user.id} user={user} selectable={selectionMode} isSelected={selectedIds.includes(user.id)} onSelect={(id) => toggleSelectRow(id)} onEdit={handleEditUser} onView={(u) => { setPeekUser(u); setIsPeekOpen(true); }} />
                            ))}
                        </div>
                        {paginationFooter}
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={sortedUsers}
                        loading={isUsersLoading}
                        selectable={selectionMode}
                        selectedIds={selectedIds}
                        onSelectionChange={(ids) => setSelectedIds(ids)}
                        onRowClick={(user) => { setPeekUser(user); setIsPeekOpen(true); }}
                        rowClassName={(row) => (row.status?.toLowerCase() === 'deactive' || row.status?.toLowerCase() === 'inactive') ? 'bg-rose-50/10 opacity-80' : ''}
                        emptyMessage="No personnel records discovered"
                        footer={paginationFooter}
                    />
                )
            ) : (
                <div className="flex flex-col items-center justify-center py-20 px-6 bg-card/30 border-2 border-dashed border-border-main/60 rounded-[var(--radius-card)] backdrop-blur-sm">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                        <div className="relative w-16 h-16 rounded-2xl bg-base border border-border-main flex items-center justify-center shadow-inner">
                            <FiUserX className="w-8 h-8 text-gray/40" />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-title mb-2 tracking-tight">No Personnel Found</h3>
                    <p className="text-gray text-[13px] mb-8 text-center max-w-[280px] font-medium leading-relaxed italic">
                        "The archive is empty. Try refining your parameters to discover active operators."
                    </p>
                    <button 
                        onClick={resetFilters} 
                        className="group flex items-center gap-2.5 px-6 py-3 bg-title text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-title/90 transition-all shadow-lg active:scale-95"
                    >
                        <FiRefreshCw className="group-hover:rotate-180 transition-transform duration-700" />
                        Reset All Filters
                    </button>
                </div>
            )}

            {/* Modals */}
            <UserPeekView isOpen={isPeekOpen} onClose={() => setIsPeekOpen(false)} user={peekUser} onEdit={handleEditUser} onDeactivate={(u) => { setPeekUser(null); setIsPeekOpen(false); setStatusTarget(u); }} />
            <UserFormModal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingUser(null); }} onSubmit={handleFormSubmit} user={editingUser} loading={storeLoading} />
            <ConfirmModal isOpen={!!statusTarget} onClose={() => setStatusTarget(null)} onConfirm={handleConfirmDeactivate} title="Deactivate Account" message={`Are you sure you want to deactivate "${statusTarget?.name}"?`} confirmText="Confirm Deactivation" danger={true} loading={storeLoading} />
            <ConfirmModal isOpen={bulkStatusOpen} onClose={() => setBulkStatusOpen(false)} onConfirm={handleConfirmDeactivate} title="Bulk Deactivation" message={`You are about to deactivate ${selectedIds.length} users. Continue?`} confirmText={`Deactivate (${selectedIds.length})`} danger={true} loading={storeLoading} />
        </div>
    );
}
