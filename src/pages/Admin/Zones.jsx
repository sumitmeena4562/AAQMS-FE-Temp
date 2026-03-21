import React from 'react'; import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import ZonesTable from '../../components/Zones/ZonesTable';

import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import { FiHome, FiBriefcase } from 'react-icons/fi';

const Zones = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const floorName = location.state?.floor?.name || params.get('floor') || null;
    const siteName = location.state?.site?.name || params.get('site') || "Site";
    const orgName = location.state?.orgName || params.get('org') || "Organization";
    const coordName = location.state?.coordinator?.name || params.get('coord') || "Coordinator";

    const floor = location.state?.floor || (floorName ? { name: floorName } : null);
    const site = location.state?.site || { name: siteName };
    const coordinator = location.state?.coordinator || { name: coordName };

    const { setBreadcrumbs } = useBreadcrumb();

    React.useEffect(() => {
        setBreadcrumbs([
            { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
            { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
            { label: orgName, path: `/admin/coordinators?org=${encodeURIComponent(orgName)}` },
            { label: coordinator.name, path: `/admin/site-plan?org=${encodeURIComponent(orgName)}&coord=${encodeURIComponent(coordinator.name)}` },
            { label: site.name, path: `/admin/floor-plan?org=${encodeURIComponent(orgName)}&coord=${encodeURIComponent(coordinator.name)}&site=${encodeURIComponent(site.name)}` },
            { label: floor?.name || "Zones", path: location.pathname + location.search, isActive: true }
        ]);
    }, [orgName, coordinator.name, site.name, floor?.name, location.pathname, location.search, setBreadcrumbs]);

    // Fallback safe state
    if (!floor) {
        return (
            <div className="p-8 text-center text-gray font-sans mt-20">
                <h2 className="text-xl font-bold mb-4 text-title">No Floor Selected</h2>
                <p className="mb-6">Please start from the Organization Dashboard and select a Floor Plan.</p>
                <button
                    onClick={() => navigate('/admin/organizations')}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Go to Organizations
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col font-sans h-full">

            {/* HEADER */}
            <PageHeader
                hideAddButton={true}
            // onReset={() => console.log("Reset filters")}
            // onApplyFilters={() => console.log("Apply filters")}
            />

            {/* MAIN BODY */}
            <main className="flex-1 w-full pb-12 flex flex-col pt-4 sm:pt-6">

                {/* Title Space reserved to match FloorPlan layout padding conventions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
                    {/* ZonesTable already has its internal title "Defined Safety Zones", so we just use this wrapper for spatial matching */}
                </div>

                {/* TABLE */}
                <ZonesTable />

            </main>


        </div>
    );
};

export default Zones;