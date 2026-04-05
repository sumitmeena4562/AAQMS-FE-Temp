
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import FilterBar from '../../components/UI/FilterBar';
import FloorCard from '../../components/UI/FloorCard';
import { useFilterStore } from '../../store/useFilterStore';
import { hierarchyService } from '../../services/hierarchyService';
import { FiHome, FiBriefcase, FiAlertCircle, FiLoader } from 'react-icons/fi';

/**
 * ΓöÇΓöÇ FLOOR PLAN SELECTION PAGE ΓöÇΓöÇ
 * 
 * This page manages the selection of a specific floor plan within a selected Site.
 * Transitioned from Mock Data to production API integration.
 */

const FloorPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedOrg, selectedCoord, selectedSite, setOrg, setCoord, setSite, setFloor } = useFilterStore();
  
  // PRODUCTION STATE: Handling dynamic floor list, loading, and errors
  const [floorList, setFloorList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);


  // UI HELPERS (Removed unused legacy mock variables)


  useEffect(() => {
    // Breadcrumb logic removed (mock-based) or updated in future to fetch org/site info
    // For now, focusing on FETCHING the actual floors
    if (selectedSite) {
        fetchFloors(selectedSite);
    } else {
        setFloorList([]);
    }
  }, [selectedSite]);

  const fetchFloors = async (siteId) => {
    setIsLoading(true);
    setError(null);
    try {
        // PROFESSIONAL INTEGRATION: Fetching from hierarchy API with site_id filter
        const data = await hierarchyService.getFloors({ site_id: siteId });
        setFloorList(data || []);
    } catch (err) {
        console.error("Failed to fetch floors:", err);
        setError("Could not load floor plans. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  // Breadcrumbs updated to focus on the active selection
  const breadcrumbs = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
    { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
    { label: "Site Plan", path: `/admin/site-plan` },
    { label: "Floor Plan", path: "#", isActive: true }
  ];

  // ACTIVE FILTER COUNT: Tracks how many floors have an 'ACTIVE' status (case-insensitive) for the UI header
  const activePlansCount = floorList.filter(f => f?.status?.toUpperCase() === 'ACTIVE').length;

  /**
   * ΓöÇΓöÇ NAVIGATION HANDLER ΓöÇΓöÇ
   * Redirects the user to the Zone mapping for the specific floor.
   */
  const handleFloorClick = (floor) => {
    setFloor(floor.id);
    navigate(`/admin/zones?site=${selectedSite}&floor=${floor.id}`, {
      state: { floor, siteId: selectedSite }
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
