import React, { useState, useMemo, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import useUserStore from '../../store/userStore';
import UserPeekView from '../../components/Dashboard/UserPeekView';
import UserFormModal from '../../components/Dashboard/UserFormModal';
import ConfirmModal from '../../components/UI/ConfirmModal';
import { StatsRow } from '../../components/Dashboard/StatsCard';
import {
    FiPlus, FiDownload, FiTrash2,
    FiUserCheck, FiUserX, FiUsers,
    FiRefreshCw, FiCalendar
} from 'react-icons/fi';
import UserTable from '../../components/Tables/UserTable';
import useDebounce from '../../hooks/useDebounce';
import FilterDropdown from '../../components/UI/FilterDropdown';
import TableSkeleton from '../../components/UI/TableSkeleton';

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
        { label: 'Total Personnel', value: stats.total, icon: FiUsers, iconColor: 'text-primary', iconBg: 'bg-primary/10' },
        { label: 'Active Status', value: stats.active, icon: FiUserCheck, iconColor: 'text-emerald-500', iconBg: 'bg-emerald-50' },
        { label: 'Inactive / Standby', value: stats.inactive, icon: FiUserX, iconColor: 'text-slate-400', iconBg: 'bg-slate-50' },
        { label: 'Unassigned', value: stats.unassigned, icon: FiUsers, iconColor: 'text-amber-500', iconBg: 'bg-amber-50' },
    ];

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">User Management</h1>
                    <p className="text-[13px] font-semibold text-slate-500 mt-1">Manage platform users, roles & enterprise permissions</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={exportCSV} 
                        className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                        <FiDownload size={16} /> Export
                    </button>
                    <button 
                        onClick={handleAddUser} 
                        className="flex items-center gap-2 px-5 py-2 text-[13px] font-black text-white bg-[#072267] rounded-xl shadow-lg shadow-primary/20 hover:bg-[#072267]/95 transition-all active:scale-95"
                    >
                        <FiPlus size={18} /> Add User
                    </button>
                </div>
            </div>

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
                        <button 
                            onClick={resetFilters} 
                            className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-600 px-2 py-1 transition-colors flex items-center gap-1.5 active:scale-95"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            Clear All
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2.5 whitespace-nowrap lg:border-l lg:border-slate-100 lg:pl-4">
                    <button 
                        onClick={fetchUsers} 
                        title="Refresh Data"
                        className="p-2 bg-white border border-slate-100 rounded-xl text-slate-500 hover:text-primary hover:border-primary transition-all active:scale-90 shadow-sm"
                    >
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
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
                        <div className="flex items-center justify-between px-6 py-3 bg-white border border-[#072267]/10 rounded-2xl mb-3 shadow-[0_10px_40px_rgba(7,34,103,0.08)]">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#072267] text-white flex items-center justify-center text-xs font-black shadow-lg shadow-[#072267]/20">
                                    {selectedIds.length}
                                </div>
                                <span className="text-[13px] font-black text-[#072267]">Users Selected</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={handleBulkActivate} className="flex items-center gap-2 px-4 py-1.5 text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-all active:scale-95 shadow-sm">
                                    <FiUserCheck size={14}/> Activate
                                </button>
                                <button onClick={handleBulkDeactivate} className="flex items-center gap-2 px-4 py-1.5 text-xs font-black text-amber-600 bg-amber-50 border border-amber-100 rounded-lg hover:bg-amber-100 transition-all active:scale-95 shadow-sm">
                                    <FiUserX size={14}/> Deactivate
                                </button>
                                <button onClick={() => setBulkDeleteOpen(true)} className="flex items-center gap-2 px-4 py-1.5 text-xs font-black text-rose-600 bg-rose-50 border border-rose-100 rounded-lg hover:bg-rose-100 transition-all active:scale-95 shadow-sm">
                                    <FiTrash2 size={14}/> Delete
                                </button>
                                <div className="w-px h-6 bg-slate-200 mx-2" />
                                <button onClick={clearSelection} className="px-3 py-1.5 text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">Cancel</button>
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
                                <button onClick={resetFilters} className="px-5 py-2 bg-slate-900 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95">
                                    Reset All Filters
                                </button>
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
