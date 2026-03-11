import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { t } from '../../theme/theme';

const ProfileDropdown = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const name = user?.name || 'Admin User';
    const email = user?.email || 'admin@aisafety.com';

    const handleLogout = (e) => { e.preventDefault(); logout(); navigate('/login'); };

    const menuItems = [
        { label: 'My Profile', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
        { label: 'Settings', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
        { label: 'Support', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
    ];

    return (
        <div ref={ref} style={{ position:'relative' }}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width:32, height:32, borderRadius: t.radius.lg,
                    background: `linear-gradient(135deg, ${t.color.primary}, #7C3AED)`,
                    border:'none', cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color: t.color.textInverse, fontSize: t.fontSize.sm, fontWeight: t.fontWeight.bold,
                    transition: `box-shadow ${t.transition.base}`,
                    boxShadow: isOpen ? '0 0 0 3px rgba(79,70,229,0.2)' : t.shadow.none,
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.2)'; }}
                onMouseLeave={e => { if (!isOpen) e.currentTarget.style.boxShadow = t.shadow.none; }}
            >
                {name.charAt(0).toUpperCase()}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div style={{
                    position:'absolute', right:0, top:'calc(100% + 8px)',
                    width:220, background: t.color.bg,
                    border: `1px solid ${t.color.border}`, borderRadius: t.radius.xl,
                    boxShadow: t.shadow.md,
                    zIndex: t.zIndex.dropdown, overflow:'hidden',
                }}>
                    {/* User Info */}
                    <div style={{ padding: `${t.space.lg}px 14px`, display:'flex', alignItems:'center', gap:10, borderBottom: `1px solid ${t.color.borderLight}` }}>
                        <div style={{
                            width:34, height:34, borderRadius: t.radius.lg,
                            background: `linear-gradient(135deg, ${t.color.primary}, #7C3AED)`,
                            display:'flex', alignItems:'center', justifyContent:'center',
                            color: t.color.textInverse, fontSize: t.fontSize.md, fontWeight: t.fontWeight.bold, flexShrink:0,
                        }}>
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ overflow:'hidden' }}>
                            <div style={{ fontSize: t.fontSize.md, fontWeight: t.fontWeight.semibold, color: t.color.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', lineHeight:1.2 }}>{name}</div>
                            <div style={{ fontSize: t.fontSize.xs, color: t.color.textPlaceholder, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', marginTop:1 }}>{email}</div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div style={{ padding: `${t.space.xs}px 0` }}>
                        {menuItems.map((item, i) => (
                            <a
                                key={i}
                                href="#"
                                style={{
                                    display:'flex', alignItems:'center', gap:10,
                                    padding: `${t.space.md}px 14px`, fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium,
                                    color: t.color.textTertiary, textDecoration:'none',
                                    transition: `all 0.1s`,
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = t.color.bgHover; e.currentTarget.style.color = t.color.text; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.color.textTertiary; }}
                            >
                                <span style={{ opacity:0.5, display:'flex', alignItems:'center' }}>{item.icon}</span>
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Logout */}
                    <div style={{ borderTop: `1px solid ${t.color.borderLight}`, padding: `${t.space.xs}px 0` }}>
                        <a
                            href="#"
                            onClick={handleLogout}
                            style={{
                                display:'flex', alignItems:'center', gap:10,
                                padding: `${t.space.md}px 14px`, fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold,
                                color: t.color.danger, textDecoration:'none',
                                transition: 'all 0.1s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = t.color.dangerBg; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                            Log out
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;