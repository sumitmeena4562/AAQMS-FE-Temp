import React, { useState } from 'react';
import UserTable from '../../components/Tables/UserTable';
import Button from '../../components/UI/Button';
import { FiRotateCcw, FiFilter, FiPlus } from 'react-icons/fi';

// Dummy data based on the design
const dummyUsers = [
    {
        id: 1,
        name: "Sarah Jenkins",
        email: "sarah.j@acmecorp.com",
        organization: "Acme Corp",
        role: "Coordinator",
        assignment: "unassigned",
        status: "active"
    },
    {
        id: 2,
        name: "David Kim",
        email: "david.kim@ssism.com",
        organization: "SSISM",
        role: "Field Officer",
        assignment: "assigned",
        status: "active"
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        email: "elena.r@globex.org",
        organization: "Globex",
        role: "Coordinator",
        assignment: "assigned",
        status: "active"
    },
    {
        id: 4,
        name: "Marcus Thorne",
        email: "m.thorne@innovate.io",
        organization: "Innovate Ltd",
        role: "Field Officer",
        assignment: "unassigned",
        status: "inactive"
    },
    {
        id: 5,
        name: "Aisha Khan",
        email: "aisha.k@techcore.com",
        organization: "TechCore",
        role: "Coordinator",
        assignment: "assigned",
        status: "active"
    },
    {
        id: 6,
        name: "John Smith",
        email: "j.smith@builders.inc",
        organization: "Builders Inc",
        role: "Field Officer",
        assignment: "assigned",
        status: "active"
    },
    {
        id: 7,
        name: "Yuki Tanaka",
        email: "yuki.t@zensoft.jp",
        organization: "ZenSoft",
        role: "Field Officer",
        assignment: "assigned",
        status: "active"
    },
    {
        id: 8,
        name: "Liam O'Connor",
        email: "liam.oc@emerald.ie",
        organization: "Emerald Eco",
        role: "Coordinator",
        assignment: "unassigned",
        status: "active"
    },
    {
        id: 9,
        name: "Sofia Rossi",
        email: "s.rossi@lume.it",
        organization: "Lume SpA",
        role: "Field Officer",
        assignment: "assigned",
        status: "active"
    },
    {
        id: 10,
        name: "Chen Wei",
        email: "c.wei@easternstar.cn",
        organization: "Eastern Star",
        role: "Coordinator",
        assignment: "assigned",
        status: "inactive"
    }
];

const Users = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        organization: '',
        role: '',
        status: ''
    });

    // Derived filtered users list
    const filteredUsers = React.useMemo(() => {
        return dummyUsers.filter(user => {
            const matchesOrg = !filters.organization || user.organization === filters.organization;
            const matchesRole = !filters.role || user.role === filters.role;
            const matchesStatus = !filters.status || user.status === filters.status;
            return matchesOrg && matchesRole && matchesStatus;
        });
    }, [filters]);

    const resetFilters = () => setFilters({ organization: '', role: '', status: '' });

    // Unique options for filters
    const orgOptions = [...new Set(dummyUsers.map(u => u.organization))];
    const roleOptions = [...new Set(dummyUsers.map(u => u.role))];

    return (
        <div className="flex flex-col w-full " style={{padding:'1%'}}>
            {/* Main Content Area */}
            <div className="w-full px-1">
                {/* Header Row: Title and Actions Combined */}
                <div className="flex justify-between items-end mb-16 mt-4">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-[34px] font-black text-text-primary tracking-tight leading-none">
                            User Management Hub
                        </h2>
                        <div className="text-[14px] font-medium text-text-secondary opacity-70">
                            Directory of {filteredUsers.length} active platform users
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="primary"
                            icon={FiPlus}
                            onClick={() => setIsModalOpen(true)}
                            className="px-8 shadow-pro"
                        >
                            <span>Add New User</span>
                        </Button>
                    </div>
                </div>

                {/* Filter Section (Modern-Pill UI) */}
                <div className="flex items-center gap-4 mb-16 overflow-x-auto pb-4 scrollbar-none">
                    <div className="flex items-center gap-2 text-text-muted text-[10px] font-black uppercase tracking-[0.2em] pr-2">
                        <FiFilter className="text-[12px]" /> Filters
                    </div>

                    {/* Organization Pill */}
                    <div className="relative group">
                        <select
                            value={filters.organization}
                            onChange={(e) => setFilters({ ...filters, organization: e.target.value })}
                            className={`appearance-none border text-[12px] font-extrabold rounded-full pl-5 pr-12 py-2.5 outline-none transition-all cursor-pointer min-w-[170px] shadow-sm
                                ${filters.organization ? 'bg-primary text-text-inverse border-primary' : 'bg-bg-secondary border-border text-text-secondary hover:border-border-hover'}`}
                        >
                            <option value="">By Organization</option>
                            {orgOptions.map(org => <option key={org} value={org}>{org}</option>)}
                        </select>
                        <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${filters.organization ? 'text-text-inverse' : 'text-text-muted group-hover:text-text-secondary'}`}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>

                    {/* Role Pill */}
                    <div className="relative group">
                        <select
                            value={filters.role}
                            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                            className={`appearance-none border text-[12px] font-extrabold rounded-full pl-5 pr-12 py-2.5 outline-none transition-all cursor-pointer min-w-[140px] shadow-sm
                                ${filters.role ? 'bg-primary text-text-inverse border-primary' : 'bg-bg-secondary border-border text-text-secondary hover:border-border-hover'}`}
                        >
                            <option value="">By Role</option>
                            {roleOptions.map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                        <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${filters.role ? 'text-text-inverse' : 'text-text-muted group-hover:text-text-secondary'}`}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>

                    {/* Status Pill */}
                    <div className="relative group">
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className={`appearance-none border text-[12px] font-extrabold rounded-full pl-5 pr-12 py-2.5 outline-none transition-all cursor-pointer min-w-[130px] shadow-sm
                                ${filters.status ? 'bg-primary text-text-inverse border-primary' : 'bg-bg-secondary border-border text-text-secondary hover:border-border-hover'}`}
                        >
                            <option value="">By Status</option>
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive Only</option>
                        </select>
                        <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${filters.status ? 'text-text-inverse' : 'text-text-muted group-hover:text-text-secondary'}`}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>

                    {/* Reset Pill */}
                    {(filters.organization || filters.role || filters.status) && (
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-text-inverse rounded-full hover:opacity-90 transition-all text-[11px] font-black uppercase tracking-widest ml-auto shadow-pro border border-primary/20"
                        >
                            <FiRotateCcw className="text-[13px]" /> Clear All
                        </button>
                    )}
                </div>

                {/* Main Table Surface */}
                <div className="w-full bg-bg-secondary rounded-card border border-border shadow-premium overflow-hidden">
                    <UserTable data={filteredUsers} />
                </div>

                {/* Footer Note */}
                <div className="mt-16 py-12 border-t border-border/30 flex flex-col items-center justify-center gap-5">
                    <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-bg-tertiary/50 border border-border text-[12px] text-text-secondary font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        AI assists detection. Final approval is human-controlled.
                    </div>
                    <p className="text-[10px] text-text-muted uppercase tracking-[0.25em] font-black opacity-60">(c) 2026 AAQMS DASHBOARD</p>
                </div>
            </div>
        </div>
    );
};

export default Users;