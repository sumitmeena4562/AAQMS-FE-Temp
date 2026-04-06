import React, { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import FilterBar from '../../components/UI/FilterBar';
import FloorCard from '../../components/UI/FloorCard';
import Button from '../../components/UI/Button';
import { useFilterStore } from '../../store/useFilterStore';
import { useHierarchyStore } from '../../store/useHierarchyStore';
import { useOrgStore } from '../../store/useOrgStore';
import { FiHome, FiBriefcase, FiLoader, FiAlertCircle } from 'react-icons/fi';

const FloorPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const passedOrgId = searchParams.get('org_id');
  const passedOrgName = searchParams.get('org_name');
  const passedCoordId = searchParams.get('coord_id');
  const passedCoordName = searchParams.get('coord');
  const passedSiteId = searchParams.get('site_id');
  const passedSiteName = searchParams.get('site');

  const { resetFilters } = useFilterStore();
  const { orgs } = useOrgStore();

  const handleResetAll = () => {
      setSearchParams({});
      resetFilters();
  };

  const { selectedOrg, selectedCoord, selectedSite, setOrg, setCoord, setSite } = useFilterStore();
  const { floors, fetchFloors, loading, error: hierarchyError } = useHierarchyStore();

  useEffect(() => {
    // 1. Sync global filters ONLY if passed through URL and store is empty
    if (passedOrgId && !selectedOrg) setOrg(passedOrgId);
    if (passedCoordId && !selectedCoord) setCoord(passedCoordId);
    if (passedSiteId && !selectedSite) setSite(passedSiteId);
    
    // 2. Fetch floors (Global or Site-specific)
    const activeSiteId = (passedSiteId === 'undefined' || !passedSiteId) ? selectedSite : passedSiteId;
    fetchFloors(activeSiteId || null);
  }, [passedOrgId, passedCoordId, passedSiteId, selectedSite, setOrg, setCoord, setSite, fetchFloors]);

  const activeSiteId = selectedSite || passedSiteId;
  const activeOrgId = selectedOrg || passedOrgId;
  const activeCoordId = selectedCoord || passedCoordId;

  const orgInfo = orgs.find(o => o.id === activeOrgId) || (passedOrgName ? { name: passedOrgName } : null);

  const breadcrumbs = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
    { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
  ];

  if (activeOrgId) {
    breadcrumbs.push({ 
        label: orgInfo?.name || "Organization", 
        path: `/admin/coordinators?org_id=${activeOrgId}&org_name=${encodeURIComponent(orgInfo?.name || '')}` 
    });
  }

  if (passedSiteId || selectedSite) {
    breadcrumbs.push({ 
        label: passedSiteName || "Site Plan", 
        path: `/admin/site-plan?org_id=${activeOrgId}&org_name=${encodeURIComponent(orgInfo?.name || '')}&coord_id=${passedCoordId}&coord=${encodeURIComponent(passedCoordName || '')}` 
    });
  }

  breadcrumbs.push({ label: "Floor Plan", path: "#", isActive: true });

  const floorList = floors;
  const isLoading = loading;
  const siteInfo = { name: passedSiteName || "Site" };
  const coordInfo = activeCoordId ? { name: passedCoordName || "Coordinator" } : null;

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
        title={passedSiteName ? `Floors for ${passedSiteName}` : "All Floor Plans"}
        subtitle={activeSiteId 
            ? `Showing ${activePlansCount} active floor levels for ${passedSiteName || 'the selected site'}` 
            : "Viewing all architectural levels across all sites"}
        breadcrumbs={breadcrumbs}
        hideAddButton={true}
        rightContent={
          <div className="flex items-center gap-3">
             <Button onClick={handleResetAll} variant="outline" size="sm" className="!h-[38px] bg-card flex items-center gap-2 px-4 border-dashed border-primary/30 hover:border-primary/60 transition-all">
                  <FiLoader size={14} className={loading ? 'animate-spin' : ''} />
                  <span className="font-black text-[10px] uppercase tracking-widest text-primary">Clear Context</span>
              </Button>
              {floorList.length > 0 && (
                 <span className="text-[10px] font-black text-gray uppercase tracking-widest bg-base/50 px-3 py-1.5 rounded-lg border border-border-main/50">
                    {floorList.length} Total Levels
                </span>
              )}
          </div>
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
            <div className="w-full py-24 flex flex-col items-center justify-center text-gray/40 bg-base/20 rounded-[var(--radius-card)] border border-border-main/40 mt-4">
               <FiAlertCircle className="w-10 h-10 mb-4 opacity-20" />
               <p className="text-sm font-bold text-title">No Floor Plans Found</p>
               <p className="text-[10px] uppercase tracking-widest mt-1">
                 {activeSiteId ? "This site doesn't have any registered floor levels yet" : "No floor plans have been registered in the system yet"}
               </p>
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