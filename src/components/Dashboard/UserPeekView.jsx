import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiShield, FiBriefcase, FiClock, FiCalendar, FiEdit2, FiTrash2, FiMapPin, FiActivity, FiUser } from 'react-icons/fi';
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
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 + (0.05 * index), type: 'spring', stiffness: 100 }}
        whileHover={{ x: 5 }}
        style={{ display:'flex', alignItems:'center', gap: 20, padding:'16px 0', borderBottom: `1px solid ${t.color.borderLight}` }}
    >
        <div style={{ width:40, height:40, borderRadius: 12, background: t.color.primaryBg, display:'flex', alignItems:'center', justifyContent:'center', color: t.color.primary, flexShrink:0, border: `1px solid ${t.color.primaryBorder}` }}>
            {icon}
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 900, color: t.color.textPlaceholder, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.color.text }}>{value || '—'}</div>
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
                        style={{ position:'fixed', inset:0, background: 'rgba(7, 34, 103, 0.1)', backdropFilter:'blur(8px)', zIndex: t.zIndex.overlay }}
                    />

                    <motion.div
                        initial={{ x:'100%' }}
                        animate={{ x:0 }}
                        exit={{ x:'100%' }}
                        transition={{ type:'spring', damping:30, stiffness:200 }}
                        style={{ 
                            position:'fixed', right:0, top:0, height:'100%', width: 480, maxWidth:'95vw', 
                            background: 'rgba(255, 255, 255, 0.85)', 
                            backdropFilter: 'blur(20px) saturate(180%)',
                            borderLeft: `1px solid rgba(255, 255, 255, 0.5)`,
                            boxShadow: t.shadow.xl, 
                            zIndex: t.zIndex.modal, display:'flex', flexDirection:'column'
                        }}
                    >
                        {/* Header */}
                        <div style={{ 
                            padding: '24px 32px', borderBottom: `1px solid ${t.color.borderLight}`,
                            display:'flex', alignItems:'center', justifyContent:'space-between',
                            background: 'rgba(255, 255, 255, 0.4)'
                        }}>
                            <div>
                                <h2 style={{ fontSize: 13, fontWeight: 900, color: t.color.text, margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    Security Clearance Profile
                                </h2>
                                <p style={{ fontSize: 11, color: t.color.textPlaceholder, margin: '4px 0 0', fontWeight: 600 }}>System Ledger ID: {user.id || 'N/A'}</p>
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose} 
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: t.color.textPlaceholder, padding: 8, borderRadius: 12, display: 'flex' }}
                            >
                                <FiX size={20} />
                            </motion.button>
                        </div>

                        {/* Content */}
                        <div style={{ flex:1, overflowY:'auto', padding:'40px 32px' }}>
                            
                            {/* Profile Identity Section */}
                            <div style={{ display:'flex', alignItems:'center', gap: 24, marginBottom: 44 }}>
                                <motion.div 
                                    initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    style={{ 
                                        width: 84, height: 84, borderRadius: 24, 
                                        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`, 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                        fontSize: 32, fontWeight: 900, color: '#fff',
                                        boxShadow: `0 12px 24px ${colors[0]}30`,
                                        border: '4px solid #fff'
                                    }}
                                >
                                    {initials}
                                </motion.div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 24, fontWeight: 900, color: t.color.text, marginBottom: 6, letterSpacing:'-0.03em' }}>{user.name}</div>
                                    <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                                        <div style={{ fontSize: 13, color: t.color.textSecondary, fontWeight: 700 }}>{user.email}</div>
                                        <div style={{ 
                                            padding:'4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 900, textTransform:'uppercase',
                                            background: user.status === 'active' ? t.color.successBg : t.color.dangerBg,
                                            color: user.status === 'active' ? t.color.success : t.color.danger,
                                            border: `1px solid ${user.status === 'active' ? t.color.successBorder : t.color.dangerBorder}`,
                                            letterSpacing: '0.06em'
                                        }}>{user.status}</div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display:'flex', gap: 12, marginTop: 24 }}>
                                        <motion.button
                                            whileHover={{ y: -2, boxShadow: `0 8px 16px ${t.color.primary}25` }}
                                            whileTap={{ y: 0 }}
                                            onClick={() => { onClose(); onEdit(user); }}
                                            style={{ display:'flex', alignItems:'center', gap: 8, padding:'10px 24px', fontSize: 12, fontWeight: 800, color: '#fff', background: t.color.primary, border: 'none', borderRadius: 12, cursor:'pointer' }}
                                        >
                                            <FiEdit2 size={13} /> EDIT
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ background: t.color.dangerBg, color: t.color.dangerDark }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => { onClose(); onDelete(user); }}
                                            style={{ display:'flex', alignItems:'center', gap: 8, padding:'10px 18px', fontSize: 11, fontWeight: 800, color: t.color.textPlaceholder, background: 'transparent', border: `1px solid ${t.color.border}`, borderRadius: 12, cursor:'pointer' }}
                                        >
                                            <FiTrash2 size={13} /> REMOVE
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            {/* Info Sections - Premium Card Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 44 }}>
                               {[
                                   { icon:<FiShield size={16}/>, label:"Member Role", value:user.role },
                                   { icon:<FiBriefcase size={16}/>, label:"Organization", value:user.organization },
                                   { icon:<FiActivity size={16}/>, label:"Sector Unit", value:user.region || 'North Zone' },
                                   { icon:<FiCalendar size={16}/>, label:"Registry Date", value:user.createdAt || '20 Mar 2024' },
                                   { icon:<FiClock size={16}/>, label:"Last Ping", value:user.lastActive || 'Active Now' },
                                   { icon:<FiUser size={16}/>, label:"Access Level", value:"Level 4" }
                               ].map((item, idx) => (
                                   <motion.div 
                                       key={idx}
                                       initial={{ opacity:0, y: 10 }}
                                       animate={{ opacity:1, y: 0 }}
                                       transition={{ delay: 0.2 + idx * 0.05 }}
                                       style={{ 
                                           padding: '16px', background: 'rgba(248, 250, 252, 0.5)', 
                                           borderRadius: 16, border: `1px solid ${t.color.borderLight}`,
                                           display: 'flex', flexDirection: 'column', gap: 8
                                       }}
                                   >
                                       <div style={{ color: t.color.primary }}>{item.icon}</div>
                                       <div>
                                           <div style={{ fontSize: 9, fontWeight: 900, color: t.color.textPlaceholder, textTransform:'uppercase', letterSpacing:'0.05em' }}>{item.label}</div>
                                           <div style={{ fontSize: 13, fontWeight: 800, color: t.color.text, marginTop: 2 }}>{item.value}</div>
                                       </div>
                                   </motion.div>
                               ))}
                            </div>

                            {/* Analytics & Ledger */}
                            <div style={{ display:'flex', flexDirection:'column', gap: 40 }}>
                                
                                {/* Activity Summary */}
                                <div style={{ padding: '24px', background: 'rgba(7, 34, 103, 0.03)', borderRadius: 24, border: `1px solid ${t.color.primaryBorder}` }}>
                                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 24 }}>
                                        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.color.primary }} />
                                            <span style={{ fontSize: 11, fontWeight: 900, color: t.color.text, letterSpacing:'0.04em', textTransform: 'uppercase' }}>Operational Pulse</span>
                                        </div>
                                        <span style={{ fontSize: 10, fontWeight: 900, color: t.color.success, background: t.color.successBg, padding: '4px 10px', borderRadius: 8 }}>OPTIMIZED</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 60 }}>
                                        {[40, 65, 30, 85, 50, 95, 70].map((h, i) => (
                                            <div key={i} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                                                <motion.div 
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    transition={{ delay: 0.5 + i * 0.04, type: 'spring', damping: 15 }}
                                                    style={{ 
                                                        width: '100%', 
                                                        background: i === 5 ? t.color.primary : t.color.borderDark, 
                                                        borderRadius: 4,
                                                        opacity: i === 5 ? 1 : 0.3
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Security Audit Logs */}
                                <div>
                                    <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 20 }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.color.primary }} />
                                        <span style={{ fontSize: 11, fontWeight: 900, color: t.color.text, letterSpacing:'0.04em', textTransform: 'uppercase' }}>Security Ledger</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {[
                                            { title: 'Auth Token Refreshed', meta: '2h ago • Sector 4', color: t.color.primary },
                                            { title: 'Inventory Batch Upload', meta: '4h ago • Global Node', color: t.color.primary },
                                            { title: 'Credential Reset', meta: 'Yesterday • Security Hub', color: t.color.success },
                                            { title: 'Unknown Access Point', meta: '2d ago • Critical Guard', color: t.color.danger },
                                        ].map((item, i) => (
                                            <motion.div 
                                                key={i}
                                                whileHover={{ x: 4, background: 'rgba(248, 250, 252, 0.8)' }}
                                                style={{ padding: '12px 16px', borderRadius: 16, background: 'rgba(248, 250, 252, 0.4)', transition: 'all 0.2s ease', border: `1px solid ${t.color.borderLight}` }}
                                            >
                                                <div style={{ display:'flex', gap: 14, alignItems: 'center' }}>
                                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                                                    <div>
                                                        <div style={{ fontSize: 13, fontWeight: 800, color: t.color.text }}>{item.title}</div>
                                                        <div style={{ fontSize: 10, color: t.color.textPlaceholder, marginTop: 2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{item.meta}</div>
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

