import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Logo from "../../components/Branding/Logo";
import Sidebar from "../../components/Sidebar/Sidebar";
import Search from "../../components/UI/Search";

import Navbar from "../../components/Navbar/Navbar";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { BreadcrumbProvider, useBreadcrumb, generateBreadcrumbs } from "../../context/BreadcrumbContext";

// ── Nav Items Configuration ──
// Items with `children` will show collapsible sub-menus.
// Aap yahan apne hisaab se sub-items add/remove kar sakte ho.
const navItems = [
    {
        label: 'Dashboard', path: '/admin/dashboard', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        )
    },
    {
        // ── Organization with sub-menus ──
        label: 'Organization Management', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        ),
        children: [
            {
                label: 'Organizations', path: '/admin/organizations', icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 7V5a4 4 0 0 0-8 0v2"></path></svg>
                )
            },
            {
                label: 'Coordinators', path: '/admin/coordinators', icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                )
            },
            {
                label: 'Site Plan', path: '/admin/site-plan', icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
                )
            },
            {
                label: 'Floor Plan', path: '/admin/floor-plan', icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                )
            },
            {
                label: 'Zones', path: '/admin/zones', icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                )
            },
            {
                label: 'Inventory', path: '/admin/inventory', icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
                )
            },
        ]
    },

    {
        label: 'User Management', path: '/admin/users', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        )
    },
    {
        label: 'Risk Alerts', path: '/admin/risk-alerts', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        )
    },
    {
        label: 'Reports', path: '/admin/reports', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        )
    },
    {
        label: 'Settings', path: '/admin/settings', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        )
    }
];

// ── User Info ──
const userInfo = {
    name: 'Admin User',
    email: 'admin@aisafety.com',
    avatar: 'A'
};

// ── Inner Layout (reads breadcrumb from context) ──
const AdminLayoutInner = () => {
    const { breadcrumbs, setBreadcrumbs } = useBreadcrumb();
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

    // Auto-generate breadcrumbs from sidebar navItems on every route change
    React.useEffect(() => {
        const autoCrumbs = generateBreadcrumbs(navItems, location.pathname);
        setBreadcrumbs(autoCrumbs);
    }, [location.pathname, setBreadcrumbs]);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-family)' }}>
            {/* Sidebar */}
            <Sidebar
                navItems={navItems}
                logo={<Logo />}
                userInfo={userInfo}
                mobileOpen={isMobileOpen}
                setMobileOpen={setIsMobileOpen}
            />

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
                <Navbar
                    showMenuButton={true}
                    onMenuClick={() => setIsMobileOpen(true)}
                    leftContent={
                        breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />
                    }
                    rightContent={
                        <div className="flex items-center gap-3 md:gap-6 w-full md:w-auto justify-end">
                            <div className="flex-1 md:flex-none relative max-w-[180px] sm:max-w-none md:w-80 transition-all duration-300 md:ml-0">
                                <Search placeholder="Search..." />
                            </div>
                            <div className="hidden sm:block h-6 w-px mx-1 md:mx-2" style={{ backgroundColor: 'var(--color-border)' }}></div>
                            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                                <button
                                    className="p-1.5 md:p-2 transition-colors relative flex items-center justify-center cursor-pointer"
                                    style={{ color: 'var(--color-text-muted)' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                    <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full border border-white" style={{ backgroundColor: 'var(--color-danger, #ef4444)' }}></span>
                                </button>
                                <div className="h-7 w-7 md:h-8 md:w-8 rounded-full border-2 overflow-hidden cursor-pointer flex-shrink-0" style={{ borderColor: 'var(--color-border)' }}>
                                    <img src="https://ui-avatars.com/api/?name=Admin+User&background=F59E0B&color=fff" alt="User Avatar" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    }
                />
                <main style={{ flex: 1, overflowY: 'auto', background: 'var(--color-bg-primary)' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

// ── Wrapper with BreadcrumbProvider ──
const AdminLayout = () => (
    <BreadcrumbProvider>
        <AdminLayoutInner />
    </BreadcrumbProvider>
);

export default AdminLayout;
