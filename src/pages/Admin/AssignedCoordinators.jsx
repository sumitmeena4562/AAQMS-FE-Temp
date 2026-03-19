import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CoordinatorCard from '../../components/UI/CoordinatorCard';
import PageHeader from '../../components/UI/PageHeader';
import useUserStore from '../../store/userStore';
import { generateSitePlansForCoordinator } from '../../utils/mockSiteData';

const DashboardIcon = <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const FolderIcon = <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;

const AssignedCoordinators = () => {
  const location = useLocation();
  const selectedOrg = location.state?.org || null;
  const orgName = selectedOrg?.name || "Organization";
  
  const users = useUserStore(state => state.users);
  const fetchUsers = useUserStore(state => state.fetchUsers);

  useEffect(() => {
    // If we land directly here and store is empty, fetch the users
    if (users.length === 0) {
      fetchUsers();
    }
  }, [users.length, fetchUsers]);

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

  const breadcrumbItems = [
    { label: "Dashboard", path: "/admin", icon: DashboardIcon },
    { label: "Organization Management", path: "/admin/organizations", icon: FolderIcon },
    { label: "Organizations", path: "/admin/organizations", icon: null },
    { label: orgName, path: "/admin/coordinators", icon: null, isActive: true }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">

      {/* HEADER */}
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        hideAddButton={true}
        onReset={() => console.log("Reset coordinators")}
        onApplyFilters={() => console.log("Filter coordinators")}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 w-full !px-8 !py-4 flex flex-col">

        {/* Page Title & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between !mb-6 gap-4">
          <h1 className="text-[20px] font-bold text-[#111827] leading-none tracking-tight">
            {orgName}: Assigned Coordinators
          </h1>
          <span className="text-[13px] font-medium text-[#6B7280]">
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
