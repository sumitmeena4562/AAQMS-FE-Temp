import React from 'react';
import { ArrowRight } from 'lucide-react';

const OrganizationCard = ({ org }) => {
  const isMaintenance = org?.status === 'MAINTENANCE' || org?.status?.toLowerCase() === 'maintenance';

  return (
    <div className="group flex flex-col bg-white rounded-[24px] border border-gray-100 shadow-sm hover:shadow-lg transition-all h-full overflow-hidden">
      <div className="h-[220px] w-full shrink-0 overflow-hidden relative">
        <img src={org?.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" />
        <div className={`absolute top-4 right-4 px-2.5 py-1 ${isMaintenance ? 'bg-[#FFF3CD] text-[#856404]' : 'bg-[#DCFCE7] text-[#166534]'} rounded-md text-[9px] font-bold uppercase tracking-widest`}>
          {org?.status || 'ACTIVE'}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-1">{org?.name}</h3>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
          {org?.industry} • {org?.region}
        </p>

        {/* Stats Section: 3 clean columns (Left, Center, Right aligned) */}
        <div className="flex justify-between items-center mb-6 px-1">
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">COORD...</span>
            <span className="text-xl font-bold text-slate-800 leading-none">{org?.coordinators || 0}</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">TOTAL S...</span>
            <span className="text-xl font-bold text-slate-800 leading-none">{org?.sites || 0}</span>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">FLOOR</span>
            <span className="text-xl font-bold text-slate-800 leading-none">{org?.floors || 0}</span>
          </div>
        </div>

        {/* mt-auto ensures the button is always precisely at the bottom */}
        <button className="mt-auto w-full py-3 border border-gray-200 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-all">
          Select Organization <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default OrganizationCard;