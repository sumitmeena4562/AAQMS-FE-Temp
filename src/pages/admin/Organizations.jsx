// pages/OrganizationManagement.jsx
import React from 'react';
import OrganizationCard from '../../components/organization/OrganizationCard';

const organizations = [
  {
    name: "Acme Corp",
    industry: "Technology",
    region: "North America",
    coordinators: 2,
    sites: 4,
    floors: 5,
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c"
  },
  {
    name: "Global Logistics",
    industry: "Logistics",
    region: "Europe",
    coordinators: 5,
    sites: 12,
    floors: 8,
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1581091012184-5c9f2f2c5f3c"
  },
  {
    name: "SSISM",
    industry: "Security",
    region: "Asia Pacific",
    coordinators: 1,
    sites: 2,
    floors: 4,
    status: "MAINTENANCE",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e"
  }
];

const Organizations = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 flex flex-col items-center px-4">
      <div className="w-full max-w-[960px]">
        <div className="flex justify-end gap-3 mb-10">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Apply Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Org
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-xl font-bold text-gray-900">
            Select Organization to Manage
          </h1>
          <span className="text-sm text-gray-500 font-medium">
            Showing 3 total organizations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          {organizations.map((org, index) => (
            <OrganizationCard key={index} org={org} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Organizations;