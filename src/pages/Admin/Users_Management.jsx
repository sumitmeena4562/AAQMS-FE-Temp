import React, { useState, useMemo, useRef, useEffect } from 'react';
import UserPeekView from '../../components/Dashboard/UserPeekView';
import {
    FiPlus, FiSearch, FiDownload, FiTrash2,
    FiUserCheck, FiUserX, FiUsers, FiAlertCircle,
    FiCheckCircle, FiClock, FiX, FiChevronDown,
    FiRefreshCw, FiSettings
} from 'react-icons/fi';

// ─── Dummy Data ────────────────────────────────────────────────────────────────
const dummyUsers = [
    { id: 1,  name: "Sarah Jenkins",  email: "sarah.j@acmecorp.com",   organization: null,            role: "Coordinator",   assignment: "unassigned", status: "active",   verified: true  },
    { id: 7,  name: "Yuki Tanaka",    email: "yuki.t@zensoft.jp",      organization: "ZenSoft",       role: "Field Officer", assignment: "assigned",   status: "active",   verified: true  },
    { id: 8,  name: "Liam O'Connor",  email: "liam.oc@emerald.ie",     organization: "Emerald Eco",   role: "Coordinator",   assignment: "unassigned", status: "active",   verified: false },
    { id: 9,  name: "Sofia Rossi",    email: "s.rossi@lume.it",        organization: "Lume SpA",      role: "Field Officer", assignment: "assigned",   status: "active",   verified: true  },
    { id: 10, name: "Chen Wei",       email: "c.wei@easternstar.cn",   organization: "Eastern Star",  role: "Coordinator",   assignment: "assigned",   status: "inactive", verified: true  },
    { id: 11, name: "Maria Garcia",   email: "m.garcia@techcorp.es",   organization: "TechCorp",      role: "Admin",         assignment: "assigned",   status: "active",   verified: true  },
    { id: 12, name: "Ahmed Hassan",   email: "a.hassan@innovate.ae",   organization: "Innovate Labs", role: "Field Officer", assignment: "assigned",   status: "active",   verified: true  },
];

// ─── Avatar helper ──────────────────────────────────────────────────────────────
const AVATAR_COLORS = [['#6366F1','#A855F7'],['#3B82F6','#06B6D4'],['#F43F5E','#FB923C'],['#10B981','#3B82F6'],['#F59E0B','#EF4444']];
function getAvatar(name) {
    if (!name) return { initials:'?', colors: AVATAR_COLORS[0] };
    let h = 0; for (let i=0;i<name.length;i++) h = name.charCodeAt(i)+((h<<5)-h);
    const p = name.split(' ');
    return { initials: (p.length>=2?`${p[0][0]}${p[1][0]}`:name.slice(0,2)).toUpperCase(), colors: AVATAR_COLORS[Math.abs(h)%AVATAR_COLORS.length] };
}

// ─── Badge components ───────────────────────────────────────────────────────────
const ROLE_BADGE = { coordinator:{bg:'#F5F3FF',color:'#5B21B6',border:'#DDD6FE'},'field officer':{bg:'#EFF6FF',color:'#1E40AF',border:'#BFDBFE'},admin:{bg:'#FFF7ED',color:'#C2410C',border:'#FED7AA'} };
const STATUS_BADGE = { active:{dot:'#10B981',bg:'#ECFDF5',color:'#065F46',border:'#A7F3D0'},inactive:{dot:'#9CA3AF',bg:'#F9FAFB',color:'#4B5563',border:'#E5E7EB'},assigned:{dot:'#60A5FA',bg:'#EFF6FF',color:'#1E40AF',border:'#BFDBFE'},unassigned:{dot:'#FCA5A5',bg:'#FEF2F2',color:'#991B1B',border:'#FECACA'} };

const RoleBadge = ({role}) => { const s=ROLE_BADGE[role?.toLowerCase()]||{bg:'#F3F4F6',color:'#374151',border:'#E5E7EB'}; return <span style={{display:'inline-block',padding:'2px 9px',fontSize:11,fontWeight:600,background:s.bg,color:s.color,border:`1px solid ${s.border}`,borderRadius:20}}>{role}</span>; };
const StatusBadge = ({type,text}) => { const s=STATUS_BADGE[type?.toLowerCase()]||STATUS_BADGE.inactive; return <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'2px 8px',fontSize:11,fontWeight:600,background:s.bg,color:s.color,border:`1px solid ${s.border}`,borderRadius:20}}><span style={{width:6,height:6,borderRadius:'50%',background:s.dot,flexShrink:0}}/>{text}</span>; };

