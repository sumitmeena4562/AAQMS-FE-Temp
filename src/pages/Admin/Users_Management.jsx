import React, { useState, useMemo, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import useUserStore from '../../store/userStore';
import UserPeekView from '../../components/Dashboard/UserPeekView';
import UserFormModal from '../../components/Dashboard/UserFormModal';
import ConfirmModal from '../../components/UI/ConfirmModal';
import { StatsRow } from '../../components/Dashboard/StatsCard';
import PageHeader from '../../components/Dashboard/pageHeader';
import {
    FiPlus, FiDownload, FiTrash2,
    FiUserCheck, FiUserX, FiUsers,
    FiRefreshCw, FiCalendar, FiCheckCircle, FiAlertCircle, FiClock
} from 'react-icons/fi';
import UserTable from '../../components/Tables/UserTable';
import useDebounce from '../../hooks/useDebounce';
import FilterDropdown from '../../components/UI/FilterDropdown';
import TableSkeleton from '../../components/UI/TableSkeleton';
import Button from '../../components/UI/Button';

export default function Users() {
    const store = useUserStore();
    const {
        users, stats, filterOptions, loading,
        search, filters, sortKey, sortDir, selectedIds,
        fetchUsers, exportCSV,
        setFilters, toggleSelectAll, toggleSelectRow,
        clearSelection, resetFilters,
    } = store;

    // ── Modal & UI state ──
    const [peekUser, setPeekUser] = useState(null);
    const [isPeekOpen, setIsPeekOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

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

    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsFormOpen(true);
        setIsPeekOpen(false);
    };

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

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
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

            {/* Toolbar Section */}
            <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-20">
                <div className="flex flex-wrap items-center gap-2.5 flex-1">
                    <FilterDropdown 
                        label="Role" 
                        value={filters.role} 
                        options={filterOptions.roles} 
                        onChange={v => setFilters({...filters, role:v})} 
                        allLabel="All Roles" 
                    />
                    <FilterDropdown 
                        label="Organization" 
                        value={filters.organization} 
                        options={filterOptions.organizations} 
                        onChange={v => setFilters({...filters, organization:v, region: ''})} 
                        allLabel="All Orgs" 
                    />
                    <FilterDropdown 
                        label="Zone" 
                        value={filters.region} 
                        options={filterOptions.regions} 
                        onChange={v => setFilters({...filters, region:v})} 
                        allLabel="All Zones" 
                    />

                    <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden md:block" />

                    <FilterDropdown 
                        label="Status" 
                        value={filters.status} 
                        options={[
                            { value: 'active', label: 'Active Only' },
                            { value: 'inactive', label: 'Inactive Only' }
                        ]} 
                        onChange={v => setFilters({...filters, status:v})} 
                        allLabel="Any Status" 
                    />
                    <FilterDropdown 
                        label="Assignment" 
                        value={filters.assignment} 
                        options={[
                            { value: 'assigned', label: 'Assigned' },
                            { value: 'unassigned', label: 'Unassigned' }
                        ]} 
                        onChange={v => setFilters({...filters, assignment:v})} 
                        allLabel="Any Assignment" 
                    />
                    <FilterDropdown 
                        label="Time Range" 
                        value={filters.timeRange} 
                        options={[
                            { value: 'today', label: 'Today' },
                            { value: '7d', label: 'Last 7 Days' },
                            { value: '30d', label: 'Last 30 Days' }
                        ]} 
                        onChange={v => setFilters({...filters, timeRange:v})} 
                        allLabel="All Time"
                        icon={<FiCalendar size={14} />}
                    />

                    {activeFilterCount > 0 && (
                        <Button 
                            variant="ghost" 
                            onClick={resetFilters} 
                            className="!px-2 !py-1 !text-[10px] !font-black !text-rose-500 !uppercase !tracking-widest hover:!text-rose-600 group"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 group-hover:animate-pulse mr-1" />
                            Clear All
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2.5 whitespace-nowrap lg:border-l lg:border-slate-100 lg:pl-4">
                    <Button 
                        variant="outline"
                        onClick={fetchUsers} 
                        title="Refresh Data"
                        className="!p-2 !h-9 !w-9 !rounded-xl"
                        icon={FiRefreshCw}
                    />
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                        <strong className="text-slate-900">{sortedUsers.length}</strong> / {stats.total} Users
                    </span>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <Motion.div 
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: 10, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-6 py-3 bg-white border border-primary/10 rounded-2xl mb-3 shadow-[0_10px_40px_rgba(7,34,103,0.08)]">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black shadow-lg shadow-primary/20">
                                    {selectedIds.length}
                                </div>
                                <span className="text-[13px] font-black text-primary">Users Selected</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button onClick={handleBulkActivate} icon={FiUserCheck} variant="outline" className="!h-8 !px-4 !text-xs !bg-emerald-50 !text-emerald-600 !border-emerald-100 hover:!bg-emerald-100">
                                    Activate
                                </Button>
                                <Button onClick={handleBulkDeactivate} icon={FiUserX} variant="outline" className="!h-8 !px-4 !text-xs !bg-amber-50 !text-amber-600 !border-amber-100 hover:!bg-amber-100">
                                    Deactivate
                                </Button>
                                <Button onClick={() => setBulkDeleteOpen(true)} icon={FiTrash2} variant="outline" className="!h-8 !px-4 !text-xs !bg-rose-50 !text-rose-600 !border-rose-100 hover:!bg-rose-100">
                                    Delete
                                </Button>
                                <div className="w-px h-6 bg-slate-200 mx-2" />
                                <Button variant="ghost" onClick={clearSelection} className="!h-8 !px-3 !text-[10px] !font-black !text-slate-400 hover:!text-slate-600 !uppercase !tracking-widest">Cancel</Button>
                            </div>
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>

            {/* Main Table Area */}
            <div className="bg-white border border-slate-100 rounded-[20px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[400px] flex flex-col relative transition-all duration-300">
                {loading ? (
                    <TableSkeleton />
                ) : (
                    <div className="flex-1 flex flex-col">
                        <UserTable 
                            data={sortedUsers}
                            selectedIds={selectedIds}
                            onSelectionChange={(ids) => store.setSelectedIds(ids)} 
                            onRowClick={(user) => { setPeekUser(user); setIsPeekOpen(true); }}
                            onEdit={handleEditUser}
                            toggleSelectAll={() => toggleSelectAll(sortedUsers.map(u=>u.id))}
                            toggleSelectRow={toggleSelectRow}
                        />
                    
                        {sortedUsers.length === 0 && (
                            <div className="flex-1 flex flex-col items-center justify-center p-16 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                                    <FiUsers size={28} className="text-slate-300"/>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">No Results Found</h3>
                                <p className="text-[13px] font-semibold text-slate-500 mb-6 max-w-xs mx-auto">
                                    Try adjusting your search terms or filters to find what you&apos;re looking for.
                                </p>
                                <Button 
                                    onClick={resetFilters} 
                                    variant="primary"
                                    className="!px-5 !py-2 !bg-slate-900 hover:!bg-slate-800 !rounded-xl !font-black !text-[11px] !uppercase !tracking-widest shadow-lg shadow-slate-900/10"
                                >
                                    Reset All Filters
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer Bar */}
                {sortedUsers.length > 0 && (
                    <div className="px-6 py-2.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Database synchronized
                        </span>
                        <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                {sortedUsers.length} profile{sortedUsers.length!==1?'s':''} listed
                             </span>
                        </div>
                    </div>
                )}
            </div>

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
