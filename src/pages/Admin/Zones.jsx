import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import ZonesTable from '../../components/Zones/ZonesTable';
import FilterBar from '../../components/UI/FilterBar';
import FilterDropdown from '../../components/UI/FilterDropdown';
import Button from '../../components/UI/Button';
import { FiSquare, FiCheckSquare } from 'react-icons/fi';
import { List } from 'lucide-react';
import { useFilterStore } from '../../store/useFilterStore';
import { organizations, coordinators, sites, floors, zones, assets } from '../../data/mockFilterData';
import { FiHome, FiBriefcase } from 'react-icons/fi';
import { Fuel, Truck, Layout, Monitor } from 'lucide-react';

const Zones = () => {
    const [activeView, setActiveView] = useState('list');
    const [selectionMode, setSelectionMode] = useState(false);
    const [filters, setFilters] = useState({ zoneType: '' });

    const navigate = useNavigate();
    const location = useLocation();
    const { selectedOrg, selectedCoord, selectedSite, selectedFloor, setOrg, setCoord, setSite, setFloor } = useFilterStore();

    const passedOrgName = location.state?.orgName || new URLSearchParams(location.search).get('org');
    const passedCoordName = location.state?.coordinator?.name || new URLSearchParams(location.search).get('coord');
    const passedSiteName = location.state?.site?.name || location.state?.siteInfo?.name || new URLSearchParams(location.search).get('site');
    const passedFloorName = location.state?.floor?.name || new URLSearchParams(location.search).get('floor');

    useEffect(() => {
        let currentOrgId = selectedOrg;
        let currentCoordId = selectedCoord;
        let currentSiteId = selectedSite;

        if (!currentOrgId && passedOrgName) {
            const matchOrg = organizations.find(o => o.name.toLowerCase() === passedOrgName.toLowerCase());
            if (matchOrg) { setOrg(matchOrg.id); currentOrgId = matchOrg.id; }
        }
        if (!currentCoordId && passedCoordName) {
            const matchCoord = coordinators.find(c => c.name.toLowerCase() === passedCoordName.toLowerCase() && (!currentOrgId || c.orgId === currentOrgId));
            if (matchCoord) { setCoord(matchCoord.id); currentCoordId = matchCoord.id; }
        }
        if (!currentSiteId && passedSiteName) {
            const matchSite = sites.find(s => s.name.toLowerCase() === passedSiteName.toLowerCase() && (!currentCoordId || s.coordId === currentCoordId));
            if (matchSite) { setSite(matchSite.id); currentSiteId = matchSite.id; }
        }
        if (!selectedFloor && passedFloorName) {
            const matchFloor = floors.find(f => f.name.toLowerCase() === passedFloorName.toLowerCase() && (!currentSiteId || f.siteId === currentSiteId));
            if (matchFloor) setFloor(matchFloor.id);
        }
    }, [selectedOrg, selectedCoord, selectedSite, selectedFloor, passedOrgName, passedCoordName, passedSiteName, passedFloorName, setOrg, setCoord, setSite, setFloor]);

    const activeOrgId = selectedOrg || organizations.find(o => o.name.toLowerCase() === passedOrgName?.toLowerCase())?.id;
    const activeCoordId = selectedCoord || coordinators.find(c => c.name.toLowerCase() === passedCoordName?.toLowerCase())?.id;
    const activeSiteId = selectedSite || sites.find(s => s.name.toLowerCase() === passedSiteName?.toLowerCase())?.id;
    const activeFloorId = selectedFloor || floors.find(f => f.name.toLowerCase() === passedFloorName?.toLowerCase())?.id;

    const orgInfo = activeOrgId ? organizations.find(o => o.id === activeOrgId) : null;
    const coordInfo = activeCoordId ? coordinators.find(c => c.id === activeCoordId) : null;
    const siteInfo = activeSiteId ? sites.find(s => s.id === activeSiteId) : null;
    const floorInfo = activeFloorId ? floors.find(f => f.id === activeFloorId) : null;

    const floorZones = useMemo(() => {
        if (!activeFloorId) return [];
        return zones.filter(z => z.floorId === activeFloorId).map(z => {
            const zoneAssets = assets.filter(a => a.zoneId === z.id);
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
                count: `${zoneAssets.length} Assets`
            };
        });
    }, [activeFloorId]);

    const filteredZones = useMemo(() => {
        let result = [...floorZones];
        if (filters.zoneType) {
            result = result.filter(z => z.type === filters.zoneType);
        }
        return result;
    }, [floorZones, filters.zoneType]);

    const breadcrumbs = [
        { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
        { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
        { label: orgInfo?.name || "Organization", path: `/admin/coordinators` },
        { label: coordInfo?.name || "Site Plan", path: `/admin/site-plan` },
        { label: siteInfo?.name || "Floor Plan", path: `/admin/floor-plan` },
        { label: floorInfo?.name || "Zones", path: "#", isActive: true }
    ];

    return (
        <div className="flex flex-col font-sans h-full">

            {/* HEADER */}
            <PageHeader
                title={floorInfo ? `Zones in ${floorInfo.name}` : "Zones Management"}
                subtitle={floorInfo ? `Operational safety zones for ${siteInfo?.name}` : "Please use the filter bar to select a specific floor"}
                breadcrumbs={breadcrumbs}
                hideAddButton={true}
            />

            {/* MAIN BODY */}
            <main className="flex-1 w-full pb-12 flex flex-col pt-4 sm:pt-6">

                <FilterBar activeLevel="zones" className="mb-6">
                    <div className="flex items-center gap-3">
                        <Button
                            variant={selectionMode ? "primary" : "outline"}
                            onClick={() => setSelectionMode(!selectionMode)}
                            className={`!h-9 !px-3 !text-[11px] !font-black !uppercase !tracking-widest flex items-center gap-1.5 shrink-0 ${selectionMode ? 'shadow-md shadow-primary/20' : ''}`}
                        >
                            {selectionMode ? <FiCheckSquare size={13} /> : <FiSquare size={13} />}
                            Select
                        </Button>
                        <FilterBar.Separator />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 flex-1">
                        <FilterDropdown
                            label="Zone Type"
                            options={['Storage', 'Logistics', 'Office', 'Data Room', 'Infrastructure', 'Security', 'HVAC']}
                            value={filters.zoneType}
                            onChange={(v) => setFilters(prev => ({ ...prev, zoneType: v }))}
                            allLabel="All Types"
                        />
                    </div>

                    <div className="flex items-center gap-2 shrink-0 border-l border-border-main/40 pl-3 ml-auto">
                        <div className="flex items-center bg-base p-1 rounded-lg border border-border-main/60">
                            <button 
                                onClick={() => setActiveView('list')}
                                className={`flex items-center justify-center gap-2 h-[38px] px-5 rounded-md text-sm font-semibold transition-all shadow-sm outline-none cursor-pointer ${
                                    activeView === 'list' 
                                    ? 'bg-card text-title shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] border border-border-main ring-1 ring-black/5' 
                                    : 'bg-transparent text-gray hover:text-title border-transparent shadow-none'
                                }`}
                            >
                                <List size={16} className={activeView === 'list' ? "text-title" : "text-gray"} />
                                <span>List</span>
                            </button>
                            <button 
                                onClick={() => setActiveView('drawing')}
                                className={`flex items-center justify-center gap-2 h-[38px] px-5 rounded-md text-sm font-semibold transition-all shadow-sm outline-none cursor-pointer ${
                                    activeView === 'drawing' 
                                    ? 'bg-card text-title shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] border border-border-main ring-1 ring-black/5' 
                                    : 'bg-transparent text-gray hover:text-title border-transparent shadow-none'
                                }`}
                            >
                                <svg className={`w-4 h-4 ${activeView === 'drawing' ? "text-title" : "text-gray"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                <span>Drawing</span>
                            </button>
                        </div>
                    </div>
                </FilterBar>

                {!activeFloorId ? (
                    <div className="text-center py-12 bg-card rounded-lg border border-border-main mt-4">
                        <p className="text-gray font-medium tracking-wide">
                            Please sequentially select an Organization, Coordinator, Site, and Floor to view zones.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* TABLE */}
                        <div className={`transition-all duration-300 w-full ${activeView === 'list' ? 'block animate-in fade-in duration-500' : 'hidden'}`}>
                            <ZonesTable data={filteredZones} selectionMode={selectionMode} />
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