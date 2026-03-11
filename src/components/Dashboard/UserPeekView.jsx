import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiShield, FiBriefcase, FiClock, FiCalendar, FiEdit2, FiTrash2, FiMail, FiMapPin } from 'react-icons/fi';

const AVATAR_COLORS = [['#6366F1','#A855F7'],['#3B82F6','#06B6D4'],['#F43F5E','#FB923C'],['#10B981','#3B82F6'],['#F59E0B','#EF4444']];
function getAvatar(name) {
    if (!name) return { initials:'?', colors: AVATAR_COLORS[0] };
    let h = 0; for (let i=0;i<name.length;i++) h = name.charCodeAt(i)+((h<<5)-h);
    const p = name.split(' ');
    return { initials: (p.length>=2?`${p[0][0]}${p[1][0]}`:name.slice(0,2)).toUpperCase(), colors: AVATAR_COLORS[Math.abs(h)%AVATAR_COLORS.length] };
}

const InfoRow = ({ icon, label, value }) => (
    <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 0' }}>
        <div style={{ width:34, height:34, borderRadius:8, background:'#EEF2FF', display:'flex', alignItems:'center', justifyContent:'center', color:'#4F46E5', flexShrink:0 }}>
            {icon}
        </div>
        <div>
            <div style={{ fontSize:10, fontWeight:600, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>{label}</div>
            <div style={{ fontSize:14, fontWeight:600, color:'#111827' }}>{value || '—'}</div>
        </div>
    </div>
);

/**
 * User Peek View — slide-in drawer showing user details
 *
 * @param {boolean}  isOpen   - show/hide
 * @param {Function} onClose  - close handler
 * @param {Object}   user     - user object to display
 * @param {Function} onEdit   - (user) => open edit modal
 * @param {Function} onDelete - (user) => open delete confirmation
 */
const UserPeekView = ({ isOpen, onClose, user, onEdit, onDelete }) => {
    if (!user) return null;
    const { initials, colors } = getAvatar(user.name);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity:0 }}
                        animate={{ opacity:1 }}
                        exit={{ opacity:0 }}
                        onClick={onClose}
                        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.2)', backdropFilter:'blur(2px)', zIndex:99 }}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x:'100%' }}
                        animate={{ x:0 }}
                        exit={{ x:'100%' }}
                        transition={{ type:'spring', damping:25, stiffness:200 }}
                        style={{ position:'fixed', right:0, top:0, height:'100%', width:420, maxWidth:'95vw', background:'#fff', boxShadow:'-6px 0 24px rgba(0,0,0,0.08)', zIndex:100, display:'flex', flexDirection:'column' }}
                    >
                        {/* Header */}
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:'1px solid #F3F4F6', flexShrink:0 }}>
                            <span style={{ fontSize:14, fontWeight:700, color:'#111827', textTransform:'uppercase', letterSpacing:'0.04em' }}>User Profile</span>
                            <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#9CA3AF', display:'flex', padding:4, borderRadius:6 }}
                                onMouseEnter={e => e.currentTarget.style.background='#F3F4F6'}
                                onMouseLeave={e => e.currentTarget.style.background='none'}
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{ flex:1, overflowY:'auto', padding:'24px 20px' }}>
                            {/* Profile Header */}
                            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', marginBottom:24 }}>
                                <div style={{ width:72, height:72, borderRadius:'50%', background:`linear-gradient(135deg,${colors[0]},${colors[1]})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:700, color:'#fff', marginBottom:12 }}>
                                    {initials}
                                </div>
                                <div style={{ fontSize:18, fontWeight:700, color:'#111827', marginBottom:2 }}>{user.name}</div>
                                <div style={{ fontSize:13, color:'#9CA3AF' }}>{user.email}</div>

                                {/* Action Buttons */}
                                <div style={{ display:'flex', gap:8, marginTop:16 }}>
                                    {onEdit && (
                                        <button
                                            onClick={() => { onClose(); onEdit(user); }}
                                            style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 16px', fontSize:12, fontWeight:600, color:'#fff', background:'#4F46E5', border:'1px solid #4338CA', borderRadius:7, cursor:'pointer' }}
                                        >
                                            <FiEdit2 size={12} /> Edit
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => { onClose(); onDelete(user); }}
                                            style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 16px', fontSize:12, fontWeight:600, color:'#EF4444', background:'#fff', border:'1px solid #FECACA', borderRadius:7, cursor:'pointer' }}
                                            onMouseEnter={e => { e.currentTarget.style.background='#FEF2F2'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background='#fff'; }}
                                        >
                                            <FiTrash2 size={12} /> Delete
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div style={{ height:1, background:'#F3F4F6', margin:'0 0 16px' }} />

                            {/* Details */}
                            <InfoRow icon={<FiShield size={16}/>} label="Role" value={user.role} />
                            <InfoRow icon={<FiBriefcase size={16}/>} label="Organization" value={user.organization} />
                            <InfoRow icon={<FiMapPin size={16}/>} label="Assignment" value={user.assignment ? user.assignment.charAt(0).toUpperCase() + user.assignment.slice(1) : '—'} />

                            <InfoRow
                                icon={<FiClock size={16}/>}
                                label="Status"
                                value={
                                    <span style={{
                                        display:'inline-block', padding:'3px 10px', fontSize:11, fontWeight:700,
                                        borderRadius:20, textTransform:'uppercase', letterSpacing:'0.04em',
                                        background: user.status === 'active' ? '#ECFDF5' : '#FEF2F2',
                                        color: user.status === 'active' ? '#065F46' : '#991B1B',
                                        border: `1px solid ${user.status === 'active' ? '#A7F3D0' : '#FECACA'}`,
                                    }}>
                                        {user.status}
                                    </span>
                                }
                            />

                            <InfoRow icon={<FiCalendar size={16}/>} label="Last Active" value={user.lastActive || '—'} />
                            <InfoRow icon={<FiCalendar size={16}/>} label="Created" value={user.createdAt || '—'} />

                            {/* Activity Section */}
                            <div style={{ marginTop:20, padding:16, background:'#F9FAFB', borderRadius:10, border:'1px solid #F3F4F6' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12 }}>
                                    <FiCalendar size={13} color="#9CA3AF" />
                                    <span style={{ fontSize:11, fontWeight:600, color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.05em' }}>Recent Activity</span>
                                </div>
                                {[1,2].map(i => (
                                    <div key={i} style={{ display:'flex', gap:8, padding:'8px 0', borderBottom: i===1 ? '1px solid #E5E7EB' : 'none' }}>
                                        <div style={{ width:5, height:5, borderRadius:'50%', background:'#4F46E5', marginTop:5, flexShrink:0 }} />
                                        <div>
                                            <div style={{ fontSize:12, fontWeight:600, color:'#111827', lineHeight:1.3 }}>Logged in from Mumbai, India</div>
                                            <div style={{ fontSize:11, color:'#9CA3AF', marginTop:2 }}>2 hours ago • Chrome/Windows</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default UserPeekView;
