import React, { useState, useEffect } from 'react';
import { useOrgStore } from '../../store/useOrgStore';
import OrganizationCard from '../../components/UI/OrganizationCard';
import { FiBriefcase, FiInbox, FiRefreshCcw, FiHome, FiTrendingUp, FiActivity, FiGlobe, FiGrid, FiList, FiEdit2, FiTrash2 } from 'react-icons/fi';
import CreateOrganization from '../../components/UI/CreateOrganization';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import useUserStore from '../../store/userStore';
import FilterDropdown from '../../components/UI/FilterDropdown';
import { StatsRow } from '../../components/Dashboard/StatsCard';
import PageHeader from '../../components/Dashboard/pageHeader';
import DataTable from '../../components/UI/DataTable';
import DotStatus from '../../components/UI/DotStatus';
import Badge from '../../components/UI/Badge';

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

        setBreadcrumbs([
            { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
            { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} />, isActive: true }
        ]);
    }, [users.length, fetchUsers, setBreadcrumbs]);

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
            label: 'Total Organizations',
            value: orgs.length,
            icon: FiBriefcase,
            iconBgClass: 'bg-emerald-50',
            iconColorClass: 'text-emerald-600',
            description: 'Across all industries'
        },
        {
            label: 'Active Entities',
            value: orgs.filter(o => o.status === 'ACTIVE').length,
            icon: FiTrendingUp,
            iconBgClass: 'bg-blue-50',
            iconColorClass: 'text-blue-600',
            description: 'Live & Operational'
        },
        {
            label: 'Under Maintenance',
            value: orgs.filter(o => o.status === 'MAINTENANCE').length,
            icon: FiActivity,
            iconBgClass: 'bg-orange-50',
            iconColorClass: 'text-orange-600',
            description: 'Service in progress'
        },
        {
            label: 'Total Sites',
            value: orgs.reduce((acc, o) => acc + (parseInt(o.stats?.sites) || 0), 0),
            icon: FiGlobe,
            iconBgClass: 'bg-indigo-50',
            iconColorClass: 'text-indigo-600',
            description: 'Deployed globally'
        }
    ];

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-12">
            
            {/* 1. Page Header (Unified) */}
            <PageHeader 
                title="Organizations" 
                subtitle={`Manage ${filteredOrgs.length} client entities and their operational density`}
                rightContent={
                    <button 
                        onClick={() => { setEditingOrg(null); setIsCreateModalOpen(true); }}
                        className="h-10 flex items-center gap-2 px-5 bg-slate-900 text-white rounded-xl font-black text-[13px] hover:bg-slate-800 transition-all shadow-sm active:scale-95 shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Organization
                    </button>
                }
            />

            {/* 2. STATS ROW */}
            <StatsRow items={statsData} columns={4} />

            {/* 3. GRID CONTENT WITH FILTERS */}
            <div className="flex flex-col gap-6">
                
                {/* 2.5 PREMIUM FILTER WELL (DataTable Style) */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-3.5 shadow-sm">
                    <div className="flex flex-wrap items-center gap-3">
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
                                { value: 'all', label: 'All Status' },
                                { value: 'ACTIVE', label: 'Active Only' },
                                { value: 'MAINTENANCE', label: 'Maintenance Only' },
                                { value: 'DEACTIVE', label: 'Deactive Only' }
                            ]}
                            value={filters.status}
                            onChange={(v) => setFilters(prev => ({ ...prev, status: v }))}
                            allLabel="All"
                        />

                        <div className="h-6 w-[1.5px] bg-slate-100 shrink-0 mx-2" />

                        {/* View Toggle (Relocated) */}
                        <div className="flex items-center bg-slate-50/80 p-1 rounded-xl border border-slate-100 shadow-inner group">
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`h-8 px-3 flex items-center gap-2 rounded-lg transition-all font-black text-[10px] uppercase tracking-widest ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                                title="Grid View"
                            >
                                <FiGrid size={13} className={viewMode === 'grid' ? 'text-primary' : ''} />
                                <span className={viewMode === 'grid' ? 'block' : 'hidden'}>Grid</span>
                            </button>
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`h-8 px-3 flex items-center gap-2 rounded-lg transition-all font-black text-[10px] uppercase tracking-widest ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                                title="List View"
                            >
                                <FiList size={13} className={viewMode === 'list' ? 'text-primary' : ''} />
                                <span className={viewMode === 'list' ? 'block' : 'hidden'}>List</span>
                            </button>
                        </div>

                        <button 
                            onClick={() => setFilters({ industry: 'all', status: 'all', region: 'all' })}
                            className="ml-auto h-10 flex items-center gap-2 px-4 text-slate-400 hover:text-rose-600 font-bold text-[11px] uppercase tracking-widest transition-all rounded-xl hover:bg-rose-50/50 group"
                        >
                            <FiRefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                            Reset
                        </button>
                    </div>
                </div>

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
                                    render: (name, org) => (
                                        <div className="flex items-center gap-3.5 py-1">
                                            <div className="w-10 h-10 bg-slate-100/50 border border-slate-200/50 rounded-xl flex items-center justify-center font-black text-[13px] text-slate-500 overflow-hidden shadow-sm uppercase tracking-tighter shrink-0 select-none">
                                                {org.logo ? (
                                                    <img src={org.logo} alt="" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all" />
                                                ) : (
                                                    <span className="bg-gradient-to-br from-slate-200 to-slate-100 w-full h-full flex items-center justify-center">
                                                        {name?.substring(0, 2) || 'OR'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[14px] font-black text-slate-900 leading-none tracking-tight">{name}</span>
                                                    {org.stats?.sites > 5 && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" title="High Activity" />
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em] leading-none">
                                                    <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{org.type || 'Enterprise'}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span>{org.industry || 'General'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                },
                                { 
                                    header: 'Industry', 
                                    accessor: 'industry',
                                    render: (val) => (
                                        <div className="flex">
                                            <Badge 
                                                variant="soft" 
                                                className={`!text-[10px] !px-2.5 !py-1 !font-black !uppercase !tracking-widest border border-current/10 ${
                                                    !val ? 'text-slate-400 bg-slate-50' : 'text-primary bg-primary/5'
                                                }`}
                                            >
                                                {val || 'Not Classified'}
                                            </Badge>
                                        </div>
                                    )
                                },
                                { 
                                    header: 'Region', 
                                    accessor: 'region',
                                    render: (val) => (
                                        <div className="flex items-center gap-2 text-[12px] font-bold text-slate-600">
                                            <FiGlobe className="text-slate-300 shrink-0" size={14} />
                                            <span>{val || 'Global (HQ)'}</span>
                                        </div>
                                    )
                                },
                                { 
                                    header: 'Deployment Health', 
                                    accessor: 'stats',
                                    className: 'text-center',
                                    render: (stats) => (
                                        <div className="flex items-center justify-center gap-5">
                                            <div className="flex flex-col items-center group/stat cursor-help">
                                                <span className="text-[15px] font-black text-slate-900 group-hover/stat:text-primary transition-colors">{stats?.sites || 0}</span>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Sites</span>
                                            </div>
                                            <div className="h-6 w-[1px] bg-slate-100 shrink-0" />
                                            <div className="flex flex-col items-center group/stat cursor-help">
                                                <span className="text-[15px] font-black text-slate-900 group-hover/stat:text-indigo-600 transition-colors">{stats?.coordinators || 0}</span>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Captains</span>
                                            </div>
                                        </div>
                                    )
                                },
                                { 
                                    header: 'Status', 
                                    accessor: 'status',
                                    render: (status) => {
                                        const isActive = status === 'ACTIVE';
                                        const isMaint = status === 'MAINTENANCE';
                                        return (
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                                                isActive ? 'bg-emerald-50/50 border-emerald-100/50 text-emerald-700' : 
                                                isMaint ? 'bg-orange-50/50 border-orange-100/50 text-orange-700' :
                                                'bg-slate-50 border-slate-100 text-slate-500'
                                            }`}>
                                                <DotStatus status={isActive ? 'active' : isMaint ? 'warning' : 'inactive'} />
                                                <span className="text-[11px] font-black uppercase tracking-widest leading-none">
                                                    {status || 'PENDING'}
                                                </span>
                                            </div>
                                        );
                                    }
                                },
                                { 
                                    header: 'Actions', 
                                    accessor: 'id',
                                    className: 'text-right',
                                    render: (_, org) => (
                                        <div className="flex items-center justify-end gap-2 pr-2">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleEdit(org); }}
                                                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-900 transition-all rounded-xl shadow-sm hover:shadow-md active:scale-95"
                                                title="Edit Blueprint"
                                            >
                                                <FiEdit2 size={15} />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); removeOrg(org.id); }}
                                                className="p-2 text-slate-400 hover:text-rose-500 transition-colors hover:bg-slate-50 rounded-lg group"
                                                title="Decommission"
                                            >
                                                <FiTrash2 size={15} className="group-hover:rotate-12 transition-transform" />
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
                    <div className="flex flex-col items-center justify-center py-24 bg-white/40 border-2 border-dashed border-slate-100 rounded-3xl animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-5 rotate-3">
                            <FiInbox className="w-7 h-7 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-1">No Organizations Found</h3>
                        <p className="text-slate-400 text-xs mb-8 text-center max-w-xs px-6 font-medium leading-relaxed">
                            We couldn't find any organization matching your selection. Try clearing your filters.
                        </p>
                        <button 
                            onClick={() => setFilters({ industry: 'all', status: 'all', region: 'all' })}
                            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
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