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
        <div className="flex flex-col w-full">
            {/* Main Content Area */}
            <div className="w-full" style={{ padding: '10px' }}>
                {/* Header Row: Title and Actions Combined */}
                <div className="flex justify-between items-center mb-10 mt-10">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-[32px] font-extrabold text-slate-900 tracking-tight leading-none">
                            User Management Hub
                        </h2>
                        <div className="text-[14px] font-semibold text-slate-400 italic mt-2.5">
                            Current directory of {filteredUsers.length} active platform users
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="primary"
                            icon={FiPlus}
                            onClick={() => setIsModalOpen(true)}
                            className="shadow-xl shadow-blue-500/30 h-[36px] px-8 rounded-full"
                        >
                            <span className="text-[14px] font-bold">Add New User</span>
                        </Button>
                    </div>
                </div>

                {/* Filter Section (Modern-Pill UI) */}
                <div className="flex items-center gap-2.5 mb-10 overflow-x-auto pb-2 scrollbar-none">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/60 rounded-full text-slate-500 text-[11px] font-black uppercase tracking-widest border border-slate-200/50">
                        <FiFilter className="text-blue-500" /> Filters
                    </div>

                    {/* Organization Pill */}
                    <div className="relative group">
                        <select
                            value={filters.organization}
                            onChange={(e) => setFilters({ ...filters, organization: e.target.value })}
                            className={`appearance-none border text-[12px] font-bold rounded-full pl-4 pr-10 py-1.5 outline-none transition-all cursor-pointer min-w-[150px]
                                ${filters.organization ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
                        >
                            <option value="">By Organization</option>
                            {orgOptions.map(org => <option key={org} value={org}>{org}</option>)}
                        </select>
                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${filters.organization ? 'text-blue-400' : 'text-slate-400'}`}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>

                    {/* Role Pill */}
                    <div className="relative group">
                        <select
                            value={filters.role}
                            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                            className={`appearance-none border text-[12px] font-bold rounded-full pl-4 pr-10 py-1.5 outline-none transition-all cursor-pointer min-w-[130px]
                                ${filters.role ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
                        >
                            <option value="">By Role</option>
                            {roleOptions.map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${filters.role ? 'text-blue-400' : 'text-slate-400'}`}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>

                    {/* Status Pill */}
                    <div className="relative group">
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className={`appearance-none border text-[12px] font-bold rounded-full pl-4 pr-10 py-1.5 outline-none transition-all cursor-pointer min-w-[120px]
                                ${filters.status ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
                        >
                            <option value="">By Status</option>
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive Only</option>
                        </select>
                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${filters.status ? 'text-blue-400' : 'text-slate-400'}`}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>

                    {/* Reset Pill */}
                    {(filters.organization || filters.role || filters.status) && (
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-full transition-all text-[11px] font-black uppercase tracking-widest ml-2"
                        >
                            <FiRotateCcw className="text-[12px]" /> Clear All
                        </button>
                    )}
                </div>

                {/* Main Table Container */}
                <div className="w-full">
                    <UserTable data={filteredUsers} />
                </div>

                {/* Footer Note */}
                <div className="mt-16 py-12 border-t border-slate-100 flex flex-col items-center justify-center gap-5">
                    <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-50/80 border border-slate-100 text-[12px] text-slate-500 font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        AI assists detection. Final approval is human-controlled.
                    </div>
                    <p className="text-[11px] text-slate-300 uppercase tracking-[0.2em] font-extrabold">(c) 2026 AAQMS DASHBOARD</p>
                </div>
            </div>
        </div>
    );
};

export default Users;