import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiShield, FiBriefcase, FiClock, FiCalendar, FiEdit2, FiTrash2, FiMail, FiMapPin, FiActivity } from 'react-icons/fi';
import { t } from '../../theme/theme';

const AVATAR_COLORS = t.color.avatarGradients;
function getAvatar(name) {
    if (!name) return { initials:'?', colors: AVATAR_COLORS[0] };
    let h = 0; for (let i=0;i<name.length;i++) h = name.charCodeAt(i)+((h<<5)-h);
    const p = name.split(' ');
    return { initials: (p.length>=2?`${p[0][0]}${p[1][0]}`:name.slice(0,2)).toUpperCase(), colors: AVATAR_COLORS[Math.abs(h)%AVATAR_COLORS.length] };
}

const InfoRow = ({ icon, label, value }) => (
    <div style={{ display:'flex', alignItems:'flex-start', gap: 16, padding:'14px 0', borderBottom: `1px solid ${t.color.borderLight}40` }}>
        <div style={{ width:32, height:32, borderRadius: 10, background: t.color.primaryBg, display:'flex', alignItems:'center', justifyContent:'center', color: t.color.primary, flexShrink:0 }}>
            {icon}
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: t.color.textPlaceholder, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.color.text }}>{value || '—'}</div>
        </div>
    </div>
);

const UserPeekView = ({ isOpen, onClose, user, onEdit, onDelete }) => {
    if (!user) return null;
    const { initials, colors } = getAvatar(user.name);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity:0 }}
                        animate={{ opacity:1 }}
                        exit={{ opacity:0 }}
                        onClick={onClose}
                        style={{ position:'fixed', inset:0, background: 'rgba(0,0,0,0.15)', backdropFilter:'blur(4px)', zIndex: 999 }}
                    />

                    <motion.div
                        initial={{ x:'100%' }}
                        animate={{ x:0 }}
                        exit={{ x:'100%' }}
                        transition={{ type:'spring', damping:28, stiffness:220 }}
                        style={{ 
                            position:'fixed', right:0, top:0, height:'100%', width: 420, maxWidth:'95vw', 
                            background: '#fff', boxShadow: '-12px 0 40px rgba(0,0,0,0.08)', 
                            zIndex: 1000, display:'flex', flexDirection:'column' 
                        }}
                    >
                        {/* Header with Glassmorphism */}
                        <div style={{ 
                            padding: '24px 32px', borderBottom: `1px solid ${t.color.borderLight}`, 
                            background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', 
                            position: 'relative', overflow: 'hidden' 
                        }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${t.color.primary}, ${t.color.primaryLight})` }} />
                            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                                <span style={{ fontSize: 13, fontWeight: 900, color: t.color.text, textTransform:'uppercase', letterSpacing:'0.1em' }}>User Profile</span>
                                <motion.button 
                                    whileHover={{ rotate: 90, background: '#f8fafc' }}
                                    onClick={onClose} 
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.color.textPlaceholder, padding: 8, borderRadius: '50%', display: 'flex' }}
                                >
                                    <FiX size={18} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Content */}
                        <div style={{ flex:1, overflowY:'auto', padding:'32px' }}>
                            {/* Profile Info Card */}
                            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', marginBottom: 40 }}>
                                <motion.div 
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    style={{ 
                                        width: 84, height: 84, borderRadius: '50%', 
                                        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`, 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                        fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 20,
                                        boxShadow: `0 12px 24px ${colors[0]}40`
                                    }}
                                >
                                    {initials}
                                </motion.div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: t.color.text, marginBottom: 4 }}>{user.name}</div>
                                <div style={{ fontSize: 13, color: t.color.textPlaceholder, fontWeight: 500 }}>{user.email}</div>

                                {/* Actions */}
                                <div style={{ display:'flex', gap: 12, marginTop: 24 }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => { onClose(); onEdit(user); }}
                                        style={{ display:'flex', alignItems:'center', gap: 8, padding:'8px 20px', fontSize: 12, fontWeight: 800, color: '#fff', background: t.color.primary, border: 'none', borderRadius: 10, cursor:'pointer' }}
                                    >
                                        <FiEdit2 size={13} /> EDIT
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05, background: '#FEF2F2' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => { onClose(); onDelete(user); }}
                                        style={{ display:'flex', alignItems:'center', gap: 8, padding:'8px 20px', fontSize: 12, fontWeight: 800, color: t.color.danger, background: 'transparent', border: `1.5px solid ${t.color.dangerBorder}`, borderRadius: 10, cursor:'pointer' }}
                                    >
                                        <FiTrash2 size={13} /> DELETE
                                    </motion.button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <InfoRow icon={<FiShield size={16}/>} label="Role" value={user.role} />
                                <InfoRow icon={<FiBriefcase size={16}/>} label="Organization" value={user.organization} />
                                <InfoRow icon={<FiMapPin size={16}/>} label="Assignment" value={user.assignment ? user.assignment.charAt(0).toUpperCase() + user.assignment.slice(1) : '—'} />
                                <InfoRow 
                                    icon={<FiActivity size={16}/>} 
                                    label="Status" 
                                    value={
                                        <span style={{ 
                                            padding:'4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform:'uppercase',
                                            background: user.status === 'active' ? '#ECFDF5' : '#FEF2F2',
                                            color: user.status === 'active' ? '#065F46' : '#991B1B',
                                            border: `1.5px solid ${user.status === 'active' ? '#A7F3D0' : '#FECACA'}`,
                                        }}>{user.status}</span>
                                    } 
                                />
                                <InfoRow icon={<FiClock size={16}/>} label="Last Active" value={user.lastActive || '15 mins ago'} />
                                <InfoRow icon={<FiCalendar size={16}/>} label="Created" value={user.createdAt || '2024-03-20'} />
                            </div>

                            {/* Activity Feed */}
                            <div style={{ marginTop: 40 }}>
                                <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 20 }}>
                                    <FiActivity size={14} color={t.color.primary} />
                                    <span style={{ fontSize: 11, fontWeight: 900, color: t.color.textMuted, textTransform:'uppercase', letterSpacing:'0.1em' }}>Recent Activity</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingLeft: 8, borderLeft: `2px solid #f1f5f9` }}>
                                    {[1, 2].map(i => (
                                        <div key={i} style={{ position: 'relative' }}>
                                            <div style={{ position: 'absolute', left: -14, top: 4, width: 10, height: 10, borderRadius: '50%', background: i === 1 ? t.color.primary : '#CBD5E1', border: '2px solid #fff' }} />
                                            <div style={{ fontSize: 13, fontWeight: 700, color: t.color.text, lineHeight: 1.4 }}>{i === 1 ? 'Logged in from Mumbai, India' : 'Updated account password'}</div>
                                            <div style={{ fontSize: 11, color: t.color.textPlaceholder, marginTop: 4 }}>{i === 1 ? '2 hours ago • Chrome/Windows' : 'Yesterday • Safari/macOS'}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default UserPeekView;
