import React, { useState, useEffect } from 'react';
import { useOrgStore } from '../../store/useOrgStore';
import OrganizationCard from '../../components/UI/OrganizationCard';
import { FiBriefcase, FiInbox, FiRefreshCcw, FiHome, FiTrendingUp, FiActivity, FiGlobe, FiGrid, FiList, FiEdit2, FiTrash2 } from 'react-icons/fi';
import CreateOrganization from '../../components/UI/CreateOrganization';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import useUserStore from '../../store/userStore';
import FilterDropdown from '../../components/UI/FilterDropdown';
import { StatsRow } from '../../components/Dashboard/StatsCard';
import PageHeader from '../../components/UI/PageHeader';
import DataTable from '../../components/UI/DataTable';
import DotStatus from '../../components/UI/DotStatus';
import Badge from '../../components/UI/Badge';
import FilterBar from '../../components/UI/FilterBar';

// Resilient Logo Component for DataTable
const OrgLogo = ({ org }) => {
    const [imgError, setImgError] = useState(false);
    const name = org?.name || 'OR';

    return (
        <div className="w-9 h-9 bg-base border border-border-main/50 rounded-xl flex items-center justify-center font-black text-[12px] text-gray overflow-hidden shadow-sm uppercase tracking-tighter shrink-0 select-none">
            {org?.logo && !imgError ? (
                <img 
                    src={org.logo} 
                    alt={name} 
                    className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all" 
                    onError={() => setImgError(true)} 
                />
            ) : (
                <span className="bg-gradient-to-br from-base to-page w-full h-full flex items-center justify-center">
                    {name.substring(0, 2)}
                </span>
            )}
        </div>
    );
};

