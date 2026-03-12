import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { t } from '../../theme/theme';

/* ── Animated Collapsible ── */
const CollapsibleSection = ({ isOpen, children }) => {
    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    useEffect(() => { if (ref.current) setHeight(ref.current.scrollHeight); }, [children, isOpen]);
    return (
        <div style={{ maxHeight: isOpen ? `${height}px` : '0px', overflow:'hidden', transition:`max-height ${t.transition.smooth}` }}>
            <div ref={ref}>{children}</div>
        </div>
    );
};

/* ── Styles ── */
const S = {
    aside: (collapsed, mobileOpen) => ({
        width: collapsed ? t.layout.sidebarCollapsed : t.layout.sidebarWidth,
        minWidth: collapsed ? t.layout.sidebarCollapsed : t.layout.sidebarWidth,
        background: t.color.sidebarBg,
        borderRight: `1px solid ${t.color.sidebarBorder}`,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: `width ${t.transition.smooth}, min-width ${t.transition.smooth}`,
        zIndex: t.zIndex.sidebar,
        flexShrink: 0,
        fontFamily: 'inherit',
    }),
    logoWrap: (collapsed) => ({
        height: t.layout.navbarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: collapsed ? `0 ${t.space.lg}px` : `0 ${t.space.xl}px`,
        marginBottom: t.space.md,
        position: 'sticky',
        top: 0,
        background: t.color.sidebarBg,
        zIndex: 10,
        boxSizing: 'border-box',
        borderBottom: `1px solid ${t.color.borderLight}`,
    }),
    toggleBtn: {
        width: 28, height: 28, borderRadius: t.radius.sm,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', border: '1px solid transparent',
        cursor: 'pointer', color: t.color.textPlaceholder, flexShrink: 0,
        transition: `all ${t.transition.fast}`,
    },
    nav: { padding: `${t.space.xs}px 10px`, display:'flex', flexDirection:'column', gap:1 },
    simpleLink: (active, collapsed) => ({
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? 0 : 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
        padding: collapsed ? '9px 0' : `${t.space.md}px ${t.space.lg}px`,
        borderRadius: t.radius.sm,
        fontSize: t.fontSize.md,
        fontWeight: active ? t.fontWeight.semibold : 450,
        color: active ? t.color.primary : t.color.textTertiary,
        background: active ? t.color.primaryBg : 'transparent',
        textDecoration: 'none',
        transition: `all ${t.transition.fast}`,
        position: 'relative',
        cursor: 'pointer',
        border: 'none',
        width: '100%',
        textAlign: 'left',
        fontFamily: 'inherit',
        outline: 'none',
        letterSpacing: '-0.01em',
    }),
    icon: (active) => ({
        opacity: active ? 1 : 0.55,
        display: 'flex',
        alignItems: 'center',
        color: active ? t.color.primary : t.color.textMuted,
        transition: `all ${t.transition.fast}`,
        flexShrink: 0,
    }),
    chevron: (open) => ({
        width: 14, height: 14,
        transform: open ? 'rotate(180deg)' : 'rotate(0)',
        transition: `transform ${t.transition.smooth}`,
        opacity: 0.4,
        flexShrink: 0,
        marginLeft: 'auto',
    }),
    childrenWrap: {
        marginLeft: t.space['2xl'],
        paddingLeft: 10,
        borderLeft: `1.5px solid ${t.color.border}`,
        marginTop: 2,
        marginBottom: t.space.xs,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
    },
    childLink: (active) => ({
        display: 'flex',
        alignItems: 'center',
        gap: t.space.md,
        padding: `${t.space.sm}px 10px`,
        borderRadius: 5,
        fontSize: t.fontSize.sm,
        fontWeight: active ? t.fontWeight.semibold : 450,
        color: active ? t.color.primary : t.color.textMuted,
        background: active ? t.color.primaryBg : 'transparent',
        textDecoration: 'none',
        transition: `all ${t.transition.fast}`,
        letterSpacing: '-0.01em',
    }),
    sectionLabel: {
        fontSize: t.fontSize.xxs,
        fontWeight: t.fontWeight.semibold,
        color: t.color.textPlaceholder,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        padding: `14px ${t.space.lg}px ${t.space.sm}px`,
    },
    bottom: {
        marginTop: 'auto',
        padding: '10px 10px',
        borderTop: `1px solid ${t.color.borderLight}`,
        background: t.color.sidebarBg,
    },
    userCard: (collapsed) => ({
        padding: collapsed ? `${t.space.md}px ${t.space.sm}px` : `${t.space.md}px 10px`,
        borderRadius: t.radius.md,
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? 0 : 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
        background: t.color.bg,
        border: `1px solid ${t.color.border}`,
        cursor: 'pointer',
        transition: `all ${t.transition.fast}`,
    }),
    avatar: {
        width: 30, height: 30, borderRadius: t.radius.sm,
        background: `linear-gradient(135deg, ${t.color.primary}, #7C3AED)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: t.color.textInverse, fontWeight: t.fontWeight.bold, fontSize: t.fontSize.sm, flexShrink: 0,
    },
    userName: {
        fontWeight: t.fontWeight.semibold, fontSize: t.fontSize.sm,
        color: t.color.text,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        lineHeight: 1.2,
    },
    userEmail: {
        fontSize: 10.5,
        color: t.color.textPlaceholder,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        marginTop: 1,
    },
    activeBar: {
        position: 'absolute',
        left: -10,
        top: 8,
        bottom: 8,
        width: 3,
        background: t.color.primary,
        borderRadius: '0 3px 3px 0',
    },
    overlay: {
        position: 'fixed',
        inset: 0,
        background: t.color.overlayDark,
        backdropFilter: 'blur(2px)',
        zIndex: 999,
    },
};

const Sidebar = ({ navItems = [], logo, collapsed = false, mobileOpen = false, setMobileOpen, onToggle }) => {
    const { user } = useAuthStore();
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState({});

    const toggleMenu = (label) => setOpenMenus(p => ({ ...p, [label]: !p[label] }));

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
    const isParentActive = (item) => item.children ? item.children.some(c => isActive(c.path)) : isActive(item.path);

    useEffect(() => {
        navItems.forEach(item => {
            if (item.children && isParentActive(item)) setOpenMenus(p => ({ ...p, [item.label]: true }));
        });
    }, [location.pathname]);

    useEffect(() => { if (setMobileOpen) setMobileOpen(false); }, [location.pathname]);

    const hoverOn = (e, isAct) => { if (!isAct) e.currentTarget.style.background = t.color.bgMuted; };
    const hoverOff = (e, isAct) => { e.currentTarget.style.background = isAct ? t.color.primaryBg : 'transparent'; };

    const renderSimple = (item) => {
        const act = isActive(item.path);
        return (
            <div key={item.path} style={{ position:'relative', marginBottom:1 }}>
                {act && <div style={S.activeBar} />}
                <NavLink
                    to={item.path}
                    style={S.simpleLink(act, collapsed)}
                    onMouseEnter={e => hoverOn(e, act)}
                    onMouseLeave={e => hoverOff(e, act)}
                >
                    <span style={S.icon(act)}>{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                </NavLink>
            </div>
        );
    };

    const renderParent = (item) => {
        const isOpen = openMenus[item.label];
        const childActive = isParentActive(item);
        return (
            <div key={item.label} style={{ marginBottom:1 }}>
                <button
                    onClick={() => toggleMenu(item.label)}
                    style={S.simpleLink(childActive || isOpen, collapsed)}
                    onMouseEnter={e => hoverOn(e, childActive || isOpen)}
                    onMouseLeave={e => hoverOff(e, childActive || isOpen)}
                >
                    <span style={S.icon(childActive)}>{item.icon}</span>
                    {!collapsed && <span style={{flex:1}}>{item.label}</span>}
                    {!collapsed && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={S.chevron(isOpen)}>
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    )}
                </button>
                <CollapsibleSection isOpen={isOpen && !collapsed}>
                    <div style={S.childrenWrap}>
                        {item.children.map(child => {
                            const cAct = isActive(child.path);
                            return (
                                <NavLink
                                    key={child.path}
                                    to={child.path}
                                    style={S.childLink(cAct)}
                                    onMouseEnter={e => hoverOn(e, cAct)}
                                    onMouseLeave={e => hoverOff(e, cAct)}
                                >
                                    {child.icon && <span style={S.icon(cAct)}>{child.icon}</span>}
                                    {child.label}
                                </NavLink>
                            );
                        })}
                    </div>
                </CollapsibleSection>
            </div>
        );
    };

    return (
        <>
            {mobileOpen && <div onClick={() => setMobileOpen(false)} style={S.overlay} />}

            <aside
                className={`sidebar-panel ${mobileOpen ? 'sidebar-mobile-open' : ''}`}
                style={S.aside(collapsed, mobileOpen)}
            >
                <div style={{ flex:1, overflowY:'auto', overflowX:'hidden', paddingBottom:10 }} className="no-scrollbar">
                    {/* Logo + Toggle */}
                    <div style={S.logoWrap(collapsed)}>
                        {!collapsed && logo}
                        <button
                            onClick={onToggle}
                            style={S.toggleBtn}
                            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            onMouseEnter={e => { e.currentTarget.style.background = t.color.bgMuted; e.currentTarget.style.borderColor = t.color.border; e.currentTarget.style.color = t.color.textSecondary; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = t.color.textPlaceholder; }}
                        >
                            {collapsed ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Section Label */}
                    {!collapsed && <div style={S.sectionLabel}>Menu</div>}

                    {/* Navigation */}
                    <nav style={S.nav}>
                        {navItems.map(item =>
                            item.children && item.children.length > 0
                                ? renderParent(item)
                                : renderSimple(item)
                        )}
                    </nav>
                </div>

                {/* User Card */}
                <div style={S.bottom}>
                    {user && (
                        <div
                            style={S.userCard(collapsed)}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = t.color.primaryBorder; e.currentTarget.style.boxShadow = t.shadow.xs; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = t.color.border; e.currentTarget.style.boxShadow = t.shadow.none; }}
                        >
                            <div style={S.avatar}>
                                {user.avatar || user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            {!collapsed && (
                                <div style={{ overflow:'hidden', flex:1 }}>
                                    <div style={S.userName}>{user.name || 'Admin User'}</div>
                                    <div style={S.userEmail}>{user.email || 'admin@aisafety.com'}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </aside>

            <style>{`
                .sidebar-panel::-webkit-scrollbar { width: 3px; }
                .sidebar-panel::-webkit-scrollbar-thumb { background: ${t.color.borderDark}; border-radius: ${t.radius.full}px; }
                .sidebar-panel::-webkit-scrollbar-track { background: transparent; }
                @media (max-width: 768px) {
                    .sidebar-panel {
                        position: fixed !important;
                        top: 0 !important; left: 0 !important;
                        height: 100vh !important;
                        transform: translateX(-100%);
                        transition: transform ${t.transition.slow} !important;
                        box-shadow: 4px 0 20px rgba(0,0,0,0.08);
                        width: ${t.layout.sidebarWidth}px !important; min-width: ${t.layout.sidebarWidth}px !important;
                    }
                    .sidebar-panel.sidebar-mobile-open { transform: translateX(0); }
                }
            `}</style>
        </>
    );
};

export default Sidebar;
