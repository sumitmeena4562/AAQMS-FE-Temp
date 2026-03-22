import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import { StatsRow } from '../../components/Dashboard/StatsCard';
import DataTable from '../../components/UI/DataTable';
import Badge from '../../components/UI/Badge';
import { 
    FiHome, FiBriefcase, FiBox, FiCheckCircle, 
    FiAlertCircle, FiClock, FiExternalLink, FiGrid,
    FiMonitor, FiPrinter, FiShield, FiCpu, FiLayout, FiRefreshCcw,
    FiLayers, FiMapPin
} from 'react-icons/fi';
import { generateInventoryForZone, generateGlobalInventory } from '../../utils/mockSiteData';
import Button from '../../components/UI/Button';
import FilterBar from '../../components/UI/FilterBar';
import FilterDropdown from '../../components/UI/FilterDropdown';
import Search from '../../components/UI/Search';
import { useOrgStore } from '../../store/useOrgStore';
import AssetDrawer from '../../components/Admin/Inventory/AssetDrawer';
import EmptyState from '../../components/Admin/Inventory/EmptyState';

const AssetIcon = ({ type, className = "" }) => {
    switch (type?.toLowerCase()) {
        case 'chair':
        case 'furniture':
            return <FiGrid className={className} />;
        case 'monitor':
        case 'peripheral':
            return <FiMonitor className={className} />;
        case 'network':
        case 'router':
            return <FiCpu className={className} />;
        case 'printer':
            return <FiPrinter className={className} />;
        case 'safety':
            return <FiShield className={className} />;
        default:
            return <FiBox className={className} />;
    }
};

