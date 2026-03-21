import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import useUserStore from '../../store/userStore';
import UserPeekView from '../../components/Dashboard/UserPeekView';
import UserFormModal from '../../components/Dashboard/UserFormModal';
import ConfirmModal from '../../components/UI/ConfirmModal';
import { StatsRow } from '../../components/Dashboard/StatsCard';
import PageHeader from '../../components/Dashboard/pageHeader';
import DataTable from '../../components/UI/DataTable';
import {
    FiPlus, FiDownload, FiTrash2,
    FiUserCheck, FiUserX, FiUsers,
    FiRefreshCw, FiCalendar, FiCheckCircle, FiAlertCircle, FiClock,
    FiExternalLink, FiEdit2, FiSquare, FiCheckSquare
} from 'react-icons/fi';
import FilterDropdown from '../../components/UI/FilterDropdown';
import Button from '../../components/UI/Button';
import useDebounce from '../../hooks/useDebounce';
import UserAvatar from '../../components/UI/UserAvatar';
import Badge from '../../components/UI/Badge';
import DotStatus from '../../components/UI/DotStatus';

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
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [selectionMode, setSelectionMode] = useState(false);

    // Search Debounce
    const debouncedSearch = useDebounce(search, 300);

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

    const handleDeleteUser = (user) => {
        setDeleteTarget(user);
        setIsPeekOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        const res = await store.deleteUser(deleteTarget.id);
        if (res.success) {
            toast.success('User deleted successfully');
            setDeleteTarget(null);
        } else {
            toast.error(res.error || 'Failed to delete user');
        }
    };

    const handleBulkActivate = async () => {
        const res = await store.bulkAction('activate');
        if (res.success) {
            toast.success(`${selectedIds.length} users activated`);
        } else {
            toast.error(res.error || 'Bulk activation failed');
        }
    };

    const handleBulkDeactivate = async () => {
        const res = await store.bulkAction('deactivate');
        if (res.success) {
            toast.success(`${selectedIds.length} users deactivated`);
        } else {
            toast.error(res.error || 'Bulk deactivation failed');
        }
    };

    const handleBulkDelete = async () => {
        const res = await store.bulkAction('delete');
        if (res.success) {
            toast.success(`${selectedIds.length} users deleted`);
            setBulkDeleteOpen(false);
        } else {
            toast.error(res.error || 'Bulk deletion failed');
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
            iconColorClass: 'text-emerald-500',
            iconBgClass: 'bg-emerald-50',
            trend: 12,
            description: 'vs last month'
        },
        {
            title: 'Inactive',
            value: stats.inactive,
            icon: FiAlertCircle,
            iconColorClass: 'text-rose-500',
            iconBgClass: 'bg-rose-50',
            trend: -5,
            description: 'vs last month'
        },
        {
            title: 'Unassigned',
            value: stats.unassigned,
            icon: FiClock,
            iconColorClass: 'text-amber-500',
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
                    <UserAvatar name={row?.name} size="32px" className="shadow-sm border-2 border-white ring-1 ring-slate-100 shrink-0" />
                    <div className="flex flex-col min-w-0">
                        <div className="text-[12px] font-black text-slate-900 leading-tight truncate">{row?.name}</div>
                        <div className="text-[9px] font-bold text-slate-400 mt-0.5 truncate uppercase tracking-widest leading-none">{row?.email?.split('@')[0]}</div>
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
                    <span className="text-[12px] font-black text-slate-800 truncate leading-none">{value || 'Contractor'}</span>
                    <span className="text-[8px] text-slate-400 font-black uppercase tracking-[0.1em] mt-1 truncate">Unit</span>
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
                    <Badge variant="soft" className="!text-[8px] !px-1.5 !py-0.5 !font-black !uppercase !tracking-widest border border-current/10 text-primary bg-primary/5">
                        {value}
                    </Badge>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'assignment',
            width: '12%',
            align: 'center',
            render: (value) => {
                const isAssigned = value === 'assigned';
                return (
                    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg border ${
                        isAssigned ? 'bg-emerald-50/50 border-emerald-100/50 text-emerald-700' : 
                        'bg-slate-50 border-slate-100 text-slate-500'
                    }`}>
                        <DotStatus status={isAssigned ? 'active' : 'inactive'} />
                        <span className="text-[8px] font-black uppercase tracking-widest leading-none">
                            {isAssigned ? 'Assigned' : 'Standby'}
                        </span>
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
                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-900 transition-all rounded-lg shadow-sm active:scale-95"
                        title="View Details"
                    >
                        <FiExternalLink size={11} />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleEditUser(row); }}
                        className="px-2.5 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary transition-all rounded-lg shadow-sm active:scale-95 font-black uppercase tracking-widest text-[8px] hidden md:flex"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleEditUser(row); }}
                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary transition-all rounded-lg shadow-sm active:scale-95 md:hidden"
                    >
                        <FiEdit2 size={11} />
                    </button>
                </div>
            )
        }
    ], [handleEditUser]);

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Header Section — uses shared PageHeader */}
            <PageHeader
                title="User Management"
                subtitle="Manage platform users, roles & enterprise permissions"
                rightContent={
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={exportCSV}
                            icon={FiDownload}
                            className="!h-10 !px-4 !text-[13px] !font-bold"
                        >
                            Export
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleAddUser}
                            icon={FiPlus}
                            className="!h-10 !px-5 !text-[13px] !font-black !bg-primary hover:!bg-primary/95"
                        >
                            Add User
                        </Button>
                    </div>
                }
            />

            {/* Stats Section */}
            <StatsRow items={statsData} />

            {/* Main Data Table Area — Unified Premium DataTable */}
            <DataTable
                columns={columns}
                data={sortedUsers}
                loading={loading}
                selectable={selectionMode}
                selectedIds={selectedIds}
                onSelectionChange={(ids) => store.setSelectedIds(ids)}
                onRowClick={(user) => { setPeekUser(user); setIsPeekOpen(true); }}
                filterContent={
                    <>
                        <FilterDropdown
                            label="Role"
                            options={filterOptions.roles}
                            value={filters.role}
                            onChange={v => setFilters({ ...filters, role: v })}
                            allLabel="All"
                        />
                        <FilterDropdown
                            label="Organization"
                            options={filterOptions.organizations}
                            value={filters.organization}
                            onChange={v => setFilters({ ...filters, organization: v, region: '' })}
                            allLabel="All"
                        />
                        <FilterDropdown
                            label="Zone"
                            options={filterOptions.regions}
                            value={filters.region}
                            onChange={v => setFilters({ ...filters, region: v })}
                            allLabel="All"
                        />
                        <FilterDropdown
                            label="Status"
                            options={[
                                { value: 'active', label: 'Active Only' },
                                { value: 'inactive', label: 'Inactive Only' }
                            ]}
                            value={filters.status}
                            onChange={v => setFilters({ ...filters, status: v })}
                            allLabel="All"
                        />
                        <FilterDropdown
                            label="Assignment"
                            options={[
                                { value: 'assigned', label: 'Assigned' },
                                { value: 'unassigned', label: 'Unassigned' }
                            ]}
                            value={filters.assignment}
                            onChange={v => setFilters({ ...filters, assignment: v })}
                            allLabel="All"
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
                            allLabel="All"
                            icon={<FiCalendar size={14} />}
                        />
                        <div className="h-4 w-[1px] bg-slate-200 shrink-0 mx-1" />
                        <Button
                            variant="outline"
                            onClick={fetchUsers}
                            className="!p-2 !h-9 !w-9 !rounded-xl border-slate-200"
                            icon={FiRefreshCw}
                        />
                        <div className="h-4 w-[1px] bg-slate-200 shrink-0 mx-1" />
                        <Button
                            variant={selectionMode ? "primary" : "outline"}
                            onClick={() => setSelectionMode(!selectionMode)}
                            className={`!h-9 !px-3 !text-[11px] !font-black !uppercase !tracking-widest flex items-center gap-1.5 shrink-0 ${selectionMode ? 'shadow-md shadow-primary/20' : ''}`}
                        >
                            {selectionMode ? <FiCheckSquare size={13} /> : <FiSquare size={13} />}
                            Select
                        </Button>
                    </>
                }
                selectionFooter={
                    <div className="flex flex-col md:flex-row items-center justify-between w-full gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-[11px] font-black shadow-lg shadow-primary/20">
                                {selectedIds.length}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[12px] font-black text-slate-800 uppercase tracking-tight leading-none">Selected</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Bulk Actions</span>
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
                                onClick={() => setBulkDeleteOpen(true)}
                                icon={FiTrash2}
                                variant="outline"
                                className="!h-8 !px-3 !text-[10px] !font-bold !bg-rose-50 !text-rose-700 !border-rose-100/50 hover:!bg-rose-100 !rounded-lg"
                            >
                                Delete
                            </Button>
                            <div className="hidden sm:block w-px h-5 bg-slate-200 mx-1" />
                            <Button
                                variant="ghost"
                                onClick={clearSelection}
                                className="!h-8 !px-3 !text-[10px] !font-black !text-slate-400 hover:!text-slate-600 !uppercase !tracking-widest"
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
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {sortedUsers.length} of {stats.total} entries cached
                            </span>
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                            Database Sync: Live
                        </span>
                    </div>
                }
                emptyMessage="No personnel records discovered matching your search"
            />

            {/* Modals */}
            <UserPeekView
                isOpen={isPeekOpen}
                onClose={() => setIsPeekOpen(false)}
                user={peekUser}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
            />

            <UserFormModal
                isOpen={isFormOpen}
                onClose={() => { setIsFormOpen(false); setEditingUser(null); }}
                onSubmit={handleFormSubmit}
                user={editingUser}
                loading={loading}
            />

            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                title="Delete User"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                confirmText="Delete Profile"
                danger={true}
                loading={loading}
            />

            <ConfirmModal
                isOpen={bulkDeleteOpen}
                onClose={() => setBulkDeleteOpen(false)}
                onConfirm={handleBulkDelete}
                title="Bulk Delete"
                message={`You are about to permanently delete ${selectedIds.length} users. This action is irreversible.`}
                confirmText={`Confirm Delete (${selectedIds.length})`}
                danger={true}
                loading={loading}
            />
        </div>
    );
}
