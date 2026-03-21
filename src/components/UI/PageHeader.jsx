import React from 'react';
import Breadcrumb from '../Breadcrumb/Breadcrumb';

const PageHeader = ({ 
  onReset, 
  onApplyFilters, 
  onAdd, 
  addButtonText = "Add New Org",
  hideAddButton = false
}) => {
  return (
    <div className="bg-base border-b border-border-main">
      
      <div className="w-full !px-8 !py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* ACTION BUTTONS (Shifted left or spread as needed) */}
        <div className="flex-1 hidden md:block" />

        {/* 2. ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={onReset}
            className="h-[36px] flex items-center gap-2 px-4 bg-card border border-border-main rounded-lg font-semibold text-[13px] text-body hover:bg-base transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 text-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          
          <button 
            onClick={onApplyFilters}
            className="h-[36px] flex items-center gap-2 px-4 bg-accent border border-transparent rounded-lg font-semibold text-[13px] text-white hover:opacity-90 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Apply Filters
          </button>
          
          {!hideAddButton && (
            <button 
              onClick={onAdd}
              className="h-[36px] flex items-center gap-2 px-4 bg-title border border-transparent rounded-lg font-semibold text-[13px] text-white hover:opacity-90 transition-all shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              {addButtonText}
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default PageHeader;