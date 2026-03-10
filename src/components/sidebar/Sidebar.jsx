import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

/**
 * Sidebar Component — Global, Reusable, Fully Responsive
 *
 * Props:
 * @param {Array} navItems - Navigation items array. Each item can have children for sub-menus.
 *   Format: [{ label, path, icon, children: [{ label, path, icon }] }]
 * @param {React.ReactNode} logo - Logo component to render at the top
 * @param {Object} userInfo - User info for bottom section { name, email, avatar }
 * @param {boolean} collapsed - Whether sidebar is collapsed (icon-only mode)
 * @param {Function} onToggle - Callback when sidebar toggle is clicked
 */

/* ── Animated Collapsible Wrapper ── */
const CollapsibleSection = ({ isOpen, children }) => {
    const ref = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.scrollHeight);
        }
    }, [children, isOpen]);

    return (
        <div style={{
            maxHeight: isOpen ? `${height}px` : '0px',
            overflow: 'hidden',
            transition: 'max-height 250ms ease',
        }}>
            <div ref={ref}>
                {children}
            </div>
        </div>
    );
};

const Sidebar = ({
    navItems = [],
    logo,
    collapsed = false,
    mobileOpen = false,
    setMobileOpen,
    onToggle
}) => {
    const { user } = useAuthStore();
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState({});

    // Toggle sub-menu open/close
    const toggleMenu = (label) => {
        setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
    };

    // Check if a parent or any of its children is active
    const isParentActive = (item) => {
        if (item.children) {
            return item.children.some(child =>
                location.pathname === child.path || location.pathname.startsWith(child.path + '/')
            );
        }
        return location.pathname === item.path || location.pathname.startsWith(item.path + '/');
    };

    // Auto-open parent menu if its child is active
    useEffect(() => {
        navItems.forEach(item => {
            if (item.children && isParentActive(item)) {
                setOpenMenus(prev => ({ ...prev, [item.label]: true }));
            }
        });
    }, [location.pathname]);

    // Close mobile sidebar on route change
    useEffect(() => {
        if (setMobileOpen) setMobileOpen(false);
    }, [location.pathname, setMobileOpen]);

    // ── Render nav item with children (collapsible) ──
    const renderParentItem = (item) => {
        const isOpen = openMenus[item.label];
        const isChildActive = isParentActive(item);

        return (
            <div key={item.label} style={{ marginBottom: '2px' }}>
                <button
                    onClick={() => toggleMenu(item.label)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: collapsed ? 0 : '12px',
                        justifyContent: collapsed ? 'center' : 'space-between',
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13px',
                        fontWeight: isChildActive || isOpen ? 600 : 500,
                        color: isChildActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                        background: isOpen ? 'var(--color-accent-soft)' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                        fontFamily: 'var(--font-family)',
                        textAlign: 'left',
                        outline: 'none'
                    }}
                    onMouseEnter={e => {
                        if (!isOpen) e.currentTarget.style.background = 'var(--color-bg-hover)';
                    }}
                    onMouseLeave={e => {
                        if (!isOpen) e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                            opacity: isChildActive || isOpen ? 1 : 0.55,
                            display: 'flex', alignItems: 'center',
                            color: isChildActive ? 'var(--color-primary)' : 'inherit',
                            transition: 'all 180ms ease'
                        }}>{item.icon}</span>
                        {!collapsed && item.label}
                    </span>
                    {!collapsed && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            style={{
                                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 250ms ease',
                                opacity: 0.4,
                                flexShrink: 0
                            }}
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    )}
                </button>

                {/* ── Children (animated collapse) ── */}
                <CollapsibleSection isOpen={isOpen && !collapsed}>
                    <div style={{
                        marginLeft: '22px',
                        paddingLeft: '14px',
                        borderLeft: '2px solid var(--color-border)',
                        marginTop: '4px',
                        marginBottom: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                    }}>
                        {item.children.map(child => {
                            const childActive = location.pathname === child.path || location.pathname.startsWith(child.path + '/');
                            return (
                                <NavLink
                                    key={child.path}
                                    to={child.path}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: childActive ? 600 : 450,
                                        color: childActive ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                                        background: childActive ? 'var(--color-primary-50)' : 'transparent',
                                        textDecoration: 'none',
                                        transition: 'all 150ms ease',
                                        letterSpacing: '-0.005em'
                                    }}
                                    onMouseEnter={e => {
                                        if (!childActive) e.currentTarget.style.background = 'var(--color-bg-hover)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = childActive ? 'var(--color-primary-50)' : 'transparent';
                                    }}
                                >
                                    {child.icon && (
                                        <span style={{
                                            opacity: childActive ? 0.8 : 0.5,
                                            display: 'flex', alignItems: 'center',
                                            transition: 'opacity 150ms ease'
                                        }}>{child.icon}</span>
                                    )}
                                    {child.label}
                                </NavLink>
                            );
                        })}
                    </div>
                </CollapsibleSection>
            </div>
        );
    };

    // ── Render simple nav item (no children) ──
    const renderSimpleItem = (item) => {
        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

        return (
            <NavLink
                key={item.path}
                to={item.path}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: collapsed ? 0 : '12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    background: isActive ? 'var(--color-accent-soft)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 150ms ease',
                    marginBottom: '2px',
                }}
                onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.background = 'var(--color-bg-hover)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.background = isActive ? 'var(--color-accent-soft)' : 'transparent';
                }}
            >
                <span style={{
                    opacity: isActive ? 1 : 0.45,
                    display: 'flex', alignItems: 'center',
                    transition: 'opacity 150ms ease'
                }}>{item.icon}</span>
                {!collapsed && item.label}
            </NavLink>
        );
    };

    // ── Render nav item (routes to correct renderer) ──
    const renderNavItem = (item) => {
        if (item.children && item.children.length > 0) {
            return renderParentItem(item);
        }
        return renderSimpleItem(item);
    };

    // ── Sidebar Content ──
    const sidebarContent = (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                {/* Logo */}
                {logo && (
                    <div style={{
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: collapsed ? '0 12px' : '0 20px',
                        borderBottom: '1px solid var(--color-border)',
                        boxSizing: 'border-box'
                    }}>
                        {logo}
                    </div>
                )}

                {/* Nav Items */}
                <nav style={{
                    padding: '4px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0px'
                }}>
                    {navItems.map(item => renderNavItem(item))}
                </nav>
            </div>

            {/* Bottom User Info */}
            {user && (
                <div style={{
                    padding: collapsed ? '12px 8px' : '12px 16px',
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: collapsed ? 0 : '12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    margin: '8px 12px 12px 12px',
                    borderRadius: 'var(--radius-md)'
                }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <div style={{
                        width: 32, height: 32, borderRadius: '6px',
                        background: 'var(--color-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 800, fontSize: 13, flexShrink: 0
                    }}>
                        {user.avatar || user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    {!collapsed && (
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                            <div style={{
                                fontWeight: 700, fontSize: '13px',
                                color: 'var(--color-text-primary)',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                lineHeight: 1.2
                            }}>
                                {user.name || 'Admin User'}
                            </div>
                            <div style={{
                                fontSize: '11px',
                                color: 'var(--color-text-muted)',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                            }}>
                                {user.email || 'admin@aisafety.com'}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* ── Mobile Overlay ── */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="sidebar-mobile-overlay"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.35)',
                        backdropFilter: 'blur(2px)',
                        zIndex: 999,
                        display: 'block'
                    }}
                />
            )}

            {/* ── Sidebar ── */}
            <aside
                className={`sidebar-panel ${mobileOpen ? 'sidebar-mobile-open' : ''}`}
                style={{
                    width: collapsed ? '72px' : 'var(--sidebar-width)',
                    minWidth: collapsed ? '72px' : 'var(--sidebar-width)',
                    background: 'var(--color-bg-secondary)',
                    borderRight: '1px solid var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    transition: 'width 200ms ease, min-width 200ms ease',
                    zIndex: 1000,
                    flexShrink: 0
                }}
            >
                {sidebarContent}
            </aside>

            {/* ── Responsive Styles ── */}
            <style>{`
                .sidebar-panel::-webkit-scrollbar {
                    width: 4px;
                }
                .sidebar-panel::-webkit-scrollbar-thumb {
                    background: var(--color-border);
                    border-radius: 9999px;
                }
                .sidebar-panel::-webkit-scrollbar-track {
                    background: transparent;
                }
                @media (max-width: 768px) {
                    .sidebar-panel {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        height: 100vh !important;
                        transform: translateX(-100%);
                        transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1) !important;
                        box-shadow: 8px 0 32px rgba(0, 0, 0, 0.12);
                        width: var(--sidebar-width) !important;
                        min-width: var(--sidebar-width) !important;
                    }
                    .sidebar-panel.sidebar-mobile-open {
                        transform: translateX(0);
                    }
                }
            `}</style>
        </>
    );
};

export default Sidebar;
