import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import FilterBar from '../../components/UI/FilterBar';
import FloorCard from '../../components/UI/FloorCard';
import Button from '../../components/UI/Button';
import { useFilterStore } from '../../store/useFilterStore';
import { useHierarchy } from '../../hooks/api/useHierarchy';
import { useFloors } from '../../hooks/api/useHierarchyQueries';
import { FiHome, FiBriefcase, FiLoader, FiAlertCircle } from 'react-icons/fi';
import CardSkeleton from '../../components/UI/CardSkeleton';

const FloorPlan = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSynced, setIsSynced] = useState(false);
  const { resetFilters, selectedOrg, selectedCoord, selectedSite, setOrg, setCoord, setSite } = useFilterStore();

  const [currentPage, setCurrentPage] = useState(1);

  const passedOrgId = searchParams.get('org_id');
  const passedOrgName = searchParams.get('org_name');
  const passedSiteId = searchParams.get('site_id');
  const passedSiteName = searchParams.get('site');
  const passedCoordId = searchParams.get('coord_id');
  const passedCoordName = searchParams.get('coord');

  const activeSiteId = useMemo(() => 
    selectedSite.length > 0 ? selectedSite : (passedSiteId ? [passedSiteId] : []),
  [selectedSite, passedSiteId]);

  const activeOrgId = useMemo(() => 
    selectedOrg.length > 0 ? selectedOrg : (passedOrgId ? [passedOrgId] : []),
  [selectedOrg, passedOrgId]);

  const activeCoordId = useMemo(() => 
    selectedCoord.length > 0 ? selectedCoord : (passedCoordId ? [passedCoordId] : []),
  [selectedCoord, passedCoordId]);

  // --- DATA FETCHING (Restored Granular Hooks) ---
  const { organizations: orgs } = useHierarchy({ includeSites: false, includeCoords: false });
  
  const { data: floorData, isLoading, error: hierarchyError } = useFloors(activeSiteId, {
    page: currentPage,
    page_size: 10
  });
  const floorList = floorData?.results || [];
  const totalLevels = floorData?.count || 0;

  const handleResetAll = () => {
    setSearchParams({});
    resetFilters();
  };

  // URL → Store sync (mount-only guard)
  useEffect(() => {
    const pOrg = searchParams.get('org_id') || searchParams.get('org');
    const pSite = searchParams.get('site_id') || searchParams.get('site');
    const pCoord = searchParams.get('coord_id') || searchParams.get('coord');

    // Logic Review: "Admin direct aaye to sari dikh"
    if (!pOrg && !pSite && !pCoord) {
        resetFilters();
    } else {
        if (pOrg) setOrg(pOrg.split(','));
        if (pSite) setSite(pSite.split(','));
        if (pCoord) setCoord(pCoord.split(','));
    }

    setIsSynced(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const currentOrg = activeOrgId.length === 1 ? orgs.find(o => String(o.id) === String(activeOrgId[0])) : null;
  const orgLabel = activeOrgId.length > 1 ? `Organizations (${activeOrgId.length})` : currentOrg?.name || passedOrgName;
  const orgInfo = { name: orgLabel || "Organization" };

  const breadcrumbs = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
    { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
  ];

  if (activeOrgId.length > 0) {
    breadcrumbs.push({ 
        label: orgInfo?.name || "Organization", 
        path: `/admin/coordinators?org_id=${activeOrgId.join(',')}&org_name=${encodeURIComponent(orgInfo?.name || '')}` 
    });
  }

  if (activeSiteId.length > 0) {
    const siteLabel = activeSiteId.length > 1 ? `Sites (${activeSiteId.length})` : passedSiteName || "Site Plan";
    breadcrumbs.push({ 
        label: siteLabel, 
        path: `/admin/site-plan?org_id=${activeOrgId.join(',')}&org_name=${encodeURIComponent(orgInfo?.name || '')}&coord_id=${activeCoordId.join(',')}&coord=${encodeURIComponent(passedCoordName || '')}` 
    });
  }

  breadcrumbs.push({ label: "Floor Plan", path: "#", isActive: true });

  const siteInfo = { name: (activeSiteId.length === 1 ? passedSiteName : `Multiple Sites`) || "Site" };
  const coordInfo = activeCoordId.length > 0 ? { name: passedCoordName || "Coordinator" } : null;

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
              {totalLevels > 0 && (
                 <span className="text-[10px] font-black text-gray uppercase tracking-widest bg-base/50 px-3 py-1.5 rounded-lg border border-border-main/50">
                    {totalLevels} Total Levels
                </span>
              )}
          </div>
        }
      />

      {/* MAIN BODY */}
      <main className="flex-1 w-full pb-12 flex flex-col pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8">
        <FilterBar activeLevel="floors" />

        {/* CARDS LIST/GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 gap-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-6">
          {isLoading ? (
            <div className="col-span-full w-full py-4">
               <CardSkeleton count={10} columns={5} />
            </div>
          ) : hierarchyError ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-red-500/70 bg-rose-50/50 rounded-3xl border border-dashed border-rose-200">
               <FiAlertCircle className="w-8 h-8 mb-3" />
               <p className="text-sm font-medium">{hierarchyError.message || hierarchyError}</p>
            </div>
          ): floorList.length > 0 ? (
            <>
              {floorList.map((floor, index) => (
                <FloorCard 
                  key={floor.id || index} 
                  floor={floor} 
                  site={siteInfo}
                  onClick={() => handleFloorClick(floor)} 
                />
              ))}

              {totalLevels > 10 && (
                  <div className="flex items-center justify-between px-4 py-4 bg-card border border-border-main rounded-2xl shadow-sm mt-6 col-span-full">
                      <span className="text-[10px] font-black text-gray uppercase tracking-widest">
                          Page {currentPage} of {Math.ceil(totalLevels / 10)}
                      </span>
                      <div className="flex items-center gap-2">
                          <Button variant="outline" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="!h-9 !px-4 !text-[10px] !font-black !uppercase">Previous</Button>
                          <Button variant="outline" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= Math.ceil(totalLevels / 10)} className="!h-9 !px-6 !text-[10px] !font-black !uppercase">Next</Button>
                      </div>
                  </div>
              )}
            </>
          ) : (
            <div className="col-span-full w-full py-32 flex flex-col items-center justify-center text-gray/40 bg-card/40 rounded-[2.5rem] border-2 border-dashed border-border-main/50 mt-4">
               <div className="w-20 h-20 bg-base rounded-3xl flex items-center justify-center mb-6 border border-border-main/30 rotate-6 shadow-inner">
                  <FiAlertCircle className="w-10 h-10 text-primary/40" />
               </div>
               <p className="text-xl font-black text-title tracking-tight">No Floor Plans Found</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2 opacity-60">
                  {activeSiteId.length > 0 ? "This site doesn't have any registered floor levels yet" : "No floor plans have been registered in the system yet"}
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