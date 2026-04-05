import React from 'react';
import { FiPlus, FiDownload, FiRefreshCw } from 'react-icons/fi';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import Button from './Button';

const PageHeader = ({ 
  title,
  subtitle,
  breadcrumbs = [],
  rightContent,
  onReset, 
  onAdd, 
  onExport,
  addButtonText = "Add New",
  hideAddButton = true,
  className = ""
}) => {
  return (
    <div className={`bg-card border-b border-border-main/50 ${className}`}>
        {/* 1. BREADCRUMB STRIP (Internalized for Cohesion) */}
        {breadcrumbs.length > 0 && (
            <div className="w-full px-4 sm:px-8 pt-4 pb-1">
                <Breadcrumb items={breadcrumbs} />
            </div>
        )}

      <div className="w-full px-4 sm:px-8 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* 2. TITLE & SUBTITLE ΓÇö High Density Typography */}
        {title && (
          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-black text-title leading-tight tracking-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <div className="text-[11px] sm:text-[12px] font-bold text-gray uppercase tracking-widest leading-none opacity-80">
                {subtitle}
              </div>
            )}
          </div>
        )}

        {/* 3. ACTION CONTENT / BUTTONS */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Custom Right Content Area (e.g., Filter Toggles) */}
          {rightContent && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              {rightContent}
            </div>
          )}

          {/* Standardized Actions */}
          <div className="flex items-center gap-2">
            {onReset && (
              <Button 
                onClick={onReset}
                variant="outline"
                size="sm"
                className="!h-[38px] bg-card flex items-center gap-2"
              >
                <FiRefreshCw size={14} className="text-gray" />
                Reset
              </Button>
            )}

            {onExport && (
              <Button 
                onClick={onExport}
                variant="outline"
                size="sm"
                className="!h-[38px] bg-card shadow-sm hover:shadow transition-all flex items-center gap-2 px-4"
              >
                <FiDownload size={15} className="text-gray" />
                <span className="font-black text-[11px] uppercase tracking-widest">Export</span>
              </Button>
            )}
            
            {!hideAddButton && onAdd && (
              <Button 
                onClick={onAdd}
                size="sm"
                className="!h-[38px] !bg-primary shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2 px-4"
              >
                <FiPlus size={16} className="text-white" />
                <span className="font-black text-[11px] text-white uppercase tracking-widest leading-none">
                    {addButtonText}
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
