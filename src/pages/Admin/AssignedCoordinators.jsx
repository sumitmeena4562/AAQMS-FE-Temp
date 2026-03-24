import React, { useEffect } from 'react';
import CoordinatorCard from '../../components/UI/CoordinatorCard';
import PageHeader from '../../components/UI/PageHeader';
import FilterBar from '../../components/UI/FilterBar';
import useUserStore from '../../store/userStore';
import { useFilterStore } from '../../store/useFilterStore';
import { organizations } from '../../data/mockFilterData';
import { generateSitePlansForCoordinator } from '../../utils/mockSiteData';
import { FiHome, FiBriefcase, FiGrid, FiList } from 'react-icons/fi';

const AssignedCoordinators = () => {
  const [view, setView] = React.useState('list');
  const { selectedOrg } = useFilterStore();
  const orgInfo = selectedOrg ? organizations.find(o => o.id === selectedOrg) : null;
  const orgName = orgInfo?.name || "Organization";

  const users = useUserStore(state => state.users);
  const fetchUsers = useUserStore(state => state.fetchUsers);

  const breadcrumbs = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
    { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
    { label: orgName, path: "#", isActive: true }
  ];

  useEffect(() => {
    if (users.length === 0) fetchUsers();
  }, [users.length, fetchUsers]);

  const orgUsers = selectedOrg ? users.filter(u => u.organization === orgName) : [];

  const coordinatorsList = orgUsers.map(user => {
    const plans = generateSitePlansForCoordinator(user.id, user.organization);
    const totalZones = plans.reduce((acc, plan) => acc + plan.stats.zones, 0);

    return {
      name: user.name,
      id: `USER-${user.id.toString().padStart(3, '0')}`,
      status: user.status === 'active' ? 'ACTIVE' : 'AWAY',
      sites: plans.length,
      zones: totalZones,
      sitePlans: plans,
      image: null
    };
  });

  const activeCoordinatorsCount = coordinatorsList.filter(c => c.status === 'ACTIVE').length;

  return (
    <div className="flex flex-col font-sans h-full">

      {/* HEADER */}
      <PageHeader
        title={`${orgName}: Assigned Coordinators`}
        subtitle={selectedOrg ? `Managing ${activeCoordinatorsCount} active platform coordinators for this entity` : "Please use the filter bar to select an organization"}
        breadcrumbs={breadcrumbs}
        hideAddButton={true}
        rightContent={
          selectedOrg ? (
            <span className="text-[10px] font-black text-gray uppercase tracking-widest bg-base/50 px-3 py-1.5 rounded-lg border border-border-main/50">
                {coordinatorsList.length} Total Users
            </span>
          ) : null
        }
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 w-full pb-12 flex flex-col pt-4 sm:pt-6">
        <FilterBar activeLevel="coordinators" />

        {!selectedOrg ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border-main mt-4">
            <p className="text-gray font-medium tracking-wide">
              Please select an Organization to view assigned coordinators.
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col mb-4">
            <div className="flex justify-end mb-4 pr-1">
              <div className="flex items-center bg-base border border-border-main p-1 rounded-lg">
                <button 
                  onClick={() => setView('list')}
                  className={`p-1.5 rounded-md transition-all duration-200 ${view === 'list' ? 'bg-white shadow-[0_2px_8px_rgba(7,34,103,0.08)] text-primary' : 'text-gray hover:text-primary'}`}
                  title="List View"
                >
                  <FiList size={15} strokeWidth={2.5} />
                </button>
                <button 
                  onClick={() => setView('grid')}
                  className={`p-1.5 rounded-md transition-all duration-200 ${view === 'grid' ? 'bg-white shadow-[0_2px_8px_rgba(7,34,103,0.08)] text-primary' : 'text-gray hover:text-primary'}`}
                  title="Grid View"
                >
                  <FiGrid size={15} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
              {coordinatorsList.length > 0 ? (
                coordinatorsList.map((coord, index) => (
                  <CoordinatorCard key={index} coordinator={coord} orgName={orgName} view={view} />
                ))
              ) : (
                <div className="text-center py-12 bg-card rounded-lg border border-border-main col-span-full">
                  <p className="text-gray font-medium tracking-wide">
                    No users assigned to this organization yet.
                    <br /><span className="text-xs text-gray/60 mt-2 block">Go to User Management to create and assign users.</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-auto pt-12 pb-6 flex items-center justify-center gap-1.5 text-[12px] text-gray font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          AI assists detection. Final approval is human-controlled.
        </div>
      </main>
    </div>
  );
};

export default AssignedCoordinators;
