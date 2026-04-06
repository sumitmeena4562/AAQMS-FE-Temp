import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import FilterBar from '../../components/UI/FilterBar';
import FloorCard from '../../components/UI/FloorCard';
import { useFilterStore } from '../../store/useFilterStore';
import { useHierarchyStore } from '../../store/useHierarchyStore';
import { FiHome, FiBriefcase, FiLoader, FiAlertCircle } from 'react-icons/fi';

const FloorPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedOrg, selectedCoord, selectedSite, setOrg, setCoord, setSite } = useFilterStore();
  const { floors, fetchFloors, loading, error: hierarchyError } = useHierarchyStore();
  const searchParams = new URLSearchParams(location.search);
  
  const passedOrgId = searchParams.get('org_id');
  const passedOrgName = searchParams.get('org_name');
  const passedCoordId = searchParams.get('coord_id');
  const passedCoordName = searchParams.get('coord');
  const passedSiteId = searchParams.get('site_id');
  const passedSiteName = searchParams.get('site');

  useEffect(() => {
    // 1. Sync global filters
    if (passedOrgId) setOrg(passedOrgId);
    if (passedCoordId) setCoord(passedCoordId);
    if (passedSiteId) setSite(passedSiteId);
    
    // 2. Fetch floors for the site
    if (passedSiteId || selectedSite) {
        fetchFloors(passedSiteId || selectedSite);
    }
  }, [passedOrgId, passedCoordId, passedSiteId, selectedSite]);

  const breadcrumbs = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
    { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
    { label: passedOrgName || "Organization", path: `/admin/coordinators?org_id=${passedOrgId}&org_name=${encodeURIComponent(passedOrgName || '')}` },
    { label: passedSiteName || "Site Plan", path: `/admin/site-plan?org_id=${passedOrgId}&org_name=${encodeURIComponent(passedOrgName || '')}&coord=${encodeURIComponent(passedCoordName || '')}&coord_id=${passedCoordId}` },
    { label: "Floor Plan", path: "#", isActive: true }
  ];

  const floorList = floors;
  const isLoading = loading;
  const siteInfo = { name: passedSiteName || "Site" };
  const orgInfo = { name: passedOrgName || "Organization" };
  const coordInfo = { name: passedCoordName || "Coordinator" };

  const activePlansCount = floorList.length;

  /**
   * ── NAVIGATION HANDLER ──
   * Redirects the user to the Zone mapping for the specific floor.
   */
  const handleFloorClick = (floor) => {
    navigate(`/admin/zones?org_id=${passedOrgId}&org_name=${encodeURIComponent(passedOrgName || "")}&coord_id=${passedCoordId}&coord=${encodeURIComponent(passedCoordName || "")}&site_id=${passedSiteId}&site=${encodeURIComponent(passedSiteName || "")}&floor_id=${floor.id}&floor=${encodeURIComponent(floor.name || floor.floor_name || "")}`, {
      state: { floor, site: siteInfo, coordinator: coordInfo, orgName: passedOrgName }
    });
  };

  return (
    <div className="flex flex-col font-sans h-full">
      
      {/* HEADER */}
      <PageHeader 
        title="Floor Plan Selection"
        subtitle={selectedSite ? `Showing ${activePlansCount} active floor levels for the current site selection` : "Please choose a site from the filter bar to view available floor plans"}
        breadcrumbs={breadcrumbs}
        hideAddButton={true}
        rightContent={
          selectedSite ? (
            <span className="text-[10px] font-black text-gray uppercase tracking-widest bg-base/50 px-3 py-1.5 rounded-lg border border-border-main/50">
                {floorList.length} Total Levels
            </span>
          ) : null
        }
      />

      {/* MAIN BODY */}
      <main className="flex-1 w-full pb-12 flex flex-col pt-4 sm:pt-6">
        <FilterBar activeLevel="floors" />

        {/* CARDS LIST/GRID SECTION */}
        <div className="flex flex-wrap gap-6 px-4 sm:px-0">
          {isLoading ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-gray/50">
               <FiLoader className="w-8 h-8 animate-spin mb-3" />
               <p className="text-sm font-bold uppercase tracking-widest text-[10px]">Fetching live floor plans...</p>
            </div>
          ) : hierarchyError ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-red-500/70 bg-rose-50/50 rounded-3xl border border-dashed border-rose-200">
               <FiAlertCircle className="w-8 h-8 mb-3" />
               <p className="text-sm font-medium">{hierarchyError}</p>
            </div>
          ) : floorList.length > 0 ? (
            floorList.map((floor, index) => (
              <FloorCard 
                key={floor.id || index} 
                floor={floor} 
                site={siteInfo}
                onClick={() => handleFloorClick(floor)} 
              />
            ))
          ) : (
            <div className="w-full py-20 flex flex-col items-center justify-center text-gray/40 border-2 border-dashed border-border-main/50 rounded-3xl">
               <p className="text-sm font-medium">No floor plans found for the selected site.</p>
               <p className="text-[10px] uppercase tracking-widest mt-2">Check the filters or upload a new plan</p>
            </div>
          )}
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