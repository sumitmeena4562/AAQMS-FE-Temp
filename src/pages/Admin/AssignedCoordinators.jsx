import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CoordinatorCard from '../../components/UI/CoordinatorCard';
import PageHeader from '../../components/UI/PageHeader';
import useUserStore from '../../store/userStore';
import { generateSitePlansForCoordinator } from '../../utils/mockSiteData';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import { FiHome, FiBriefcase, FiGrid } from 'react-icons/fi';

const AssignedCoordinators = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orgName = location.state?.org?.name || params.get('org') || "Organization";

  const users = useUserStore(state => state.users);
  const fetchUsers = useUserStore(state => state.fetchUsers);

  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    // 1. Fetch users if needed
    if (users.length === 0) {
      fetchUsers();
    }

    // 2. Set Global Premium Breadcrumbs for this page
    setBreadcrumbs([
      { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
      { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
      { label: orgName, path: location.pathname + location.search, isActive: true }
    ]);
  }, [users.length, fetchUsers, orgName, setBreadcrumbs, location.pathname, location.search]);

  // Derived logic from User Management:
  // We grab everyone matching this organization.
  // The User table has 'role', 'status' ('active' / 'inactive'), etc.
  const orgUsers = users.filter(u => u.organization === orgName);

  const coordinatorsList = orgUsers.map(user => {
    const plans = generateSitePlansForCoordinator(user.id);
    const totalZones = plans.reduce((acc, plan) => acc + plan.stats.zones, 0);

    return {
      name: user.name,
      id: `USER-${user.id.toString().padStart(3, '0')}`,
      status: user.status === 'active' ? 'ACTIVE' : 'AWAY', // Maps status UI
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
        hideAddButton={true}
        onReset={() => console.log("Reset coordinators")}
        onApplyFilters={() => console.log("Filter coordinators")}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 w-full pb-12 flex flex-col pt-4 sm:pt-6">

        {/* Page Title & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-primary leading-none tracking-tight">
            {orgName}: Assigned Coordinators
          </h1>
          <span className="text-sm font-medium text-secondary">
            Showing {activeCoordinatorsCount} active coordinators
          </span>
        </div>

        {/* Coordinator Cards Container */}
        <div className="w-full flex flex-col gap-4">
          {coordinatorsList.length > 0 ? (
            coordinatorsList.map((coord, index) => (
              <CoordinatorCard key={index} coordinator={coord} orgName={orgName} />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500 font-medium tracking-wide">
                No users assigned to this organization yet.
                <br /><span className="text-xs text-gray-400 mt-2 block">Go to User Management to create and assign users.</span>
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-12 pb-6 flex items-center justify-center gap-1.5 text-[12px] text-[#9CA3AF] font-medium">
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
