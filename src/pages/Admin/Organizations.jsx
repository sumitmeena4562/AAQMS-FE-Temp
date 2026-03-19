import React, { useState, useEffect } from 'react';
import { useOrgStore } from '../../store/useOrgStore';
import OrganizationCard from '../../components/UI/OrganizationCard';
import { FiBriefcase, FiInbox, FiRefreshCcw, FiHome, FiTrendingUp, FiActivity, FiGlobe } from 'react-icons/fi';
import CreateOrganization from '../../components/UI/CreateOrganization';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import useUserStore from '../../store/userStore';
import FilterDropdown from '../../components/UI/FilterDropdown';
import { StatsRow } from '../../components/Dashboard/StatsCard';
import PageHeader from '../../components/Dashboard/pageHeader';

const Organizations = () => {
    const orgs = useOrgStore(state => state.orgs);
    const addOrg = useOrgStore(state => state.addOrg);
    const updateOrg = useOrgStore(state => state.updateOrg);
    const removeOrg = useOrgStore(state => state.removeOrg);
    
    const [filters, setFilters] = useState({ industry: 'all', status: 'all', region: 'all' });
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

                        <div className="h-5 w-[1.5px] bg-slate-100 shrink-0 mx-2" />

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

                {/* THE GRID */}
                {filteredOrgs.length > 0 ? (
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