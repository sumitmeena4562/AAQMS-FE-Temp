import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiShield, FiBriefcase, FiClock, FiCalendar, FiEdit2, FiTrash2, FiMail, FiMapPin } from 'react-icons/fi';
import { t } from '../../theme/theme';

const AVATAR_COLORS = t.color.avatarGradients;
function getAvatar(name) {
    if (!name) return { initials:'?', colors: AVATAR_COLORS[0] };
    let h = 0; for (let i=0;i<name.length;i++) h = name.charCodeAt(i)+((h<<5)-h);
    const p = name.split(' ');
    return { initials: (p.length>=2?`${p[0][0]}${p[1][0]}`:name.slice(0,2)).toUpperCase(), colors: AVATAR_COLORS[Math.abs(h)%AVATAR_COLORS.length] };
}

const InfoRow = ({ icon, label, value }) => (
    <div style={{ display:'flex', alignItems:'flex-start', gap: t.space.lg, padding:`${t.space.lg}px 0` }}>
        <div style={{ width:34, height:34, borderRadius: t.radius.lg, background: t.color.primaryBg, display:'flex', alignItems:'center', justifyContent:'center', color: t.color.primary, flexShrink:0 }}>
            {icon}
        </div>
        <div>
            <div style={{ fontSize: t.fontSize.xxs, fontWeight: t.fontWeight.semibold, color: t.color.textPlaceholder, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>{label}</div>
            <div style={{ fontSize: t.fontSize.base, fontWeight: t.fontWeight.semibold, color: t.color.text }}>{value || '—'}</div>
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
                        style={{ position:'fixed', inset:0, background: t.color.overlay, backdropFilter:'blur(2px)', zIndex:99 }}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x:'100%' }}
                        animate={{ x:0 }}
                        exit={{ x:'100%' }}
                        transition={{ type:'spring', damping:25, stiffness:200 }}
                        style={{ position:'fixed', right:0, top:0, height:'100%', width: t.layout.drawerWidth, maxWidth:'95vw', background: t.color.bg, boxShadow: t.shadow.drawerLight, zIndex:100, display:'flex', flexDirection:'column' }}
                    >
                        {/* Header */}
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:`14px ${t.space['2xl']}px`, borderBottom:`1px solid ${t.color.borderLight}`, flexShrink:0 }}>
                            <span style={{ fontSize: t.fontSize.base, fontWeight: t.fontWeight.bold, color: t.color.text, textTransform:'uppercase', letterSpacing:'0.04em' }}>User Profile</span>
                            <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color: t.color.textPlaceholder, display:'flex', padding:4, borderRadius: t.radius.sm }}
                                onMouseEnter={e => e.currentTarget.style.background = t.color.bgMuted}
                                onMouseLeave={e => e.currentTarget.style.background='none'}
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{ flex:1, overflowY:'auto', padding:`${t.space['3xl']}px ${t.space['2xl']}px` }}>
                            {/* Profile Header */}
                            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', marginBottom: t.space['3xl'] }}>
                                <div style={{ width:72, height:72, borderRadius: t.radius.circle, background:`linear-gradient(135deg,${colors[0]},${colors[1]})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize: t.fontSize['5xl'], fontWeight: t.fontWeight.bold, color: t.color.textInverse, marginBottom: t.space.lg }}>
                                    {initials}
                                </div>
                                <div style={{ fontSize: t.fontSize['2xl'], fontWeight: t.fontWeight.bold, color: t.color.text, marginBottom:2 }}>{user.name}</div>
                                <div style={{ fontSize: t.fontSize.md, color: t.color.textPlaceholder }}>{user.email}</div>

                                {/* Action Buttons */}
                                <div style={{ display:'flex', gap: t.space.md, marginTop: t.space.xl }}>
                                    {onEdit && (
                                        <button
                                            onClick={() => { onClose(); onEdit(user); }}
                                            style={{ display:'flex', alignItems:'center', gap: t.space.sm, padding:'7px 16px', fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: t.color.textInverse, background: t.color.primary, border:`1px solid ${t.color.primaryDark}`, borderRadius: t.radius.md, cursor:'pointer' }}
                                        >
                                            <FiEdit2 size={12} /> Edit
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => { onClose(); onDelete(user); }}
                                            style={{ display:'flex', alignItems:'center', gap: t.space.sm, padding:'7px 16px', fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: t.color.danger, background: t.color.bg, border:`1px solid ${t.color.dangerBorder}`, borderRadius: t.radius.md, cursor:'pointer' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = t.color.dangerBg; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = t.color.bg; }}
                                        >
                                            <FiTrash2 size={12} /> Delete
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div style={{ height:1, background: t.color.borderLight, margin:'0 0 16px' }} />

                            {/* Details */}
                            <InfoRow icon={<FiShield size={16}/>} label="Role" value={user.role} />
                            <InfoRow icon={<FiBriefcase size={16}/>} label="Organization" value={user.organization} />
                            <InfoRow icon={<FiMapPin size={16}/>} label="Assignment" value={user.assignment ? user.assignment.charAt(0).toUpperCase() + user.assignment.slice(1) : '—'} />

                            <InfoRow
                                icon={<FiClock size={16}/>}
                                label="Status"
                                value={
                                    <span style={{
                                        display:'inline-block', padding:'3px 10px', fontSize: t.fontSize.xs, fontWeight: t.fontWeight.bold,
                                        borderRadius: t.radius.pill, textTransform:'uppercase', letterSpacing:'0.04em',
                                        background: user.status === 'active' ? t.color.successBg : t.color.dangerBg,
                                        color: user.status === 'active' ? t.color.successDark : t.color.dangerDark,
                                        border: `1px solid ${user.status === 'active' ? t.color.successBorder : t.color.dangerBorder}`,
                                    }}>
                                        {user.status}
                                    </span>
                                }
                            />

                            <InfoRow icon={<FiCalendar size={16}/>} label="Last Active" value={user.lastActive || '—'} />
                            <InfoRow icon={<FiCalendar size={16}/>} label="Created" value={user.createdAt || '—'} />

                            {/* Activity Section */}
                            <div style={{ marginTop: t.space['2xl'], padding: t.space.xl, background: t.color.bgHover, borderRadius: t.radius.xl, border:`1px solid ${t.color.borderLight}` }}>
                                <div style={{ display:'flex', alignItems:'center', gap: t.space.sm, marginBottom: t.space.lg }}>
                                    <FiCalendar size={13} color={t.color.textPlaceholder} />
                                    <span style={{ fontSize: t.fontSize.xs, fontWeight: t.fontWeight.semibold, color: t.color.textMuted, textTransform:'uppercase', letterSpacing:'0.05em' }}>Recent Activity</span>
                                </div>
                                {[1,2].map(i => (
                                    <div key={i} style={{ display:'flex', gap: t.space.md, padding:`${t.space.md}px 0`, borderBottom: i===1 ? `1px solid ${t.color.border}` : 'none' }}>
                                        <div style={{ width:5, height:5, borderRadius: t.radius.circle, background: t.color.primary, marginTop:5, flexShrink:0 }} />
                                        <div>
                                            <div style={{ fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: t.color.text, lineHeight:1.3 }}>Logged in from Mumbai, India</div>
                                            <div style={{ fontSize: t.fontSize.xs, color: t.color.textPlaceholder, marginTop:2 }}>2 hours ago • Chrome/Windows</div>
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
