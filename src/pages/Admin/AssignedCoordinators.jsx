import React from 'react';
import CoordinatorCard from '../../components/organization/CoordinatorCard';
import PageHeader from '../../components/UI/PageHeader';

const DashboardIcon = <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const FolderIcon = <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;

const coordinatorsData = [
  {
    name: "Siddhika Bishnoi",
    id: "ACME-042",
    status: "ACTIVE",
    sites: 4,
    zones: 10
  },
  {
    name: "Rahul Sharma",
    id: "ACME-089",
    status: "AWAY",
    sites: 2,
    zones: 5
  },
  {
    name: "Priya Mehta",
    id: "ACME-102",
    status: "ACTIVE",
    sites: 6,
    zones: 10
  },
  {
    name: "Arjun Verma",
    id: "ACME-115",
    status: "ACTIVE",
    sites: 3,
    zones: 5
  }
];

const AssignedCoordinators = () => {

  const breadcrumbItems = [
    { label: "Dashboard", path: "/admin", icon: DashboardIcon },
    { label: "Organization Management", path: "/admin/organizations", icon: FolderIcon },
    { label: "Organizations ", path: "/admin/organizations", icon: null },
    { label: " Acme Corp", path: "/admin/coordinators", icon: null, isActive: true }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">

      {/* 1. HEADER (Buttons aur Breadcrumb) */}
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
            Acme Corp: Assigned Coordinators
          </h1>
          <span className="text-[13px] font-medium text-[#6B7280]">
            Showing {coordinatorsData.filter(c => c.status === 'ACTIVE').length} active coordinators
          </span>
        </div>

        {/* Coordinator Cards Container */}
        <div className="w-full flex flex-col gap-4">
          {coordinatorsData.map((coord, index) => (
            <CoordinatorCard key={index} coordinator={coord} />
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-[241.5px] flex items-center justify-center gap-1.5 text-[12px] text-[#9CA3AF] font-medium">
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
