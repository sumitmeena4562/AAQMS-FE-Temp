import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Button from '../../components/UI/Button';
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
  
  const [searchParams, setSearchParams] = useSearchParams();
  const passedOrgId = searchParams.get('org_id');
  const passedOrgNameFromUrl = searchParams.get('org_name');
  const passedCoordId = searchParams.get('coord_id');
  const passedCoordNameFromUrl = searchParams.get('coord');

  const { resetFilters } = useFilterStore();

  const handleResetAll = () => {
      setSearchParams({});
      resetFilters();
  };

  useEffect(() => {
    // 1. Sync global filters ONLY if passed through URL and store is empty
    if (passedOrgId && !selectedOrg) setOrg(passedOrgId);
    if (passedCoordId && !selectedCoord) setCoord(passedCoordId);
    
    // 2. Fetch sites specifically for this context
    const cleanOrg = (passedOrgId === 'undefined' || !passedOrgId) ? selectedOrg : passedOrgId;
    const cleanCoord = (passedCoordId === 'undefined' || !passedCoordId) ? selectedCoord : passedCoordId;

    fetchSites({ 
        organisation: cleanOrg || '', 
        coord_id: cleanCoord || '' 
    });
  }, [passedOrgId, passedCoordId, selectedOrg, selectedCoord, setOrg, setCoord, fetchSites]);

  const activeOrgId = selectedOrg || passedOrgId;
  const activeCoordId = selectedCoord || passedCoordId;

  const orgInfo = orgs.find(o => o.id === activeOrgId) || (passedOrgNameFromUrl ? { name: passedOrgNameFromUrl } : null);
  const coordInfo = activeCoordId ? { name: passedCoordNameFromUrl || "Coordinator" } : null;

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

  breadcrumbs.push({ 
    label: coordInfo?.name || "Site Plan", 
    path: "#", 
    isActive: true 
  });

  const sitePlans = sites;
  const totalPlans = sitePlans.length;
  const activePlansCount = sitePlans.filter(p => p.status === 'ACTIVE').length;

  return (
    <div className="flex flex-col font-sans h-full">

      {/* HEADER */}
      <PageHeader
        title={activeOrgId ? "Site Plan Selection" : "All Operational Sites"}
        subtitle={
            activeCoordId 
                ? `Managing ${activePlansCount} active site plans for ${coordInfo?.name}` 
                : activeOrgId
                    ? `Showing all sites for ${orgInfo?.name}`
                    : "Viewing all sites across all organizations"
        }
        breadcrumbs={breadcrumbs}
        hideAddButton={true}
        rightContent={
          <div className="flex items-center gap-3">
             <Button onClick={handleResetAll} variant="outline" size="sm" className="!h-[38px] bg-card flex items-center gap-2 px-4 border-dashed border-primary/30 hover:border-primary/60 transition-all">
                  <FiLoader size={14} className={loading ? 'animate-spin' : ''} />
                  <span className="font-black text-[10px] uppercase tracking-widest text-primary">Clear Context</span>
              </Button>
              {totalPlans > 0 && (
                <span className="text-[10px] font-black text-gray uppercase tracking-widest bg-base/50 px-3 py-1.5 rounded-lg border border-border-main/50">
                    {totalPlans} Total Projects
                </span>
              )}
          </div>
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
        ) : sitePlans.length === 0 ? (
           <div className="text-center py-24 bg-card rounded-2xl border border-border-main mt-4 shadow-sm animate-in fade-in zoom-in">
             <div className="w-16 h-16 rounded-3xl bg-base border border-border-main flex items-center justify-center mx-auto mb-6">
                <FiBriefcase className="w-6 h-6 text-gray/30" />
             </div>
            <p className="text-title font-bold tracking-tight text-lg mb-1">
              No Operational Sites Found
            </p>
            <p className="text-gray text-xs">
              {activeOrgId ? `${orgInfo?.name || 'Selected organization'} does not have any sites registered yet.` : "No sites have been registered in the system yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {sitePlans.map((item, index) => (
              <div key={item.id || index} className="w-full max-w-[340px]">
                <OrganizationCard
                  org={item}
                  isSiteCard={true}
                  coordinatorContext={coordInfo}
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
