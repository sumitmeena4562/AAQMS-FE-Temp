import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../../components/UI/Button';
import OrganizationCard from '../../components/UI/OrganizationCard';
import PageHeader from '../../components/UI/PageHeader';
import FilterBar from '../../components/UI/FilterBar';
import { useFilterStore } from '../../store/useFilterStore';
import { useHierarchy } from '../../hooks/api/useHierarchy';
import { FiHome, FiBriefcase, FiLoader, FiAlertCircle, FiMapPin, FiUsers } from 'react-icons/fi';
import CardSkeleton from '../../components/UI/CardSkeleton';
import Pagination from '../../components/UI/Pagination';
import useDebounce from '../../hooks/useDebounce';
import useSearchStore from '../../store/useSearchStore';

const SitePlan = () => {
  const { 
    selectedOrg, selectedCoord, selectedSite, 
    setOrg, setCoord 
  } = useFilterStore();
  const { query: searchQuery } = useSearchStore();
  const [isSynced, setIsSynced] = useState(false);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const { resetFilters } = useFilterStore();
  const [currentPage, setCurrentPage] = useState(1);
  
  const passedOrgId = searchParams.get('org_id');
  const passedOrgNameFromUrl = searchParams.get('org_name');
  const passedCoordId = searchParams.get('coord_id');
  const passedCoordNameFromUrl = searchParams.get('coord');

  const activeOrgId = useMemo(() => 
    selectedOrg.length > 0 ? selectedOrg : (passedOrgId ? [passedOrgId] : []),
  [selectedOrg, passedOrgId]);

  const activeCoordId = useMemo(() => 
    selectedCoord.length > 0 ? selectedCoord : (passedCoordId ? [passedCoordId] : []),
  [selectedCoord, passedCoordId]);

    // --- DATA FETCHING ---
    const { organizations: orgs, sites: sitePlans, isLoading: loading, error: hierarchyError } = useHierarchy({ 
        includeSites: true, 
        includeCoords: false, // EXPLICITLY DISABLED: Speeds up load by avoiding slow admin/ call
        enabled: isSynced
    });

    // Filtering & Searching
    const filteredSitePlans = useMemo(() => {
        if (!sitePlans || !Array.isArray(sitePlans)) return [];
        let data = sitePlans;

        // 1. Organization Filter (FE)
        if (selectedOrg && selectedOrg.length > 0) {
            data = data.filter(p => {
                // Defensive extraction of Org ID
                const orgId = p.organisation_id || p.org_id || p.organisation?.id || p.organisation;
                return selectedOrg.includes(String(orgId));
            });
        }

        // 2. Search Filter (FE) - Using central searchQuery
        if (searchQuery) {
            const q = searchQuery.toLowerCase().trim();
            data = data.filter(p => 
                (p.site_name || p.name || '').toLowerCase().includes(q) ||
                (p.address || '').toLowerCase().includes(q) ||
                (p.organisation_name || '').toLowerCase().includes(q)
            );
        }

        // 3. Filter by selected site from FilterBar
        if (selectedSite && selectedSite.length > 0) {
            data = data.filter(p => {
                const sId = p.id || p.site_id || p.pk;
                return selectedSite.includes(String(sId));
            });
        }

        return data;
    }, [sitePlans, selectedOrg, selectedSite, searchQuery]);

    // Proper Pagination Slicing
    const itemsPerPage = 12;
    const totalPlans = filteredSitePlans.length;
    const activePlansCount = filteredSitePlans.filter(p => (p.status || p.is_active) === 'ACTIVE' || p.status === 'active' || p.is_active === true).length;

    const paginatedSitePlans = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredSitePlans.slice(start, start + itemsPerPage);
    }, [filteredSitePlans, currentPage]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedOrg, selectedSite, searchQuery]);

  const handleResetAll = () => {
      setSearchParams({});
      resetFilters();
  };

  // URL → Store sync (mount-only guard)
  useEffect(() => {
    const pOrg = searchParams.get('org_id') || searchParams.get('org');
    const pCoord = searchParams.get('coord_id') || searchParams.get('coord');

    // Logic Review: "Admin direct aaye to sari dikh"
    if (!pOrg && !pCoord) {
        resetFilters();
    } else {
        if (pOrg) setOrg(pOrg.split(','));
        if (pCoord) setCoord(pCoord.split(','));
    }

    setIsSynced(true);
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
        title={activeOrgId.length > 0 ? "Site Plan Selection" : "All Operational Sites"}
        subtitle={
            activeCoordId.length > 0
                ? `Managing ${activePlansCount} active site plans for ${coordInfo?.name}` 
                : activeOrgId.length > 0
                    ? `Showing all sites for ${orgInfo?.name}`
                    : "Viewing all sites across all organizations"
        }
        breadcrumbs={breadcrumbs}
        hideAddButton={true}
        rightContent={
          <div className="flex items-center gap-3">
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
        <FilterBar 
          activeLevel="sites" 
          hideCoordFilter={true} 
          showSearch={false}
        />

        {loading ? (
            <div className="w-full mt-4">
               <CardSkeleton count={8} columns={4} />
            </div>
        ) : hierarchyError ? (
          <div className="text-center py-24 bg-card rounded-2xl border border-red-200 mt-4 shadow-sm">
            <FiAlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 font-bold">Failed to load sites</p>
          </div>
        ) : filteredSitePlans.length === 0 ? (
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedSitePlans.map((item, index) => (
                <div key={item.id || index} className="w-full">
                  <OrganizationCard
                    org={item}
                    isSiteCard={true}
                    coordinatorContext={coordInfo}
                  />
                </div>
              ))}
            </div>

            {totalPlans > itemsPerPage && (
              <div className="mt-8 flex justify-center border-t border-border-main/50 pt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalPlans / itemsPerPage)}
                  onPageChange={setCurrentPage}
                  totalItems={totalPlans}
                  itemsPerPage={itemsPerPage}
                  variant="primary"
                />
              </div>
            )}
          </>
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
