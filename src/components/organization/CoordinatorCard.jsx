import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getInitials } from '../../utils/avatarInitials';
import { useNavigate } from 'react-router-dom';

const CoordinatorCard = ({ coordinator, orgName }) => {
  const { name, id, status, sites, zones, image } = coordinator;
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between !p-2 px-8 bg-white border border-[#E5E7EB] rounded-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200 gap-6">
      {/* Left Section (Avatar, Name, Status) */}
      <div className="flex items-center gap-5 w-full md:w-[350px] shrink-0">

        {/* Scaled up the Avatar Wrapper for Figma accuracy */}
        <div className="relative w-[56px] h-[56px] flex-shrink-0">
          {image ? (
            <img src={image} alt={name} className="w-full h-full rounded-full object-cover border border-gray-100" />
          ) : (
            <div className="w-full h-full flex flex-shrink-0 items-center justify-center rounded-full bg-[#f0f4ff] text-[#1D4ED8] font-bold text-[20px]">
              {getInitials(name)}
            </div>
          )}
          {/* Status dot pushed precisely onto the boundary stroke */}
          {status === 'ACTIVE' && (
            <div className="absolute bottom-0 right-[2px] w-[15px] h-[15px] bg-[#22c55e] border-2 border-white rounded-full"></div>
          )}
          {status === 'AWAY' && (
            <div className="absolute bottom-0 right-[2px] w-[15px] h-[15px] bg-[#f59e0b] border-2 border-white rounded-full"></div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          {/* Increased typography dynamically to match Figma headers */}
          <h3 className="font-bold text-[18px] text-[#111827] mb-1 leading-tight">{name}</h3>
          <span className="text-[#6B7280] text-[13px] font-medium mb-1.5 uppercase tracking-wide">ID: {id}</span>

          <div className="flex items-center">
            {/* Accurate padding and rounded-full without borders! bg colors matching screenshot perfectly */}
            <span
              className={`px-3 py-[4px] rounded-full text-[11px] uppercase font-bold tracking-widest ${status === 'ACTIVE'
                ? 'bg-[#dcfce7] text-[#166534]'
                : 'bg-[#ffedd5] text-[#9a3412]'
                }`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Center Section (Stats columns strictly aligned to grid) */}
      <div className="flex items-center w-[300px] shrink-0 gap-8">
        <div className="flex flex-col w-[120px]">
          <span className="text-[#9CA3AF] text-[11px] font-bold uppercase tracking-widest mb-1.5">
            Managed Sites
          </span>
          <div className="flex items-baseline leading-none">
            {/* Huge dynamic fonts for data mapping exactly what user wanted */}
            <span className="font-bold text-[32px] text-[#111827]">{sites}</span>
            <span className="text-[#6B7280] text-[15px] font-medium ml-1.5">Sites</span>
          </div>
        </div>
        <div className="flex flex-col w-[120px]">
          <span className="text-[#9CA3AF] text-[11px] font-bold uppercase tracking-widest mb-1.5">
            Total Zone
          </span>
          <div className="font-bold text-[32px] text-[#111827] leading-none">
            {zones}
          </div>
        </div>
      </div>

      {/* Right Section (View Site Plans Button) */}
      <div className="w-full md:w-auto flex flex-1 justify-end shrink-0">
        <button 
          onClick={() => navigate('/admin/site-plan', { state: { orgName, coordinator } })}
          className="flex items-center justify-center gap-[6px] w-[131px] px-[14px] py-[6px] text-[12px] font-semibold text-[#111827] bg-white border border-[#D1D5DB] rounded-[24px] hover:bg-[#F9FAFB] transition-colors whitespace-nowrap"
        >
          View Site Plans
          <ArrowRight className="w-3.5 h-3.5 text-[#111827]" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default CoordinatorCard;
