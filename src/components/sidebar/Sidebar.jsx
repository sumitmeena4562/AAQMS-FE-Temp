import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

/* ── Animated Collapsible ── */
const CollapsibleSection = ({ isOpen, children }) => {
    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    useEffect(() => { if (ref.current) setHeight(ref.current.scrollHeight); }, [children, isOpen]);
    return (
        <div style={{ maxHeight: isOpen ? `${height}px` : '0px', overflow:'hidden', transition:'max-height 200ms ease' }}>
            <div ref={ref}>{children}</div>
        </div>
    );
};

/* ── Styles ── */
const S = {
    aside: (collapsed, mobileOpen) => ({
        width: collapsed ? 64 : 240,
        minWidth: collapsed ? 64 : 240,
        background: '#FAFAFA',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: 'width 200ms ease, min-width 200ms ease',
        zIndex: 1000,
        flexShrink: 0,
        fontFamily: 'inherit',
    }),
    logoWrap: (collapsed) => ({
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: collapsed ? '0 12px' : '0 16px',
        marginBottom: 8,
        position: 'sticky',
        top: 0,
        background: '#FAFAFA',
        zIndex: 10,
        boxSizing: 'border-box',
        borderBottom: '1px solid #F3F4F6',
    }),
    toggleBtn: {
        width: 28, height: 28, borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', border: '1px solid transparent',
        cursor: 'pointer', color: '#9CA3AF', flexShrink: 0,
        transition: 'all 120ms ease',
    },
    nav: { padding: '4px 10px', display:'flex', flexDirection:'column', gap:1 },
    // simple item
    simpleLink: (active, collapsed) => ({
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? 0 : 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
        padding: collapsed ? '9px 0' : '8px 12px',
        borderRadius: 6,
        fontSize: 13,
        fontWeight: active ? 600 : 450,
        color: active ? '#4F46E5' : '#4B5563',
        background: active ? '#EEF2FF' : 'transparent',
        textDecoration: 'none',
        transition: 'all 120ms ease',
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
        color: active ? '#4F46E5' : '#6B7280',
        transition: 'all 120ms ease',
        flexShrink: 0,
    }),
    chevron: (open) => ({
        width: 14, height: 14,
        transform: open ? 'rotate(180deg)' : 'rotate(0)',
        transition: 'transform 200ms ease',
        opacity: 0.4,
        flexShrink: 0,
        marginLeft: 'auto',
    }),
    childrenWrap: {
        marginLeft: 20,
        paddingLeft: 10,
        borderLeft: '1.5px solid #E5E7EB',
        marginTop: 2,
        marginBottom: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
    },
    childLink: (active) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 10px',
        borderRadius: 5,
        fontSize: 12,
        fontWeight: active ? 600 : 450,
        color: active ? '#4F46E5' : '#6B7280',
        background: active ? '#EEF2FF' : 'transparent',
        textDecoration: 'none',
        transition: 'all 120ms ease',
        letterSpacing: '-0.01em',
    }),
    // section label
    sectionLabel: {
        fontSize: 10,
        fontWeight: 600,
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        padding: '14px 12px 6px',
    },
    // bottom
    bottom: {
        marginTop: 'auto',
        padding: '10px 10px',
        borderTop: '1px solid #F3F4F6',
        background: '#FAFAFA',
    },
    userCard: (collapsed) => ({
        padding: collapsed ? '8px 6px' : '8px 10px',
        borderRadius: 7,
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? 0 : 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
        background: '#fff',
        border: '1px solid #E5E7EB',
        cursor: 'pointer',
        transition: 'all 120ms ease',
    }),
    avatar: {
        width: 30, height: 30, borderRadius: 6,
        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0,
    },
    userName: {
        fontWeight: 600, fontSize: 12,
        color: '#111827',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        lineHeight: 1.2,
    },
    userEmail: {
        fontSize: 10.5,
        color: '#9CA3AF',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        marginTop: 1,
    },
    // active bar
    activeBar: {
        position: 'absolute',
        left: -10,
        top: 8,
        bottom: 8,
        width: 3,
        background: '#4F46E5',
        borderRadius: '0 3px 3px 0',
    },
    // overlay
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.3)',
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

    const hoverOn = (e, isAct) => { if (!isAct) e.currentTarget.style.background = '#F3F4F6'; };
    const hoverOff = (e, isAct) => { e.currentTarget.style.background = isAct ? '#EEF2FF' : 'transparent'; };

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
                            onMouseEnter={e => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
                        >
                            {collapsed ? (
                                /* Hamburger icon when collapsed */
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                                </svg>
                            ) : (
                                /* Chevron-left when expanded */
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
                            onMouseEnter={e => { e.currentTarget.style.borderColor='#C7D2FE'; e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.06)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor='#E5E7EB'; e.currentTarget.style.boxShadow='none'; }}
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
                .sidebar-panel::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 9999px; }
                .sidebar-panel::-webkit-scrollbar-track { background: transparent; }
                @media (max-width: 768px) {
                    .sidebar-panel {
                        position: fixed !important;
                        top: 0 !important; left: 0 !important;
                        height: 100vh !important;
                        transform: translateX(-100%);
                        transition: transform 250ms cubic-bezier(0.4,0,0.2,1) !important;
                        box-shadow: 4px 0 20px rgba(0,0,0,0.08);
                        width: 240px !important; min-width: 240px !important;
                    }
                    .sidebar-panel.sidebar-mobile-open { transform: translateX(0); }
                }
            `}</style>
        </>
    );
};

export default Sidebar;
