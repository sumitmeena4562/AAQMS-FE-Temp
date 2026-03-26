import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Logo from "../../components/Branding/Logo";
import Sidebar from "../../components/sidebar/Sidebar";
import ProfileDropdown from "../../components/Navbar/ProfileDropdown";
import NotificationCenter from "../../components/Navbar/NotificationCenter";
import Navbar from "../../components/Navbar/Navbar";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { BreadcrumbProvider } from "../../context/BreadcrumbContext";
import { useBreadcrumb } from "../../hooks/useBreadcrumb";
import { generateBreadcrumbs } from "../../utils/breadcrumbUtils.jsx";

import {
    FiBriefcase, FiUsers, FiAlertTriangle,
    FiSettings, FiMap, FiLayers, FiTarget,
    FiBox, FiUser, FiHome, FiBarChart2,
    FiSearch, FiX
} from 'react-icons/fi';
import useUserStore from '../../store/userStore';

// ── Nav Items Configuration ──
const navItems = [
    {
        label: 'Dashboard', path: '/admin/dashboard', icon: <FiHome size={18} />
    },
    {
        label: 'Organization Management', icon: <FiBriefcase size={18} />,
        children: [
            {
                label: 'Organizations', path: '/admin/organizations', icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                        <line x1="9" y1="22" x2="9" y2="7"></line>
                        <line x1="8" y1="6" x2="8" y2="6"></line>
                        <line x1="12" y1="6" x2="12" y2="6"></line>
                        <line x1="16" y1="6" x2="16" y2="6"></line>
                    </svg>
                )
            },
            { label: 'Coordinators', path: '/admin/coordinators', icon: <FiUsers size={15} /> },
            { label: 'Site Plan', path: '/admin/site-plan', icon: <FiMap size={15} /> },
            { label: 'Floor Plan', path: '/admin/floor-plan', icon: <FiLayers size={15} /> },
            { label: 'Zones', path: '/admin/zones', icon: <FiTarget size={15} /> },
            { label: 'Inventory', path: '/admin/inventory', icon: <FiBox size={15} /> },
        ]
    },
    { label: 'User Management', path: '/admin/users', icon: <FiUser size={18} /> },
    { label: 'Risk Alerts', path: '/admin/risk-alerts', icon: <FiAlertTriangle size={18} /> },
    { label: 'Reports', path: '/admin/reports', icon: <FiBarChart2 size={18} /> },
    { label: 'Settings', path: '/admin/settings', icon: <FiSettings size={18} /> }
];

const AdminLayoutInner = () => {
    const { breadcrumbs, setBreadcrumbs } = useBreadcrumb();
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const { search, setSearch } = useUserStore();

    React.useEffect(() => {
        // Let dynamic pages manage their own breadcrumbs
        const dynamicRoutes = [
            '/admin/organizations',
            '/admin/coordinators',
            '/admin/site-plan',
            '/admin/floor-plan',
            '/admin/zones'
        ];
        const isDynamic = dynamicRoutes.some(route => location.pathname.startsWith(route));
        if (!isDynamic) {
            const autoCrumbs = generateBreadcrumbs(navItems, location.pathname);
            setBreadcrumbs(autoCrumbs);
        }
    }, [location.pathname, setBreadcrumbs]);

    return (
        <div className="flex h-screen overflow-hidden bg-page font-sans">
            <Sidebar
                navItems={navItems}
                logo={<Logo />}
                collapsed={isCollapsed}
                onToggle={() => setIsCollapsed(c => !c)}
                mobileOpen={isMobileOpen}
                setMobileOpen={setIsMobileOpen}
            />

            <div className="flex-1 flex flex-col h-full overflow-hidden bg-page">
                <Navbar
                    showMenuButton={true}
                    onMenuClick={() => setIsMobileOpen(true)}
                    leftContent={
                        <div className="relative group hidden sm:block">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray group-focus-within:text-primary transition-colors pointer-events-none">
                                <FiSearch size={16} />
                            </span>
                            <input
                                className="pl-11 pr-10 py-2 bg-base/50 border border-border-main/50 rounded-[var(--radius-input)] text-sm font-bold text-body outline-none focus:outline-none focus:!outline-none transition-all duration-500 focus:bg-card focus:border-transparent focus:shadow-card-hover w-[320px] focus:w-[420px]"
                                placeholder="Search anything..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray hover:text-rose-500 transition-colors"
                                >
                                    <FiX size={14} />
                                </button>
                            )}
                        </div>
                    }
                    rightContent={
                        <div className="flex items-center gap-3">
                            <NotificationCenter />
                            <ProfileDropdown />
                        </div>
                    }
                />

                <main className="flex-1 overflow-y-auto">
                    <div className="w-full max-w-[1600px] mx-auto">
                        <div className="p-4 sm:p-6 lg:p-8 relative">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

const AdminLayout = () => (
    <BreadcrumbProvider>
        <AdminLayoutInner />
    </BreadcrumbProvider>
);

export default AdminLayout;
