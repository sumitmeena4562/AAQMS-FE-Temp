import React from 'react';
import { FiGrid, FiList } from 'react-icons/fi';

/**
 * FilterBar - A reusable, high-density container for operational controls.
 * Designed for modularity allowing children to be added/removed as needed.
 */
const FilterBar = ({ children, className = '' }) => {
    return (
        <div className={`bg-card border border-border-main/60 rounded-2xl p-3.5 shadow-sm ${className}`}>
            <div className="flex flex-wrap items-center gap-3">
                {children}
            </div>
        </div>
    );
};

// ── Sub-Components for Proper Layout ──

/**
 * Vertical separator line
 */
export const Separator = ({ className = '' }) => (
    <div className={`h-6 w-[1.5px] bg-border-main/40 shrink-0 mx-2 hidden sm:block ${className}`} />
);

/**
 * ViewToggle - Standardized List/Grid switcher
 */
export const ViewToggle = ({ mode, onChange, className = '' }) => (
    <div className={`flex items-center gap-1.5 bg-base/40 p-1 rounded-xl border border-border-main/50 ${className}`}>
        <button 
            onClick={() => onChange('list')}
            className={`p-1.5 rounded-lg transition-all ${mode === 'list' ? 'bg-card text-primary shadow-sm border border-border-main/50' : 'text-gray hover:text-body hover:bg-base'}`}
            title="List View"
        >
            <FiList size={16} />
        </button>
        <button 
            onClick={() => onChange('grid')}
            className={`p-1.5 rounded-lg transition-all ${mode === 'grid' ? 'bg-card text-primary shadow-sm border border-border-main/50' : 'text-gray hover:text-body hover:bg-base'}`}
            title="Grid View"
        >
            <FiGrid size={16} />
        </button>
    </div>
);

FilterBar.Separator = Separator;
FilterBar.ViewToggle = ViewToggle;

export default FilterBar;
