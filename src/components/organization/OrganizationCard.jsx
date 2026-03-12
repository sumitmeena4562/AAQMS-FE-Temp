import React from 'react';
import { ArrowRight } from 'lucide-react';

const OrganizationCard = ({ org }) => {
  const isMaintenance = org?.status === 'MAINTENANCE' || org?.status?.toLowerCase() === 'maintenance';

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden h-full">
      <div className="relative w-full h-48 bg-gray-100">
        <img 
          src={org?.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=500'} 
          className="w-full h-full object-cover" 
          alt={org?.name || 'Organization image'} 
        />
        <div className={`absolute top-3 right-3 px-2 py-1 bg-white rounded text-[10px] font-bold shadow ${isMaintenance ? 'text-orange-500' : 'text-green-500'}`}>
          {org?.status || 'ACTIVE'}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 mt-2">{org?.name}</h3>
        <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-1 mb-6">
          {org?.industry} &bull; {org?.region}
        </p>

        <div className="flex justify-between items-center w-full mb-6 px-2">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">COORDS</span>
            <span className="text-lg font-bold text-gray-900 mt-1">{org?.coords || 0}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">TOTAL S.</span>
            <span className="text-lg font-bold text-gray-900 mt-1">{org?.totalSites || 0}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">FLOOR</span>
            <span className="text-lg font-bold text-gray-900 mt-1">{org?.floors || 0}</span>
          </div>
        </div>

        <button className="mt-auto w-full flex justify-center items-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors text-gray-900">
          Select Organization <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default OrganizationCard;