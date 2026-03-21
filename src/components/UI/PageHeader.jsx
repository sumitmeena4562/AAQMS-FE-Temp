import React from 'react';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import Button from './Button';

const PageHeader = ({ 
  title,
  subtitle,
  rightContent,
  onReset, 
  onApplyFilters, 
  onAdd, 
  addButtonText = "Add New",
  hideAddButton = true,
  className = ""
}) => {
  return (
    <div className={`bg-base border-b border-border-main ${className}`}>
      <div className="w-full px-4 sm:px-8 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* 1. TITLE & SUBTITLE */}
        {title && (
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-black text-title leading-tight tracking-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <div className="text-[12px] sm:text-[13px] font-semibold text-body leading-tight">
                {subtitle}
              </div>
            )}
          </div>
        )}

        {/* 2. ACTION CONTENT / BUTTONS */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Custom Right Content Area */}
          {rightContent && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              {rightContent}
            </div>
          )}

          {/* Standardized Actions (if provided) */}
          {(onReset || onApplyFilters || onAdd) && (
            <div className="flex items-center gap-2">
              {onReset && (
                <Button 
                  onClick={onReset}
                  variant="outline"
                  size="sm"
                  className="!h-[36px] bg-card"
                >
                  <svg className="w-4 h-4 text-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </Button>
              )}
              
              {onApplyFilters && (
                <Button 
                  onClick={onApplyFilters}
                  variant="secondary"
                  size="sm"
                  className="!h-[36px]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Apply Filters
                </Button>
              )}
              
              {!hideAddButton && onAdd && (
                <Button 
                  onClick={onAdd}
                  size="sm"
                  className="!h-[36px] !bg-title hover:!opacity-90"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  {addButtonText}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;