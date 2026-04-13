import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const [openMenus, setOpenMenus] = useState({});

    const isActive = useCallback((path) => location.pathname === path || location.pathname.startsWith(path + '/'), [location.pathname]);
    const isParentActive = useCallback((item) => 
        item.children ? item.children.some(c => isActive(c.path)) : isActive(item.path)
    , [isActive]);

    const [prevPath, setPrevPath] = useState(location.pathname);

    // 🔹 Auto-open sidebar menus if their child is active (Adjusting state during rendering)
    if (location.pathname !== prevPath) {
        setPrevPath(location.pathname);
        const activeParents = {};
        navItems.forEach(item => {
            if (item.children && isParentActive(item)) {
                activeParents[item.label] = true;
            }
        });
        setOpenMenus(prev => ({ ...prev, ...activeParents }));
    }

    const toggleMenu = (item) => {
        setOpenMenus(p => ({ ...p, [item.label]: !p[item.label] }));
        // 🔹 Navigate immediately if parent has a default path
        if (item.path) {
           navigate(item.path);
        }
    };

    useEffect(() => { if (setMobileOpen) setMobileOpen(false); }, [location.pathname, setMobileOpen]);

    const renderSimple = (item) => {
        const act = isActive(item.path);
        return (
            <div key={item.path} className="relative mb-0.5 group">
                {act && <div className="absolute left-[-10px] top-2 bottom-2 w-[3px] bg-primary rounded-r-full shadow-[0_0_8px_rgba(7,34,103,0.2)] transition-all duration-300" />}
                <NavLink
                    to={item.path}
                    className={() => `
                        flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] transition-all duration-200
                        ${collapsed ? 'justify-center px-0 h-10 w-10 mx-auto transition-transform' : 'justify-start'}
                        ${act 
                            ? 'bg-primary/10 text-primary font-bold shadow-sm' 
                            : 'text-slate-700 hover:bg-slate-200/50 hover:text-slate-900 font-medium'}
                    `}
                >
                    <span className={`flex items-center shrink-0 transition-colors ${act ? 'text-primary' : 'text-slate-500 group-hover:text-slate-900'}`}>
                        {item.icon}
                    </span>
                    {!collapsed && <span className="truncate tracking-tight">{item.label}</span>}
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
                    onClick={() => toggleMenu(item)}
                    className={`
                        w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] transition-all duration-200 border-none outline-none cursor-pointer
                        ${collapsed ? 'justify-center px-0 h-10 w-10 mx-auto' : 'justify-start'}
                        ${activeOrOpen 
                            ? 'bg-primary/10 text-primary font-bold' 
                            : 'text-slate-700 hover:bg-slate-200/50 hover:text-slate-900 font-medium'}
                    `}
                >
                    <span className={`flex items-center shrink-0 transition-colors ${activeOrOpen ? 'text-primary' : 'text-slate-500 group-hover:text-slate-900'}`}>
                        {item.icon}
                    </span>
                    {!collapsed && <span className="flex-1 text-left truncate tracking-tight">{item.label}</span>}
                    {!collapsed && (
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
                            className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'rotate-0 text-slate-400'}`}
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    )}
                </button>
                <CollapsibleSection isOpen={isOpen && !collapsed}>
                    <div className="ml-8 mt-1 mb-2 flex flex-col transition-all">
                        {item.children.map((child, index) => {
                            const cAct = isActive(child.path);
                            const isLast = index === item.children.length - 1;

                            return (
                                <div key={child.path} className="relative group/child pl-4 py-0.5">
                                    {/* ── Tree Branches ── */}
                                    <div className={`absolute left-0 top-0 w-[1.5px] bg-slate-200 transition-colors group-hover/child:bg-slate-300 ${isLast ? 'h-[50%]' : 'h-full'}`} />
                                    <div className="absolute left-0 top-[50%] w-3 h-[1.5px] bg-slate-200 transition-colors group-hover/child:bg-slate-300" />
                                    
                                    {/* ── Active Indicator ── */}
                                    {cAct && <div className="absolute left-[-2px] top-[50%] -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-primary shadow-[0_0_8px_rgba(7,34,103,0.3)] z-10" />}

                                    <NavLink
                                        to={child.path}
                                        className={`
                                            flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[12px] transition-all duration-200
                                            ${cAct 
                                                ? 'bg-primary/5 text-primary font-bold border border-primary/10' 
                                                : 'text-slate-600 hover:text-slate-950 font-medium'}
                                        `}
                                    >
                                        {child.icon && (
                                            <span className={`flex items-center shrink-0 transition-colors ${cAct ? 'text-primary' : 'text-slate-400 group-hover/child:text-slate-600'}`}>
                                                {child.icon}
                                            </span>
                                        )}
                                        <span className="truncate tracking-tight">{child.label}</span>
                                    </NavLink>
                                </div>
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
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em] px-6 pt-5 pb-2 select-none">
                            Oversight Hub
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
                <div className="mt-auto p-3 border-t border-slate-200 bg-slate-50/50 sticky bottom-0 z-10">
                    {user && (
                        <div
                            className={`
                                flex items-center rounded-xl bg-white border border-slate-200 transition-all duration-300 cursor-pointer group hover:border-primary/40 hover:shadow-md
                                ${collapsed ? 'p-2 justify-center' : 'p-2.5 gap-3 justify-start'}
                            `}
                        >
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-[13px] font-black shrink-0 shadow-lg shadow-primary/10 group-hover:scale-105 transition-transform">
                                {user.avatar || user.first_name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            {!collapsed && (
                                <div className="overflow-hidden flex-1">
                                    <p className="text-slate-900 text-[13px] font-bold truncate leading-tight group-hover:text-primary transition-colors">
                                        {user.name || 'System User'}
                                    </p>
                                    <p className="text-slate-500 text-[10px] font-bold truncate mt-0.5 tracking-tight">
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
