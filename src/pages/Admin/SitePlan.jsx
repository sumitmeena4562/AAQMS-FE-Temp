import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import OrganizationCard from '../../components/UI/OrganizationCard';
import PageHeader from '../../components/UI/PageHeader';
import FilterBar from '../../components/UI/FilterBar';
import { useFilterStore } from '../../store/useFilterStore';
import { useHierarchyStore } from '../../store/useHierarchyStore';
import { useOrgStore } from '../../store/useOrgStore';
import { FiHome, FiBriefcase, FiLoader } from 'react-icons/fi';

const SitePlan = () => {
  const location = useLocation();
  const { selectedOrg, selectedCoord, setOrg, setCoord } = useFilterStore();
  const { sites, fetchSites, loading } = useHierarchyStore();
  const { orgs } = useOrgStore();
  
  const searchParams = new URLSearchParams(location.search);
  const passedOrgId = searchParams.get('org_id');
  const passedOrgNameFromUrl = searchParams.get('org_name');
  const passedCoordId = searchParams.get('coord_id');
  const passedCoordNameFromUrl = searchParams.get('coord');

  useEffect(() => {
    // 1. Sync global filters if passed through URL
    if (passedOrgId) setOrg(passedOrgId);
    if (passedCoordId) setCoord(passedCoordId);
    
    // 2. Fetch sites specifically for this context
    fetchSites({ 
        organisation: passedOrgId || selectedOrg, 
        coord_id: passedCoordId || selectedCoord 
    });
  }, [passedOrgId, passedCoordId, selectedOrg, selectedCoord, setOrg, setCoord, fetchSites]);

  const activeOrgId = selectedOrg || passedOrgId;
  const activeCoordId = selectedCoord || passedCoordId;

  const orgInfo = orgs.find(o => o.id === activeOrgId) || { name: passedOrgNameFromUrl };
  const coordInfo = { name: passedCoordNameFromUrl || "Coordinator" };

  const breadcrumbs = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
    { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
    { 
        label: orgInfo?.name || "Organization", 
        path: activeOrgId ? `/admin/coordinators?org_id=${activeOrgId}&org_name=${encodeURIComponent(orgInfo?.name || '')}` : '/admin/organizations'
    },
    { label: activeCoordId ? coordInfo?.name : "Site Plan", path: "#", isActive: true }
  ];

  // Logic: Show sites belonging strictly to the currently selected context
  const sitePlans = sites;

  const totalPlans = sitePlans.length;
  const activePlansCount = sitePlans.filter(p => p.status === 'ACTIVE').length;

  return (
    <div className="flex flex-col font-sans h-full">

      {/* HEADER */}
      <PageHeader
        title="Site Plan Selection"
        subtitle={
            !activeOrgId 
                ? "Please select an Organization to view its operational sites"
                : activeCoordId 
                    ? `Managing ${activePlansCount} active site plans for ${coordInfo?.name}` 
                    : `Showing all sites for ${orgInfo?.name}`
        }
        breadcrumbs={breadcrumbs}
        hideAddButton={true}
        rightContent={
          activeCoordId ? (
            <span className="text-[10px] font-black text-gray uppercase tracking-widest bg-base/50 px-3 py-1.5 rounded-lg border border-border-main/50">
                {totalPlans} Total Projects
            </span>
          ) : null
        }
      />

      {/* MAIN BODY */}
      <main className="flex-1 w-full pb-12 flex flex-col pt-4 sm:pt-6">
        <FilterBar activeLevel="sites" />

        {loading ? (
             <div className="flex flex-col items-center justify-center py-32 bg-base/10 rounded-2xl border border-dashed border-border-main mt-4">
                 <FiLoader className="w-10 h-10 text-primary animate-spin mb-4" />
                 <p className="text-gray font-bold tracking-widest text-[10px] uppercase">Retrieving live site data...</p>
             </div>
        ) : !activeOrgId ? (
          <div className="text-center py-24 bg-card rounded-2xl border border-border-main mt-4 shadow-sm animate-in fade-in zoom-in">
             <div className="w-16 h-16 rounded-3xl bg-base border border-border-main flex items-center justify-center mx-auto mb-6">
                <FiBriefcase className="w-6 h-6 text-gray/30" />
             </div>
            <p className="text-title font-bold tracking-tight text-lg mb-1">
              Organization Context Missing
            </p>
            <p className="text-gray text-xs">
              Please select an Organization to view its operational sites.
            </p>
          </div>
        ) : sitePlans.length === 0 ? (
           <div className="text-center py-24 bg-card rounded-2xl border border-border-main mt-4 shadow-sm animate-in fade-in zoom-in">
             <div className="w-16 h-16 rounded-3xl bg-base border border-border-main flex items-center justify-center mx-auto mb-6">
                <FiBriefcase className="w-6 h-6 text-gray/30" />
             </div>
            <p className="text-title font-bold tracking-tight text-lg mb-1">
              No Operational Sites Found
            </p>
            <p className="text-gray text-xs">
              {orgInfo?.name || 'Selected organization'} does not have any sites registered yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {sitePlans.map((item, index) => (
              <div key={item.id || index} className="w-full max-w-[340px]">
                <OrganizationCard
                  org={item}
                  isSiteCard={true}
                  coordinatorContext={{ name: coordInfo?.name }}
                />
              </div>
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

export default SitePlan;
