import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Button from '../../components/UI/Button';
import OrganizationCard from '../../components/UI/OrganizationCard';
import PageHeader from '../../components/UI/PageHeader';
import FilterBar from '../../components/UI/FilterBar';
import { useFilterStore } from '../../store/useFilterStore';
import { useHierarchyStore } from '../../store/useHierarchyStore';
import { useOrgStore } from '../../store/useOrgStore';
import { useHierarchy } from '../../hooks/api/useHierarchy';
import { useSites } from '../../hooks/api/useHierarchyQueries';
import { FiHome, FiBriefcase, FiLoader, FiAlertCircle } from 'react-icons/fi';
import CardSkeleton from '../../components/UI/CardSkeleton';

const SitePlan = () => {
  const location = useLocation();
  const { selectedOrg, selectedCoord, setOrg, setCoord } = useFilterStore();
  const { clearHierarchy } = useHierarchyStore();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const { resetFilters } = useFilterStore();
  const [currentPage, setCurrentPage] = useState(1);
  
  const passedOrgId = searchParams.get('org_id');
  const passedOrgNameFromUrl = searchParams.get('org_name');
  const passedCoordId = searchParams.get('coord_id');
  const passedCoordNameFromUrl = searchParams.get('coord');

  const activeOrgId = selectedOrg.length > 0 ? selectedOrg : (passedOrgId ? [passedOrgId] : []);
  const activeCoordId = selectedCoord.length > 0 ? selectedCoord : (passedCoordId ? [passedCoordId] : []);

  // --- QUERY HOOKS ---
  const { organizations: orgs } = useHierarchy();
  const { data: siteData = { results: [], total: 0 }, isLoading: loading, error: hierarchyError } = useSites({ 
      organisation: activeOrgId, 
      coord_id: activeCoordId 
  });

  const sitePlans = siteData.results || [];
  const totalPlans = siteData.total || sitePlans.length;
  const activePlansCount = sitePlans.filter(p => p.status === 'ACTIVE').length;

  const handleResetAll = () => {
      setSearchParams({});
      resetFilters();
  };

  // URL → Store sync (mount-only guard)
  const hasSynced = useRef(false);
  useEffect(() => {
    if (hasSynced.current) return;
    
    const pOrg = searchParams.get('org_id') || searchParams.get('org');
    const pCoord = searchParams.get('coord_id') || searchParams.get('coord');

    // Logic Review: "Admin direct aaye to sari dikh"
    if (!pOrg && !pCoord) {
        resetFilters();
    } else {
        if (pOrg) setOrg(pOrg.split(','));
        if (pCoord) setCoord(pCoord.split(','));
    }

    hasSynced.current = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const currentOrg = activeOrgId.length === 1 ? orgs.find(o => String(o.id) === String(activeOrgId[0])) : null;
  const orgLabel = activeOrgId.length > 1 ? `Organizations (${activeOrgId.length})` : currentOrg?.name || passedOrgNameFromUrl;
  const orgInfo = { name: orgLabel || "Organization" };
  const coordInfo = activeCoordId.length > 0 ? { name: passedCoordNameFromUrl || "Coordinator" } : null;

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

  breadcrumbs.push({ 
    label: coordInfo?.name || "Site Plan", 
    path: "#", 
    isActive: true 
  });

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
            <div className="w-full mt-4">
               <CardSkeleton count={8} columns={4} />
            </div>
        ) : hierarchyError ? (
          <div className="text-center py-24 bg-card rounded-2xl border border-red-200 mt-4 shadow-sm">
            <FiAlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 font-bold">Failed to load sites</p>
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
              {activeOrgId.length > 0 ? `${orgInfo?.name || 'Selected organization'} does not have any sites registered yet.` : "No sites have been registered in the system yet."}
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

            {totalPlans > 10 && (
                <div className="flex items-center justify-between px-6 py-4 bg-card border border-border-main rounded-2xl shadow-sm mt-6 col-span-full">
                    <span className="text-[10px] font-black text-gray uppercase tracking-widest">
                        Page {currentPage} of {Math.ceil(totalPlans / 10)}
                    </span>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="!h-9 !px-4 !text-[10px] !font-black !uppercase">Previous</Button>
                        <Button variant="outline" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= Math.ceil(totalPlans / 10)} className="!h-9 !px-6 !text-[10px] !font-black !uppercase">Next</Button>
                    </div>
                </div>
            )}
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
