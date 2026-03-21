import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

/* ── Animated Collapsible ── */
const CollapsibleSection = ({ isOpen, children }) => {
    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    useEffect(() => { if (ref.current) setHeight(ref.current.scrollHeight); }, [children, isOpen]);
    return (
        <div 
            className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
            style={{ maxHeight: isOpen ? `${height}px` : '0px' }}
        >
            <div ref={ref}>{children}</div>
        </div>
    );
};

const Sidebar = ({ navItems = [], logo, collapsed = false, mobileOpen = false, setMobileOpen, onToggle }) => {
    const { user } = useAuthStore();
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState({});

    const toggleMenu = (label) => setOpenMenus(p => ({ ...p, [label]: !p[label] }));

    const isActive = useCallback((path) => location.pathname === path || location.pathname.startsWith(path + '/'), [location.pathname]);
    const isParentActive = useCallback((item) => 
        item.children ? item.children.some(c => isActive(c.path)) : isActive(item.path)
    , [isActive]);

    useEffect(() => { if (setMobileOpen) setMobileOpen(false); }, [location.pathname, setMobileOpen]);

    const renderSimple = (item) => {
        const act = isActive(item.path);
        return (
            <div key={item.path} className="relative mb-0.5 group">
                {act && <div className="absolute left-[-10px] top-2 bottom-2 w-[3px] bg-primary rounded-r-[3px]" />}
                <NavLink
                    to={item.path}
                    className={() => `
                        flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-all duration-150
                        ${collapsed ? 'justify-center px-0' : 'justify-start'}
                        ${act ? 'bg-primary/[0.06] text-primary font-semibold' : 'text-gray hover:bg-base font-medium'}
                    `}
                >
                    <span className={`flex items-center shrink-0 transition-opacity ${act ? 'opacity-100 text-primary' : 'opacity-60 text-gray group-hover:opacity-100 group-hover:text-body'}`}>
                        {item.icon}
                    </span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
            </div>
        );
    };

    const renderParent = (item) => {
        const isOpen = openMenus[item.label];
        const childActive = isParentActive(item);
        const activeOrOpen = childActive || isOpen;
        
        return (
            <div key={item.label} className="mb-0.5 group">
                <button
                    onClick={() => toggleMenu(item.label)}
                    className={`
                        w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-all duration-150 border-none outline-none cursor-pointer
                        ${collapsed ? 'justify-center px-0' : 'justify-start'}
                        ${activeOrOpen ? 'bg-primary/[0.06] text-primary font-semibold' : 'text-gray hover:bg-base font-medium'}
                    `}
                >
                    <span className={`flex items-center shrink-0 transition-opacity ${activeOrOpen ? 'opacity-100 text-primary' : 'opacity-60 text-gray group-hover:opacity-100 group-hover:text-body'}`}>
                        {item.icon}
                    </span>
                    {!collapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
                    {!collapsed && (
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
                            className={`shrink-0 transition-transform duration-300 opacity-40 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    )}
                </button>
                <CollapsibleSection isOpen={isOpen && !collapsed}>
                    <div className="ml-8 pl-2.5 border-l-1.5 border-border-main/40 mt-0.5 mb-1.5 flex flex-col gap-0.5 transition-all">
                        {item.children.map(child => {
                            const cAct = isActive(child.path);
                            return (
                                <NavLink
                                    key={child.path}
                                    to={child.path}
                                    className={`
                                        flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[12px] transition-all duration-150 text-gray
                                        ${cAct ? 'bg-primary/[0.06] text-primary font-semibold' : 'hover:bg-base hover:text-title font-medium'}
                                    `}
                                >
                                    {child.icon && (
                                        <span className={`flex items-center shrink-0 transition-opacity ${cAct ? 'opacity-100 text-primary' : 'opacity-50 text-gray group-hover:opacity-100'}`}>
                                            {child.icon}
                                        </span>
                                    )}
                                    <span className="truncate">{child.label}</span>
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
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div 
                    onClick={() => setMobileOpen(false)} 
                    className="fixed inset-0 bg-title/40 backdrop-blur-[1px] z-[999]" 
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`
                    flex flex-col h-screen sticky top-0 bg-card border-r border-border-main z-[1000] shrink-0 transition-all duration-300 ease-in-out font-sans overflow-hidden
                    ${collapsed ? 'w-[72px]' : 'w-[260px]'}
                    ${mobileOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'}
                    max-md:fixed max-md:top-0 max-md:left-0 max-md:z-[1000] max-md:w-[260px] max-md:shadow-2xl
                `}
            >
                <div className="flex-1 overflow-y-auto no-scrollbar pb-2.5">
                    {/* Logo + Toggle */}
                    <div className={`h-[52px] flex items-center justify-between sticky top-0 bg-card z-10 px-4 mb-2 border-b border-border-main/20 ${collapsed ? 'px-4' : 'px-6'}`}>
                        {!collapsed && logo}
                        <button
                            onClick={onToggle}
                            className={`
                                w-7 h-7 flex items-center justify-center rounded-md border border-transparent bg-transparent cursor-pointer text-gray hover:text-body hover:bg-base hover:border-border-main/60 transition-all duration-200 shrink-0
                                ${collapsed ? 'mx-auto' : ''}
                            `}
                            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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
                    {!collapsed && (
                        <div className="text-[10px] font-semibold text-gray uppercase tracking-[0.08em] px-6 pt-3 pb-2 select-none">
                            Main Menu
                        </div>
                    )}

                    {/* Navigation */}
                    <nav className="px-2.5 flex flex-col gap-0.5">
                        {navItems.map(item =>
                            item.children && item.children.length > 0
                                ? renderParent(item)
                                : renderSimple(item)
                        )}
                    </nav>
                </div>

                {/* User Card */}
                <div className="mt-auto p-2.5 border-t border-border-main/50 bg-card sticky bottom-0 z-10">
                    {user && (
                        <div
                            className={`
                                flex items-center rounded-xl bg-card border border-border-main/60 transition-all duration-200 cursor-pointer group hover:border-primary/30 hover:shadow-sm
                                ${collapsed ? 'p-2 justify-center' : 'p-2.5 gap-3 justify-start'}
                            `}
                        >
                            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white text-[13px] font-bold shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                                {user.avatar || user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            {!collapsed && (
                                <div className="overflow-hidden flex-1">
                                    <p className="text-title text-[13px] font-semibold truncate leading-tight group-hover:text-primary transition-colors">
                                        {user.name || 'System User'}
                                    </p>
                                    <p className="text-gray text-[10px] font-medium truncate mt-0.5">
                                        {user.email || 'user@system.com'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
