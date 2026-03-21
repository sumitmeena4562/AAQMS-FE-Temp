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
    FiPlus, FiDownload, FiTrash2,
    FiUserCheck, FiUserX, FiUsers,
    FiRefreshCw, FiRefreshCcw, FiCalendar, FiCheckCircle, FiAlertCircle, FiClock,
    FiExternalLink, FiEdit2, FiSquare, FiCheckSquare,
    FiGrid, FiList, FiHome, FiUser
} from 'react-icons/fi';
import FilterDropdown from '../../components/UI/FilterDropdown';
import Button from '../../components/UI/Button';
import UserCard from '../../components/UI/UserCard';
import useDebounce from '../../hooks/useDebounce';
import UserAvatar from '../../components/UI/UserAvatar';
import Badge from '../../components/UI/Badge';
import DotStatus from '../../components/UI/DotStatus';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';

export default function Users() {
    const store = useUserStore();
    const {
        users, stats, filterOptions, loading,
        search, filters, sortKey, sortDir, selectedIds,
        fetchUsers, exportCSV,
        setSearch, setFilters, toggleSelectAll, toggleSelectRow,
        clearSelection, resetFilters,
    } = store;

    // ── Modal & UI state ──
    const [peekUser, setPeekUser] = useState(null);
    const [isPeekOpen, setIsPeekOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [banTarget, setBanTarget] = useState(null);
    const [banActionType, setBanActionType] = useState('ban'); // 'ban' or 'unban'
    const [bulkBanOpen, setBulkBanOpen] = useState(false);
    const [bulkActionType, setBulkActionType] = useState('ban');
    const [selectionMode, setSelectionMode] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

    // Search Debounce
    const debouncedSearch = useDebounce(search, 300);
    const { setBreadcrumbs } = useBreadcrumb();

    useEffect(() => {
        fetchUsers();
    }, [debouncedSearch, filters, fetchUsers]);

    const sortedUsers = useMemo(() => {
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
            ? await store.updateUser(editingUser.id, data)
            : await store.createUser(data);

        if (res.success) {
            toast.success(editingUser ? 'Profile updated successfully' : 'User created successfully');
            setIsFormOpen(false);
            setEditingUser(null);
        } else {
            toast.error(res.error || 'Failed to save user');
        }
        return res;
    };

    const handleBanUser = (user, type = 'ban') => {
        setBanTarget(user);
        setBanActionType(type);
        setIsPeekOpen(false);
    };

    const handleConfirmBan = async () => {
        if (!banTarget) return;
        const res = await store.bulkAction(banActionType, [banTarget.id]);
        if (res.success) {
            toast.success(`User ${banActionType === 'ban' ? 'banned' : 'restored'} successfully`);
            setBanTarget(null);
        } else {
            toast.error(res.error || `Failed to ${banActionType} user`);
        }
    };

    const handleBulkActivate = async () => {
        const res = await store.bulkAction('activate', selectedIds);
        if (res.success) {
            toast.success(`${selectedIds.length} users activated`);
        } else {
            toast.error(res.error || 'Bulk activation failed');
        }
    };

    const handleBulkDeactivate = async () => {
        const res = await store.bulkAction('deactivate', selectedIds);
        if (res.success) {
            toast.success(`${selectedIds.length} users deactivated`);
        } else {
            toast.error(res.error || 'Bulk deactivation failed');
        }
    };

    const handleBulkBan = async () => {
        const res = await store.bulkAction(bulkActionType, selectedIds);
        if (res.success) {
            toast.success(`${selectedIds.length} users ${bulkActionType === 'ban' ? 'banned' : 'restored'}`);
            setBulkBanOpen(false);
        } else {
            toast.error(res.error || `Bulk ${bulkActionType} failed`);
        }
    };

    const statsData = [
        {
            title: 'Total Users',
            value: stats.total,
            icon: FiUsers,
            iconColorClass: 'text-primary',
            iconBgClass: 'bg-primary/10',
            change: `${stats.active} Active / ${stats.inactive} Inactive`,
            changeType: 'neutral',
            description: 'all platform users'
        },
        {
            title: 'Active Users',
            value: stats.active,
            icon: FiCheckCircle,
            iconColorClass: 'text-success',
            iconBgClass: 'bg-emerald-50',
            trend: 12,
            description: 'vs last month'
        },
        {
            title: 'Inactive',
            value: stats.inactive,
            icon: FiAlertCircle,
            iconColorClass: 'text-danger',
            iconBgClass: 'bg-rose-50',
            trend: -5,
            description: 'vs last month'
        },
        {
            title: 'Unassigned',
            value: stats.unassigned,
            icon: FiClock,
            iconColorClass: 'text-warning',
            iconBgClass: 'bg-amber-50',
            change: 'Needs Assignment',
            changeType: 'warning',
            description: 'pending review'
        },
    ];

    // Define columns for reuse - satisfying user requirement to easily add/remove columns
    const columns = useMemo(() => [
        {
            header: 'Personnel Profile',
            accessor: 'name',
            width: '22%',
            render: (_, row) => (
                <div className="flex items-center gap-2 py-0.5 group-hover:px-1 transition-all">
                    <UserAvatar name={row?.name} avatar={row?.avatar} size="32px" className="shadow-sm border-2 border-white ring-1 ring-base shrink-0" />
                    <div className="flex flex-col min-w-0">
                        <div className="text-[12px] font-black text-title leading-tight truncate">{row?.name}</div>
                        <div className="text-[9px] font-bold text-gray mt-0.5 truncate uppercase tracking-widest leading-none">{row?.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Organization',
            accessor: 'organization',
            width: '15%',
            render: (value) => (
                <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-black text-title truncate leading-none">{value || 'Contractor'}</span>
                    <span className="text-[8px] text-gray font-black uppercase tracking-[0.1em] mt-1 truncate">Unit</span>
                </div>
            )
        },
        {
            header: 'Role',
            accessor: 'role',
            width: '12%',
            align: 'center',
            className: 'hidden lg:table-cell',
            render: (value) => (
                <div className="flex justify-center">
                    <Badge 
                        variant="solid" 
                        color={value === 'Coordinator' ? 'coordinator' : value === 'Admin' ? 'admin' : 'fieldOfficer'}
                        className="!text-[8px] !px-1.5 !py-0.5 !font-black !uppercase !tracking-widest"
                    >
                        {value}
                    </Badge>
                </div>
            )
        },
        {
            header: 'Assignment',
            accessor: 'assignment',
            width: '12%',
            align: 'center',
            render: (value) => {
                const isAssigned = value === 'assigned';
                return (
                    <div className="flex justify-center">
                        <Badge 
                            variant="light" 
                            color={isAssigned ? 'success' : 'neutral'}
                            className="!text-[8px] !px-1.5 !py-0.5 !font-black !uppercase !tracking-widest"
                        >
                            {isAssigned ? 'Assigned' : 'Standby'}
                        </Badge>
                    </div>
                );
            }
        },
        {
            header: 'Account',
            accessor: 'status',
            width: '10%',
            align: 'center',
            render: (value) => {
                const isBanned = value.toLowerCase() === 'banned';
                const isActive = value.toLowerCase() === 'active';
                return (
                    <div className="flex justify-center">
                        <Badge 
                            variant="light" 
                            color={isActive ? 'success' : isBanned ? 'danger' : 'neutral'}
                            className="!text-[8px] !px-1.5 !py-0.5 !font-black !uppercase !tracking-widest"
                        >
                            {value}
                        </Badge>
                    </div>
                );
            }
        },
        {
            header: 'Actions',
            accessor: 'id',
            width: '100px',
            align: 'right',
            render: (_, row) => (
                <div className="flex items-center justify-end gap-1 pr-0.5">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setPeekUser(row); setIsPeekOpen(true); }}
                        className="w-7 h-7 flex items-center justify-center text-gray hover:text-white hover:bg-title transition-all rounded-lg shadow-sm active:scale-95"
                        title="View Details"
                    >
                        <FiExternalLink size={11} />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleEditUser(row); }}
                        className="px-2.5 h-7 flex items-center justify-center text-gray hover:text-white hover:bg-primary transition-all rounded-lg shadow-sm active:scale-95 font-black uppercase tracking-widest text-[8px] hidden md:flex"
                    >
                        Edit
                    </button>
                </div>
            )
        }
    ], [handleEditUser]);

    return (
        <div className="flex flex-col gap-6 w-full">
            <PageHeader
                title="User Management"
                subtitle={`Managing ${users.length} active platform identities and permissions`}
                onAdd={handleAddUser}
                addButtonText="Add User"
                hideAddButton={false}
                onExport={exportCSV}
                breadcrumbs={[
                    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
                    { label: "User Management", path: "/admin/users", icon: <FiUser size={14} />, isActive: true }
                ]}
                rightContent={null}
            />

            {/* 2. Stats Section — Unified Oversight Metrics */}
            <StatsRow items={statsData} />

            {/* Filter & View Toggle Bar (Matches Organizations.jsx) */}
            <div className="bg-card border border-border-main/60 rounded-2xl p-3.5 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        variant={selectionMode ? "primary" : "outline"}
                        onClick={() => setSelectionMode(!selectionMode)}
                        className={`!h-9 !px-3 !text-[11px] !font-black !uppercase !tracking-widest flex items-center gap-1.5 shrink-0 ${selectionMode ? 'shadow-md shadow-primary/20' : ''}`}
                    >
                        {selectionMode ? <FiCheckSquare size={13} /> : <FiSquare size={13} />}
                        Select
                    </Button>
                    <div className="h-6 w-[1.5px] bg-border-main/40 shrink-0 mx-2 hidden sm:block" />
                    
                    <FilterDropdown
                        label="Role"
                        options={filterOptions.roles}
                        value={filters.role}
                        onChange={v => setFilters({ ...filters, role: v })}
                        allLabel="All Roles"
                    />
                    <FilterDropdown
                        label="Organization"
                        options={filterOptions.organizations}
                        value={filters.organization}
                        onChange={v => setFilters({ ...filters, organization: v, region: '' })}
                        allLabel="All Organizations"
                    />
                    <FilterDropdown
                        label="Status"
                        options={[
                            { value: 'active', label: 'Active Only' },
                            { value: 'inactive', label: 'Inactive Only' },
                            { value: 'banned', label: 'Banned' }
                        ]}
                        value={filters.status}
                        onChange={v => setFilters({ ...filters, status: v })}
                        allLabel="All Statuses"
                    />
                    <FilterDropdown
                        label="Zone"
                        options={filterOptions.regions}
                        value={filters.region}
                        onChange={v => setFilters({ ...filters, region: v })}
                        allLabel="All Zones"
                    />
                    <FilterDropdown
                        label="Assignment"
                        options={[
                            { value: 'assigned', label: 'Assigned' },
                            { value: 'unassigned', label: 'Unassigned' }
                        ]}
                        value={filters.assignment}
                        onChange={v => setFilters({ ...filters, assignment: v })}
                        allLabel="All Assignments"
                    />
                    <FilterDropdown
                        label="Time Range"
                        options={[
                            { value: 'today', label: 'Today' },
                            { value: '7d', label: 'Last 7 Days' },
                            { value: '30d', label: 'Last 30 Days' }
                        ]}
                        value={filters.timeRange}
                        onChange={v => setFilters({ ...filters, timeRange: v })}
                        allLabel="All Time"
                        icon={<FiCalendar size={14} />}
                    />
                      <FilterDropdown
                        label="Status"
                        options={filterOptions.statuses}
                        value={filters.status}
                        onChange={v => setFilters({ ...filters, status: v })}
                        allLabel="All Statuses"
                    />

                    <div className="h-6 w-[1.5px] bg-border-main/40 shrink-0 mx-2 hidden sm:block" />

                    {/* View Toggles (Relocated from Header) */}
                    <div className="flex items-center gap-1.5 bg-base/40 p-1 rounded-xl border border-border-main/50">
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-card text-primary shadow-sm border border-border-main/50' : 'text-gray hover:text-body hover:bg-base'}`}
                            title="List View"
                        >
                            <FiList size={16} />
                        </button>
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-card text-primary shadow-sm border border-border-main/50' : 'text-gray hover:text-body hover:bg-base'}`}
                            title="Grid View"
                        >
                            <FiGrid size={16} />
                        </button>
                    </div>

                    <button 
                        onClick={resetFilters}
                        className="ml-auto h-9 flex items-center gap-2 px-3.5 text-gray hover:text-rose-600 font-black text-[10px] uppercase tracking-widest transition-all rounded-xl hover:bg-rose-50/10 group"
                    >
                        <FiRefreshCcw size={13} className="group-hover:rotate-180 transition-transform duration-500" />
                        Reset
                    </button>
                </div>
            </div>

            {/* SELECTION ACTION BAR FOR GRID VIEW */}
            {viewMode === 'grid' && selectionMode && selectedIds.length > 0 && (
                <div className="flex items-center justify-between py-3 px-4 sm:px-6 bg-primary/[0.04] border border-primary/20 rounded-[var(--radius-card)] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col md:flex-row items-center justify-between w-full gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-[11px] font-black shadow-lg shadow-primary/20">
                                {selectedIds.length}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[12px] font-black text-title uppercase tracking-tight leading-none">Selected</span>
                                <span className="text-[8px] font-bold text-gray uppercase tracking-widest mt-0.5">Bulk Actions</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-end gap-1.5">
                            <Button
                                onClick={handleBulkActivate}
                                icon={FiUserCheck}
                                variant="outline"
                                className="!h-8 !px-3 !text-[10px] !font-bold !bg-emerald-50 !text-emerald-700 !border-emerald-100/50 hover:!bg-emerald-100 !rounded-lg"
                            >
                                Activate
                            </Button>
                            <Button
                                onClick={handleBulkDeactivate}
                                icon={FiUserX}
                                variant="outline"
                                className="!h-8 !px-3 !text-[10px] !font-bold !bg-amber-50 !text-amber-700 !border-amber-100/50 hover:!bg-amber-100 !rounded-lg"
                            >
                                Deactivate
                            </Button>
                            <Button
                                onClick={() => { setBulkActionType('ban'); setBulkBanOpen(true); }}
                                icon={FiAlertCircle}
                                variant="outline"
                                className="!h-8 !px-3 !text-[10px] !font-bold !bg-rose-50 !text-rose-700 !border-rose-100/50 hover:!bg-rose-100 !rounded-lg"
                            >
                                Ban
                            </Button>
                            <Button
                                onClick={() => { setBulkActionType('unban'); setBulkBanOpen(true); }}
                                icon={FiCheckCircle}
                                variant="outline"
                                className="!h-8 !px-3 !text-[10px] !font-bold !bg-blue-50 !text-blue-700 !border-blue-100/50 hover:!bg-blue-100 !rounded-lg"
                            >
                                Unban
                            </Button>
                            <div className="hidden sm:block w-px h-5 bg-border-main/50 mx-1" />
                            <Button
                                variant="ghost"
                                onClick={clearSelection}
                                className="!h-8 !px-3 !text-[10px] !font-black !text-gray hover:!text-body !uppercase !tracking-widest"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            {sortedUsers.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 w-full animate-in fade-in duration-500">
                        {sortedUsers.map(user => (
                            <UserCard 
                                key={user.id}
                                user={user}
                                selectable={selectionMode}
                                isSelected={selectedIds.includes(user.id)}
                                onSelect={(id) => store.toggleSelectRow(id)}
                                onEdit={handleEditUser}
                                onView={(u) => { setPeekUser(u); setIsPeekOpen(true); }}
                            />
                        ))}
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={sortedUsers}
                        loading={loading}
                        selectable={selectionMode}
                        selectedIds={selectedIds}
                        onSelectionChange={(ids) => store.setSelectedIds(ids)}
                        onRowClick={(user) => { setPeekUser(user); setIsPeekOpen(true); }}
                        selectionFooter={
                            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-[11px] font-black shadow-lg shadow-primary/20">
                                        {selectedIds.length}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[12px] font-black text-title uppercase tracking-tight leading-none">Selected</span>
                                        <span className="text-[8px] font-bold text-gray uppercase tracking-widest mt-0.5">Bulk Actions</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-center md:justify-end gap-1.5">
                                    <Button
                                        onClick={handleBulkActivate}
                                        icon={FiUserCheck}
                                        variant="outline"
                                        className="!h-8 !px-3 !text-[10px] !font-bold !bg-emerald-50 !text-emerald-700 !border-emerald-100/50 hover:!bg-emerald-100 !rounded-lg"
                                    >
                                        Activate
                                    </Button>
                                    <Button
                                        onClick={handleBulkDeactivate}
                                        icon={FiUserX}
                                        variant="outline"
                                        className="!h-8 !px-3 !text-[10px] !font-bold !bg-amber-50 !text-amber-700 !border-amber-100/50 hover:!bg-amber-100 !rounded-lg"
                                    >
                                        Deactivate
                                    </Button>
                                    <Button
                                        onClick={() => { setBulkActionType('ban'); setBulkBanOpen(true); }}
                                        icon={FiAlertCircle}
                                        variant="outline"
                                        className="!h-8 !px-3 !text-[10px] !font-bold !bg-rose-50 !text-rose-700 !border-rose-100/50 hover:!bg-rose-100 !rounded-lg"
                                    >
                                        Ban
                                    </Button>
                                    <Button
                                        onClick={() => { setBulkActionType('unban'); setBulkBanOpen(true); }}
                                        icon={FiCheckCircle}
                                        variant="outline"
                                        className="!h-8 !px-3 !text-[10px] !font-bold !bg-blue-50 !text-blue-700 !border-blue-100/50 hover:!bg-blue-100 !rounded-lg"
                                    >
                                        Unban
                                    </Button>
                                    <div className="hidden sm:block w-px h-5 bg-border-main/50 mx-1" />
                                    <Button
                                        variant="ghost"
                                        onClick={clearSelection}
                                        className="!h-8 !px-3 !text-[10px] !font-black !text-gray hover:!text-body !uppercase !tracking-widest"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        }
                        footer={
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-gray uppercase tracking-widest">
                                        {sortedUsers.length} of {stats.total} entries cached
                                    </span>
                                </div>
                                <span className="text-[10px] font-black text-gray/40 uppercase tracking-widest">
                                    Database Sync: Live
                                </span>
                            </div>
                        }
                        emptyMessage="No personnel records discovered matching your search"
                    />
                )
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-card/40 border-2 border-dashed border-border-main rounded-3xl animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-base rounded-2xl flex items-center justify-center mb-5 rotate-3">
                        <FiUserX className="w-7 h-7 text-gray/40" />
                    </div>
                    <h3 className="text-lg font-black text-title mb-1">No Personnel Found</h3>
                    <p className="text-gray text-xs mb-8 text-center max-w-xs px-6 font-medium leading-relaxed">
                        We couldn't find any users matching your selection. Try clearing your filters.
                    </p>
                    <button 
                        onClick={resetFilters}
                        className="flex items-center gap-2 px-6 py-2.5 bg-card border border-border-main rounded-xl text-xs font-black text-body hover:bg-base hover:border-border-hover transition-all shadow-sm active:scale-95"
                    >
                        <FiRefreshCw className="w-3.5 h-3.5" />
                        Clear Criteria
                    </button>
                </div>
            )}


            {/* Modals */}
            <UserPeekView
                isOpen={isPeekOpen}
                onClose={() => setIsPeekOpen(false)}
                user={peekUser}
                onEdit={handleEditUser}
                onBan={handleBanUser}
            />

            <UserFormModal
                isOpen={isFormOpen}
                onClose={() => { setIsFormOpen(false); setEditingUser(null); }}
                onSubmit={handleFormSubmit}
                user={editingUser}
                loading={loading}
            />

            <ConfirmModal
                isOpen={!!banTarget}
                onClose={() => setBanTarget(null)}
                onConfirm={handleConfirmBan}
                title={banActionType === 'ban' ? "Ban User" : "Unban User"}
                message={banActionType === 'ban' 
                    ? `Are you sure you want to ban "${banTarget?.name}"? This will restrict their access to the platform.`
                    : `Are you sure you want to restore access for "${banTarget?.name}"?`}
                confirmText={banActionType === 'ban' ? "Confirm Ban" : "Confirm Unban"}
                danger={banActionType === 'ban'}
                loading={loading}
            />

            <ConfirmModal
                isOpen={bulkBanOpen}
                onClose={() => setBulkBanOpen(false)}
                onConfirm={handleBulkBan}
                title={bulkActionType === 'ban' ? "Bulk Ban" : "Bulk Unban"}
                message={bulkActionType === 'ban'
                    ? `You are about to ban ${selectedIds.length} users. Continue?`
                    : `You are about to unban ${selectedIds.length} users. Continue?`}
                confirmText={bulkActionType === 'ban' ? `Ban (${selectedIds.length})` : `Unban (${selectedIds.length})`}
                danger={bulkActionType === 'ban'}
                loading={loading}
            />
        </div>
    );
}
