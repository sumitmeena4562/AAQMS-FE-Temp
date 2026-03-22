import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import ZonesTable from '../../components/Zones/ZonesTable';
import FilterBar from '../../components/UI/FilterBar';
import FilterDropdown from '../../components/UI/FilterDropdown';
import Button from '../../components/UI/Button';
import { FiSquare, FiCheckSquare } from 'react-icons/fi';
import { List } from 'lucide-react';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import { FiHome, FiBriefcase } from 'react-icons/fi';
import { ZONES_DATA } from '../../data/zones';

const Zones = () => {
    const [activeView, setActiveView] = useState('list');
    const [selectionMode, setSelectionMode] = useState(false);
    const [filters, setFilters] = useState({ zoneType: '' });

    const filteredZones = useMemo(() => {
        let result = [...ZONES_DATA];
        if (filters.zoneType) {
            result = result.filter(z => z.type === filters.zoneType);
        }
        return result;
    }, [filters.zoneType]);

    const location = useLocation();
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const floorName = location.state?.floor?.name || params.get('floor') || null;
    const siteName = location.state?.site?.name || params.get('site') || "Site";
    const orgName = location.state?.orgName || params.get('org') || "Organization";
    const coordName = location.state?.coordinator?.name || params.get('coord') || "Coordinator";

    const floor = location.state?.floor || (floorName ? { name: floorName } : null);
    const site = location.state?.site || { name: siteName };
    const coordinator = location.state?.coordinator || { name: coordName };

    const { setBreadcrumbs } = useBreadcrumb();

    const breadcrumbs = [
        { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
        { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
        { label: orgName, path: `/admin/coordinators?org=${encodeURIComponent(orgName)}` },
        { label: coordinator.name, path: `/admin/site-plan?org=${encodeURIComponent(orgName)}&coord=${encodeURIComponent(coordinator.name)}` },
        { label: site.name, path: `/admin/floor-plan?org=${encodeURIComponent(orgName)}&coord=${encodeURIComponent(coordinator.name)}&site=${encodeURIComponent(site.name)}` },
        { label: floor?.name || "Zones", path: location.pathname + location.search, isActive: true }
    ];

    React.useEffect(() => {
        // Dynamic PageHeader takes care of breadcrumbs now
    }, [orgName, coordinator.name, site.name, floor?.name, location.pathname, location.search]);

    // Fallback safe state
    if (!floor) {
        return (
            <div className="p-8 text-center text-gray font-sans mt-20">
                <h2 className="text-xl font-bold mb-4 text-title">No Floor Selected</h2>
                <p className="mb-6">Please start from the Organization Dashboard and select a Floor Plan.</p>
                <button
                    onClick={() => navigate('/admin/organizations')}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Go to Organizations
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col font-sans h-full">

            {/* HEADER */}
            <PageHeader
                title={`Zones in ${floor.name}`}
                subtitle={`Operational safety zones for ${site.name} — ${orgName}`}
                breadcrumbs={breadcrumbs}
                hideAddButton={true}
            />

            {/* MAIN BODY */}
            <main className="flex-1 w-full pb-12 flex flex-col pt-4 sm:pt-6">

                <FilterBar className="mb-6">
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
                            options={['Storage', 'Loading Bay', 'Office']}
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

                {/* TABLE */}
                <div className={`transition-all duration-300 w-full ${activeView === 'list' ? 'block animate-in fade-in duration-500' : 'hidden'}`}>
                    <ZonesTable data={filteredZones} selectionMode={selectionMode} />
                </div>
                {activeView === 'drawing' && (
                    <div className="w-full h-[600px] border border-border-main rounded-xl flex items-center justify-center bg-card text-gray animate-in fade-in duration-500">
                        <div className="flex flex-col items-center gap-3">
                            <svg className="w-10 h-10 text-border-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Interactive Floor Plan acts exactly like the Drawing tab here.</span>
                        </div>
                    </div>
                )}
               

            </main>


        </div>
    );
};

export default Zones;