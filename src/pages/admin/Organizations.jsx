import React, { useState } from 'react';
import { RotateCcw, Filter, Plus, ChevronDown } from 'lucide-react';
import OrganizationCard from '../../components/organization/OrganizationCard';

const FilterField = ({ label, options }) => (
  <div className="flex flex-col gap-1.5 w-full sm:w-[150px]">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</label>
    <div className="relative">
      <select className="w-full appearance-none bg-white border border-gray-200 rounded-full px-4 py-2 pr-8 text-[13px] font-semibold text-gray-800 outline-none cursor-pointer hover:border-blue-400 transition-all">
        {options.map(opt => <option key={opt}>{opt}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

const Organizations = () => {
  const [organizations] = useState([
    { id: 1, name: 'Acme Corp', industry: 'TECHNOLOGY', region: 'NORTH AMERICA', status: 'ACTIVE', coordinators: 2, sites: 4, floors: 5, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80' },
    { id: 2, name: 'Global Logistics', industry: 'LOGISTICS', region: 'EUROPE', status: 'ACTIVE', coordinators: 5, sites: 12, floors: 8, image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80' },
    { id: 3, name: 'SSISM', industry: 'SECURITY', region: 'ASIA PACIFIC', status: 'MAINTENANCE', coordinators: 1, sites: 2, floors: 4, image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80' },
    { id: 4, name: 'Nordic Tech', industry: 'SOFTWARE', region: 'EUROPE', status: 'ACTIVE', coordinators: 3, sites: 1, floors: 2, image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80' },
    { id: 5, name: 'Oceanic Trade', industry: 'MARITIME', region: 'ASIA PACIFIC', status: 'INACTIVE', coordinators: 0, sites: 2, floors: 1, image: 'https://images.unsplash.com/photo-1586528116186-b4b609c13ee0?auto=format&fit=crop&q=80' },
  ]);

  return (
    // Wrap the entire page body in a max-w-[1280px] mx-auto container
    <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-8 flex flex-col min-h-full">

      {/* Top Filter & Action Bar - Matches 2nd Image exactly */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 w-full mb-10 pb-6 border-b border-gray-200">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-end gap-4 w-full lg:w-auto">
          <FilterField label="INDUSTRY TYPE" options={["All Industries", "Technology", "Logistics", "Security"]} />
          <FilterField label="ACTIVE STATUS" options={["All Statuses", "Active", "Maintenance", "Inactive"]} />
          <FilterField label="REGION" options={["Global", "North America", "Europe", "Asia Pacific"]} />
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap justify-start lg:justify-end items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
          <button className="text-gray-600 font-bold text-[13px] hover:bg-gray-100 px-5 py-2.5 rounded-full transition-all flex items-center gap-2 border border-gray-200 bg-white shadow-sm">
            <RotateCcw size={14} /> Reset
          </button>
          <button className="px-6 py-2.5 bg-[#2563EB] text-white rounded-full font-bold text-[13px] shadow-sm flex items-center gap-2 hover:bg-blue-600 transition-colors">
            <Filter size={14} fill="currentColor" strokeWidth={0} /> Apply Filters
          </button>
          <button className="px-6 py-2.5 bg-[#0F172A] text-white rounded-full font-bold text-[13px] shadow-sm flex items-center gap-2 hover:bg-slate-800 transition-colors">
            <Plus size={14} strokeWidth={3} /> Add New Org
          </button>
        </div>
      </div>

      {/* Title & Count Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 w-full gap-4">
        <h2 className="text-[22px] font-bold text-slate-900 tracking-tight leading-none">
          Select Organization to Manage
        </h2>
        <p className="text-gray-500 text-[13px] font-medium leading-none">
          Showing {organizations.length} total organizations
        </p>
      </div>

      {/* Responsive Grid: dynamically down to 1 card and up to 5 cards based on screen size as requested */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
        {organizations.map(org => (
          <OrganizationCard key={org.id} org={org} />
        ))}
      </div>

      {/* Footer Info Text */}
      <div className="mt-12 mb-4 flex justify-center w-full">
        <p className="flex items-center gap-2 text-gray-500 text-[12px] font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          AI assists detection. Final approval is human-controlled.
        </p>
      </div>

    </div>
  );
};

export default Organizations;