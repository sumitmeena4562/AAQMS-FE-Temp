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
    const [users] = useState(dummyUsers);

    return (
        <div className="flex flex-col w-full">
            {/* Main Content Area */}
            <div className="w-full">

                {/* Row 1: Action Buttons (Top Right) */}
                <div className="flex justify-end items-center gap-3 mb-6">
                    <Button
                        variant="primary"
                        icon={FiPlus}
                        onClick={() => console.log('Add')}
                    >
                        Add New User
                    </Button>
                </div>

                {/* Row 2: Title and Count */}
                <div className="flex justify-between items-end mb-8 px-2 pl-0">
                    <h2 className="text-[32px] font-extrabold text-slate-900 tracking-tight">
                        User Management
                    </h2>
                    <div className="text-[14px] font-semibold text-slate-400 italic">
                        Showing {users.length} total User
                    </div>
                </div>

                {/* Main Table Container */}
                <div className="w-full">
                    <UserTable data={users} />
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