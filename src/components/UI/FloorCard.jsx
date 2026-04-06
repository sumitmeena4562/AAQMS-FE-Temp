import React from 'react';
import { ArrowRight, Map } from 'lucide-react';

/**
 * FLOOR CARD
 * Height: 360px (Normalized with OrganizationCard)
 * Grid: 3-Column stats (Matching OrganizationCard/UserCard)
 * Fonts: Standardized 7.5px labels / 15px values
 */
const FloorCard = ({ floor, site, onClick }) => {
  const { level, name, description, status, zones_count, inventory_count } = floor;
  const siteName = site?.name || floor.site_name || 'Generic Site';

  return (
    <div
      onClick={onClick}
      className="w-full max-w-[304px] h-[440px] bg-card rounded-[var(--radius-card)] border border-border-main shadow-card hover:border-blue-600 hover:shadow-card-hover transition-all duration-300 flex flex-col group overflow-hidden cursor-pointer relative"
    >

      {/* Visual Image Area (Blue Line Art Style Placeholder) */}
      <div className="h-[180px] bg-card flex items-center justify-center relative border-b border-border-main group-hover:bg-base transition-colors p-6">
        <div className="absolute top-3 right-3 px-2 py-[2px] bg-card rounded-md text-[11px] font-bold text-gray shadow-sm border border-border-main uppercase">
          {level}
        </div>

        {/* Placeholder SVG - simulating the line art map */}
        <div className="w-[100px] h-[100px] flex items-center justify-center relative transition-all duration-500">
          {/* Static SVG matching the mockup styling */}
          <svg className="w-full h-full text-[#1E3A8A] opacity-90 transition-transform duration-500 group-hover:scale-[1.03]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
            {/* Simple boxy representation of floor plan */}
            <rect x="3" y="4" width="18" height="16" rx="0.5" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <rect x="9" y="11" width="6" height="4" />
            <circle cx="12" cy="13" r="1" />
            <line x1="12" y1="18" x2="12" y2="20" strokeDasharray="1 1" />
          </svg>
        </div>
      </div>

      {/* Body Content Area */}
      <div className="p-6 flex-1 flex flex-col pt-8">

        <div className="flex flex-col mb-1.5">
          {siteName && (
            <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-1.5">
              {siteName}
            </span>
          )}
          <h3 className="text-xl font-bold text-title leading-tight">
            {name}
          </h3>
        </div>
        {status === 'ACTIVE' && (
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)] absolute top-40 right-6"></span>
        )}

        <p className="text-[12px] text-body font-medium mb-6 leading-relaxed line-clamp-2">
          {description || 'Functional Spaces & Zones'}
        </p>

        <div className="flex items-center justify-between gap-3 mb-auto">
          <div className="flex-1 bg-gray-50 rounded-[16px] py-4 px-2 flex flex-col items-center justify-center group-hover:bg-blue-50 transition-colors border border-transparent">
            <span className="text-[10px] font-bold text-body group-hover:text-blue-500 uppercase tracking-[0.15em] mb-1.5 transition-colors">
              ZONES
            </span>
            <span className="text-2xl font-bold text-title leading-none group-hover:text-blue-800 transition-colors">
              {zones_count || 0}
            </span>
          </div>
          <div className="flex-1 bg-gray-50 rounded-[16px] py-4 px-2 flex flex-col items-center justify-center group-hover:bg-blue-50 transition-colors border border-transparent">
            <span className="text-[10px] font-bold text-body group-hover:text-blue-500 uppercase tracking-[0.15em] mb-1.5 transition-colors">
              ASSETS
            </span>
            <span className="text-2xl font-bold text-title leading-none group-hover:text-blue-800 transition-colors">
              {inventory_count || 0}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button className="mt-6 w-full py-[12px] px-4 bg-card border border-border-main rounded-2xl text-[13px] font-semibold text-primary flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all overflow-hidden relative">
          <span className="relative z-10 transition-colors">View Zone Mapping</span>
          <ArrowRight className="w-[16px] h-[16px] ml-2 text-gray group-hover:opacity-0 absolute right-4 transition-all" strokeWidth={2} />
          <Map className="w-[16px] h-[16px] ml-2 text-white opacity-0 group-hover:opacity-100 absolute right-4 transition-all" strokeWidth={2} />
        </button>

      </div>
    </div>
  );
};

export default FloorCard;
