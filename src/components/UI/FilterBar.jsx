import React from 'react';
import { FiGrid, FiList, FiRefreshCcw } from 'react-icons/fi';
import FilterDropdown from './FilterDropdown';
import Search from './Search';
import { useFilterStore } from '../../store/useFilterStore';
import { organizations, coordinators, sites, floors } from '../../data/mockFilterData';

const FilterBar = ({ 
    activeLevel, // 'coordinators', 'sites', 'floors', 'zones'
    className = '',
    children,
    showStatus = false,
    showSearch = false,
    searchPlaceholder = "Search..."
}) => {
    const { 
        selectedOrg, setOrg,
        selectedCoord, setCoord,
        selectedSite, setSite,
        selectedFloor, setFloor,
        selectedStatus, setStatus,
        searchTerm, setSearch,
        resetFilters
    } = useFilterStore();

    // Safely strip singular/plural mapping for consistent tiering
    const normalizedLevel = activeLevel?.replace(/s$/, '') || ''; 

    // Hierarchy rendering rules
    const renderOrg = ['coordinator', 'site', 'floor', 'zone'].includes(normalizedLevel);
    const renderCoord = ['site', 'floor', 'zone'].includes(normalizedLevel);
    const renderSite = ['floor', 'zone'].includes(normalizedLevel);
    const renderFloor = ['zone'].includes(normalizedLevel);

    // Dynamic Relational Options mapping
    const orgOptions = organizations.map(o => ({ value: o.id, label: o.name }));
    const coordOptions = coordinators.filter(c => c.orgId === selectedOrg).map(c => ({ value: c.id, label: c.name }));
    const siteOptions = sites.filter(s => s.coordId === selectedCoord).map(s => ({ value: s.id, label: s.name }));
    const floorOptions = floors.filter(f => f.siteId === selectedSite).map(f => ({ value: f.id, label: f.name }));

    const isFilterActive = selectedOrg !== '' || selectedCoord !== '' || selectedSite !== '' || selectedFloor !== '' || selectedStatus !== 'all' || searchTerm !== '';

    return (
        <div className={`bg-card border border-border-main/60 rounded-2xl p-3.5 shadow-sm mb-6 ${className}`}>
            <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                
                {/* 🔹 LEFT SIDE: Cascading Dropdowns */}
                <div className="flex flex-wrap items-center gap-3 flex-1">
                    
                    {renderOrg && (
                        <FilterDropdown 
                            label="Organization"
                            options={orgOptions}
                            value={selectedOrg}
                            onChange={(val) => setOrg(val)}
                            allLabel="Select Organization"
                        />
                    )}

                    {renderCoord && (
                        <div className={!selectedOrg ? 'opacity-50 pointer-events-none' : ''}>
                            <FilterDropdown 
                                label="Coordinator"
                                options={coordOptions}
                                value={selectedCoord}
                                onChange={(val) => setCoord(val)}
                                allLabel="Select Coordinator"
                            />
                        </div>
                    )}

                    {renderSite && (
                        <div className={!selectedCoord ? 'opacity-50 pointer-events-none' : ''}>
                            <FilterDropdown 
                                label="Site"
                                options={siteOptions}
                                value={selectedSite}
                                onChange={(val) => setSite(val)}
                                allLabel="Select Site"
                            />
                        </div>
                    )}

                    {renderFloor && (
                        <div className={!selectedSite ? 'opacity-50 pointer-events-none' : ''}>
                            <FilterDropdown 
                                label="Floor"
                                options={floorOptions}
                                value={selectedFloor}
                                onChange={(val) => setFloor(val)}
                                allLabel="Select Floor"
                            />
                        </div>
                    )}

                    {showStatus && (
                        <FilterDropdown 
                            label="Status"
                            options={[
                                { value: 'ACTIVE', label: 'Active Only' },
                                { value: 'INACTIVE', label: 'Inactive Only' }
                            ]}
                            value={selectedStatus}
                            onChange={(val) => setStatus(val || 'all')}
                            allLabel="All Statuses"
                        />
                    )}

                    {showSearch && (
                        <div className="w-[200px] ml-1 shrink-0">
                            <Search 
                                placeholder={searchPlaceholder} 
                                onSearch={(val) => setSearch(val)}
                            />
                        </div>
                    )}
                    
                    {children}
                </div>

                {/* 🔹 RIGHT SIDE: Clear Button */}
                <div className="flex items-center gap-2 shrink-0 border-l border-border-main/40 pl-3 ml-auto">
                    {isFilterActive && (
                        <button 
                            onClick={resetFilters}
                            className="h-9 flex items-center gap-1.5 px-3 text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase tracking-widest transition-all rounded-xl bg-title/5 hover:bg-rose-50 shadow-sm border border-transparent hover:border-rose-100 group animate-in zoom-in duration-300"
                        >
                            <FiRefreshCcw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export const Separator = ({ className = '' }) => (
    <div className={`h-6 w-[1.5px] bg-border-main/40 shrink-0 mx-2 hidden sm:block ${className}`} />
);

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
