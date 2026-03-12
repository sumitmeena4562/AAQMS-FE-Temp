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

const InfoRow = ({ icon, label, value, index }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 * index }}
        style={{ display:'flex', alignItems:'center', gap: 20, padding:'16px 0', borderBottom: `1px solid #F1F5F9` }}
    >
        <div style={{ width:36, height:36, borderRadius: 12, background: t.color.primaryBg, display:'flex', alignItems:'center', justifyContent:'center', color: t.color.primary, flexShrink:0 }}>
            {icon}
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 900, color: t.color.textPlaceholder, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.color.text }}>{value || '—'}</div>
        </div>
    </motion.div>
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
                        style={{ position:'fixed', inset:0, background: 'rgba(0,0,0,0.1)', backdropFilter:'blur(4px)', zIndex: t.zIndex.overlay }}
                    />

                    <motion.div
                        initial={{ x:'100%' }}
                        animate={{ x:0 }}
                        exit={{ x:'100%' }}
                        transition={{ type:'spring', damping:30, stiffness:250 }}
                        style={{ 
                            position:'fixed', right:0, top:0, height:'100%', width: 500, maxWidth:'95vw', 
                            background: '#fff', boxShadow: '-12px 0 50px rgba(0,0,0,0.06)', 
                            zIndex: t.zIndex.modal, display:'flex', flexDirection:'column'
                        }}
                    >
                        {/* Header */}
                        <div style={{ 
                            padding: '24px 32px', borderBottom: '1px solid #F1F5F9',
                            display:'flex', alignItems:'center', justifyContent:'space-between',
                            background: '#fff'
                        }}>
                            <div>
                                <h2 style={{ fontSize: 14, fontWeight: 900, color: t.color.text, margin: 0, letterSpacing: '-0.01em' }}>
                                    User Profile
                                </h2>
                                <p style={{ fontSize: 12, color: t.color.textPlaceholder, margin: '2px 0 0', fontWeight: 600 }}>Account overview & activity</p>
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.1, background: '#F8FAFC' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose} 
                                style={{ background: '#fff', border: '1px solid #E2E8F0', cursor: 'pointer', color: t.color.textPlaceholder, padding: 8, borderRadius: 12, display: 'flex' }}
                            >
                                <FiX size={18} />
                            </motion.button>
                        </div>

                        {/* Content */}
                        <div style={{ flex:1, overflowY:'auto', padding:'32px' }}>
                            
                            {/* Profile Identity Section */}
                            <div style={{ display:'flex', alignItems:'center', gap: 24, marginBottom: 40 }}>
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    style={{ 
                                        width: 72, height: 72, borderRadius: 18, 
                                        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`, 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                        fontSize: 28, fontWeight: 900, color: '#fff',
                                        boxShadow: `0 10px 20px ${colors[0]}20`
                                    }}
                                >
                                    {initials}
                                </motion.div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 24, fontWeight: 900, color: t.color.text, marginBottom: 4, letterSpacing:'-0.02em' }}>{user.name}</div>
                                    <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                                        <div style={{ fontSize: 14, color: t.color.textSecondary, fontWeight: 600 }}>{user.email}</div>
                                        <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#CBD5E1' }} />
                                        <div style={{ 
                                            padding:'3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 900, textTransform:'uppercase',
                                            background: user.status === 'active' ? '#ECFDF5' : '#FFF1F2',
                                            color: user.status === 'active' ? '#059669' : '#E11D48',
                                            letterSpacing: '0.04em'
                                        }}>{user.status}</div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display:'flex', gap: 10, marginTop: 20 }}>
                                        <motion.button
                                            whileHover={{ y: -2, background: t.color.primaryDark }}
                                            whileTap={{ y: 0 }}
                                            onClick={() => { onClose(); onEdit(user); }}
                                            style={{ display:'flex', alignItems:'center', gap: 8, padding:'10px 20px', fontSize: 12, fontWeight: 800, color: '#fff', background: t.color.primary, border: 'none', borderRadius: 10, cursor:'pointer', boxShadow: `0 6px 12px ${t.color.primary}15` }}
                                        >
                                            <FiEdit2 size={13} /> EDIT
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ background: '#FFF1F2' }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => { onClose(); onDelete(user); }}
                                            style={{ display:'flex', alignItems:'center', gap: 8, padding:'10px 18px', fontSize: 12, fontWeight: 800, color: t.color.danger, background: 'transparent', border: `1px solid ${t.color.dangerBorder}`, borderRadius: 10, cursor:'pointer' }}
                                        >
                                            <FiTrash2 size={13} /> DELETE
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            {/* Info Sections */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 40 }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <InfoRow index={0} icon={<FiShield size={16}/>} label="User Role" value={user.role} />
                                    <InfoRow index={1} icon={<FiBriefcase size={16}/>} label="Organization" value={user.organization} />
                                    <InfoRow index={2} icon={<FiMapPin size={16}/>} label="Assignment Area" value={user.assignment ? user.assignment.charAt(0).toUpperCase() + user.assignment.slice(1) : 'General'} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <InfoRow index={3} icon={<FiClock size={16}/>} label="Last Active" value={user.lastActive || '15 mins ago'} />
                                    <InfoRow index={4} icon={<FiCalendar size={16}/>} label="Joined On" value={user.createdAt || 'March 20, 2024'} />
                                    <InfoRow index={5} icon={<FiActivity size={16}/>} label="Clearance" value="LVL 4" />
                                </div>
                            </div>

                            {/* Charts & Logs */}
                            <div style={{ display:'flex', flexDirection:'column', gap: 40 }}>
                                
                                {/* Activity Summary */}
                                <div style={{ padding: '24px', background: '#F8FAFC', borderRadius: 20, border: '1px solid #F1F5F9' }}>
                                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 24 }}>
                                        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.color.primary }} />
                                            <span style={{ fontSize: 12, fontWeight: 900, color: t.color.text, letterSpacing:'0.01em' }}>Operational Trend</span>
                                        </div>
                                        <span style={{ fontSize: 10, fontWeight: 900, color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: 8 }}>+12%</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 80 }}>
                                        {[40, 65, 30, 85, 50, 95, 70].map((h, i) => (
                                            <div key={i} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                                                <motion.div 
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    transition={{ delay: 0.3 + i * 0.04, type: 'spring', damping: 15 }}
                                                    style={{ 
                                                        width: '100%', 
                                                        background: i === 5 ? t.color.primary : '#E2E8F0', 
                                                        borderRadius: 6,
                                                        boxShadow: i === 5 ? `0 6px 12px ${t.color.primary}15` : 'none'
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                                        {['M','T','W','T','F','S','S'].map((d, i) => (
                                            <span key={i} style={{ fontSize: 9, fontWeight: 800, color: t.color.textPlaceholder }}>{d}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Security Audit Logs */}
                                <div>
                                    <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 20 }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.color.primary }} />
                                        <span style={{ fontSize: 12, fontWeight: 900, color: t.color.text, letterSpacing:'0.01em' }}>Access Ledger</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                        {[
                                            { title: 'Session established', meta: '2h ago • Mumbai, IN', color: t.color.primary },
                                            { title: 'Inventory Sync', meta: '4h ago • Sector 7', color: t.color.primary },
                                            { title: 'Credential Rotation', meta: 'Yesterday • Auto-Task', color: '#10B981' },
                                            { title: 'External Access', meta: '2d ago • London (REJECTED)', color: '#EF4444' },
                                        ].map((item, i) => (
                                            <motion.div 
                                                key={i}
                                                whileHover={{ x: 4, background: '#F8FAFC' }}
                                                style={{ padding: '12px', borderRadius: 12, cursor: 'default', transition: 'all 0.2s ease', borderBottom: i < 3 ? '1px solid #F1F5F9' : 'none' }}
                                            >
                                                <div style={{ display:'flex', gap: 12 }}>
                                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, border: '2px solid #fff', boxShadow: '0 0 0 1px #E2E8F0', marginTop: 4, flexShrink: 0 }} />
                                                    <div>
                                                        <div style={{ fontSize: 13, fontWeight: 800, color: t.color.text }}>{item.title}</div>
                                                        <div style={{ fontSize: 11, color: t.color.textPlaceholder, marginTop: 2, fontWeight: 600 }}>{item.meta}</div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
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
