import React from 'react';
import { useLocation } from 'react-router-dom';
import OrganizationCard from '../../components/UI/OrganizationCard';
import PageHeader from '../../components/UI/PageHeader';

import useUserStore from '../../store/userStore';
import { generateSitePlansForCoordinator } from '../../utils/mockSiteData';

import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import { FiHome, FiBriefcase } from 'react-icons/fi';

const SitePlan = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orgName = location.state?.orgName || params.get('org') || "Organization";
  const coordName = location.state?.coordinator?.name || params.get('coord') || "Coordinator";

  const users = useUserStore(state => state.users);
  const fetchUsers = useUserStore(state => state.fetchUsers);
  const { setBreadcrumbs } = useBreadcrumb();

  const breadcrumbs = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
    { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
    { label: orgName, path: `/admin/coordinators?org=${encodeURIComponent(orgName)}` },
    { label: coordName, path: location.pathname + location.search, isActive: true }
  ];

  React.useEffect(() => {
    if (users.length === 0) fetchUsers();
    // Breadcrumbs managed by PageHeader
  }, [users.length, fetchUsers, orgName, coordName, location.pathname, location.search]);

  const matchedUser = users.find(u => u.name === coordName && u.organization === orgName);

  const coordinator = location.state?.coordinator || (matchedUser ? {
    name: matchedUser.name,
    sitePlans: generateSitePlansForCoordinator(matchedUser.id)
  } : { name: coordName, sitePlans: [] });

  const sitePlans = coordinator.sitePlans || [];

  const totalPlans = sitePlans.length;
  const activePlansCount = sitePlans.filter(p => p.status === 'ACTIVE').length;

  return (
    <div className="flex flex-col font-sans h-full">

      {/* HEADER */}
      <PageHeader
        title="Site Plan Selection"
        subtitle={`Managing ${activePlansCount} active site plans for ${coordName}`}
        breadcrumbs={breadcrumbs}
        hideAddButton={true}
        rightContent={
            <span className="text-[10px] font-black text-gray uppercase tracking-widest bg-base/50 px-3 py-1.5 rounded-lg border border-border-main/50">
                {totalPlans} Total Projects
            </span>
        }
      />

      {/* MAIN BODY */}
      <main className="flex-1 w-full pb-12 flex flex-col pt-4 sm:pt-6">

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {sitePlans.map((item, index) => (
            <div key={item.id || index} className="w-full max-w-[340px]">
              {/* Reuse OrganizationCard with isSiteCard flag */}
              <OrganizationCard
                org={item}
                isSiteCard={true}
                coordinatorContext={coordinator}
              />
            </div>
          ))}
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

export default SitePlan;
