import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import FilterBar from '../../components/UI/FilterBar';
import FloorCard from '../../components/UI/FloorCard';
import { useFilterStore } from '../../store/useFilterStore';
import { organizationService } from '../../services/organizationService';
import { userService } from '../../services/userService';
import { FiHome, FiBriefcase, FiLoader, FiAlertCircle } from 'react-icons/fi';

const FloorPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedOrg, selectedCoord, selectedSite, setOrg, setCoord, setSite } = useFilterStore();
  const [floorList, setFloorList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contextData, setContextData] = useState({ org: null, coord: null, site: null });

  useEffect(() => {
    const fetchMetadata = async () => {
      const orgName = location.state?.orgName || new URLSearchParams(location.search).get('org');
      const coordName = location.state?.coordinator?.name || new URLSearchParams(location.search).get('coord');
      const siteName = location.state?.site?.name || new URLSearchParams(location.search).get('site');
      
      let org = null, coord = null, site = null;

      if (orgName) {
         try {
           const orgs = await organizationService.getOrganizations({ search: orgName });
           org = (orgs.results || orgs).find(o => o.name?.toLowerCase() === orgName.toLowerCase() || o.organization_name?.toLowerCase() === orgName.toLowerCase());
           if (org && !selectedOrg) setOrg(org.id);
         } catch (e) { console.error(e); }
      }

      if (coordName) {
         try {
           const usersResult = await userService.getUsers({ role: 'coordinator', search: coordName });
           const users = usersResult.users || usersResult.results || usersResult;
           coord = Array.isArray(users) ? users.find(u => u.name.toLowerCase() === coordName.toLowerCase()) : null;
           if (coord && !selectedCoord) setCoord(coord.id);
         } catch (e) { console.error(e); }
      }

      if (siteName && org) {
         try {
            const data = await organizationService.getSites(org.id);
            site = (data.results || data).find(s => s.name.toLowerCase() === siteName.toLowerCase());
            if (site && !selectedSite) setSite(site.id);
         } catch (e) { console.error(e); }
      }
      setContextData({ org, coord, site });
    };
    fetchMetadata();
  }, [location.search, location.state, selectedOrg, selectedCoord, selectedSite, setOrg, setCoord, setSite]);

  useEffect(() => {
    const fetchFloors = async () => {
      if (!selectedSite) {
        setFloorList([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await organizationService.getFloors(selectedSite);
        setFloorList(data.results || data || []);
      } catch (err) {
        console.error("Failed to fetch floors:", err);
        setError("Failed to load floor plans.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFloors();
  }, [selectedSite]);

  const orgInfo = contextData.org || { name: "Organization" };
  const coordInfo = contextData.coord || { name: "Coordinator" };
  const siteInfo = contextData.site || { name: "Site" };

  // Breadcrumbs updated to focus on the active selection
  const breadcrumbs = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
    { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
    { label: orgInfo?.name || orgInfo?.organization_name || "Organization", path: `/admin/organizations` },
    { label: coordInfo?.name || "Site Plan", path: `/admin/site-plan` },
    { label: siteInfo?.name || "Floor Plan", path: "#", isActive: true }
  ];

  const activePlansCount = floorList.length;

  /**
   * ── NAVIGATION HANDLER ──
   * Redirects the user to the Zone mapping for the specific floor.
   */
  const handleFloorClick = (floor) => {
    navigate(`/admin/zones?org=${encodeURIComponent(orgInfo?.name || orgInfo?.organization_name || "")}&coord=${encodeURIComponent(coordInfo?.name || "")}&site=${encodeURIComponent(siteInfo?.name || "")}&floor=${encodeURIComponent(floor.name || "")}`, {
      state: { floor, site: siteInfo, coordinator: coordInfo, orgName: orgInfo?.name || orgInfo?.organization_name }
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
               <p className="text-sm font-medium">Fetching floor plans from server...</p>
            </div>
          ) : error ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-red-500/70">
               <FiAlertCircle className="w-8 h-8 mb-3" />
               <p className="text-sm font-medium">{error}</p>
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