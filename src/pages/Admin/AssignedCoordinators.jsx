import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CoordinatorCard from '../../components/UI/CoordinatorCard';
import PageHeader from '../../components/UI/PageHeader';
import FilterBar from '../../components/UI/FilterBar';
import { useFilterStore } from '../../store/useFilterStore';
import { useHierarchy } from '../../hooks/api/useHierarchy';
import CardSkeleton from '../../components/UI/CardSkeleton';
import Button from '../../components/UI/Button';
import { FiHome, FiBriefcase, FiGrid, FiList, FiInbox } from 'react-icons/fi';

const AssignedCoordinators = () => {
  const location = useLocation();
  const [view, setView] = React.useState('list');
  const [currentPage, setCurrentPage] = React.useState(1);
  const { selectedOrg, setOrg } = useFilterStore();
  
  // --- QUERY HOOKS (UNIFIED) ---
  const { organizations: orgs, coordinators: coordinatorsListRaw, isLoading } = useHierarchy({ includeSites: false });

  const passedOrgName = location.state?.org?.name || new URLSearchParams(location.search).get('org');
  const orgInfo = selectedOrg.length === 1 ? orgs.find(o => String(o.id) === String(selectedOrg[0])) : null;
  
  // Robust Name Protection: If the passed current org looks like a personnel name, set to 'Organisation'
  const finalOrgName = selectedOrg.length > 1 ? `Multiple Organizations` : (orgInfo?.name || (passedOrgName && !passedOrgName.includes(" ") ? passedOrgName : "Organisation"));
  const orgName = finalOrgName === "Organisation" && passedOrgName ? passedOrgName : finalOrgName;

  const isOrgSelected = !!(selectedOrg.length > 0 || passedOrgName);

  const breadcrumbs = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
    { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
    { label: orgName, path: "#", isActive: true }
  ];

  // URL → Store sync (mount-only)
  useEffect(() => {
    if (selectedOrg.length === 0 && passedOrgName && orgs.length > 0) {
      const match = orgs.find(o => o.name.toLowerCase() === passedOrgName.toLowerCase());
      if (match) setOrg(match.id);
    }
  }, [orgs, selectedOrg.length, passedOrgName, setOrg]); 

  // fetchUsers effect removed - handled by useCoordinators query hook

  const coordinatorsList = coordinatorsListRaw.map(user => {
    // Backend already returns pre-filtered coordinators for the given org
    const totalSites = user.coordinator_profile?.total_sites ?? user.total_sites ?? 0;
    const totalZones = user.coordinator_profile?.total_zones ?? user.total_zones ?? 0;

    return {
      name: user.name,
      id: user.employee_id || `COORD-${user.id.toString().substring(0, 4)}`,
      status: user.status === 'active' ? 'ACTIVE' : 'AWAY',
      sites: totalSites,
      zones: totalZones,
      image: user.avatar || null
    };
  });

  const activeCoordinatorsCount = coordinatorsList.filter(c => c.status === 'ACTIVE').length;

  return (
    <div className="flex flex-col font-sans h-full">

      {/* HEADER */}
      <PageHeader
        title={`${orgName}: Assigned Coordinators`}
        subtitle={isOrgSelected ? `Managing ${activeCoordinatorsCount} active platform coordinators for this entity` : "Please use the filter bar to select an organization"}
        breadcrumbs={breadcrumbs}
        hideAddButton={true}
        rightContent={
          isOrgSelected ? (
            <span className="text-[10px] font-black text-gray uppercase tracking-widest bg-base/50 px-3 py-1.5 rounded-lg border border-border-main/50">
                {coordinatorsList.length} Total Users
            </span>
          ) : null
        }
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 w-full pb-12 flex flex-col pt-4 sm:pt-6">
        <FilterBar activeLevel="coordinators" />

        {!isOrgSelected ? (
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
              {isLoading ? (
                <CardSkeleton count={6} columns={3} />
              ) : coordinatorsList.length > 0 ? (
                <>
                  {coordinatorsList.slice((currentPage - 1) * 10, currentPage * 10).map((coord, index) => (
                    <CoordinatorCard key={index} coordinator={coord} orgName={orgName} view={view} />
                  ))}
                  
                  {coordinatorsList.length > 10 && (
                    <div className="flex items-center justify-between px-6 py-4 bg-card border border-border-main rounded-2xl shadow-sm mt-6 col-span-full">
                      <span className="text-[10px] font-black text-gray uppercase tracking-widest">
                        Page {currentPage} of {Math.ceil(coordinatorsList.length / 10)}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="!h-9 !px-4 !text-[10px] !font-black !uppercase">Previous</Button>
                        <Button variant="outline" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= Math.ceil(coordinatorsList.length / 10)} className="!h-9 !px-6 !text-[10px] !font-black !uppercase">Next</Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full flex flex-col items-center justify-center py-24 bg-card/40 rounded-3xl border-2 border-dashed border-border-main col-span-full animate-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-base rounded-2xl flex items-center justify-center mb-5 -rotate-3">
                    <FiInbox className="w-7 h-7 text-gray/40" />
                  </div>
                  <h3 className="text-xl font-black text-title mb-2">No Personnel Records</h3>
                  <p className="text-gray text-xs mb-8 text-center max-w-sm px-6 font-medium leading-relaxed">
                    No users assigned to this organization yet. 
                    <br />Go to User Management to create and assign users.
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
