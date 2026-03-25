import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import FloorCard from '../../components/UI/FloorCard';
import { generateFloorsForSite } from '../../utils/mockSiteData';

import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import { FiHome, FiBriefcase } from 'react-icons/fi';

const FloorPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const siteName = location.state?.site?.name || params.get('site') || "Site";
  const orgName = location.state?.orgName || params.get('org') || "Organization";
  const coordName = location.state?.coordinator?.name || params.get('coord') || "Coordinator";
  const site = location.state?.site || { name: siteName, id: 'SITE-UNKNOWN' };
  const coordinator = location.state?.coordinator || { name: coordName };

  const { setBreadcrumbs } = useBreadcrumb();

  const breadcrumbs = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
    { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
    { label: orgName, path: `/admin/coordinators?org=${encodeURIComponent(orgName)}` },
    { label: coordinator.name, path: `/admin/site-plan?org=${encodeURIComponent(orgName)}&coord=${encodeURIComponent(coordinator.name)}` },
    { label: site.name, path: location.pathname + location.search, isActive: true }
  ];

  useEffect(() => {
    // Breadcrumbs managed by PageHeader
  }, [orgName, coordinator.name, site.name, location.pathname, location.search]);

  // Fallback safe state
  if (!site) {
    return (
      <div className="p-8 text-center text-gray font-sans mt-20">
        <h2 className="text-xl font-bold mb-4 text-title">No Site Selected</h2>
        <p className="mb-6">Please start from the Organization Dashboard and select a Site Plan.</p>
        <button 
          onClick={() => navigate('/admin/organizations')} 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const floorsList = generateFloorsForSite(site);
  const activePlansCount = floorsList.filter(f => f.status === 'ACTIVE').length;

  const handleFloorClick = (floor) => {
    navigate(`/admin/zones?org=${encodeURIComponent(orgName)}&coord=${encodeURIComponent(coordinator.name)}&site=${encodeURIComponent(site.name)}&floor=${encodeURIComponent(floor.name)}`, { state: { floor, site, orgName, coordinator } });
  };

  return (
    <div className="flex flex-col font-sans h-full">
      
      {/* HEADER */}
      <PageHeader 
        title="Floor Plan Selection"
        subtitle={`Managing ${activePlansCount} active floor plans for ${site.name}`}
        breadcrumbs={breadcrumbs}
        hideAddButton={true}
        rightContent={
            <span className="text-[10px] font-black text-gray uppercase tracking-widest bg-base/50 px-3 py-1.5 rounded-lg border border-border-main/50">
                {floorsList.length} Total Levels
            </span>
        }
      />

      {/* MAIN BODY */}
      <main className="flex-1 w-full pb-12 flex flex-col pt-4 sm:pt-6">

        {/* CARDS GRID (Standardized) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {floorsList.map((floor, index) => (
            <FloorCard 
              key={floor.id || index} 
              floor={floor} 
              site={site}
              onClick={() => handleFloorClick(floor)} 
            />
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-16 flex items-center justify-center gap-1.5 text-xs text-gray/60 font-medium pb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          AI assists detection. Final approval is human-controlled.
        </div>

      </main>
    </div>
  );
};

export default FloorPlan;
