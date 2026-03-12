import React, { useState } from 'react';
import { RotateCcw, Filter, Plus, Bot } from 'lucide-react';
import OrganizationCard from '../../components/organization/OrganizationCard';

const Organizations = () => {
  const [organizations] = useState([
    { id: 1, name: 'Acme Corp', industry: 'TECHNOLOGY', region: 'NORTH AMERICA', status: 'ACTIVE', coords: 2, totalSites: 4, floors: 5, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=500' },
    { id: 2, name: 'Global Logistics', industry: 'LOGISTICS', region: 'EUROPE', status: 'ACTIVE', coords: 5, totalSites: 12, floors: 8, image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=500' },
    { id: 3, name: 'SSISM', industry: 'SECURITY', region: 'ASIA PACIFIC', status: 'MAINTENANCE', coords: 1, totalSites: 2, floors: 4, image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=500' },
  ]);

  return (
    <div className="w-full flex-1 p-6 md:p-8 bg-gray-50">
      
      {/* Top Action Row */}
      <div className="flex justify-between items-center w-full mb-8">
        <div className="text-slate-400 text-sm font-medium">
          &gt; Organizations
        </div>
        
        <div className="flex gap-3 items-center">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <RotateCcw size={16} /> Reset
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm">
            <Filter size={16} fill="currentColor" strokeWidth={0} /> Apply Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] rounded-lg text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm">
            <Plus size={16} strokeWidth={3} /> Add New Org
          </button>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex justify-between items-end w-full mb-6">
        <h2 className="text-xl font-bold text-gray-900">Select Organization to Manage</h2>
        <span className="text-sm text-gray-500 font-medium">Showing {organizations.length} total organizations</span>
      </div>

      {/* The Card Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map(org => (
          <OrganizationCard key={org.id} org={org} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-xs text-gray-400 flex justify-center items-center gap-2">
        <Bot size={14} className="text-gray-400" />
        AI assists detection. Final approval is human-controlled.
      </div>
      
    </div>
  );
};

export default Organizations;