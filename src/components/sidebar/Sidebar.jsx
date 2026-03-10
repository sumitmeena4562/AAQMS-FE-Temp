import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {motion} from 'framer-motion';
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
            <div key={item.label} style={{ marginBottom: '6px', position: 'relative' }}>
                <button
                    onClick={() => toggleMenu(item.label)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: collapsed ? 0 : '12px',
                        justifyContent: collapsed ? 'center' : 'space-between',
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13.5px',
                        fontWeight: isChildActive || isOpen ? 600 : 500,
                        color: isChildActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        background: isOpen ? 'var(--color-bg-hover)' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                        fontFamily: 'var(--font-family)',
                        textAlign: 'left',
                        outline: 'none',
                        position: 'relative',
                        zIndex: 1
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
                            opacity: isChildActive || isOpen ? 1 : 0.6,
                            display: 'flex', alignItems: 'center',
                            color: isChildActive ? 'var(--color-primary)' : 'inherit',
                            transition: 'all 180ms ease'
                        }}>{item.icon}</span>
                        {!collapsed && item.label}
                    </span>
                    {!collapsed && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            style={{
                                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 250ms ease',
                                opacity: 0.5,
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
                        marginLeft: '24px',
                        paddingLeft: '12px',
                        borderLeft: '1.5px solid var(--color-border-light)',
                        marginTop: '4px',
                        marginBottom: '8px',
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
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '13px',
                                        fontWeight: childActive ? 600 : 500,
                                        color: childActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                        background: childActive ? 'var(--color-primary-50, rgba(7, 34, 103, 0.05))' : 'transparent',
                                        textDecoration: 'none',
                                        transition: 'all var(--transition-fast)',
                                        letterSpacing: '-0.01em'
                                    }}
                                    onMouseEnter={e => {
                                        if (!childActive) e.currentTarget.style.background = 'var(--color-bg-hover)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = childActive ? 'var(--color-primary-50, rgba(7, 34, 103, 0.05))' : 'transparent';
                                    }}
                                >
                                    {child.icon && (
                                        <span style={{
                                            opacity: childActive ? 0.9 : 0.5,
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
            <div key={item.path} style={{ position: 'relative', marginBottom: '8px' }}>
                {/* Active Indicator Line */}
                {isActive && (
                    <motion.div
                        layoutId="active-indicator"
                        style={{
                            position: 'absolute',
                            left: '-32px',
                            top: '10px',
                            bottom: '10px',
                            width: '4px',
                            background: 'var(--color-primary)',
                            borderRadius: '0 4px 4px 0',
                            zIndex: 5
                        }}
                    />
                )}
                
                <NavLink
                    to={item.path}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: collapsed ? 0 : '16px',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        padding: '12px 24px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13.5px',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        background: isActive ? 'var(--color-primary-50, rgba(7, 34, 103, 0.05))' : 'transparent',
                        textDecoration: 'none',
                        transition: 'all var(--transition-fast)',
                        position: 'relative',
                        zIndex: 1
                    }}
                    onMouseEnter={e => {
                        if (!isActive) e.currentTarget.style.background = 'var(--color-bg-hover)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = isActive ? 'var(--color-primary-50, rgba(7, 34, 103, 0.05))' : 'transparent';
                    }}
                >
                    <span style={{
                        opacity: isActive ? 1 : 0.6,
                        display: 'flex', alignItems: 'center',
                        color: isActive ? 'var(--color-primary)' : 'inherit',
                        transition: 'opacity 150ms ease'
                    }}>{item.icon}</span>
                    {!collapsed && (
                        <span style={{ transition: 'transform 0.2s' }}>{item.label}</span>
                    )}
                </NavLink>
            </div>
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
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: '20px' }} className="no-scrollbar">
                {/* Branding Section */}
                {logo && (
                    <div style={{
                        height: 'var(--navbar-height, 64px)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: collapsed ? '0 12px' : '0 32px',
                        marginBottom: '24px',
                        boxSizing: 'border-box',
                        position: 'sticky',
                        top: 0,
                        background: 'var(--color-bg-secondary)',
                        zIndex: 10
                    }}>
                        {logo}
                    </div>
                )}

                {/* Navigation Section */}
                <nav style={{
                    padding: '0 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}>
                    {navItems.map(item => renderNavItem(item))}
                </nav>
            </div>

            {/* Bottom Section: Support & User */}
            <div style={{
                padding: '16px 12px',
                borderTop: '1px solid var(--color-border-light)',
                background: 'var(--color-bg-secondary)',
                marginTop: 'auto'
            }}>
                {/* Optional Support Link item can go here */}
                
                {user && (
                    <div 
                        style={{
                            padding: collapsed ? '10px 8px' : '10px 12px',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: collapsed ? 0 : '12px',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            background: 'var(--color-bg-hover)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-base)',
                            border: '1px solid var(--color-border-light)'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'var(--color-border)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--color-border-light)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <div style={{
                            width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                            background: 'var(--color-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(7, 34, 103, 0.15)'
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
                                    fontSize: '11.5px',
                                    color: 'var(--color-text-muted)',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                    marginTop: '1px'
                                }}>
                                    {user.email || 'admin@aisafety.com'}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
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
