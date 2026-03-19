import React, { useState, useEffect } from 'react';
import { useOrgStore } from '../../store/useOrgStore';
import OrganizationCard from '../../components/UI/OrganizationCard';
import { FiActivity, FiBriefcase, FiAlertTriangle, FiInbox, FiRefreshCcw, FiHome } from 'react-icons/fi';
import CreateOrganization from '../../components/UI/CreateOrganization';
import PageHeader from '../../components/UI/PageHeader';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import useUserStore from '../../store/userStore';
import FilterDropdown from '../../components/UI/FilterDropdown';

const Organizations = () => {
    const orgs = useOrgStore(state => state.orgs);
    const addOrg = useOrgStore(state => state.addOrg);
    const updateOrg = useOrgStore(state => state.updateOrg);
    const removeOrg = useOrgStore(state => state.removeOrg);
    
    const [searchQuery, setSearchQuery] = useState("");
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
        const matchesSearch = (org.name || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesIndustry = filters.industry === 'all' || (org.industry || "") === filters.industry;
        const matchesStatus = filters.status === 'all' || (org.status || "") === filters.status;
        const matchesRegion = filters.region === 'all' || (org.region || "") === filters.region;
        return matchesSearch && matchesIndustry && matchesStatus && matchesRegion;
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

    return (
        <div className="flex flex-col min-h-full font-sans animate-in fade-in duration-500">
            <PageHeader 
                addButtonText="Add New Org" 
                onAdd={() => { setEditingOrg(null); setIsCreateModalOpen(true); }}
            />

            <main className="flex-1 w-full pb-20">
              <div className="px-8 mt-6">
                
                {/* 1. SECTION HEADER & FILTERS */}
                <div className="flex flex-col gap-6 mb-8 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-extrabold text-[#111827] tracking-tight">Available Organizations</h2>
                      <span className="px-2.5 py-0.5 bg-slate-200/60 text-slate-600 text-[11px] font-extrabold rounded-lg">
                        {filteredOrgs.length}
                      </span>
                    </div>
                  </div>

                  {/* 2. FILTER BAR (Matches User Management Style) */}
                  <div className="flex flex-wrap items-center gap-3 bg-white/40 p-1 rounded-xl">
                    <div className="relative flex-1 max-w-sm group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search organizations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
                      />
                    </div>

                    <div className="h-4 w-[1px] bg-slate-200 shrink-0 mx-1" />

                    <FilterDropdown 
                      label="Industry"
                      options={industryOptions}
                      value={filters.industry}
                      onChange={(v) => setFilters(prev => ({ ...prev, industry: v }))}
                    />

                    <FilterDropdown 
                      label="Region"
                      options={regionOptions}
                      value={filters.region}
                      onChange={(v) => setFilters(prev => ({ ...prev, region: v }))}
                    />

                    <FilterDropdown 
                      label="Status"
                      options={[
                        { value: 'all', label: 'All Status' },
                        { value: 'ACTIVE', label: 'Active' },
                        { value: 'MAINTENANCE', label: 'Maintenance' },
                        { value: 'DEACTIVE', label: 'Deactive' }
                      ]}
                      value={filters.status}
                      onChange={(v) => setFilters(prev => ({ ...prev, status: v }))}
                    />

                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setFilters({ industry: 'all', status: 'all', region: 'all' });
                      }}
                      className="ml-auto h-10 flex items-center gap-2 px-4 text-slate-400 hover:text-rose-500 font-bold text-[11px] uppercase tracking-widest transition-colors rounded-xl hover:bg-rose-50"
                    >
                      <FiRefreshCcw size={12} />
                      Reset Filters
                    </button>
                  </div>
                </div>

                {/* 3. DYNAMIC GRID / EMPTY STATE */}
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
                  <div className="flex flex-col items-center justify-center py-20 bg-white/50 border border-dashed border-slate-200 rounded-2xl animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <FiInbox className="w-7 h-7 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-1">No Results Found</h3>
                    <p className="text-slate-400 text-xs mb-6 text-center max-w-xs px-6">
                      We couldn't find any organization matching your criteria. Try clearing your filters.
                    </p>
                    <button 
                      onClick={() => { setSearchQuery(""); setFilters({ industry: 'all', status: 'all' }); }}
                      className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      <FiRefreshCcw className="w-3.5 h-3.5" />
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </main>

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