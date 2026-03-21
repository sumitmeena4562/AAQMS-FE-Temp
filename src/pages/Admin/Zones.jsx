import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import ZonesTable from '../../components/Zones/ZonesTable';

const DashboardIcon = <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const FolderIcon = <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;

const Zones = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const floor = location.state?.floor || null;
    const site = location.state?.site || { name: "Site" };
    const orgName = location.state?.orgName || "Organization";
    const coordinator = location.state?.coordinator || { name: "Coordinator" };

    // Fallback safe state
    if (!floor) {
        return (
            <div className="p-8 text-center text-gray-500 font-sans mt-20">
                <h2 className="text-xl font-bold mb-4 text-gray-800">No Floor Selected</h2>
                <p className="mb-6">Please start from the Organization Dashboard and select a Floor Plan.</p>
                <button
                    onClick={() => navigate('/admin/organizations')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Go to Organizations
                </button>
            </div>
        );
    }

    const breadcrumbItems = [
        { label: "Dashboard", path: "/admin", icon: DashboardIcon },
        { label: "Organization Management", path: "/admin/organizations", icon: FolderIcon },
        { label: "Organizations", path: "/admin/organizations", icon: null },
        {
            label: orgName,
            path: "/admin/coordinators",
            state: { org: { name: orgName } },
            icon: null
        },
        {
            label: coordinator.name,
            path: "/admin/site-plan",
            state: { orgName, coordinator },
            icon: null
        },
        {
            label: site.name,
            path: "/admin/floor-plan",
            state: { site, orgName, coordinator },
            icon: null
        },
        { label: floor.name || "Zones", path: "/admin/zones", icon: null, isActive: true }
    ];

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">

            {/* HEADER */}
            <PageHeader
                breadcrumbItems={breadcrumbItems}
                hideAddButton={true}
            // onReset={() => console.log("Reset filters")}
            // onApplyFilters={() => console.log("Apply filters")}
            />

            {/* MAIN BODY */}
            <main className="flex-1 w-full !px-8 pb-12 !pt-0 flex flex-col">

                {/* Title Space reserved to match FloorPlan layout padding conventions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 !pt-8 !mb-8">
                    {/* ZonesTable already has its internal title "Defined Safety Zones", so we just use this wrapper for spatial matching */}
                </div>

                {/* TABLE */}
                <ZonesTable />

            </main>


        </div>
    );
};

export default Zones;