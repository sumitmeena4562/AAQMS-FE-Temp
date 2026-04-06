import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import ZonesTable from '../../components/Zones/ZonesTable';
import FilterBar from '../../components/UI/FilterBar';
import Button from '../../components/UI/Button';
import { useFilterStore } from '../../store/useFilterStore';
import { useHierarchyStore } from '../../store/useHierarchyStore';
import { useOrgStore } from '../../store/useOrgStore';
import { FiHome, FiBriefcase, FiLoader, FiAlertCircle, FiX, FiMaximize, FiDownload } from 'react-icons/fi';
import { Layout, Truck, Fuel, Monitor } from 'lucide-react';

const MediaModal = ({ isOpen, onClose, zone }) => {
    if (!isOpen) return null;
    
    const blueprintUrl = zone?.floor_blueprint || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop';
    
    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-title/40 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-card w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-border-main animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-main bg-base/50">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <h3 className="text-lg font-black text-title uppercase tracking-tight leading-none">
                                {zone?.name || 'Zone'} Drawing
                            </h3>
                        </div>
                        <p className="text-[10px] font-bold text-gray uppercase tracking-widest mt-1 opacity-60">
                            {zone?.site_name} • {zone?.floor_name}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 rounded-xl bg-card border border-border-main text-gray hover:text-primary transition-all shadow-sm">
                            <FiDownload size={18} />
                        </button>
                        <button onClick={onClose} className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                            <FiX size={18} />
                        </button>
                    </div>
                </div>
                <div className="flex-1 bg-base relative overflow-hidden flex items-center justify-center group/viewer">
                    <img 
                        src={blueprintUrl} 
                        alt="Zone Drawing" 
                        onLoad={(e) => e.target.classList.add('opacity-100')}
                        className="max-w-full max-h-full object-contain shadow-2xl transition-all duration-500 hover:scale-105 opacity-0"
                    />
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                        <div className="px-4 py-2 bg-title/80 backdrop-blur-xl text-white rounded-full border border-white/10 shadow-2xl scale-90 group-hover/viewer:scale-100 transition-all duration-500 opacity-0 group-hover/viewer:opacity-100">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em]">{zone?.type} ZONE • {zone?.status}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Zones = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedMediaZone, setSelectedMediaZone] = useState(null);
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

    const { 
        selectedOrg, selectedCoord, selectedSite, selectedFloor, 
        setOrg, setCoord, setSite, setFloor, resetFilters 
    } = useFilterStore();
    
    const { zones, fetchZones, loading, error: hierarchyError, allSites, allFloors } = useHierarchyStore();
    const { orgs } = useOrgStore();

    const passedOrgId = searchParams.get('org_id') || searchParams.get('org');
    const passedSiteId = searchParams.get('site_id') || searchParams.get('site');
    const passedFloorId = searchParams.get('floor_id') || searchParams.get('floor');
    const passedCoordId = searchParams.get('coord_id') || searchParams.get('coord');

    useEffect(() => {
        if (passedOrgId && !selectedOrg) setOrg(passedOrgId);
        if (passedSiteId && !selectedSite) setSite(passedSiteId);
        if (passedFloorId && !selectedFloor) setFloor(passedFloorId);
        if (passedCoordId && !selectedCoord) setCoord(passedCoordId);
    }, []);

    useEffect(() => {
        const newParams = new URLSearchParams();
        if (selectedOrg) newParams.set('org_id', selectedOrg);
        if (selectedSite) newParams.set('site_id', selectedSite);
        if (selectedFloor) newParams.set('floor_id', selectedFloor);
        if (selectedCoord) newParams.set('coord_id', selectedCoord);
        
        const pOrgName = searchParams.get('org_name');
        const pSiteName = searchParams.get('site');
        const pFloorName = searchParams.get('floor');
        if (pOrgName) newParams.set('org_name', pOrgName);
        if (pSiteName) newParams.set('site', pSiteName);
        if (pFloorName) newParams.set('floor', pFloorName);

        setSearchParams(newParams, { replace: true });

        fetchZones(selectedFloor || null, {
            site_id: selectedSite || undefined,
            organisation_id: selectedOrg || undefined
        });
    }, [selectedOrg, selectedSite, selectedFloor, selectedCoord, setSearchParams, fetchZones]);

    const currentOrg = orgs.find(o => o.id === selectedOrg);
    const currentSite = (allSites || []).find(s => s.id === selectedSite);
    const currentFloor = (allFloors || []).find(f => f.id === selectedFloor);

    const breadcrumbs = [
        { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
        { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
    ];

    if (selectedOrg) breadcrumbs.push({ label: currentOrg?.name || "Organization", path: `/admin/coordinators?org_id=${selectedOrg}&org_name=${encodeURIComponent(currentOrg?.name || '')}` });
    if (selectedSite) breadcrumbs.push({ label: currentSite?.site_name || "Site Plan", path: `/admin/site-plan?org_id=${selectedOrg}&site_id=${selectedSite}` });
    if (selectedFloor) breadcrumbs.push({ label: currentFloor?.floor_name || "Floor Plan", path: `/admin/floor-plan?site_id=${selectedSite}&floor_id=${selectedFloor}` });
    breadcrumbs.push({ label: "Zones", path: "#", isActive: true });

    const processedZones = zones.map(z => {
        let Icon = Layout;
        let bgClass = 'bg-blue-50';
        let txtClass = 'text-blue-600';
        if (z.type === 'Logistics' || z.type === 'Storage') { Icon = Truck; bgClass = 'bg-orange-50'; txtClass = 'text-orange-600'; }
        if (z.type === 'Infrastructure' || z.type === 'HVAC') { Icon = Fuel; bgClass = 'bg-green-50'; txtClass = 'text-green-600'; }
        if (z.type === 'Data Room' || z.type === 'Security') { Icon = Monitor; bgClass = 'bg-indigo-50'; txtClass = 'text-indigo-600'; }
        return { ...z, icon: Icon, iconBgClass: bgClass, iconTextClass: txtClass, count: `${z.count ?? 0}` };
    });

    const handleResetAll = () => { resetFilters(); setSearchParams({}); };
    const handleViewMedia = (zone) => { setSelectedMediaZone(zone); setIsMediaModalOpen(true); };

    return (
        <div className="flex flex-col font-sans h-full">
            <PageHeader
                title={currentFloor ? `Zones for ${currentFloor.floor_name}` : "All Active Zones"}
                subtitle={selectedFloor ? "Managing operational safety zones and risk levels for the current floor" : "Viewing all mapped zones across the entire organization hierarchy"}
                breadcrumbs={breadcrumbs}
                hideAddButton={true}
                rightContent={
                    <div className="flex items-center gap-3">
                        <Button onClick={handleResetAll} variant="outline" size="sm" className="!h-[38px] bg-card border-dashed border-primary/30 hover:border-primary/60 transition-all text-primary flex items-center gap-2 px-4 shadow-sm">
                            <FiLoader size={14} className={loading ? 'animate-spin' : ''} />
                            <span className="font-black text-[10px] uppercase tracking-widest ">Clear Context</span>
                        </Button>
                        {zones.length > 0 && <span className="text-[10px] font-black text-gray uppercase tracking-widest bg-base/50 px-3 py-1.5 rounded-lg border border-border-main/50">{zones.length} Active Zones</span>}
                    </div>
                }
            />
            <main className="flex-1 w-full pb-12 flex flex-col pt-4 sm:pt-6 overflow-hidden">
                <div className="mb-6 px-4">
                    <FilterBar activeLevel="zones" />
                </div>
                <div className="flex-1 overflow-auto px-4">
                    {loading ? (
                        <div className="w-full py-32 flex flex-col items-center justify-center text-gray/50 animate-pulse">
                            <FiLoader className="w-10 h-10 animate-spin mb-4 text-primary/40" />
                            <p className="text-sm font-bold uppercase tracking-widest opacity-50">Synchronizing Zones...</p>
                        </div>
                    ) : hierarchyError ? (
                        <div className="w-full py-24 flex flex-col items-center justify-center text-rose-500 bg-rose-50/50 rounded-3xl border border-rose-100 mx-4">
                            <FiAlertCircle className="w-10 h-10 mb-4" />
                            <h4 className="text-lg font-bold">Fetch Error</h4>
                            <p className="text-sm opacity-80">{hierarchyError}</p>
                            <Button onClick={() => fetchZones(selectedFloor || null)} variant="outline" className="mt-6">Try Again</Button>
                        </div>
                    ) : zones.length > 0 ? (
                        <div className="h-full">
                            <ZonesTable data={processedZones} selectionMode={false} onViewMedia={handleViewMedia} />
                        </div>
                    ) : (
                        <div className="w-full py-32 flex flex-col items-center justify-center text-center bg-card/50 rounded-3xl border-2 border-dashed border-border-main/50 mx-4">
                            <div className="w-16 h-16 bg-base rounded-full flex items-center justify-center mb-6 border border-border-main/30">
                                <Layout className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold text-title mb-1">No Zones Found</h3>
                            <p className="text-sm text-gray max-w-[260px] mb-8">Try adjusting your filters to see more results.</p>
                        </div>
                    )}
                </div>
            </main>
            <MediaModal isOpen={isMediaModalOpen} onClose={() => setIsMediaModalOpen(false)} zone={selectedMediaZone} />
        </div>
    );
};

export default Zones;