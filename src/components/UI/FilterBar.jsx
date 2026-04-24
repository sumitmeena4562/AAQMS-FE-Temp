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
    hideCoordFilter = false,
    searchPlaceholder = "Search...",
    hideClearButton = false,
    isCustomFilterActive = false,
    onClear,
    externalFloors = null,
    ...rest
}) => {
    const {
        selectedOrg, setOrg,
        selectedCoord, setCoord,
        selectedSite, setSite,
        selectedFloor, setFloor,
        selectedZone, setZone,
        selectedStatus, setStatus,
        searchTerm, setSearch,
        resetFilters
    } = useFilterStore();

    const { query: searchQuery, setQuery, clearSearch } = useSearchStore();
    const [_, setSearchParams] = useSearchParams();

    const handleResetAll = () => {
        resetFilters();
        if (onClear) onClear();
        setSearchParams({});
        clearSearch();
    };



    const isFilterActive = React.useMemo(() => (
        selectedOrg.length > 0 || 
        selectedCoord.length > 0 || 
        selectedSite.length > 0 || 
        selectedFloor.length > 0 || 
        selectedZone.length > 0 ||
        !!searchQuery
    ), [selectedOrg, selectedCoord, selectedSite, selectedFloor, selectedZone, searchQuery]);

    // Safely strip singular/plural mapping for consistent tiering
    const normalizedLevel = activeLevel?.replace(/s$/, '') || '';

    // Hierarchy rendering rules
    // Default to rendering Org unless we are on the Organizations page itself
    // Only auto-render if an activeLevel is provided to avoid duplicates with manual children
    const renderOrg = activeLevel && normalizedLevel !== 'organization';
    const renderCoord = ['coordinator', 'site', 'floor', 'zone'].includes(normalizedLevel);
    const renderSite = ['site', 'floor', 'zone'].includes(normalizedLevel);
    const renderFloor = ['floor', 'zone'].includes(normalizedLevel);

    // ─── HELPERS ───
    const getID = (val) => {
        if (!val) return '';
        if (typeof val === 'object' && val.id) return String(val.id);
        if (typeof val === 'object' && val.pk) return String(val.pk);
        return String(val);
    };

    // ─── QUERY HOOKS (UNIFIED) ───
    const hierarchyOptions = React.useMemo(() => ({
        includeOrgs: !!renderOrg,
        includeCoords: !!renderCoord && !hideCoordFilter,
        includeSites: !!(renderSite || renderFloor),
        enabled: !!(renderOrg || (renderCoord && !hideCoordFilter) || renderSite || renderFloor) 
    }), [renderOrg, renderCoord, renderSite, renderFloor, hideCoordFilter]);

    const { organizations: orgs, coordinators: allCoordinators, sites: allSites, isLoading } = useHierarchy(hierarchyOptions);

    const isFloorsExternal = rest.hasOwnProperty('externalFloors') || externalFloors !== null;
    const { data: floorData } = useFloors(selectedSite, {}, {
        enabled: !isFloorsExternal && renderFloor && selectedSite.length > 0
    });
    
    const allFloors = React.useMemo(() => {
        const rawFloors = isFloorsExternal ? (externalFloors || []) : (floorData?.results || []);
        
        // Filter by selected site locally if needed
        if (selectedSite.length > 0) {
            return rawFloors.filter(f => {
                const sId = getID(f.site_id || f.site);
                return selectedSite.some(id => String(id) === sId);
            });
        }
        return rawFloors;
    }, [isFloorsExternal, externalFloors, floorData, selectedSite, getID]);

    // Dynamic Relational Options mapping (using Real IDs) - Memoized to prevent re-render loops
    const orgOptions = React.useMemo(() => orgs.map(o => ({ value: o.id, label: o.name })), [orgs]);

    const coordOptions = React.useMemo(() => allCoordinators.map((c, i) => {
        const id = getID(c.id || c.pk || c.employee_id || i);
        
        // Robust Name extraction (checking nested user objects and common variants)
        const name = c.name || 
                     c.full_name || 
                     c.coordinator_name || 
                     c.user?.name || 
                     c.user?.full_name || 
                     `Coordinator #${id}`;
                     
        return { value: id, label: name };
    }), [allCoordinators]);
    const siteOptions = React.useMemo(() => {
        let filtered = allSites;
        if (selectedOrg && selectedOrg.length > 0) {
            filtered = filtered.filter(s => {
                const orgId = getID(s.organisation_id || s.org_id || s.organisation);
                return selectedOrg.some(id => String(id) === orgId);
            });
        }
        return filtered.map(s => ({ value: s.id, label: s.site_name || s.name }));
    }, [allSites, selectedOrg]);
    const floorOptions = React.useMemo(() => allFloors.map(f => ({ value: f.id, label: f.name })), [allFloors]);



    return (
        <div 
            className={`bg-card border border-border-main/60 rounded-2xl p-2.5 sm:p-3.5 shadow-sm mb-6 ${className}`}
            {...rest}
        >
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

                    {renderCoord && !hideCoordFilter && (
                        <FilterDropdown
                            label="Coordinator"
                            options={coordOptions}
                            value={selectedCoord}
                            onChange={(val) => setCoord(val)}
                            allLabel="All Coordinators"
                            multiple={true}
                            loading={isLoading}
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
                                onSearch={(val) => setQuery(val)}
                            />
                        </div>
                    )}

                    {children}
                </div>

                {/* 🔹 RIGHT SIDE: Clear Button & Toggles */}
                <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-border-main/40 pt-3 sm:pt-0 sm:pl-3 ml-0 sm:ml-auto w-full sm:w-auto justify-end">
                    {(isFilterActive || isCustomFilterActive) && !hideClearButton && (
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
