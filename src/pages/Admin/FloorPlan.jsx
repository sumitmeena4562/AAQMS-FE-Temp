import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import FilterBar from '../../components/UI/FilterBar';
import FloorCard from '../../components/UI/FloorCard';
import { useFilterStore } from '../../store/useFilterStore';
import { useHierarchy } from '../../hooks/api/useHierarchy';
import { useFloors } from '../../hooks/api/useHierarchyQueries';
import { FiHome, FiBriefcase, FiAlertCircle } from 'react-icons/fi';
import CardSkeleton from '../../components/UI/CardSkeleton';
import Pagination from '../../components/UI/Pagination';

const FloorPlan = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSynced, setIsSynced] = useState(false);
  const { resetFilters, selectedOrg, selectedSite, selectedFloor, setOrg, setCoord, setSite } = useFilterStore();
  
  const [currentPage, setCurrentPage] = useState(1);
  
  const passedOrgName = searchParams.get('org_name');
  const passedSiteId = searchParams.get('site_id');
  const passedSiteName = searchParams.get('site');
  const activeSiteId = useMemo(() => 
    selectedSite.length > 0 ? selectedSite : (passedSiteId ? [passedSiteId] : []),
  [selectedSite, passedSiteId]);

  // --- DATA FETCHING (GLOBAL: Zero Latency Pattern) ---
  const { data: orgs = [], sites: allSites = [] } = useHierarchy({ 
    includeSites: true, 
    includeCoords: false,
    enabled: isSynced 
  });
  
  const { data: floorData, isLoading, error: hierarchyError } = useFloors(undefined, 
    { page_size: 5000 }, // Params (2nd arg)
    { enabled: isSynced } // Options (3rd arg)
  );
  const floorList = useMemo(() => floorData?.results || [], [floorData]);

  // Advanced Client-side filtering (Org -> Site -> Floor)
  const filteredFloorList = useMemo(() => {
    if (!floorList || !Array.isArray(floorList)) return [];
    let data = floorList;

    // 1. Organization Filter (FE)
    if (selectedOrg && selectedOrg.length > 0) {
      data = data.filter(f => {
        const oId = f.organisation_id || f.org_id || f.organisation?.id || f.site?.organisation_id;
        return selectedOrg.includes(String(oId));
      });
    }

    // 2. Site Filter (FE)
    if (selectedSite && selectedSite.length > 0) {
      data = data.filter(f => {
        const sId = f.site_id || f.site?.id || f.site;
        return selectedSite.includes(String(sId));
      });
    }

    // 3. Floor Dropdown Filter (FE)
    if (selectedFloor && selectedFloor.length > 0) {
      data = data.filter(f => selectedFloor.includes(String(f.id)));
    }

    return data;
  }, [floorList, selectedOrg, selectedSite, selectedFloor]);

  const totalLevels = floorData?.count || 0;
  const activePlansCount = filteredFloorList.length;

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

    if (!isSynced) {
        setTimeout(() => setIsSynced(true), 0);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-reset to page 1 when floor filter changes
  useEffect(() => {
    if (currentPage !== 1) {
        setTimeout(() => setCurrentPage(1), 0);
    }
  }, [selectedFloor]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // --- Dynamic Naming for Breadcrumbs/Headers ---
  const currentOrg = selectedOrg.length === 1 ? orgs.find(o => String(o.id) === String(selectedOrg[0])) : null;
  const currentSite = selectedSite.length === 1 ? allSites.find(s => String(s.id) === String(selectedSite[0])) : null;

  const orgLabel = selectedOrg.length > 1 ? `Multiple Orgs (${selectedOrg.length})` : currentOrg?.name || passedOrgName || "Organization";
  const siteLabel = selectedSite.length > 1 ? `Multiple Sites (${selectedSite.length})` : currentSite?.name || currentSite?.site_name || passedSiteName || "Site";

  const breadcrumbs = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
    { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
  ];

  if (selectedOrg.length > 0) {
    breadcrumbs.push({ 
        label: orgLabel, 
        path: `/admin/coordinators?org_id=${selectedOrg.join(',')}` 
    });
  }

  if (selectedSite.length > 0) {
    breadcrumbs.push({ 
        label: siteLabel, 
        path: `/admin/site-plan?org_id=${selectedOrg.join(',')}&site_id=${selectedSite.join(',')}` 
    });
  }

  breadcrumbs.push({ label: "Floor Plan", path: "#", isActive: true });

  /**
   * ── NAVIGATION HANDLER ──
   * Redirects the user to the Zone mapping for the specific floor.
   */
  const handleFloorClick = (floor) => {
    navigate(`/admin/zones?org_id=${selectedOrg.join(',')}&site_id=${selectedSite.join(',')}&floor_id=${floor.id}`, {
      state: { floor, site: currentSite || floor.site, orgName: orgLabel }
    });
  };

  return (
    <div className="flex flex-col font-sans h-full">
      
      {/* HEADER */}
      <PageHeader 
        title={selectedSite.length === 1 ? `Floors for ${siteLabel}` : "All Floor Plans"}
        subtitle={`Viewing ${activePlansCount} floor levels for ${siteLabel}`}
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
        <FilterBar 
          activeLevel="floors" 
          hideCoordFilter={true} 
          externalFloors={floorList}
        />

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
          ): filteredFloorList.length > 0 ? (
            <>
              {filteredFloorList.slice((currentPage - 1) * 12, currentPage * 12).map((floor, index) => (
                <FloorCard 
                  key={floor.id || index} 
                  floor={floor} 
                  site={currentSite || floor.site}
                  onClick={() => handleFloorClick(floor)} 
                />
              ))}

              {filteredFloorList.length > 12 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredFloorList.length / 12)}
                  onPageChange={setCurrentPage}
                  totalItems={filteredFloorList.length}
                  itemsPerPage={12}
                  variant="ghost"
                  className="mt-6 col-span-full"
                />
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