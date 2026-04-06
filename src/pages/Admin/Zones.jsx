import React, { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import ZonesTable from '../../components/Zones/ZonesTable';
import FilterBar from '../../components/UI/FilterBar';
import Button from '../../components/UI/Button';
import { useFilterStore } from '../../store/useFilterStore';
import { useHierarchyStore } from '../../store/useHierarchyStore';
import { useOrgStore } from '../../store/useOrgStore';
import { FiHome, FiBriefcase, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { Layout, Truck, Fuel, Monitor } from 'lucide-react';

const Zones = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // ── STORES & STATE ──
    const { 
        selectedOrg, selectedCoord, selectedSite, selectedFloor, 
        setOrg, setCoord, setSite, setFloor, resetFilters 
    } = useFilterStore();
    
    const { zones, fetchZones, loading, error: hierarchyError } = useHierarchyStore();
    const { orgs } = useOrgStore();

    // ── URL PARAMETERS (for direct access/deep linking) ──
    const passedOrgId = searchParams.get('org_id');
    const passedOrgName = searchParams.get('org_name');
    const passedCoordId = searchParams.get('coord_id');
    const passedCoordName = searchParams.get('coord');
    const passedSiteId = searchParams.get('site_id');
    const passedSiteName = searchParams.get('site');
    const passedFloorId = searchParams.get('floor_id');
    const passedFloorName = searchParams.get('floor');

    useEffect(() => {
        // 1. Sync global filters ONLY if passed through URL and store is empty
        if (passedOrgId && !selectedOrg) setOrg(passedOrgId);
        if (passedCoordId && !selectedCoord) setCoord(passedCoordId);
        if (passedSiteId && !selectedSite) setSite(passedSiteId);
        if (passedFloorId && !selectedFloor) setFloor(passedFloorId);
        
        // 2. Fetch zones (Global or Scoped)
        const activeFloorId = (passedFloorId === 'undefined' || !passedFloorId) ? selectedFloor : passedFloorId;
        fetchZones(activeFloorId || null);
    }, [passedOrgId, passedCoordId, passedSiteId, passedFloorId, selectedFloor, setOrg, setCoord, setSite, setFloor, fetchZones]);

    const activeFloorId = selectedFloor || passedFloorId;
    const activeSiteId = selectedSite || passedSiteId;
    const activeOrgId = selectedOrg || passedOrgId;

    const orgInfo = orgs.find(o => o.id === activeOrgId) || (passedOrgName ? { name: passedOrgName } : null);

    // ── BREADCRUMBS LOGIC (Dynamic Hierarchy) ──
    const breadcrumbs = [
        { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
        { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
    ];

    if (activeOrgId) {
        breadcrumbs.push({ 
            label: orgInfo?.name || "Organization", 
            path: `/admin/coordinators?org_id=${activeOrgId}&org_name=${encodeURIComponent(orgInfo?.name || '')}` 
        });
    }

    if (activeSiteId) {
        breadcrumbs.push({ 
            label: passedSiteName || "Site Plan", 
            path: `/admin/site-plan?org_id=${activeOrgId}&org_name=${encodeURIComponent(orgInfo?.name || '')}&coord_id=${passedCoordId}&coord=${encodeURIComponent(passedCoordName || '')}` 
        });
    }

    if (activeFloorId) {
        breadcrumbs.push({ 
            label: passedFloorName || "Floor Plan", 
            path: `/admin/floor-plan?org_id=${activeOrgId}&org_name=${encodeURIComponent(orgInfo?.name || '')}&coord_id=${passedCoordId}&coord=${encodeURIComponent(passedCoordName || '')}&site_id=${activeSiteId}&site=${encodeURIComponent(passedSiteName || '')}` 
        });
    }

    breadcrumbs.push({ label: "Zones", path: "#", isActive: true });

    // ── MAPPING ICONS TO ZONES ──
    const processedZones = zones.map(z => {
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
            count: `${z.count ?? 0} Assets`
        };
    });

    const handleResetAll = () => {
        resetFilters();
        setSearchParams({});
        fetchZones(null);
    };

    return (
        <div className="flex flex-col font-sans h-full">

            {/* HEADER */}
            <PageHeader
                title={passedFloorName ? `Zones for ${passedFloorName}` : "All Active Zones"}
                subtitle={activeFloorId 
                    ? `Managing operational safety zones and risk levels for the current floor` 
                    : "Viewing all mapped zones across the entire organization hierarchy"}
                breadcrumbs={breadcrumbs}
                hideAddButton={true}
                rightContent={
                    <div className="flex items-center gap-3">
                        <Button 
                            onClick={handleResetAll} 
                            variant="outline" 
                            size="sm" 
                            className="!h-[38px] bg-card flex items-center gap-2 px-4 border-dashed border-primary/30 hover:border-primary/60 transition-all"
                        >
                            <FiLoader size={14} className={loading ? 'animate-spin' : ''} />
                            <span className="font-black text-[10px] uppercase tracking-widest text-primary">Clear Context</span>
                        </Button>
                        {zones.length > 0 && (
                            <span className="text-[10px] font-black text-gray uppercase tracking-widest bg-base/50 px-3 py-1.5 rounded-lg border border-border-main/50">
                                {zones.length} Active Zones
                            </span>
                        )}
                    </div>
                }
            />

            {/* MAIN BODY */}
            <main className="flex-1 w-full pb-12 flex flex-col pt-4 sm:pt-6 overflow-hidden">
                
                <div className="mb-6">
                    <FilterBar activeLevel="zones" />
                </div>

                <div className="flex-1 overflow-auto px-4 sm:px-0">
                    {loading ? (
                        <div className="w-full py-32 flex flex-col items-center justify-center text-gray/50 animate-pulse">
                            <FiLoader className="w-10 h-10 animate-spin mb-4 text-primary/40" />
                            <p className="text-sm font-bold uppercase tracking-widest opacity-50">Synchronizing Zones...</p>
                        </div>
                    ) : hierarchyError ? (
                        <div className="w-full py-24 flex flex-col items-center justify-center text-rose-500 bg-rose-50/50 rounded-3xl border border-rose-100">
                            <FiAlertCircle className="w-10 h-10 mb-4" />
                            <h4 className="text-lg font-bold">Fetch Error</h4>
                            <p className="text-sm opacity-80">{hierarchyError}</p>
                            <Button onClick={() => fetchZones(activeFloorId || null)} variant="outline" className="mt-6">Try Again</Button>
                        </div>
                    ) : zones.length > 0 ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full">
                            <ZonesTable data={processedZones} selectionMode={false} />
                        </div>
                    ) : (
                        <div className="w-full py-32 flex flex-col items-center justify-center text-center bg-card/50 rounded-[var(--radius-card)] border-2 border-dashed border-border-main/50">
                            <div className="w-20 h-20 bg-base rounded-full flex items-center justify-center mb-6 shadow-sm border border-border-main/30">
                                <Layout className="w-8 h-8 text-primary shadow-glow" />
                            </div>
                            <h3 className="text-xl font-bold text-title mb-2">No Zones Found</h3>
                            <p className="text-sm text-gray max-w-[280px] mb-8">
                                {activeFloorId 
                                    ? "This floor doesn't have any zones mapped yet. Please coordinate with the site manager." 
                                    : "No zones have been registered in the system yet across the current selection."}
                            </p>
                            {!activeFloorId && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Select a floor for specific data</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Zones;