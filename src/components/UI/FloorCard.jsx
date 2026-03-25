import React from 'react';
import { FiArrowRight, FiMap } from 'react-icons/fi';

/**
 * FLOOR CARD
 * Height: 360px (Normalized with OrganizationCard)
 * Grid: 3-Column stats (Matching OrganizationCard/UserCard)
 * Fonts: Standardized 7.5px labels / 15px values
 */
const FloorCard = ({ floor, site, onClick }) => {
  const { level, name, description, stats, status } = floor;

  return (
    <div 
      onClick={onClick}
      className="w-full max-w-[340px] h-[360px] bg-card rounded-[var(--radius-card)] border border-border-main shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col group overflow-hidden cursor-pointer relative"
    >
      
      {/* 1. Header Area (Blueprint Line Art) — Compact 140px height */}
      <div className="h-[140px] bg-card flex items-center justify-center relative border-b border-border-main group-hover:bg-base transition-colors p-4">
        {/* Level Indicator (Top Right) */}
        <div className="absolute top-3 right-3 px-2 py-[2px] bg-card rounded-md text-[9.5px] font-extrabold text-gray shadow-sm border border-border-main uppercase tracking-tighter">
          {level}
        </div>
        
        {/* Placeholder SVG - Line Art */}
        <div className="w-[84px] h-[84px] flex items-center justify-center relative transition-all duration-500">
            <svg className="w-full h-full text-[#1E3A8A] opacity-90 transition-transform duration-500 group-hover:scale-[1.05]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
                <rect x="3" y="4" width="18" height="16" rx="0.5" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <rect x="9" y="11" width="6" height="4" />
                <circle cx="12" cy="13" r="1" />
                <line x1="12" y1="18" x2="12" y2="20" strokeDasharray="1 1" />
            </svg>
        </div>
      </div>

      {/* 2. Body — Exactly matching OrganizationCard font sizes/grid */}
      <div className="p-4 flex-1 flex flex-col">
        
        {/* Typography Section */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-primary tracking-tight leading-none mb-1.5 truncate">
            {name}
          </h3>
          <p className="text-[9px] text-gray font-bold tracking-widest uppercase opacity-80 truncate">
            {description || 'Functional Spaces & Zones'}
          </p>
        </div>

        {/* 3-Column Stats Grid (Standardizing) */}
        <div className="grid grid-cols-3 gap-2 mt-auto mb-6">
          <div className="flex flex-col">
            <p className="text-[7.5px] text-gray uppercase font-bold tracking-wider mb-1 opacity-70">
              Zones
            </p>
            <p className="text-[15px] font-bold text-title leading-none">
              {stats?.zones || 0}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-[7.5px] text-gray uppercase font-bold tracking-wider mb-1 opacity-70">
              Assets
            </p>
            <p className="text-[15px] font-bold text-title leading-none">
              {(stats?.assets || 10).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-[7.5px] text-gray uppercase font-bold tracking-wider mb-1 opacity-70">
              Audits
            </p>
            <p className="text-[15px] font-bold text-title leading-none">
              {stats?.audits || 0}
            </p>
          </div>
        </div>

        {/* Action Button (Style: Managing Entity) */}
        <button className="mt-auto w-full py-2 px-3 bg-base border border-border-main rounded-lg text-[11px] font-bold text-primary hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-2 group/btn">
          <span>View Zone Mapping</span>
          <FiArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>

      </div>
    </div>
  );
};

export default FloorCard;
