import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Logo from "../../components/Branding/Logo";
import Sidebar from "../../components/sidebar/Sidebar";
import ProfileDropdown from "../../components/Navbar/ProfileDropdown";
import NotificationCenter from "../../components/Navbar/NotificationCenter";
import Navbar from "../../components/Navbar/Navbar";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { BreadcrumbProvider } from "../../context/BreadcrumbContext";
import { useBreadcrumb } from "../../hooks/useBreadcrumb";
import { generateBreadcrumbs } from "../../utils/breadcrumbUtils.jsx";

import SearchField from "../../components/Navbar/SearchField";

import {
    FiBriefcase, FiUsers, FiAlertTriangle,
    FiSettings, FiMap, FiLayers, FiTarget,
    FiBox, FiUser, FiHome, FiBarChart2
} from 'react-icons/fi';
import useUserStore from '../../store/userStore';

// ── Nav Items Configuration ──
const navItems = [
    {
        label: 'Dashboard', path: '/admin/dashboard', icon: <FiHome size={18} />
    },
    {
        label: 'Organizations', path: '/admin/organizations', icon: <FiBriefcase size={18} />,
        children: [
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
                logo={<Link to="/"><Logo /></Link>}
                collapsed={isCollapsed}
                onToggle={() => setIsCollapsed(c => !c)}
                mobileOpen={isMobileOpen}
                setMobileOpen={setIsMobileOpen}
            />

            <div className="flex-1 flex flex-col h-full overflow-hidden bg-page">
                <Navbar
                    showMenuButton={true}
                    onMenuClick={() => setIsMobileOpen(true)}
                    leftContent={<SearchField />}
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
