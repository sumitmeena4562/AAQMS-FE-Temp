import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import FilterBar from '../../components/UI/FilterBar';
import FloorCard from '../../components/UI/FloorCard';
import { useFilterStore } from '../../store/useFilterStore';
import { organizations, coordinators, sites, floors } from '../../data/mockFilterData';
import { FiHome, FiBriefcase } from 'react-icons/fi';

const FloorPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedOrg, selectedCoord, selectedSite, setOrg, setCoord, setSite } = useFilterStore();

  const passedOrgName = location.state?.orgName || new URLSearchParams(location.search).get('org');
  const passedCoordName = location.state?.coordinator?.name || new URLSearchParams(location.search).get('coord');
  const passedSiteName = location.state?.site?.name || new URLSearchParams(location.search).get('site');

  useEffect(() => {
    let currentOrgId = selectedOrg;
    let currentCoordId = selectedCoord;

    if (!currentOrgId && passedOrgName) {
      const matchOrg = organizations.find(o => o.name.toLowerCase() === passedOrgName.toLowerCase());
      if (matchOrg) {
        setOrg(matchOrg.id);
        currentOrgId = matchOrg.id;
      }
    }
    if (!currentCoordId && passedCoordName) {
      const matchCoord = coordinators.find(c => c.name.toLowerCase() === passedCoordName.toLowerCase() && (!currentOrgId || c.orgId === currentOrgId));
      if (matchCoord) {
        setCoord(matchCoord.id);
        currentCoordId = matchCoord.id;
      }
    }
    if (!selectedSite && passedSiteName) {
      const matchSite = sites.find(s => s.name.toLowerCase() === passedSiteName.toLowerCase() && (!currentCoordId || s.coordId === currentCoordId));
      if (matchSite) setSite(matchSite.id);
    }
  }, [selectedOrg, selectedCoord, selectedSite, passedOrgName, passedCoordName, passedSiteName, setOrg, setCoord, setSite]);

  const activeOrgId = selectedOrg || organizations.find(o => o.name.toLowerCase() === passedOrgName?.toLowerCase())?.id;
  const activeCoordId = selectedCoord || coordinators.find(c => c.name.toLowerCase() === passedCoordName?.toLowerCase())?.id;
  const activeSiteId = selectedSite || sites.find(s => s.name.toLowerCase() === passedSiteName?.toLowerCase())?.id;

  const orgInfo = activeOrgId ? organizations.find(o => o.id === activeOrgId) : null;
  const coordInfo = activeCoordId ? coordinators.find(c => c.id === activeCoordId) : null;
  const siteInfo = activeSiteId ? sites.find(s => s.id === activeSiteId) : null;

  const breadcrumbs = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
    { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
    { label: orgInfo?.name || "Organization", path: `/admin/coordinators` },
    { label: coordInfo?.name || "Site Plan", path: `/admin/site-plan` },
    { label: siteInfo?.name || "Floor Plan", path: "#", isActive: true }
  ];

  // We explicitly fetch matched floors from the relational store to keep UI accurate
  const floorList = activeSiteId ? floors.filter(f => f.siteId === activeSiteId).map(f => ({
      ...f, 
      status: 'ACTIVE',
      stats: { zones: Math.floor(Math.random() * 5) + 2, assets: Math.floor(Math.random() * 20) + 5 }
  })) : [];

  const activePlansCount = floorList.filter(f => f.status === 'ACTIVE').length;

  const handleFloorClick = (floor) => {
    navigate(`/admin/zones?org=${encodeURIComponent(orgInfo?.name || "")}&coord=${encodeURIComponent(coordInfo?.name || "")}&site=${encodeURIComponent(siteInfo?.name || "")}&floor=${encodeURIComponent(floor.name || "")}`, {
      state: { floor, site: siteInfo, coordinator: coordInfo, orgName: orgInfo?.name }
    });
  };

  return (
    <div className="flex flex-col font-sans h-full">
      
      {/* HEADER */}
      <PageHeader 
        title="Floor Plan Selection"
        subtitle={activeSiteId ? `Managing ${activePlansCount} active floor plans for ${siteInfo?.name}` : "Please use the filter bar to select a site"}
        breadcrumbs={breadcrumbs}
        hideAddButton={true}
        rightContent={
          activeSiteId ? (
            <span className="text-[10px] font-black text-gray uppercase tracking-widest bg-base/50 px-3 py-1.5 rounded-lg border border-border-main/50">
                {floorList.length} Total Levels
            </span>
          ) : null
        }
      />

      {/* MAIN BODY */}
      <main className="flex-1 w-full pb-12 flex flex-col pt-4 sm:pt-6">
        <FilterBar activeLevel="floors" />

        {!activeSiteId ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border-main mt-4">
            <p className="text-gray font-medium tracking-wide">
              Please select an Organization, Coordinator, and Site to view floors.
            </p>
          </div>
        ) : floorList.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border-main mt-4">
            <p className="text-gray font-medium tracking-wide">
              No floors found for this site.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {floorList.map((floor, index) => (
              <FloorCard 
                key={floor.id || index} 
                floor={floor} 
                site={siteInfo}
                onClick={() => handleFloorClick(floor)} 
              />
            ))}
          </div>
        )}

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
