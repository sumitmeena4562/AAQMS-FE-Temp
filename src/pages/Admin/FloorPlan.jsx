import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import FloorCard from '../../components/organization/FloorCard';
import { generateFloorsForSite } from '../../utils/mockSiteData';

const DashboardIcon = <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const FolderIcon = <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;

const FloorPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const site = location.state?.site || null;
  const orgName = location.state?.orgName || "Organization";
  const coordinator = location.state?.coordinator || { name: "Coordinator" };

  // Fallback safe state
  if (!site) {
    return (
      <div className="p-8 text-center text-gray-500 font-sans mt-20">
        <h2 className="text-xl font-bold mb-4 text-gray-800">No Site Selected</h2>
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
    { label: site.name, path: "/admin/floor-plan", icon: null, isActive: true }
  ];

  const handleFloorClick = (floor) => {
    navigate('/admin/zones', { state: { floor, site, orgName, coordinator } });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
      
      {/* HEADER */}
      <PageHeader 
        breadcrumbItems={breadcrumbItems}
        hideAddButton={true}
        onReset={() => console.log("Reset filters")}
        onApplyFilters={() => console.log("Apply filters")}
      />

      {/* MAIN BODY */}
      <main className="flex-1 w-full !px-8 pb-12 !pt-0 flex flex-col">
        
        {/* Title & Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 !pt-8 !mb-2">
          <div className="flex items-center gap-4">
            <h1 className="text-[24px] font-bold text-gray-900 leading-none">
              Floor Plan Selection
            </h1>
            <span className="px-3 py-1 bg-blue-100/50 text-blue-600 text-[11px] font-bold rounded-full top-0.5 relative">
              {activePlansCount} Active Plans
            </span>
          </div>
        </div>
        <p className="text-[13px] text-gray-500 mb-8 max-w-3xl">
          Select a floor to view detailed zone mapping and inventory distribution for {site.name}.
        </p>

        {/* CARDS LIST/GRID */}
        <div className="flex flex-wrap gap-6">
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
        <div className="mt-auto pt-16 flex items-center justify-center gap-1.5 text-xs text-gray-400 font-medium pb-6">
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
