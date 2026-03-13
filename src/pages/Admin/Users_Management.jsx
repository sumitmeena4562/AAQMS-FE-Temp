import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import useUserStore from '../../store/userStore';
import UserPeekView from '../../components/Dashboard/UserPeekView';
import UserFormModal from '../../components/Dashboard/UserFormModal';
import ConfirmModal from '../../components/UI/ConfirmModal';
import { StatsRow } from '../../components/Dashboard/StatsCard';
import {
    FiPlus, FiSearch, FiDownload, FiTrash2,
    FiUserCheck, FiUserX, FiUsers, FiAlertCircle,
    FiCheckCircle, FiClock, FiX, FiChevronDown,
    FiRefreshCw, FiCalendar, FiFilter
} from 'react-icons/fi';
import UserTable from '../../components/Tables/UserTable';

// ─── Local UI Components ───────────────────────────────────────────────────────

const FilterDropdown = ({ label, value, options = [], onChange, allLabel = 'All' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 bg-white border rounded-xl cursor-pointer transition-all duration-300 group
                    ${isOpen ? 'border-primary ring-4 ring-primary/10 shadow-lg' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}
            >
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}:</span>
                <span className="text-sm font-bold text-slate-700">{value || allLabel}</span>
                <FiChevronDown className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} size={14} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <Motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 min-w-[180px] bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl z-[100] overflow-hidden p-1.5 ring-1 ring-black/5"
                    >
                        <button 
                            onClick={() => { onChange(''); setIsOpen(false); }}
                            className={`w-full px-3 py-2 text-left rounded-xl transition-colors text-sm font-bold
                                ${!value ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50 text-slate-600'}`}
                        >
                            {allLabel}
                        </button>
                        {options.map(opt => (
                            <button 
                                key={opt}
                                onClick={() => { onChange(opt); setIsOpen(false); }}
                                className={`w-full px-3 py-2 text-left rounded-xl transition-colors text-sm font-bold mt-0.5
                                    ${value === opt ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50 text-slate-600'}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <Motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`fixed top-0 left-1/2 z-[2000] px-6 py-3 rounded-full text-white text-sm font-black shadow-2xl flex items-center gap-3 backdrop-blur-md border border-white/20
                ${type === 'success' ? 'bg-emerald-600/90' : 'bg-rose-600/90'}`}
        >
            {type === 'success' ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
            {message}
        </Motion.div>
    );
};

const TableSkeleton = () => (
    <div className="p-6 space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-slate-100/50 rounded-2xl animate-pulse ring-1 ring-slate-200/50" />
        ))}
    </div>
);

export default function Users() {
    const store = useUserStore();
    const {
        users, stats, filterOptions, loading,
        search, filters, sortKey, sortDir, selectedIds,
        fetchUsers, createUser, updateUser, deleteUser, bulkAction, exportCSV,
        setSearch, setFilters, toggleSelectAll, toggleSelectRow,
        clearSelection, resetFilters,
    } = store;

    // ── Modal state ──
    const [peekUser, setPeekUser] = useState(null);
    const [isPeekOpen, setIsPeekOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [toast, setToast] = useState(null);

    // ── Fetch on mount and when filters/search change ──
    useEffect(() => { fetchUsers(); }, [filters]);

    const doSearch = useCallback(() => { fetchUsers(); }, [fetchUsers]);
    useEffect(() => {
        const t = setTimeout(doSearch, 300);
        return () => clearTimeout(t);
    }, [search]);

    const sortedUsers = useMemo(() => {
        const list = [...users];
        list.sort((a, b) => {
            const av = (a[sortKey] || '').toString().toLowerCase();
            const bv = (b[sortKey] || '').toString().toLowerCase();
            return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
        });
        return list;
    }, [users, sortKey, sortDir]);

    const activeFilterCount = Object.values(filters).filter(v => v && v !== '').length;

    const showToast = (message, type='success') => setToast({ message, type });

    const handleAddUser = () => { setEditingUser(null); setIsFormOpen(true); };
    const handleEditUser = (user) => { setEditingUser(user); setIsFormOpen(true); };
    const handleDeleteUser = (user) => setDeleteTarget(user);

    const handleFormSubmit = async (formData) => {
        if (editingUser) {
            const res = await updateUser(editingUser.id, formData);
            if (res.success) showToast(`${formData.name} updated successfully`);
            return res;
        } else {
            const res = await createUser(formData);
            if (res.success) showToast(`${formData.name} added successfully`);
            return res;
        }
    };

    const handleConfirmDelete = async () => {
        if (deleteTarget) {
            const res = await deleteUser(deleteTarget.id);
            if (res.success) showToast(`${deleteTarget.name} deleted`, 'success');
            setDeleteTarget(null);
        }
    };

    const handleBulkDelete = async () => {
        const res = await bulkAction('delete');
        if (res?.success) showToast(`${selectedIds.length} users deleted`);
        setBulkDeleteOpen(false);
    };

    const handleBulkActivate = async () => {
        const res = await bulkAction('activate');
        if (res?.success) showToast(`${selectedIds.length} users activated`);
    };

    const handleBulkDeactivate = async () => {
        const res = await bulkAction('deactivate');
        if (res?.success) showToast(`${selectedIds.length} users deactivated`);
    };

    const statsData = [
        { label:'Total Users', value:stats.total,      icon:<FiUsers size={16}/>,       iconBg:'#f0f9ff', iconColor:'#0369a1', subValue: `${stats.active} Active / ${stats.inactive} Inactive` },
        { label:'Active Users', value:stats.active,     icon:<FiCheckCircle size={16}/>,  iconBg:'#ecfdf5', iconColor:'#059669', trend: 12 },
        { label:'Inactive',    value:stats.inactive,   icon:<FiAlertCircle size={16}/>,  iconBg:'#fff1f2', iconColor:'#e11d48', trend: -5 },
        { label:'Unassigned',  value:stats.unassigned,  icon:<FiClock size={16}/>,        iconBg:'#fffbeb', iconColor:'#d97706' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, ease: [0.21, 1, 0.36, 1] }
        }
    };

    return (
        <Motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full space-y-6 pb-12"
        >
            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Header Section */}
            <Motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">User Management</h1>
                    <p className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Manage platform users, roles & enterprise permissions
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={exportCSV} 
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm active:scale-95"
                    >
                        <FiDownload size={16} /> Export
                    </button>
                    <button 
                        onClick={handleAddUser} 
                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-black text-white bg-primary rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                    >
                        <FiPlus size={18} /> Add New User
                    </button>
                </div>
            </Motion.div>

            {/* Stats Section */}
            <Motion.div variants={itemVariants}>
                <StatsRow items={statsData} gap={16} />
            </Motion.div>

            {/* Toolbar Section */}
            <Motion.div variants={itemVariants} className="bg-white/50 backdrop-blur-md border border-slate-200/50 p-3 rounded-[24px] shadow-sm flex flex-col lg:flex-row items-center gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 w-full lg:max-w-xs group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                        <FiSearch size={16} />
                    </span>
                    <input
                        className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/5 group-hover:border-slate-300"
                        placeholder="Search for users..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <button 
                            onClick={() => setSearch('')} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        >
                            <FiX size={14}/>
                        </button>
                    )}
                </div>

                <div className="hidden lg:block w-px h-8 bg-slate-200 mx-1" />

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-3 flex-1">
                    <FilterDropdown label="Role" value={filters.role} options={filterOptions.roles} onChange={v => setFilters({...filters, role:v})} allLabel="All Roles" />
                    <FilterDropdown label="Status" value={filters.status} options={['active','inactive']} onChange={v => setFilters({...filters, status:v})} allLabel="All Statuses" />
                    <FilterDropdown label="Organization" value={filters.organization} options={filterOptions.organizations} onChange={v => setFilters({...filters, organization:v})} allLabel="All Orgs" />
                    
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl cursor-default shadow-sm group hover:border-slate-300 transition-colors duration-300">
                        <FiCalendar className="text-slate-400" size={14} />
                        <span className="text-sm font-bold text-slate-700">Date: All Time</span>
                    </div>

                    {activeFilterCount > 0 && (
                        <button 
                            onClick={resetFilters} 
                            className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-600 px-2 py-1 transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3 whitespace-nowrap">
                    <button 
                        onClick={fetchUsers} 
                        title="Refresh Data"
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-primary hover:border-primary transition-all duration-300 shadow-sm active:scale-90"
                    >
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        <strong className="text-slate-900">{sortedUsers.length}</strong> / {stats.total} Users
                    </span>
                </div>
            </Motion.div>

            {/* Bulk Actions Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <Motion.div 
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: 10, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-6 py-4 bg-primary/5 backdrop-blur-md border border-primary/20 rounded-[28px] shadow-sm mb-4 ring-1 ring-primary/10">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black shadow-lg shadow-primary/20 animate-bounce">
                                    {selectedIds.length}
                                </div>
                                <div>
                                    <span className="text-sm font-black text-primary tracking-tight block">Users Selected</span>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Perform bulk action on selection</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={handleBulkActivate} className="flex items-center gap-2 px-4 py-2 text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-all duration-300 active:scale-95 shadow-sm">
                                    <FiUserCheck size={16}/> Activate
                                </button>
                                <button onClick={handleBulkDeactivate} className="flex items-center gap-2 px-4 py-2 text-xs font-black text-amber-600 bg-amber-50 border border-amber-100 rounded-xl hover:bg-amber-100 transition-all duration-300 active:scale-95 shadow-sm">
                                    <FiUserX size={16}/> Deactivate
                                </button>
                                <button onClick={() => setBulkDeleteOpen(true)} className="flex items-center gap-2 px-4 py-2 text-xs font-black text-rose-600 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 transition-all duration-300 active:scale-95 shadow-sm">
                                    <FiTrash2 size={16}/> Delete
                                </button>
                                <div className="w-px h-8 bg-slate-200 mx-2" />
                                <button onClick={clearSelection} className="px-4 py-2 text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">Cancel</button>
                            </div>
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>

            {/* Main Table Area */}
            <Motion.div 
                variants={itemVariants} 
                className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[32px] overflow-hidden shadow-2xl shadow-slate-200/50 min-h-[400px] flex flex-col transition-all duration-300 ring-1 ring-slate-200/50 relative"
            >
                {/* Grain texture overlay */}
                <div className="absolute inset-0 opacity-[0.01] pointer-events-none mix-blend-overlay bg-[url('https://grain-y.vercel.app/noise.svg')]" />
                
                {loading ? (
                    <TableSkeleton />
                ) : (
                    <div className="relative z-10 flex-1 flex flex-col">
                        <UserTable 
                            data={sortedUsers}
                            selectedIds={selectedIds}
                            onSelectionChange={() => {}} 
                            onRowClick={(user) => { setPeekUser(user); setIsPeekOpen(true); }}
                            onEdit={handleEditUser}
                            toggleSelectAll={() => toggleSelectAll(sortedUsers.map(u=>u.id))}
                            toggleSelectRow={toggleSelectRow}
                        />
                        
                        {sortedUsers.length === 0 && (
                            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[30px] flex items-center justify-center mb-6 shadow-sm rotate-3 group-hover:rotate-0 transition-transform">
                                    <FiUsers size={32} className="text-slate-300"/>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">No Personnel Found</h3>
                                <p className="text-sm font-semibold text-slate-500 mb-8 max-w-xs mx-auto text-pretty">
                                    We couldn&apos;t find any users matching your current criteria. Try refining your search or filters.
                                </p>
                                <button onClick={resetFilters} className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all duration-300 shadow-xl shadow-slate-900/10 active:scale-95">
                                    Reset Selection
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer Bar */}
                {sortedUsers.length > 0 && (
                    <div className="relative z-10 px-8 py-3 bg-slate-50/50 backdrop-blur-md border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Dataset Overview
                        </span>
                        <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                             <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                                Displaying {sortedUsers.length} profile{sortedUsers.length!==1?'s':''}
                             </span>
                        </div>
                    </div>
                )}
            </Motion.div>

            {/* ── Modals ── */}
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
        </Motion.div>
    );
}
