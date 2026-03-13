import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import useUserStore from '../../store/userStore';
import UserPeekView from '../../components/Dashboard/UserPeekView';
import UserFormModal from '../../components/Dashboard/UserFormModal';
import ConfirmModal from '../../components/UI/ConfirmModal';
import { StatsRow } from '../../components/Dashboard/StatsCard';
import { t } from '../../theme/theme';
import {
    FiPlus, FiSearch, FiDownload, FiTrash2,
    FiUserCheck, FiUserX, FiUsers, FiAlertCircle,
    FiCheckCircle, FiClock, FiX, FiChevronDown,
    FiRefreshCw, FiCalendar
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
        <div ref={containerRef} style={{ position: 'relative' }}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', 
                    background: '#fff', border: `1px solid ${isOpen ? t.color.primary : '#E5E7EB'}`, 
                    borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s ease',
                    boxShadow: isOpen ? `0 0 0 3px ${t.color.primary}10` : 'none'
                }}
            >
                <span style={{ fontSize: 11, fontWeight: 800, color: t.color.textPlaceholder, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}:</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: t.color.text }}>{value || allLabel}</span>
                <FiChevronDown size={14} style={{ color: t.color.textPlaceholder, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <Motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        style={{ 
                            position: 'absolute', top: '120%', left: 0, minWidth: 160, 
                            background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)',
                            border: `1px solid ${t.color.borderLight}`, borderRadius: 12, 
                            boxShadow: t.shadow.xl, zIndex: 100, overflow: 'hidden', padding: 4
                        }}
                    >
                        <button 
                            onClick={() => { onChange(''); setIsOpen(false); }}
                            style={{ 
                                width: '100%', padding: '8px 12px', textAlign: 'left', border: 'none', 
                                background: !value ? t.color.primaryBg : 'transparent', 
                                color: !value ? t.color.primary : t.color.text,
                                fontSize: 13, fontWeight: 600, borderRadius: 8, cursor: 'pointer'
                            }}
                        >
                            {allLabel}
                        </button>
                        {options.map(opt => (
                            <button 
                                key={opt}
                                onClick={() => { onChange(opt); setIsOpen(false); }}
                                style={{ 
                                    width: '100%', padding: '8px 12px', textAlign: 'left', border: 'none', 
                                    background: value === opt ? t.color.primaryBg : 'transparent', 
                                    color: value === opt ? t.color.primary : t.color.text,
                                    fontSize: 13, fontWeight: 600, borderRadius: 8, cursor: 'pointer'
                                }}
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
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ 
                position: 'fixed', top: 0, left: '50%', zIndex: 2000,
                padding: '12px 24px', borderRadius: 100,
                background: type === 'success' ? '#059669' : '#DC2626',
                color: '#fff', fontSize: 13, fontWeight: 700, 
                display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
            }}
        >
            {type === 'success' ? <FiCheckCircle size={16} /> : <FiAlertCircle size={16} />}
            {message}
        </Motion.div>
    );
};

const TableSkeleton = () => (
    <div style={{ padding: 20 }}>
        {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ height: 60, background: '#f8fafc', borderRadius: 12, marginBottom: 12, animation: 'pulse 2s infinite' }} />
        ))}
    </div>
);