const Inventory = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const orgs = useOrgStore(state => state.orgs);
    
    // Drawer State
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    // Initial data load: Global if no params, else specific
    const initialData = useMemo(() => generateGlobalInventory(orgs), [orgs]);
    
    // Filter State
    const [filters, setFilters] = useState({ 
        org: 'all', 
        floor: 'all', 
        zone: 'all',
        type: [], 
        status: [] 
    });
    const [searchQuery, setSearchQuery] = useState('');

    // Handle URL Parameters (Initial Load)
    useEffect(() => {
        const zoneParam = searchParams.get('zone');
        const orgParam = searchParams.get('org');
        const floorParam = searchParams.get('floor');
        const typeParam = searchParams.get('type');
        const statusParam = searchParams.get('status');

        if (zoneParam || orgParam || floorParam || typeParam || statusParam) {
            setFilters(prev => ({
                ...prev,
                zone: zoneParam || prev.zone,
                org: orgParam || prev.org,
                floor: floorParam || prev.floor,
                type: typeParam ? typeParam.split(',') : prev.type,
                status: statusParam ? statusParam.split(',') : prev.status
            }));
        }
    }, [searchParams]);

    const handleReset = () => {
        setFilters({ org: 'all', floor: 'all', zone: 'all', type: [], status: [] }); 
        setSearchQuery('');
    };

    const filteredInventory = useMemo(() => {
        return initialData.filter(item => {
            const matchesSearch = searchQuery === '' || 
                (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                (item.uniqueId && item.uniqueId.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.model && item.model.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesOrg = !filters.org || filters.org === 'all' || item.org === filters.org;
            const matchesFloor = !filters.floor || filters.floor === 'all' || item.floor === filters.floor;
            const matchesZone = !filters.zone || filters.zone === 'all' || item.zoneId === filters.zone;
            const matchesType = !filters.type || filters.type.length === 0 || filters.type.includes(item.type);
            const matchesStatus = !filters.status || filters.status.length === 0 || filters.status.includes(item.status);
            
            return matchesSearch && matchesOrg && matchesFloor && matchesZone && matchesType && matchesStatus;
        });
    }, [initialData, filters, searchQuery]);

    // Dropdown Options
    const orgOptions = useMemo(() => orgs.map(o => ({ value: o.name, label: o.name })), [orgs]);

    const floorOptions = useMemo(() => {
        const relevantFloors = initialData.filter(i => !filters.org || filters.org === 'all' || i.org === filters.org);
        const floors = [...new Set(relevantFloors.map(i => i.floor).filter(Boolean))];
        return floors.map(f => ({ value: f, label: f }));
    }, [initialData, filters.org]);

    const zoneOptions = useMemo(() => {
        const relevantZones = initialData.filter(i => 
            (!filters.org || filters.org === 'all' || i.org === filters.org) && 
            (!filters.floor || filters.floor === 'all' || i.floor === filters.floor)
        );
        const zones = [...new Set(relevantZones.map(i => i.zoneId).filter(Boolean))];
        return zones.map(z => ({ value: z, label: `Zone ${z}` }));
    }, [initialData, filters.org, filters.floor]);

    const typeOptions = useMemo(() => {
        const types = [...new Set(initialData.map(i => i.type).filter(Boolean))];
        return types.map(t => ({ value: t, label: t }));
    }, [initialData]);

    const statusOptions = useMemo(() => {
        const statuses = [...new Set(initialData.map(i => i.status).filter(Boolean))];
        return statuses.map(s => ({ value: s, label: s }));
    }, [initialData]);

    // Stats Calculation
    const stats = useMemo(() => {
        const total = filteredInventory.length;
        const verified = filteredInventory.filter(i => i.status === 'Verified').length;
        const mismatches = filteredInventory.filter(i => i.status === 'Mismatch').length;
        const pending = filteredInventory.filter(i => i.status === 'Pending').length;

        return [
            { label: "Assets", value: total, icon: FiBox, iconBgClass: "bg-blue-50", iconColorClass: "text-blue-500" },
            { label: "Verified", value: verified, icon: FiCheckCircle, iconBgClass: "bg-emerald-50", iconColorClass: "text-emerald-500" },
            { label: "Mismatches", value: mismatches, icon: FiAlertCircle, iconBgClass: "bg-rose-50", iconColorClass: "text-rose-500" },
            { label: "Pending", value: pending, icon: FiClock, iconBgClass: "bg-amber-50", iconColorClass: "text-amber-500" }
        ];
    }, [filteredInventory]);

    const handleOpenDrawer = (asset) => {
        setSelectedAsset(asset);
        setIsDrawerOpen(true);
    };

    const columns = useMemo(() => [
        {
            header: 'ASSET NAME',
            accessor: 'name',
            width: '24%',
            render: (name, row) => (
                <div className="flex items-center gap-3.5 py-1.5 pr-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-card text-title shrink-0 border border-border-main shadow-sm">
                        <AssetIcon type={row.icon} className="w-5 h-5 text-title/80" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[14px] font-black text-title leading-tight truncate">{name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-bold text-gray uppercase tracking-tighter bg-base px-1 rounded">{row.org}</span>
                            <span className="text-[10px] font-medium text-gray/60 truncate">• {row.model}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'UNIQUE ID',
            accessor: 'uniqueId',
            width: '14%',
            render: (id) => (
                <span className="px-2.5 py-1 bg-base border border-border-main/60 rounded-md text-[11px] font-black text-gray/80 tracking-wide font-mono uppercase">
                    {id}
                </span>
            )
        },
        {
            header: 'LOCATION',
            accessor: 'zoneId',
            width: '14%',
            render: (_, row) => (
                <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-black text-title uppercase tracking-tighter truncate">{row.floor}</span>
                    <span className="text-[10px] font-bold text-gray mt-0.5 truncate uppercase opacity-70">Zone {row.zoneId}</span>
                </div>
            )
        },
        {
            header: 'QR CODE',
            accessor: 'qr',
            width: '8%',
            align: 'center',
            render: () => (
                <div className="flex justify-center w-full text-gray/40 hover:text-title transition-colors cursor-pointer border border-transparent hover:border-border-main p-1 rounded-md">
                    <FiLayout size={18} />
                </div>
            )
        },
        {
            header: 'AI STATUS',
            accessor: 'status',
            width: '14%',
            align: 'center',
            render: (status) => {
                const color = status === 'Verified' ? 'success' : status === 'Mismatch' ? 'danger' : 'warning';
                return (
                    <div className="flex justify-center">
                        <Badge
                            variant="light"
                            color={color}
                            className="text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${status === 'Verified' ? 'bg-emerald-500' : status === 'Mismatch' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                            {status}
                        </Badge>
                    </div>
                );
            }
        },
        {
            header: 'LAST AUDIT',
            accessor: 'lastAudit',
            width: '16%',
            render: (date, row) => (
                <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-bold text-title truncate tracking-tight">{date}</span>
                    <span className="text-[11px] font-medium text-gray mt-0.5 truncate italic">By {row.auditor}</span>
                </div>
            )
        },
        {
            header: 'ACTIONS',
            accessor: 'id',
            width: '10%',
            align: 'right',
            render: (_, row) => (
                <div className="flex justify-end pr-2">
                    <Button
                        variant="outline"
                        icon={FiExternalLink}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDrawer(row);
                        }}
                        className="h-7 px-3 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 border-rose-200"
                    >
                        VIEW
                    </Button>
                </div>
            )
        }
    ], []);

    const displayedInventory = filteredInventory.slice(0, 10);

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-16">
            <PageHeader
                title="Inventory Analytics"
                subtitle={filters.org !== 'all' ? `Managing assets for ${filters.org}` : "Enterprise-wide asset monitoring and AI detection"}
                hideAddButton={true}
                breadcrumbs={[
                    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
                    { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
                    { label: "Inventory", path: "#", isActive: true }
                ]}
            />

            <StatsRow items={stats} columns={4} />

            <div className="flex flex-col w-full gap-4 mt-2">
                
                <FilterBar className="!p-2.5">
                    <div className="flex flex-wrap items-center gap-2 flex-1">
                        <FilterDropdown 
                            label="Organization"
                            options={orgOptions}
                            value={filters.org}
                            onChange={(v) => setFilters(prev => ({ ...prev, org: v, floor: 'all', zone: 'all' }))}
                            allLabel="All Organization"
                        />

                        <FilterDropdown 
                            label="Floor"
                            options={floorOptions}
                            value={filters.floor}
                            onChange={(v) => setFilters(prev => ({ ...prev, floor: v, zone: 'all' }))}
                            allLabel="All Floors"
                        />

                        <FilterDropdown 
                            label="Zone"
                            options={zoneOptions}
                            value={filters.zone}
                            onChange={(v) => setFilters(prev => ({ ...prev, zone: v }))}
                            allLabel="All Zones"
                        />

                        <Separator />

                        <FilterDropdown 
                            label="Type"
                            options={typeOptions}
                            value={filters.type}
                            onChange={(v) => setFilters(prev => ({ ...prev, type: v }))}
                            allLabel="All Types"
                            multiple={true}
                        />

                        <FilterDropdown 
                            label="Status"
                            options={statusOptions}
                            value={filters.status}
                            onChange={(v) => setFilters(prev => ({ ...prev, status: v }))}
                            allLabel="All Statuses"
                            multiple={true}
                        />
                    </div>

                    <div className="flex items-center gap-2 shrink-0 border-l border-border-main/40 pl-3 ml-auto">
                        {(filters.org !== 'all' || filters.floor !== 'all' || filters.zone !== 'all' || filters.type.length > 0 || filters.status.length > 0 || searchQuery !== '') && (
                            <button 
                                onClick={handleReset}
                                className="h-8 flex items-center gap-1.5 px-3 text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase tracking-widest transition-all rounded-lg bg-rose-50/50 shadow-sm border border-rose-100"
                            >
                                <FiRefreshCcw size={12} />
                                Reset
                            </button>
                        )}
                    </div>
                </FilterBar>

                <DataTable
                    columns={columns}
                    data={displayedInventory}
                    onRowClick={handleOpenDrawer}
                    emptyMessage={<EmptyState onReset={handleReset} />}
                    footer={
                        <div className="flex items-center justify-between w-full px-1">
                            <span className="text-[11px] font-bold text-gray tracking-tight">
                                Showing <span className="text-body font-black">{displayedInventory.length > 0 ? 1 : 0} to {displayedInventory.length}</span> of <span className="text-body font-black">{filteredInventory.length}</span> results
                            </span>
                            <div className="flex items-center gap-1.5">
                                <Button variant="outline" className="!h-8 !px-3 !text-[10px] !font-black !uppercase !tracking-widest opacity-50 cursor-not-allowed">Previous</Button>
                                <Button variant="outline" className="!h-8 !px-4 !text-[10px] !font-black !uppercase !tracking-widest">Next</Button>
                            </div>
                        </div>
                    }
                />
            </div>

            <AssetDrawer 
                asset={selectedAsset}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </div>
    );
};

const Separator = FilterBar.Separator;

export default Inventory;
