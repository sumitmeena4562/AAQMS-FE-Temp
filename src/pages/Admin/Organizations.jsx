import React, { useState, useEffect } from 'react';
import OrganizationCard from '../../components/organization/OrganizationCard';
import PageHeader from '../../components/UI/PageHeader';
import CreateOrganization from '../../components/organization/CreateOrganization';
import { useOrgStore } from '../../store/useOrgStore';
import useUserStore from '../../store/userStore';

const DashboardIcon = <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const FolderIcon = <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const OrgIcon = <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;

const Organizations = () => {
  const orgs = useOrgStore(state => state.orgs);
  const addOrg = useOrgStore(state => state.addOrg);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = useUserStore(state => state.fetchUsers);
  const users = useUserStore(state => state.users);

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, [users.length, fetchUsers]);

  const breadcrumbItems = [
    { label: "Dashboard", path: "/admin", icon: DashboardIcon },
    { label: "Organization Management", path: "/admin/organizations", icon: FolderIcon },
    { label: "Organizations", path: "/admin/organizations", icon: OrgIcon, isActive: true }
  ];

  const handleCreateOrganization = (newOrg) => {
    addOrg(newOrg);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      
      {/* 1. HEADER (Buttons aur Breadcrumb) */}
      <PageHeader 
        breadcrumbItems={breadcrumbItems}
        addButtonText="Add New Org" 
        onReset={() => console.log("Reset")}
        onApplyFilters={() => console.log("Filter")}
        onAdd={() => setIsModalOpen(true)}
      />

      {/* 2. MAIN BODY */}
      <div className="w-full !px-8 pb-12 !pt-0">
        
        {/* YAHAN HAI HEADING AUR TEXT */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 !pt-8 !mb-6">
          <h1 className="text-[24px] font-bold text-gray-900 leading-none">
            Select Organization to Manage
          </h1>
          <span className="text-[13px] font-medium text-gray-500 mb-0.5">
            Showing {orgs.length} total organizations
          </span>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {orgs.map((item, index) => (
            <div key={item.id || index} className="w-full max-w-[340px]">
              <OrganizationCard org={item} />
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-16 flex items-center justify-center gap-1.5 text-xs text-gray-400 font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          AI assists detection. Final approval is human-controlled.
        </div>

      </div>

      {/* Create Organization Modal */}
      {isModalOpen && (
        <CreateOrganization 
          onSubmit={handleCreateOrganization} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default Organizations;