const Organizations = () => {
    const orgs = useOrgStore(state => state.orgs);
    const addOrg = useOrgStore(state => state.addOrg);
    const updateOrg = useOrgStore(state => state.updateOrg);
    const removeOrg = useOrgStore(state => state.removeOrg);
    
    const [filters, setFilters] = useState({ industry: 'all', status: 'all', region: 'all' });
    const [viewMode, setViewMode] = useState('grid');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingOrg, setEditingOrg] = useState(null);

    const { setBreadcrumbs } = useBreadcrumb();
    const { users, fetchUsers } = useUserStore();

    useEffect(() => {
        if (users.length === 0) {
            fetchUsers();
        }
    }, [users.length, fetchUsers]);

    const filteredOrgs = orgs.filter(org => {
        const matchesIndustry = filters.industry === 'all' || (org.industry || "") === filters.industry;
        const matchesStatus = filters.status === 'all' || (org.status || "") === filters.status;
        const matchesRegion = filters.region === 'all' || (org.region || "") === filters.region;
        return matchesIndustry && matchesStatus && matchesRegion;
    });

    const handleEdit = (org) => {
        setEditingOrg(org);
        setIsCreateModalOpen(true);
    };

    const handleCreateOrUpdate = (data) => {
        if (editingOrg) {
            updateOrg(editingOrg.id, data);
        } else {
            addOrg(data);
        }
        setIsCreateModalOpen(false);
        setEditingOrg(null);
    };

    const industryOptions = ['all', ...new Set(orgs.map(o => o.industry).filter(Boolean))].map(i => ({ 
        value: i, 
        label: i === 'all' ? 'All Industries' : i.charAt(0).toUpperCase() + i.slice(1) 
    }));

    const regionOptions = ['all', ...new Set(orgs.map(o => o.region).filter(Boolean))].map(r => ({ 
        value: r, 
        label: r === 'all' ? 'All Regions' : r 
    }));

    const statsData = [
        { 
            label: "Total Entities", 
            value: orgs.length, 
            icon: FiBriefcase,
            badge: `${orgs.filter(o => o.status === 'ACTIVE').length} Active / ${orgs.filter(o => o.status === 'INACTIVE').length} Inactive`,
            badgeColor: "bg-primary/5 text-primary",
            subValue: "all platforms"
        },
        { 
            label: "Active Nodes", 
            value: orgs.filter(o => o.status === 'ACTIVE').length, 
            icon: FiActivity,
            trend: "+12%",
            trendLabel: "vs last month",
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        },
        { 
            label: "Operational Density", 
            value: new Set(orgs.map(o => o.industry).filter(Boolean)).size, 
            icon: FiTrendingUp,
            badge: "Sector Count",
            badgeColor: "bg-amber-50 text-amber-700",
            subValue: "active sectors"
        },
        { 
            label: "Geographic Spread", 
            value: new Set(orgs.map(o => o.region).filter(Boolean)).size, 
            icon: FiGlobe,
            trend: "Global",
            trendColor: "text-blue-500",
            trendLabel: "reach"
        }
    ];

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-12">
            
            <PageHeader 
                title="Organizations" 
                subtitle={`Managing ${filteredOrgs.length} strategic client entities and operational density`}
                onAdd={() => { setEditingOrg(null); setIsCreateModalOpen(true); }}
                addButtonText="Add Organization"
                hideAddButton={false}
                breadcrumbs={[
                    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
                    { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} />, isActive: true }
                ]}
            />

            {/* 2. Stats Section — Global Metrics */}
            <StatsRow items={statsData} />

            {/* 3. GRID CONTENT WITH FILTERS */}
            <div className="flex flex-col gap-6">
                
                <FilterBar>
                    <div className="flex flex-wrap items-center gap-2 flex-1">
                        <FilterDropdown 
                            label="Industry"
                            options={industryOptions}
                            value={filters.industry}
                            onChange={(v) => setFilters(prev => ({ ...prev, industry: v }))}
                            allLabel="All Industries"
                        />

                        <FilterDropdown 
                            label="Region"
                            options={regionOptions}
                            value={filters.region}
                            onChange={(v) => setFilters(prev => ({ ...prev, region: v }))}
                            allLabel="All Regions"
                        />

                        <FilterDropdown 
                            label="Status"
                            options={[
                                { value: 'ACTIVE', label: 'Active Only' },
                                { value: 'INACTIVE', label: 'Inactive Only' }
                            ]}
                            value={filters.status}
                            onChange={(v) => setFilters(prev => ({ ...prev, status: v || 'all' }))}
                            allLabel="All Statuses"
                        />
                    </div>

                    <div className="flex items-center gap-2 shrink-0 border-l border-border-main/40 pl-3 ml-auto">
                        {/* View Toggles (Modular component) */}
                        <FilterBar.ViewToggle mode={viewMode} onChange={setViewMode} />

                        {Object.values(filters).filter(v => v !== 'all' && v !== '').length > 0 && (
                            <button 
                                onClick={() => setFilters({ industry: 'all', status: 'all', region: 'all' })}
                                className="h-9 flex items-center gap-1.5 px-3 text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase tracking-widest transition-all rounded-xl bg-title/5 hover:bg-rose-50 shadow-sm border border-transparent hover:border-rose-100 animate-in zoom-in duration-300 group"
                            >
                                <FiRefreshCcw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                                Reset
                                <span className="w-4 h-4 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center text-[9px] ml-1">
                                    {Object.values(filters).filter(v => v !== 'all' && v !== '').length}
                                </span>
                            </button>
                        )}
                    </div>
                </FilterBar>

                {/* THE GRID (Properly Aligned) */}

                {/* THE CONTENT (GRID OR LIST) */}
                {filteredOrgs.length > 0 ? (
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {filteredOrgs.map(org => (
                                <div key={org.id} className="w-full max-w-[350px]">
                                    <OrganizationCard 
                                        org={org} 
                                        onDelete={() => removeOrg(org.id)}
                                        onEdit={() => handleEdit(org)}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <DataTable 
                            columns={[
                                { 
                                    header: 'Organization', 
                                    accessor: 'name',
                                    width: '25%',
                                    render: (name, org) => (
                                        <div className="flex items-center gap-3 py-0.5">
                                            <OrgLogo org={org} />
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-1.5 line-clamp-1">
                                                    <span className="text-[13px] font-black text-title leading-tight tracking-tight truncate">{name}</span>
                                                    {org.stats?.sites > 5 && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0" title="High Activity" />
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[9px] font-black text-gray uppercase tracking-widest leading-none mt-1">
                                                    <span className="truncate">{org.industry || 'General'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                },
                                { 
                                    header: 'Industry', 
                                    accessor: 'industry',
                                    width: '15%',
                                    className: 'hidden xl:table-cell',
                                    render: (val) => (
                                        <div className="flex">
                                            <Badge 
                                                variant="soft" 
                                                className={`!text-[9px] !px-2 !py-0.5 !font-black !uppercase !tracking-widest border border-current/10 ${
                                                    !val ? 'text-gray bg-base' : 'text-primary bg-primary/5'
                                                }`}
                                            >
                                                {val || 'General'}
                                            </Badge>
                                        </div>
                                    )
                                },
                                { 
                                    header: 'Region', 
                                    accessor: 'region',
                                    width: '15%',
                                    className: 'hidden lg:table-cell',
                                    render: (val) => (
                                        <div className="flex items-center gap-1.5 text-[11px] font-black text-body truncate">
                                            <FiGlobe className="text-gray/50 shrink-0" size={12} />
                                            <span>{val || 'Global'}</span>
                                        </div>
                                    )
                                },
                                { 
                                    header: 'Oversight', 
                                    accessor: 'stats',
                                    width: '18%',
                                    className: 'text-center',
                                    render: (stats) => (
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[14px] font-black text-title leading-none">{stats?.sites || 0}</span>
                                                <span className="text-[8px] font-black text-gray uppercase tracking-widest mt-1">Sites</span>
                                            </div>
                                            <div className="h-5 w-[1px] bg-border-main/60 shrink-0" />
                                            <div className="flex flex-col items-center">
                                                <span className="text-[14px] font-black text-title leading-none">{stats?.coordinators || 0}</span>
                                                <span className="text-[8px] font-black text-gray uppercase tracking-widest mt-1">Units</span>
                                            </div>
                                        </div>
                                    )
                                },
                                { 
                                    header: 'Status', 
                                    accessor: 'status',
                                    width: '15%',
                                    className: 'hidden sm:table-cell',
                                    render: (status) => {
                                        const isActive = status === 'ACTIVE';
                                        return (
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${
                                                isActive ? 'bg-success-bg/50 border-success/10 text-success' : 'bg-danger-bg/50 border-danger/10 text-danger'
                                            }`}>
                                                <DotStatus status={isActive ? 'active' : 'inactive'} />
                                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                                                    {isActive ? 'ACTIVE' : 'INACTIVE'}
                                                </span>
                                            </div>
                                        );
                                    }
                                },
                                { 
                                    header: 'Actions', 
                                    accessor: 'id',
                                    width: '12%',
                                    className: 'text-right',
                                    render: (_, org) => (
                                        <div className="flex items-center justify-end gap-1.5 pr-1">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleEdit(org); }}
                                                className="w-8 h-8 flex items-center justify-center text-gray hover:text-white hover:bg-title transition-all rounded-xl shadow-sm active:scale-95"
                                                title="Edit"
                                            >
                                                <FiEdit2 size={13} />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); removeOrg(org.id); }}
                                                className="w-8 h-8 flex items-center justify-center text-gray hover:text-rose-500 transition-all rounded-xl hover:bg-rose-50/10 active:scale-95"
                                                title="Delete"
                                            >
                                                <FiTrash2 size={13} />
                                            </button>
                                        </div>
                                    )
                                }
                            ]}
                            data={filteredOrgs}
                            onRowClick={(org) => handleEdit(org)}
                        />
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-card/40 border-2 border-dashed border-border-main rounded-3xl animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-base rounded-2xl flex items-center justify-center mb-5 rotate-3">
                            <FiInbox className="w-7 h-7 text-gray/40" />
                        </div>
                        <h3 className="text-lg font-black text-title mb-1">No Organizations Found</h3>
                        <p className="text-gray text-xs mb-8 text-center max-w-xs px-6 font-medium leading-relaxed">
                            We couldn't find any organization matching your selection. Try clearing your filters.
                        </p>
                        <button 
                            onClick={() => setFilters({ industry: 'all', status: 'all', region: 'all' })}
                            className="flex items-center gap-2 px-6 py-2.5 bg-card border border-border-main rounded-xl text-xs font-black text-body hover:bg-base hover:border-border-hover transition-all shadow-sm active:scale-95"
                        >
                            <FiRefreshCcw className="w-3.5 h-3.5" />
                            Clear Criteria
                        </button>
                    </div>
                )}
            </div>

            {/* Create Organization Modal */}
            <CreateOrganization 
                isOpen={isCreateModalOpen} 
                org={editingOrg}
                onSubmit={handleCreateOrUpdate}
                onClose={() => { setIsCreateModalOpen(false); setEditingOrg(null); }}
            />
        </div>
    );
};

export default Organizations;