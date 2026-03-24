import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import OrganizationCard from '../../components/UI/OrganizationCard';
import PageHeader from '../../components/UI/PageHeader';
import FilterBar from '../../components/UI/FilterBar';
import { useFilterStore } from '../../store/useFilterStore';
import { organizations, coordinators, sites } from '../../data/mockFilterData';
import { FiHome, FiBriefcase } from 'react-icons/fi';

const SitePlan = () => {
  const location = useLocation();
  const { selectedOrg, selectedCoord, setOrg, setCoord } = useFilterStore();

  const passedOrgName = location.state?.orgName || new URLSearchParams(location.search).get('org');
  const passedCoordName = location.state?.coordinator?.name || new URLSearchParams(location.search).get('coord');

  useEffect(() => {
    let currentOrgId = selectedOrg;
    if (!currentOrgId && passedOrgName) {
      const matchOrg = organizations.find(o => o.name.toLowerCase() === passedOrgName.toLowerCase());
      if (matchOrg) {
        setOrg(matchOrg.id);
        currentOrgId = matchOrg.id;
      }
    }
    if (!selectedCoord && passedCoordName) {
      const matchCoord = coordinators.find(c => c.name.toLowerCase() === passedCoordName.toLowerCase() && (!currentOrgId || c.orgId === currentOrgId));
      if (matchCoord) {
        setCoord(matchCoord.id);
      }
    }
  }, [selectedOrg, selectedCoord, passedOrgName, passedCoordName, setOrg, setCoord]);

  const activeOrgId = selectedOrg || organizations.find(o => o.name.toLowerCase() === passedOrgName?.toLowerCase())?.id;
  const activeCoordId = selectedCoord || coordinators.find(c => c.name.toLowerCase() === passedCoordName?.toLowerCase())?.id;

  const orgInfo = activeOrgId ? organizations.find(o => o.id === activeOrgId) : null;
  const coordInfo = activeCoordId ? coordinators.find(c => c.id === activeCoordId) : null;

  const breadcrumbs = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
    { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
    { label: orgInfo?.name || "Organization", path: `/admin/coordinators` },
    { label: coordInfo?.name || "Site Plan", path: "#", isActive: true }
  ];

  // Logic: Show sites belonging strictly to the currently selected coordinator
  const sitePlans = activeCoordId ? sites.filter(s => s.coordId === activeCoordId) : [];

  const totalPlans = sitePlans.length;
  const activePlansCount = sitePlans.filter(p => p.status === 'ACTIVE').length;

  return (
    <div className="flex flex-col font-sans h-full">

      {/* HEADER */}
      <PageHeader
        title="Site Plan Selection"
        subtitle={activeCoordId ? `Managing ${activePlansCount} active site plans for ${coordInfo?.name}` : "Please use the filter bar to select a coordinator"}
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

        {!activeCoordId ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border-main mt-4">
            <p className="text-gray font-medium tracking-wide">
              Please select an Organization and Coordinator to view sites.
            </p>
          </div>
        ) : sitePlans.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border-main mt-4">
            <p className="text-gray font-medium tracking-wide">
              No sites found for this coordinator.
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
