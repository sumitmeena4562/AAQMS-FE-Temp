import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import ZonesTable from '../../components/Zones/ZonesTable';
import FilterBar from '../../components/UI/FilterBar';
import Button from '../../components/UI/Button';
import { useFilterStore } from '../../store/useFilterStore';
import { useHierarchy } from '../../hooks/api/useHierarchy';

import { useFloors, useZones } from '../../hooks/api/useHierarchyQueries';
import { FiHome, FiBriefcase, FiLoader, FiAlertCircle, FiX, FiMaximize, FiDownload, FiInbox } from 'react-icons/fi';
import CardSkeleton from '../../components/UI/CardSkeleton';
import { Layout, Truck, Fuel, Monitor } from 'lucide-react';
import useSearchStore from '../../store/useSearchStore';
import { useResponsiveLimit } from '../../hooks/useWindowSize';
import Pagination from '../../components/UI/Pagination';

const MediaModal = ({ isOpen, onClose, zone }) => {
    if (!isOpen) return null;
    
    const blueprintUrl = zone?.floor_blueprint || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop';
    
    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-title/40 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-card w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-border-main animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between px-6 py-5 border-b border-border-main bg-base/50">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2.5 mb-1">
                            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(30,58,138,0.4)] animate-pulse" />
                            <h3 className="text-xl font-black text-title uppercase tracking-tighter leading-none">
                                {zone?.name || 'Zone'} Drawing
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-primary/70 bg-primary/5 px-2 py-0.5 rounded border border-primary/10 tracking-widest">
                                ID: {zone?.id}
                            </span>
                            <span className="text-[10px] font-bold text-gray uppercase tracking-widest opacity-60">
                                {zone?.orgName} • {zone?.siteName} • {zone?.floorName}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border-main text-[11px] font-bold text-gray hover:text-primary transition-all shadow-sm hover:border-primary/30">
                            <FiDownload size={14} />
                            DOWNLOAD
                        </button>
                        <button onClick={onClose} className="p-2.5 rounded-xl bg-title text-white hover:bg-primary transition-all shadow-lg">
                            <FiX size={20} />
                        </button>
                    </div>
                </div>
                <div className="flex-1 bg-[#f8f9fc] relative overflow-hidden flex items-center justify-center group/viewer p-8">
                    {/* Grid Background Effect */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e3a8a 1px, transparent 1px)', size: '20px 20px' }} />
                    
                    <img 
                        src={blueprintUrl} 
                        alt="Zone Drawing" 
                        onLoad={(e) => e.target.classList.add('opacity-100')}
                        className="max-w-full max-h-full object-contain shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] transition-all duration-700 hover:scale-[1.02] opacity-0 rounded-lg border border-white/40"
                    />
                    
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-none">
                        <div className="px-5 py-2.5 bg-title/90 backdrop-blur-xl text-white rounded-2xl border border-white/10 shadow-2xl group-hover/viewer:translate-y-[-10px] transition-all duration-500">
                           <div className="flex items-center gap-3">
                               <div className="flex flex-col items-center">
                                   <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em] mb-0.5">TYPE</span>
                                   <span className="text-[11px] font-black uppercase tracking-wider">{zone?.type}</span>
                               </div>
                               <div className="w-[1px] h-6 bg-white/10" />
                               <div className="flex flex-col items-center">
                                   <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em] mb-0.5">STATUS</span>
                                   <span className="text-[11px] font-black uppercase tracking-wider text-green-400">{zone?.status || 'ACTIVE'}</span>
                               </div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Zones = () => {
    // const navigate = useNavigate(); // removed unused
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedMediaZone, setSelectedMediaZone] = useState(null);
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSyncFinished, setIsSyncFinished] = useState(false);

    const { 
        selectedOrg, selectedCoord, selectedSite, selectedFloor,
        bulkSync 
    } = useFilterStore();
    const { query: searchQuery } = useSearchStore();
    
    // URL → Store sync (Atomic Bulk Sync)
    useEffect(() => {
        if (isSyncFinished) return;

        const pOrg = searchParams.get('org_id') || searchParams.get('org');
        const pSite = searchParams.get('site_id') || searchParams.get('site');
        const pFloor = searchParams.get('floor_id') || searchParams.get('floor');
        const pCoord = searchParams.get('coord_id') || searchParams.get('coord');

        if (pOrg || pSite || pFloor || pCoord) {
            bulkSync({ org: pOrg, site: pSite, floor: pFloor, coord: pCoord });
        }
        
        if (!isSyncFinished) {
            setTimeout(() => setIsSyncFinished(true), 0);
        }
    }, [searchParams, bulkSync, isSyncFinished]);

    // --- QUERY HOOKS (OPTIMIZED: Zero Latency Pattern) ---
    const { organizations: orgs, sites: allSites } = useHierarchy({ 
        includeOrgs: true,
        includeCoords: false, // Kill the 7-second lag
        includeSites: true 
    });

    const { data: floorData } = useFloors(undefined, { page_size: 5000 }, {
        enabled: isSyncFinished
    });
    const allFloors = floorData?.results; // Pass undefined/null while loading so FilterBar knows it's not ready

    const { data: zoneData = { results: [], total: 0 }, isLoading: loading, error: hierarchyError, refetch: refetchZones } = useZones(
        undefined, // Global fetch
        { page_size: 5000 }, // All zones for FE filtering
        { enabled: isSyncFinished }
    );

    const zones = zoneData.results || [];

    useEffect(() => {
        const newParams = new URLSearchParams();
        if (selectedOrg.length > 0) newParams.set('org_id', selectedOrg.join(','));
        if (selectedSite.length > 0) newParams.set('site_id', selectedSite.join(','));
        if (selectedFloor.length > 0) newParams.set('floor_id', selectedFloor.join(','));
        if (selectedCoord.length > 0) newParams.set('coord_id', selectedCoord.join(','));
        
        const pOrgName = searchParams.get('org_name');
        const pSiteName = searchParams.get('site');
        const pFloorName = searchParams.get('floor');
        if (pOrgName) newParams.set('org_name', pOrgName);
        if (pSiteName) newParams.set('site', pSiteName);
        if (pFloorName) newParams.set('floor', pFloorName);

        setSearchParams(newParams, { replace: true });
    }, [selectedOrg, selectedSite, selectedFloor, selectedCoord, searchParams, setSearchParams]); 

    // fetchZones effect removed - handled by useZones query hook

    // --- Dynamic Naming for Breadcrumbs/Headers ---
    const currentOrg = selectedOrg.length === 1 ? orgs.find(o => String(o.id) === String(selectedOrg[0])) : null;
    const currentSite = (allSites || []).find(s => String(s.id) === String(selectedSite[0]));
    const currentFloor = (allFloors || []).find(f => String(f.id) === String(selectedFloor[0]));

    const orgLabel = selectedOrg.length > 1 ? `Multiple Orgs (${selectedOrg.length})` : currentOrg?.name || "Organization";
    const siteLabel = selectedSite.length > 1 ? `Multiple Sites (${selectedSite.length})` : currentSite?.name || currentSite?.site_name || "Site Plan";
    const floorLabel = selectedFloor.length > 1 ? `Multiple Floors (${selectedFloor.length})` : currentFloor?.name || currentFloor?.floor_name || "Floor Plan";

    const breadcrumbs = [
        { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
        { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
    ];

    if (selectedOrg.length > 0) breadcrumbs.push({ label: orgLabel, path: `/admin/coordinators?org_id=${selectedOrg.join(',')}` });
    if (selectedSite.length > 0) breadcrumbs.push({ label: siteLabel, path: `/admin/site-plan?org_id=${selectedOrg.join(',')}&site_id=${selectedSite.join(',')}` });
    if (selectedFloor.length > 0) breadcrumbs.push({ label: floorLabel, path: `/admin/floor-plan?org_id=${selectedOrg.join(',')}&site_id=${selectedSite.join(',')}&floor_id=${selectedFloor.join(',')}` });
    breadcrumbs.push({ label: "Zones", path: "#", isActive: true });

    const processedZones = useMemo(() => {
        const rawZones = zoneData.results || [];
        
        return rawZones
            .map(z => {
                // Defensive extraction of context IDs
                const getID = (val) => {
                    if (!val) return '';
                    if (typeof val === 'object' && val.id) return String(val.id);
                    if (typeof val === 'object' && val.pk) return String(val.pk);
                    return String(val);
                };

                const zOrgId = getID(z.organisation_id || z.org_id || z.organisation);
                const zSiteId = getID(z.site_id || z.site);
                const zFloorId = getID(z.floor_id || z.floor);

                // Find context names from global cache (Safe check for undefined)
                const safeOrgs = orgs || [];
                const safeSites = allSites || [];
                const safeFloors = allFloors || [];

                const org = safeOrgs.find(o => String(o.id) === zOrgId);
                const site = safeSites.find(s => String(s.id) === zSiteId);
                const floor = safeFloors.find(f => String(f.id) === zFloorId);

                let Icon = Layout;
                let bgClass = 'bg-blue-50';
                let txtClass = 'text-blue-600';
                if (z.type === 'Logistics' || z.type === 'Storage') { Icon = Truck; bgClass = 'bg-orange-50'; txtClass = 'text-orange-600'; }
                if (z.type === 'Infrastructure' || z.type === 'HVAC') { Icon = Fuel; bgClass = 'bg-green-50'; txtClass = 'text-green-600'; }
                if (z.type === 'Data Room' || z.type === 'Security') { Icon = Monitor; bgClass = 'bg-indigo-50'; txtClass = 'text-indigo-600'; }

                return {
                    ...z,
                    organisation_id: zOrgId, // Standardize for filter
                    site_id: zSiteId,
                    floor_id: zFloorId,
                    orgName: org?.name || 'Unknown Org',
                    siteName: site?.name || site?.site_name || 'Unknown Site',
                    floorName: floor?.name || floor?.floor_name || 'Unknown Floor',
                    icon: Icon,
                    iconBgClass: bgClass,
                    iconTextClass: txtClass,
                    count: `${z.count ?? 0}`
                };
            })
            .filter(z => {
                // Use standardized IDs from the map stage above
                const matchesOrg = !selectedOrg || selectedOrg.length === 0 || selectedOrg.some(id => String(id) === z.organisation_id);
                const matchesSite = !selectedSite || selectedSite.length === 0 || (Array.isArray(selectedSite) ? selectedSite.includes(z.site_id) : String(selectedSite) === z.site_id);
                const matchesFloor = !selectedFloor || selectedFloor.length === 0 || (Array.isArray(selectedFloor) ? selectedFloor.includes(z.floor_id) : String(selectedFloor) === z.floor_id);
                const matchesSearch = !searchQuery || (z.name || '').toLowerCase().includes(searchQuery.toLowerCase());

                return matchesOrg && matchesSite && matchesFloor && matchesSearch;
            });
    }, [zoneData, selectedOrg, selectedSite, selectedFloor, searchQuery, orgs, allSites, allFloors]);

    const pageSize = useResponsiveLimit(10);
    // 🔹 Auto-reset to page 1 when filters or page size change
    useEffect(() => {
        if (currentPage !== 1) {
            setTimeout(() => setCurrentPage(1), 0);
        }
    }, [searchQuery, selectedOrg, selectedSite, selectedFloor, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

    const totalPages = Math.ceil(processedZones.length / pageSize);
    const paginatedZones = useMemo(() => {
        return processedZones.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    }, [processedZones, currentPage, pageSize]);

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
                        {processedZones.length > 0 && <span className="text-[10px] font-black text-gray uppercase tracking-widest bg-base/50 px-3 py-1.5 rounded-lg border border-border-main/50">{processedZones.length} Result{processedZones.length !== 1 ? 's' : ''}</span>}
                    </div>
                }
            />
            <main className="flex-1 w-full pb-12 flex flex-col pt-4 sm:pt-6 overflow-hidden">
                <div className="mb-6 px-4">
                    <FilterBar activeLevel="zones" hideCoordFilter={true} externalFloors={allFloors} />
                </div>
                <div className="flex-1 overflow-auto px-4">
                    {loading ? (
                        <div className="w-full mt-4">
                            <CardSkeleton count={4} columns={4} />
                        </div>
                    ) : hierarchyError ? (
                        <div className="w-full py-24 flex flex-col items-center justify-center text-rose-500 bg-rose-50/50 rounded-3xl border border-rose-100 mx-4">
                            <FiAlertCircle className="w-10 h-10 mb-4" />
                            <h4 className="text-lg font-bold">Fetch Error</h4>
                            <p className="text-sm opacity-80">{hierarchyError.message || hierarchyError}</p>
                            <Button onClick={() => refetchZones()} variant="outline" className="mt-6">Try Again</Button>
                        </div>
                    ) : zones.length > 0 ? (
                        <div className="flex flex-col gap-6">
                            <ZonesTable data={paginatedZones} selectionMode={false} onViewMedia={handleViewMedia} />
                            
                            <Pagination 
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                totalItems={processedZones.length}
                                itemsPerPage={pageSize}
                            />
                        </div>
                    ) : (
                        <div className="w-full py-40 flex flex-col items-center justify-center text-center bg-card/40 rounded-[2rem] border-2 border-dashed border-border-main/60">
                            <div className="w-20 h-20 bg-base rounded-3xl flex items-center justify-center mb-6 border border-border-main/30 rotate-6 shadow-inner">
                                <FiInbox className="w-8 h-8 text-primary/40" />
                            </div>
                            <h3 className="text-2xl font-black text-title tracking-tight mb-2">No Zones Found</h3>
                            <p className="text-gray text-xs w-full max-w-[400px] mb-8 font-medium leading-relaxed px-4">
                                We couldn't find any zones matching your selection. Try adjusting your filters.
                            </p>
                        </div>
                    )}
                </div>
            </main>
            <MediaModal isOpen={isMediaModalOpen} onClose={() => setIsMediaModalOpen(false)} zone={selectedMediaZone} />
        </div>
    );
};

export default Zones;