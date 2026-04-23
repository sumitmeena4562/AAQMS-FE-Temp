import React from 'react';
import { FiGrid, FiList, FiRefreshCcw } from 'react-icons/fi';
import FilterDropdown from './FilterDropdown';
import Search from './Search';
import { useFilterStore } from '../../store/useFilterStore';
import { useSearchParams } from 'react-router-dom';
import { useHierarchy } from '../../hooks/api/useHierarchy';
import { useFloors } from '../../hooks/api/useHierarchyQueries';
import useSearchStore from '../../store/useSearchStore';

const FilterBar = ({
    activeLevel, // 'coordinators', 'sites', 'floors', 'zones'
    className = '',
    children,
    showStatus = false,
    showSearch = false,
    searchPlaceholder = "Search...",
    hideClearButton = false
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

    const { query: searchQuery, clearSearch } = useSearchStore();
    const [_, setSearchParams] = useSearchParams();

    const handleResetAll = () => {
        resetFilters();
        setSearchParams({});
        clearSearch();
    };



    // Safely strip singular/plural mapping for consistent tiering
    const normalizedLevel = activeLevel?.replace(/s$/, '') || '';

    // Hierarchy rendering rules
    const renderOrg = ['coordinator', 'site', 'floor', 'zone'].includes(normalizedLevel);
    const renderCoord = ['site', 'floor', 'zone'].includes(normalizedLevel);
    const renderSite = ['floor', 'zone'].includes(normalizedLevel);
    const renderFloor = ['zone'].includes(normalizedLevel);

    // ─── QUERY HOOKS (UNIFIED) ───
    const hierarchyOptions = React.useMemo(() => ({
        includeOrgs: renderOrg,
        includeCoords: renderCoord,
        includeSites: renderSite || renderFloor
    }), [renderOrg, renderCoord, renderSite, renderFloor]);

    const { organizations: orgs, coordinators: allCoordinators, sites: allSites } = useHierarchy(hierarchyOptions);

    const { data: floorData } = useFloors(selectedSite, {
        enabled: renderFloor && selectedSite.length > 0
    });
    const allFloors = floorData?.results || [];

    // Dynamic Relational Options mapping (using Real IDs) - Memoized to prevent re-render loops
    const orgOptions = React.useMemo(() => orgs.map(o => ({ value: o.id, label: o.name })), [orgs]);
    const coordOptions = React.useMemo(() => allCoordinators.map(c => ({ value: c.id, label: c.name })), [allCoordinators]);
    const siteOptions = React.useMemo(() => allSites.map(s => ({ value: s.id, label: s.site_name || s.name })), [allSites]);
    const floorOptions = React.useMemo(() => allFloors.map(f => ({ value: f.id, label: f.name })), [allFloors]);

    const isFilterActive = [selectedOrg, selectedCoord, selectedSite, selectedFloor, selectedStatus].some(arr => Array.isArray(arr) && arr.length > 0) || searchTerm !== '' || searchQuery !== '';

    return (
        <div className={`bg-card border border-border-main/60 rounded-2xl p-2.5 sm:p-3.5 shadow-sm mb-6 ${className}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">

                {/* 🔹 LEFT SIDE: Cascading Dropdowns (Mobile Scrollable) */}
                <div className="flex flex-nowrap sm:flex-wrap items-center gap-2 sm:gap-3 flex-1 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 scrollbar-hide">

                    {renderOrg && (
                        <FilterDropdown
                            label="Organization"
                            options={orgOptions}
                            value={selectedOrg}
                            onChange={(val) => setOrg(val)}
                            allLabel="Select Organization"
                            multiple={true}
                        />
                    )}

                    {renderCoord && (
                        <FilterDropdown
                            label="Coordinator"
                            options={coordOptions}
                            value={selectedCoord}
                            onChange={(val) => setCoord(val)}
                            allLabel="All Coordinators"
                            multiple={true}
                        />
                    )}

                    {renderSite && (
                        <FilterDropdown
                            label="Site"
                            options={siteOptions}
                            value={selectedSite}
                            onChange={(val) => setSite(val)}
                            allLabel="Select Site"
                            multiple={true}
                        />
                    )}

                    {renderFloor && (
                        <FilterDropdown
                            label="Floor"
                            options={floorOptions}
                            value={selectedFloor}
                            onChange={(val) => setFloor(val)}
                            allLabel="Select Floor"
                            multiple={true}
                        />
                    )}

                    {showStatus && (
                        <FilterDropdown
                            label="Status"
                            options={[
                                { value: 'ACTIVE', label: 'Active' },
                                { value: 'BLOCKED', label: 'Blocked' },
                                { value: 'PENDING', label: 'Pending' }
                            ]}
                            value={selectedStatus}
                            onChange={(val) => setStatus(val)}
                            allLabel="All Statuses"
                            multiple={true}
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

                {/* 🔹 RIGHT SIDE: Clear Button & Toggles */}
                <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-border-main/40 pt-3 sm:pt-0 sm:pl-3 ml-0 sm:ml-auto w-full sm:w-auto justify-end">
                    {isFilterActive && !hideClearButton && (
                        <button
                            onClick={handleResetAll}
                            className="h-9 flex items-center gap-1.5 px-3 text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase tracking-[0.15em] transition-all rounded-xl bg-rose-50/30 hover:bg-rose-50 shadow-sm border border-rose-100/50 hover:border-rose-200 group animate-in zoom-in duration-300"
                        >
                            <FiRefreshCcw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                            Reset
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