// ─── FilterDropdown component ───────────────────────────────────────────────────
function FilterDropdown({ label, value, options, onChange, allLabel = 'All' }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const isActive = value && value !== 'all' && value !== '';
    const displayLabel = isActive ? `${label}: ${value}` : label;

    return (
        <div ref={ref} style={{ position:'relative' }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    display:'flex', alignItems:'center', gap:5,
                    padding:'6px 10px', fontSize:12, fontWeight:500,
                    color: isActive ? '#4F46E5' : '#374151',
                    background: isActive ? '#EEF2FF' : '#fff',
                    border: `1px solid ${isActive ? '#C7D2FE' : '#E5E7EB'}`,
                    borderRadius:7, cursor:'pointer', whiteSpace:'nowrap',
                }}
            >
                {displayLabel}
                <FiChevronDown size={12} style={{ transform: open ? 'rotate(180deg)':'rotate(0)', transition:'transform 0.15s' }} />
                {isActive && (
                    <span
                        onClick={(e) => { e.stopPropagation(); onChange(''); setOpen(false); }}
                        style={{ display:'flex', alignItems:'center', marginLeft:2, color:'#818CF8', cursor:'pointer' }}
                    >
                        <FiX size={11} />
                    </span>
                )}
            </button>

            {open && (
                <div style={{
                    position:'absolute', top:'calc(100% + 4px)', left:0, minWidth:180,
                    background:'#fff', border:'1px solid #E5E7EB', borderRadius:8,
                    boxShadow:'0 8px 24px rgba(0,0,0,0.1)', zIndex:50,
                    padding:'4px 0', maxHeight:220, overflowY:'auto',
                }}>
                    {/* All option */}
                    <div
                        onClick={() => { onChange(''); setOpen(false); }}
                        style={{
                            padding:'7px 12px', fontSize:12, fontWeight: !isActive ? 600 : 400,
                            color: !isActive ? '#4F46E5' : '#374151',
                            background: !isActive ? '#EEF2FF' : 'transparent',
                            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between',
                        }}
                        onMouseEnter={e => { if(isActive) e.currentTarget.style.background='#F9FAFB'; }}
                        onMouseLeave={e => { if(isActive) e.currentTarget.style.background='transparent'; }}
                    >
                        {allLabel}
                        {!isActive && <span style={{fontSize:10,color:'#4F46E5'}}>✓</span>}
                    </div>

                    <div style={{ height:1, background:'#F3F4F6', margin:'2px 0' }} />

                    {options.map(opt => {
                        const sel = value === opt;
                        return (
                            <div
                                key={opt}
                                onClick={() => { onChange(opt); setOpen(false); }}
                                style={{
                                    padding:'7px 12px', fontSize:12, fontWeight: sel ? 600 : 400,
                                    color: sel ? '#4F46E5' : '#374151',
                                    background: sel ? '#EEF2FF' : 'transparent',
                                    cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between',
                                }}
                                onMouseEnter={e => { if(!sel) e.currentTarget.style.background='#F9FAFB'; }}
                                onMouseLeave={e => { if(!sel) e.currentTarget.style.background='transparent'; }}
                            >
                                {opt}
                                {sel && <span style={{fontSize:10,color:'#4F46E5'}}>✓</span>}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── Main ───────────────────────────────────────────────────────────────────────
export default function Users() {
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [activeUser, setActiveUser] = useState(null);
    const [isPeekOpen, setIsPeekOpen] = useState(false);
    const [filters, setFilters] = useState({ organization:'', role:'', status:'', assignment:'' });
    const [sortKey, setSortKey] = useState('name');
    const [sortDir, setSortDir] = useState('asc');

    const orgOptions = [...new Set(dummyUsers.map(u => u.organization).filter(Boolean))];
    const roleOptions = [...new Set(dummyUsers.map(u => u.role).filter(Boolean))];
    const statusOptions = ['active','inactive'];
    const assignmentOptions = ['assigned','unassigned'];
    const activeFilterCount = Object.values(filters).filter(v => v && v !== '').length;

    const filteredUsers = useMemo(() => {
        let list = dummyUsers.filter(u => {
            const q = search.toLowerCase();
            return (
                (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.organization||'').toLowerCase().includes(q)) &&
                (!filters.organization || u.organization === filters.organization) &&
                (!filters.role || u.role === filters.role) &&
                (!filters.status || u.status === filters.status) &&
                (!filters.assignment || u.assignment === filters.assignment)
            );
        });
        list.sort((a,b) => {
            const av = (a[sortKey]||'').toString().toLowerCase();
            const bv = (b[sortKey]||'').toString().toLowerCase();
            return sortDir==='asc' ? av.localeCompare(bv) : bv.localeCompare(av);
        });
        return list;
    }, [search, filters, sortKey, sortDir]);

    const stats = useMemo(() => ({
        total: dummyUsers.length,
        active: dummyUsers.filter(u => u.status === 'active').length,
        inactive: dummyUsers.filter(u => u.status === 'inactive').length,
        unassigned: dummyUsers.filter(u => u.assignment === 'unassigned').length,
    }), []);

    const resetFilters = () => { setFilters({ organization:'',role:'',status:'',assignment:'' }); setSearch(''); };
    const handleBulkAction = (a) => { console.log(a, selectedIds); setSelectedIds([]); };
    const toggleAll = () => setSelectedIds(selectedIds.length===filteredUsers.length ? [] : filteredUsers.map(u=>u.id));
    const toggleRow = (id) => setSelectedIds(p => p.includes(id)?p.filter(i=>i!==id):[...p,id]);
    const handleSort = (key) => { if(sortKey===key) setSortDir(d=>d==='asc'?'desc':'asc'); else{setSortKey(key);setSortDir('asc');} };

    const SortIcon = ({col}) => {
        if(sortKey!==col) return <span style={{opacity:0.3,marginLeft:3,fontSize:10}}>↕</span>;
        return <span style={{marginLeft:3,fontSize:10,color:'#4F46E5'}}>{sortDir==='asc'?'↑':'↓'}</span>;
    };

    const statsData = [
        { label:'Total Users', value:stats.total,     icon:<FiUsers size={14} color="#2563EB"/>,       bg:'#EFF6FF', num:'#1D4ED8' },
        { label:'Active',      value:stats.active,    icon:<FiCheckCircle size={14} color="#059669"/>,  bg:'#ECFDF5', num:'#065F46' },
        { label:'Inactive',    value:stats.inactive,  icon:<FiAlertCircle size={14} color="#DC2626"/>,  bg:'#FEF2F2', num:'#B91C1C' },
        { label:'Unassigned',  value:stats.unassigned, icon:<FiClock size={14} color="#D97706"/>,       bg:'#FFFBEB', num:'#92400E' },
    ];

    const colHeaders = [
        { label:'User', key:'name' },
        { label:'Organization', key:'organization' },
        { label:'Role', key:'role' },
        { label:'Assignment', key:'assignment' },
        { label:'Status', key:'status' },
    ];

    return (
        <div style={{ width:'100%' }}>
            {/* Header */}
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
                <div>
                    <h1 style={{ fontSize:20, fontWeight:700, color:'#111827', margin:'0 0 3px 0', letterSpacing:'-0.3px' }}>User Management</h1>
                    <p style={{ fontSize:12, color:'#9CA3AF', margin:0 }}>Manage platform users, roles &amp; permissions</p>
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <button style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 13px', fontSize:12, fontWeight:500, color:'#374151', background:'#fff', border:'1px solid #E5E7EB', borderRadius:7, cursor:'pointer' }}>
                        <FiDownload size={13} /> Export
                    </button>
                    <button style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 15px', fontSize:12, fontWeight:600, color:'#fff', background:'#4F46E5', border:'1px solid #4338CA', borderRadius:7, cursor:'pointer' }}>
                        <FiPlus size={13} /> Add User
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
                {statsData.map(s => (
                    <div key={s.label} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:8, padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ background:s.bg, borderRadius:6, padding:7, display:'flex', alignItems:'center', justifyContent:'center' }}>{s.icon}</div>
                        <div>
                            <div style={{ fontSize:10, fontWeight:500, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>{s.label}</div>
                            <div style={{ fontSize:20, fontWeight:700, color:s.num, lineHeight:1 }}>{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Toolbar: Search + Dropdown Filters */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12, flexWrap:'wrap' }}>
                {/* Search */}
                <div style={{ position:'relative', width:260, flexShrink:0 }}>
                    <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF', pointerEvents:'none', display:'flex' }}><FiSearch size={13}/></span>
                    <input
                        style={{ width:'100%', paddingLeft:32, paddingRight:28, paddingTop:7, paddingBottom:7, fontSize:13, background:'#fff', border:'1px solid #E5E7EB', borderRadius:7, outline:'none', boxSizing:'border-box', color:'#111827' }}
                        placeholder="Search users..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <button onClick={() => setSearch('')} style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9CA3AF', display:'flex', padding:2 }}><FiX size={12}/></button>
                    )}
                </div>

                {/* Divider */}
                <div style={{ width:1, height:24, background:'#E5E7EB' }} />

                {/* Filter Dropdowns */}
                <FilterDropdown
                    label="Role"
                    value={filters.role}
                    options={roleOptions}
                    onChange={v => setFilters({...filters, role:v})}
                    allLabel="All Roles"
                />
                <FilterDropdown
                    label="Status"
                    value={filters.status}
                    options={statusOptions}
                    onChange={v => setFilters({...filters, status:v})}
                    allLabel="All Statuses"
                />
                <FilterDropdown
                    label="Organization"
                    value={filters.organization}
                    options={orgOptions}
                    onChange={v => setFilters({...filters, organization:v})}
                    allLabel="All Organizations"
                />
                <FilterDropdown
                    label="Assignment"
                    value={filters.assignment}
                    options={assignmentOptions}
                    onChange={v => setFilters({...filters, assignment:v})}
                    allLabel="All Assignments"
                />

                {activeFilterCount > 0 && (
                    <button onClick={resetFilters} style={{ fontSize:11, color:'#EF4444', fontWeight:500, cursor:'pointer', background:'none', border:'none', padding:'4px 8px', borderRadius:5 }}>
                        Clear all
                    </button>
                )}

                {/* Right side */}
                <div style={{ display:'flex', alignItems:'center', gap:8, marginLeft:'auto' }}>
                    <button onClick={resetFilters} title="Refresh" style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 10px', fontSize:12, fontWeight:500, color:'#374151', background:'#fff', border:'1px solid #E5E7EB', borderRadius:7, cursor:'pointer' }}>
                        <FiRefreshCw size={13} />
                    </button>
                    <span style={{ fontSize:12, color:'#6B7280', whiteSpace:'nowrap' }}>
                        <strong style={{color:'#111827'}}>{filteredUsers.length}</strong> / {dummyUsers.length} users
                    </span>
                </div>
            </div>

            {/* Bulk Bar */}
            {selectedIds.length > 0 && (
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 12px', marginBottom:10, background:'#EEF2FF', border:'1px solid #C7D2FE', borderRadius:7 }}>
                    <span style={{ fontSize:12, fontWeight:600, color:'#4338CA' }}>{selectedIds.length} selected</span>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <button style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', fontSize:11, fontWeight:600, color:'#065F46', background:'#D1FAE5', border:'none', borderRadius:5, cursor:'pointer' }} onClick={() => handleBulkAction('activate')}><FiUserCheck size={12}/> Activate</button>
                        <button style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', fontSize:11, fontWeight:600, color:'#92400E', background:'#FEF3C7', border:'none', borderRadius:5, cursor:'pointer' }} onClick={() => handleBulkAction('deactivate')}><FiUserX size={12}/> Deactivate</button>
                        <button style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', fontSize:11, fontWeight:600, color:'#991B1B', background:'#FEE2E2', border:'none', borderRadius:5, cursor:'pointer' }} onClick={() => handleBulkAction('delete')}><FiTrash2 size={12}/> Delete</button>
                        <button style={{ fontSize:11, color:'#6B7280', background:'none', border:'none', cursor:'pointer', marginLeft:4 }} onClick={() => setSelectedIds([])}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:8, overflow:'hidden' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:700 }}>
                    <thead style={{ background:'#F9FAFB', borderBottom:'1px solid #E5E7EB' }}>
                        <tr>
                            <th style={{ padding:'9px 10px', width:36 }}>
                                <input type="checkbox" style={{ width:13, height:13, cursor:'pointer', accentColor:'#4F46E5' }} checked={filteredUsers.length>0 && selectedIds.length===filteredUsers.length} onChange={toggleAll}/>
                            </th>
                            {colHeaders.map(h => (
                                <th key={h.key} style={{ padding:'9px 12px', fontSize:11, fontWeight:600, color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.06em', textAlign:'left', cursor:'pointer', userSelect:'none' }} onClick={() => handleSort(h.key)}>
                                    {h.label}<SortIcon col={h.key}/>
                                </th>
                            ))}
                            <th style={{ padding:'9px 12px', fontSize:11, fontWeight:600, color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.06em', textAlign:'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => {
                            const {initials,colors} = getAvatar(user.name);
                            const isSel = selectedIds.includes(user.id);
                            return (
                                <tr
                                    key={user.id}
                                    style={{ background: isSel?'#EEF2FF':'transparent', cursor:'pointer' }}
                                    onClick={() => { setActiveUser(user); setIsPeekOpen(true); }}
                                    onMouseEnter={e => { if(!isSel) e.currentTarget.style.background='#F9FAFB'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = isSel?'#EEF2FF':'transparent'; }}
                                >
                                    <td style={{ padding:'10px 10px', verticalAlign:'middle', borderBottom:'1px solid #F3F4F6' }} onClick={e => e.stopPropagation()}>
                                        <input type="checkbox" style={{ width:13, height:13, cursor:'pointer', accentColor:'#4F46E5' }} checked={isSel} onChange={() => toggleRow(user.id)}/>
                                    </td>
                                    <td style={{ padding:'10px 12px', fontSize:13, color:'#374151', whiteSpace:'nowrap', verticalAlign:'middle', borderBottom:'1px solid #F3F4F6' }}>
                                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                            <div style={{ width:30,height:30,borderRadius:'50%',flexShrink:0,background:`linear-gradient(135deg,${colors[0]},${colors[1]})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#fff' }}>{initials}</div>
                                            <div>
                                                <div style={{ fontSize:13, fontWeight:600, color:'#111827', lineHeight:1.2 }}>{user.name}</div>
                                                <div style={{ fontSize:11, color:'#9CA3AF', marginTop:1 }}>{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding:'10px 12px', fontSize:13, color:'#374151', whiteSpace:'nowrap', verticalAlign:'middle', borderBottom:'1px solid #F3F4F6' }}>
                                        {user.organization ? <span>{user.organization}</span> : <span style={{color:'#D1D5DB',fontStyle:'italic',fontSize:12}}>Not assigned</span>}
                                    </td>
                                    <td style={{ padding:'10px 12px', verticalAlign:'middle', borderBottom:'1px solid #F3F4F6' }}><RoleBadge role={user.role}/></td>
                                    <td style={{ padding:'10px 12px', verticalAlign:'middle', borderBottom:'1px solid #F3F4F6' }}><StatusBadge type={user.assignment} text={user.assignment==='assigned'?'Assigned':'Unassigned'}/></td>
                                    <td style={{ padding:'10px 12px', verticalAlign:'middle', borderBottom:'1px solid #F3F4F6' }}><StatusBadge type={user.status} text={user.status==='active'?'Active':'Inactive'}/></td>
                                    <td style={{ padding:'10px 12px', textAlign:'right', verticalAlign:'middle', borderBottom:'1px solid #F3F4F6' }} onClick={e => e.stopPropagation()}>
                                        <button
                                            onClick={() => { setActiveUser(user); setIsPeekOpen(true); }}
                                            style={{ padding:'4px 9px', fontSize:11, fontWeight:600, color:'#4F46E5', background:'none', border:'1px solid transparent', borderRadius:5, cursor:'pointer' }}
                                            onMouseEnter={e => { e.currentTarget.style.background='#EEF2FF'; e.currentTarget.style.borderColor='#C7D2FE'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.borderColor='transparent'; }}
                                        >View</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'56px 20px', textAlign:'center' }}>
                        <div style={{ width:44, height:44, background:'#F3F4F6', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}><FiUsers size={20} color="#9CA3AF"/></div>
                        <div style={{ fontSize:14, fontWeight:600, color:'#111827', marginBottom:4 }}>No users found</div>
                        <div style={{ fontSize:12, color:'#6B7280', marginBottom:14 }}>Try adjusting your search or filters</div>
                        <button onClick={resetFilters} style={{ fontSize:12, fontWeight:600, color:'#4F46E5', background:'none', border:'1px solid #C7D2FE', borderRadius:6, padding:'5px 14px', cursor:'pointer' }}>Reset filters</button>
                    </div>
                )}

                {filteredUsers.length > 0 && (
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 14px', background:'#F9FAFB', borderTop:'1px solid #F3F4F6' }}>
                        <span style={{ fontSize:12, color:'#6B7280' }}>
                            Displaying <strong>{filteredUsers.length}</strong> user{filteredUsers.length!==1?'s':''} total
                        </span>
                    </div>
                )}
            </div>

            {/* Peek Modal */}
            <UserPeekView isOpen={isPeekOpen} onClose={() => setIsPeekOpen(false)} user={activeUser} />
        </div>
    );
}
