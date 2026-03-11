import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Logo from "../../components/Branding/Logo";
import Sidebar from "../../components/sidebar/Sidebar"; // Folder name lowercase check karein
import Navbar from "../../components/Navbar/Navbar";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { BreadcrumbProvider, useBreadcrumb, generateBreadcrumbs } from "../../components/Breadcrumb/BreadcrumbContext";

const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>) },
    {
        label: 'Organization Management', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>),
        children: [
            { label: 'Organizations', path: '/admin/organizations' },
            { label: 'Coordinators', path: '/admin/coordinators' },
            { label: 'Site Plan', path: '/admin/site-plan' },
            { label: 'Floor Plan', path: '/admin/floor-plan' },
            { label: 'Zones', path: '/admin/zones' },
            { label: 'Inventory', path: '/admin/inventory' },
        ]
    },
    { label: 'User Management', path: '/admin/users', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>) },
    { label: 'Risk Alerts', path: '/admin/risk-alerts', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>) },
    { label: 'Reports', path: '/admin/reports', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>) },
    { label: 'Settings', path: '/admin/settings', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82"></path></svg>) }
];

const userInfo = { name: 'Admin User', email: 'admin@aisafety.com', avatar: 'A' };

const AdminLayoutInner = () => {
    const { breadcrumbs, setBreadcrumbs } = useBreadcrumb();
    const location = useLocation();

    React.useEffect(() => {
        const autoCrumbs = generateBreadcrumbs(navItems, location.pathname);
        setBreadcrumbs(autoCrumbs);
    }, [location.pathname, setBreadcrumbs]);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
            {/* Sidebar */}
            <Sidebar navItems={navItems} logo={<Logo />} userInfo={userInfo} />

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <Navbar style={{ padding: 0, backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0' }}>
                    <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 flex justify-between items-center h-full">
                        <div className="flex items-center w-full max-w-[380px]">
                            <div className="relative w-full">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input
                                    type="text"
                                    placeholder="Search organisations, users, or reports..."
                                    className="w-full bg-white border border-gray-200 text-[13px] rounded-lg pl-9 pr-3 py-2 outline-none text-gray-900"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4 sm:gap-6">
                            <button className="bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                            </button>
                            <div className="w-8 h-8 rounded-full bg-orange-300 flex items-center justify-center text-white font-bold text-sm shrink-0">A</div>
                        </div>
                    </div>
                </Navbar>

                {/* Header Container */}
                <div className="w-full bg-[#F8FAFC] mt-6">
                    <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 flex justify-between items-center">
                        <style>{`
                            .breadcrumb-no-line a, .breadcrumb-no-line span { text-decoration: none !important; border-bottom: none !important; }
                        `}</style>
                        <div className="breadcrumb-no-line w-full">
                            {breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} className="!bg-transparent !p-0" />}
                        </div>
                    </div>
                </div>

                {/* Scrollable Main Section */}
                <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-0">
                    <Outlet />
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