export default function Users() {
    const store = useUserStore();
    const {
        users, stats, filterOptions, loading,
        search, filters, sortKey, sortDir, selectedIds,
        fetchUsers, createUser, updateUser, deleteUser, bulkAction, exportCSV,
        setSearch, setFilters, handleSort, toggleSelectAll, toggleSelectRow,
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

    // ── Sort & filter users client-side (already filtered from service) ──
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

    // ── Handlers ──
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

    // ── Sort Icon ──
    const SortIcon = ({col}) => {
        if(sortKey!==col) return <span style={{opacity:0.3,marginLeft:3,fontSize:10}}>↕</span>;
        return <span style={{marginLeft:3,fontSize:10,color:'#4F46E5'}}>{sortDir==='asc'?'↑':'↓'}</span>;
    };

    // ── Stats Data ──
    const statsData = [
        { label:'Total Users', value:stats.total,      icon:<FiUsers size={16}/>,       iconBg:'#EFF6FF', iconColor:'#2563EB', subValue: `${stats.active} Active / ${stats.inactive} Inactive` },
        { label:'Active Users', value:stats.active,     icon:<FiCheckCircle size={16}/>,  iconBg:'#ECFDF5', iconColor:'#059669', trend: 12 },
        { label:'Inactive',    value:stats.inactive,   icon:<FiAlertCircle size={16}/>,  iconBg:'#FEF2F2', iconColor:'#DC2626', trend: -5 },
        { label:'Unassigned',  value:stats.unassigned,  icon:<FiClock size={16}/>,        iconBg:'#FFFBEB', iconColor:'#D97706' },
    ];

    const colHeaders = [
        { label:'User', key:'name' },
        { label:'Organization', key:'organization' },
        { label:'Role', key:'role' },
        { label:'Status', key:'status' },
    ];

    return (
        <div style={{ width:'100%' }}>
            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Header */}
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
                <div>
                    <h1 style={{ fontSize:20, fontWeight:700, color: t.color.text, margin:'0 0 3px 0', letterSpacing:'-0.3px' }}>User Management</h1>
                    <p style={{ fontSize:12, color: t.color.textPlaceholder, margin:0 }}>Manage platform users, roles &amp; permissions</p>
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <button onClick={exportCSV} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 13px', fontSize:12, fontWeight:500, color: t.color.textSecondary, background: t.color.bg, border: `1px solid ${t.color.border}`, borderRadius:7, cursor:'pointer' }}>
                        <FiDownload size={13} /> Export
                    </button>
                    <button onClick={handleAddUser} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 15px', fontSize:12, fontWeight:600, color: t.color.textInverse, background: t.color.primary, border: `1px solid ${t.color.primaryDark}`, borderRadius:7, cursor:'pointer' }}>
                        <FiPlus size={13} /> Add User
                    </button>
                </div>
            </div>

            {/* Stats */}
            <StatsRow items={statsData} gap={12} style={{ marginBottom:16 }} />

            {/* Toolbar */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12, flexWrap:'wrap' }}>
                <div style={{ position:'relative', width:260, flexShrink:0 }}>
                    <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF', pointerEvents:'none', display:'flex' }}><FiSearch size={13}/></span>
                    <input
                        style={{ width:'100%', paddingLeft:32, paddingRight:28, paddingTop:7, paddingBottom:7, fontSize:13, background:'#fff', border:'1px solid #E5E7EB', borderRadius:7, outline:'none', boxSizing:'border-box', color:'#111827' }}
                        placeholder="Search users..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && <button onClick={() => setSearch('')} style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9CA3AF', display:'flex', padding:2 }}><FiX size={12}/></button>}
                </div>

                <div style={{ width:1, height:24, background:'#E5E7EB' }} />

                <FilterDropdown label="Role" value={filters.role} options={filterOptions.roles} onChange={v => setFilters({...filters, role:v})} allLabel="All Roles" />
                <FilterDropdown label="Status" value={filters.status} options={['active','inactive']} onChange={v => setFilters({...filters, status:v})} allLabel="All Statuses" />
                <FilterDropdown label="Organization" value={filters.organization} options={filterOptions.organizations} onChange={v => setFilters({...filters, organization:v})} allLabel="All Orgs" />
                
                {/* Date Filter (Mini) */}
                <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 10px', background:'#fff', border:'1px solid #E5E7EB', borderRadius:7, cursor:'pointer' }}>
                    <FiCalendar size={13} color="#6B7280" />
                    <span style={{ fontSize:12, fontWeight:500, color:'#374151' }}>Date Range: All Time</span>
                </div>

                {activeFilterCount > 0 && <button onClick={resetFilters} style={{ fontSize:11, color:'#EF4444', fontWeight:500, cursor:'pointer', background:'none', border:'none', padding:'4px 8px' }}>Clear all</button>}

                <div style={{ display:'flex', alignItems:'center', gap:8, marginLeft:'auto' }}>
                    <button onClick={fetchUsers} title="Refresh" style={{ display:'flex', alignItems:'center', padding:'7px 10px', fontSize:12, fontWeight:500, color:'#374151', background:'#fff', border:'1px solid #E5E7EB', borderRadius:7, cursor:'pointer' }}><FiRefreshCw size={13} /></button>
                    <span style={{ fontSize:12, color:'#6B7280', whiteSpace:'nowrap' }}><strong style={{color:'#111827'}}>{sortedUsers.length}</strong> / {stats.total} users</span>
                </div>
            </div>

            {/* Bulk Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <Motion.div 
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ 
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                            padding: '12px 16px', marginBottom: 16, 
                            background: 'rgba(7, 34, 103, 0.05)', 
                            backdropFilter: 'blur(8px)',
                            border: `1px solid rgba(7, 34, 103, 0.1)`, 
                            borderRadius: 16,
                            boxShadow: '0 4px 12px rgba(7, 34, 103, 0.05)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: t.color.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>
                                    {selectedIds.length}
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 700, color: t.color.primary }}>Users Selected</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: 12, fontWeight: 700, color: t.color.success, background: t.color.successBg, border: `1px solid ${t.color.successBorder}`, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }} onClick={handleBulkActivate}><FiUserCheck size={14}/> Activate</button>
                                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: 12, fontWeight: 700, color: t.color.warning, background: t.color.warningBg, border: `1px solid ${t.color.warningBorder}`, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }} onClick={handleBulkDeactivate}><FiUserX size={14}/> Deactivate</button>
                                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: 12, fontWeight: 700, color: t.color.danger, background: t.color.dangerBg, border: `1px solid ${t.color.dangerBorder}`, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setBulkDeleteOpen(true)}><FiTrash2 size={14}/> Delete</button>
                                <div style={{ width: 1, height: 20, background: 'rgba(7, 34, 103, 0.1)', margin: '0 4px' }} />
                                <button style={{ fontSize: 12, fontWeight: 700, color: t.color.textPlaceholder, background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px' }} onClick={clearSelection}>Cancel</button>
                            </div>
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>

            {/* Table Area */}
            <div style={{ 
                background: 'rgba(255, 255, 255, 0.9)', 
                backdropFilter: 'blur(10px)',
                border: `1px solid ${t.color.border}`, 
                borderRadius: 24, 
                overflow: 'hidden', 
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.04)', 
                minHeight: 400 
            }}>
                {loading ? (
                    <TableSkeleton />
                ) : (
                    <>
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
                            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'56px 20px', textAlign:'center' }}>
                                <div style={{ width:44, height:44, background:'#F3F4F6', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}><FiUsers size={20} color="#9CA3AF"/></div>
                                <div style={{ fontSize:14, fontWeight:600, color:'#111827', marginBottom:4 }}>No users found</div>
                                <div style={{ fontSize:12, color:'#6B7280', marginBottom:14 }}>Try adjusting your search or filters</div>
                                <button onClick={resetFilters} style={{ fontSize:12, fontWeight:600, color:'#4F46E5', background:'none', border:'1px solid #C7D2FE', borderRadius:6, padding:'5px 14px', cursor:'pointer' }}>Reset filters</button>
                            </div>
                        )}
                    </>
                )}

                {sortedUsers.length > 0 && (
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 14px', background:'#F9FAFB', borderTop:'1px solid #F3F4F6' }}>
                        <span style={{ fontSize:12, color:'#6B7280' }}>
                            Displaying <strong>{sortedUsers.length}</strong> user{sortedUsers.length!==1?'s':''} total
                        </span>
                    </div>
                )}
            </div>

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
                confirmText="Delete"
                danger={true}
                loading={loading}
            />

            <ConfirmModal
                isOpen={bulkDeleteOpen}
                onClose={() => setBulkDeleteOpen(false)}
                onConfirm={handleBulkDelete}
                title="Delete Selected Users"
                message={`Are you sure you want to delete ${selectedIds.length} selected users? This action cannot be undone.`}
                confirmText={`Delete ${selectedIds.length} Users`}
                danger={true}
                loading={loading}
            />

            <style>{`
                @keyframes slideDown { from { transform: translateY(-20px); opacity:0; } to { transform: translateY(0); opacity:1; } }
            `}</style>
        </div>
    );
}
