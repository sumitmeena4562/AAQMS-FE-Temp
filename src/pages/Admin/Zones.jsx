import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../../components/UI/PageHeader';
import ZonesTable from '../../components/Zones/ZonesTable';
import FilterBar from '../../components/UI/FilterBar';
import { FiHome, FiBriefcase } from 'react-icons/fi';
import { List, Layout, Truck, Fuel, Monitor } from 'lucide-react';
import { useFilterStore } from '../../store/useFilterStore';
import { hierarchyService } from '../../services/hierarchyService';

const Zones = () => {
    const [activeView, setActiveView] = useState('list');
    const [selectionMode, setSelectionMode] = useState(false);

    const { selectedOrg, selectedCoord, selectedSite, selectedFloor } = useFilterStore();

    // The activeFloorId comes directly from the FilterBar's global store
    const activeFloorId = selectedFloor;

    // ΓöÇΓöÇ FETCH ZONES FROM BACKEND ΓöÇΓöÇ
    // useQuery automatically handles: loading, error, caching, retries, refetching
    const { data: rawZones = [], isLoading, isError } = useQuery({
        queryKey: ['zones', activeFloorId],
        queryFn: async () => {
            const response = await hierarchyService.getZones({ floor_id: activeFloorId });
            // DRF returns paginated { count, results: [...] } or a flat array
            return Array.isArray(response) ? response : (response?.results || []);
        },
        enabled: !!activeFloorId, // Only fetch when a floor is actually selected
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes ΓÇö avoid redundant DB hits
    });

    // ΓöÇΓöÇ MAP UI PROPS (icons/colors) onto the raw API data ΓöÇΓöÇ
    const floorZones = useMemo(() => {
        return rawZones.map(z => {
            let Icon = Layout;
            let bgClass = 'bg-blue-50';
            let txtClass = 'text-blue-600';

            if (z.type === 'Logistics' || z.type === 'Storage') { Icon = Truck; bgClass = 'bg-orange-50'; txtClass = 'text-orange-600'; }
            if (z.type === 'Infrastructure' || z.type === 'HVAC') { Icon = Fuel; bgClass = 'bg-green-50'; txtClass = 'text-green-600'; }
            if (z.type === 'Data Room' || z.type === 'Security') { Icon = Monitor; bgClass = 'bg-indigo-50'; txtClass = 'text-indigo-600'; }

            return {
                ...z,
                icon: Icon,
                iconBgClass: bgClass,
                iconTextClass: txtClass,
                count: `${z.count ?? 0} Assets` // count comes pre-calculated from backend
            };
        });
    }, [rawZones]);

    const breadcrumbs = [
        { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
        { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
        { label: "Organization", path: `/admin/coordinators` },
        { label: "Site Plan", path: `/admin/site-plan` },
        { label: "Floor Plan", path: `/admin/floor-plan` },
        { label: "Zones", path: "#", isActive: true }
    ];

    return (
        <div className="flex flex-col font-sans h-full">

            {/* HEADER */}
            <PageHeader
                title={activeFloorId ? `Zones` : "Zones Management"}
                subtitle={activeFloorId ? `Operational safety zones` : "Please use the filter bar to select a specific floor"}
                breadcrumbs={breadcrumbs}
                hideAddButton={true}
            />

            {/* MAIN BODY */}
            <main className="flex-1 w-full pb-12 flex flex-col pt-4 sm:pt-6">

                <FilterBar activeLevel="zones" className="mb-6">
                    {/* View toggles pushed to the right */}
                    <div className="flex items-center bg-base p-1 rounded-lg border border-border-main/60 shrink-0 ml-auto mr-1 sm:mr-0">
                        <button
                            onClick={() => setActiveView('list')}
                            className={`flex items-center justify-center gap-2 h-[28px] px-3 sm:px-5 rounded-md text-sm font-semibold transition-all shadow-sm outline-none cursor-pointer ${activeView === 'list'
                                    ? 'bg-card text-title shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] border border-border-main ring-1 ring-black/5'
                                    : 'bg-transparent text-gray hover:text-title border-transparent shadow-none'
                                }`}
                            title="List View"
                        >
                            <List size={16} className={activeView === 'list' ? "text-title" : "text-gray"} />
                        </button>
                        <button
                            onClick={() => setActiveView('drawing')}
                            className={`flex items-center justify-center gap-2 h-[28px] px-3 sm:px-5 rounded-md text-sm font-semibold transition-all shadow-sm outline-none cursor-pointer ${activeView === 'drawing'
                                    ? 'bg-card text-title shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] border border-border-main ring-1 ring-black/5'
                                    : 'bg-transparent text-gray hover:text-title border-transparent shadow-none'
                                }`}
                            title="Drawing View"
                        >
                            <svg className={`w-4 h-4 ${activeView === 'drawing' ? "text-title" : "text-gray"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>
                </FilterBar>

                {!activeFloorId ? (
                    <div className="text-center py-12 bg-card rounded-lg border border-border-main mt-4">
                        <p className="text-gray font-medium tracking-wide">
                            Please sequentially select an Organization, Coordinator, Site, and Floor to view zones.
                        </p>
                    </div>
                ) : isLoading ? (
                    <div className="text-center py-16 bg-card rounded-lg border border-border-main mt-4 animate-pulse">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                            <p className="text-sm text-gray font-medium">Loading zones...</p>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="text-center py-16 bg-card rounded-lg border border-rose-200 mt-4">
                        <div className="flex flex-col items-center gap-3">
                            <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <p className="text-sm font-semibold text-rose-600">Failed to load zones</p>
                            <p className="text-xs text-gray">Please check your connection and try again.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* TABLE */}
                        <div className={`transition-all duration-300 w-full ${activeView === 'list' ? 'block animate-in fade-in duration-500' : 'hidden'}`}>
                            <ZonesTable data={floorZones} selectionMode={selectionMode} />
                        </div>
                        {activeView === 'drawing' && (
                            <div className="w-full h-[600px] border border-border-main rounded-xl flex items-center justify-center bg-card text-gray animate-in fade-in duration-500 mt-4">
                                <div className="flex flex-col items-center gap-3">
                                    <svg className="w-10 h-10 text-border-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Interactive Floor Plan acts exactly like the Drawing tab here.</span>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Zones;
