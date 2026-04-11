import React from 'react';
import { ArrowRight, Map } from 'lucide-react';
import { getInitials } from '../../utils/avatarInitials';
import { useNavigate } from 'react-router-dom';

const CoordinatorCard = ({ coordinator, orgName, view = 'list' }) => {
  const { name, id, status, sites, zones, image } = coordinator;
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/admin/site-plan?org=${encodeURIComponent(orgName)}&coord=${encodeURIComponent(coordinator.name)}`, { state: { orgName, coordinator } });
  };

  if (view === 'grid') {
    return (
      <div className="w-full elite-card elite-card-hover flex flex-col group overflow-hidden relative p-6 cursor-pointer" onClick={handleNavigate}>

        {/* Top: Avatar & Status (Center) */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-[64px] h-[64px] shrink-0 mb-3">
            {image ? (
              <img src={image} alt={name} className="w-full h-full rounded-full object-cover border border-slate-200" />
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded-full bg-[#f0f4ff] text-[#1D4ED8] font-bold text-[22px]">
                {getInitials(name)}
              </div>
            )}
            {/* Sole Status Indicator */}
            {status === 'ACTIVE' && (
              <div className="absolute bottom-0 right-1 w-4 h-4 bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.4)] border-2 border-white rounded-full"></div>
            )}
            {status === 'AWAY' && (
              <div className="absolute bottom-0 right-1 w-4 h-4 bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.4)] border-2 border-white rounded-full"></div>
            )}
          </div>

          <h3 className="font-bold text-[18px] text-title leading-tight mb-3 text-center">{name}</h3>

          {/* SYSTEM ID Field */}
          <div className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-gray uppercase tracking-widest mb-0.5">ID</span>
            <span className="text-[13px] font-bold text-slate-800">{id}</span>
          </div>
        </div>

        {/* Dynamic Blue-Hover Metrics strictly matching FloorCard */}
        <div className="flex items-center justify-between gap-3 mb-6 mt-auto">
          <div className="flex-1 bg-gray-50 rounded-[16px] py-4 px-2 flex flex-col items-center justify-center group-hover:bg-blue-50 transition-colors border border-transparent">
            <span className="text-[12px] font-bold text-body group-hover:text-blue-500 uppercase tracking-[0.15em] mb-1.5 transition-colors text-center">
              MNG. SITES
            </span>
            <span className="text-2xl font-bold text-title leading-none group-hover:text-blue-800 transition-colors">
              {sites}
            </span>
          </div>
          <div className="flex-1 bg-gray-50 rounded-[16px] py-4 px-2 flex flex-col items-center justify-center group-hover:bg-blue-50 transition-colors border border-transparent">
            <span className="text-[12px] font-bold text-body group-hover:text-blue-500 uppercase tracking-[0.15em] mb-1.5 transition-colors text-center">
              TOTAL ZONE
            </span>
            <span className="text-2xl font-bold text-title leading-none group-hover:text-blue-800 transition-colors">
              {zones}
            </span>
          </div>
        </div>

        {/* Action Button matching FloorCard */}
        <button
          onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
          className="mt-auto w-full py-[14px] px-4 bg-card border border-border-main rounded-2xl text-[14px] font-semibold text-primary flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all overflow-hidden relative"
        >
          <span className="relative z-10 transition-colors">View Site Plans</span>
          <ArrowRight className="w-[18px] h-[18px] ml-2 text-gray group-hover:opacity-0 absolute right-5 transition-all" strokeWidth={2} />
          <Map className="w-[18px] h-[18px] ml-2 text-white opacity-0 group-hover:opacity-100 absolute right-5 transition-all" strokeWidth={2} />
        </button>
      </div>
    );
  }

  // --- DEFAULT LIST VIEW (Horizontal Compact Table) ---
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between py-4 px-8 elite-card elite-card-hover gap-6">

      {/* 1. Avatar + Name Column */}
      <div className="flex items-center gap-4 min-w-[200px] shrink-0">
        <div className="relative w-[48px] h-[48px] flex-shrink-0">
          {image ? (
            <img src={image} alt={name} className="w-full h-full rounded-full object-cover border border-gray-100" />
          ) : (
            <div className="w-full h-full flex flex-shrink-0 items-center justify-center rounded-full bg-[#f0f4ff] text-[#1D4ED8] font-bold text-[18px]">
              {getInitials(name)}
            </div>
          )}
          {/* Sole Status Indicator */}
          {status === 'ACTIVE' && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.4)] border-2 border-white rounded-full"></div>
          )}
          {status === 'AWAY' && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.4)] border-2 border-white rounded-full"></div>
          )}
        </div>
        <h3 className="font-bold text-[16px] text-primary leading-tight truncate">{name}</h3>
      </div>

      {/* 2. ID Column */}
      <div className="flex flex-col justify-center min-w-[100px] shrink-0">
        <span className="text-gray text-[10px] font-bold uppercase tracking-widest mb-1.5 mt-0.5">
          ID
        </span>
        <span className="font-bold text-[14px] text-slate-800 uppercase tracking-wide">{id}</span>
      </div>

      {/* 3. Managed Sites Column */}
      <div className="flex flex-col justify-center min-w-[110px] shrink-0">
        <span className="text-gray text-[10px] font-bold uppercase tracking-widest mb-1.5 mt-0.5">
          Managed Sites
        </span>
        <span className="font-bold text-[14px] text-slate-800 uppercase tracking-wide">{sites}</span>
      </div>

      {/* 4. Total Zone Column */}
      <div className="flex flex-col justify-center min-w-[100px] shrink-0">
        <span className="text-gray text-[10px] font-bold uppercase tracking-widest mb-1.5 mt-0.5">
          Total Zone
        </span>
        <span className="font-bold text-[14px] text-slate-800 uppercase tracking-wide">{zones}</span>
      </div>

      {/* 5. Action Button Column */}
      <div className="flex justify-end shrink-0">
        <button
          onClick={handleNavigate}
          className="flex items-center justify-center gap-[6px] w-[140px] px-[14px] py-[8px] text-[12px] font-semibold text-primary bg-card border border-border-main rounded-full hover:bg-base transition-colors whitespace-nowrap group"
        >
          View Site Plans
          <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default CoordinatorCard;
