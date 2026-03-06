import React, { useState } from 'react';
import Button from '../../components/UI/Button';
import Table from '../../components/UI/Table';
import Badge from '../../components/UI/Badge';
import DotStatus from '../../components/UI/DotStatus'
import ActionLink from '../../components/UI/ActionLink';


// Dummy data based on the design
const dummyUsers = [
    {
        id: 1,
        employeeName: "Sarah Jenkins",
        email: "sarah.j@acmecorp.com",
        organization: "------",
        role: "Coordinator",
        assignment: "Unassigned",
        status: "Active"
    },
    {
        id: 2,
        employeeName: "David Kim",
        email: "david.kim@acmecorp.com",
        organization: "SSISM",
        role: "Field Officer",
        assignment: "assigned",
        status: "Active"
    }
];

const Users = () => {
    const [users] = useState(dummyUsers);

    // Define table columns matching the design
    const columns = [
        {
            header: "EMPLOYEE NAME",
            accessor: "employeeName",
            render: (name, row) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{name}</span>
                    <span className="text-xs text-gray-400 mt-0.5">{row.email}</span>
                </div>
            )
        },
        {
            header: "ORGANIZATION",
            accessor: "organization",
            render: (org) => <span className="text-sm font-medium text-gray-600">{org}</span>
        },
        {
            header: "ROLE",
            accessor: "role",
            render: (role) => {
                const colorClasses = {
                    'Coordinator': { bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]' },
                    'Field Officer': { bg: 'bg-[#DBEAFE]', text: 'text-[#2563EB]' }
                };
                const c = colorClasses[role] || { bg: 'bg-gray-100', text: 'text-gray-600' };
                return (
                    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold ${c.bg} ${c.text}`}>
                        {role}
                    </span>
                );
            }
        },
        {
            header: "ASSIGNMENT",
            accessor: "assignment",
            render: (assignment) => {
                const type = assignment.toLowerCase() === 'unassigned' ? 'unassigned' : 'assigned';
                return <DotStatus type={type} text={assignment} />;
            }
        },
        {
            header: "STATUS",
            accessor: "status",
            render: (status) => {
                const type = status.toLowerCase() === 'active' ? 'active' : 'inactive';
                return <DotStatus type={type} text={status} />;
            }
        },
        {
            header: "ACTIONS",
            accessor: "actions",
            render: (_, row) => (
                <ActionLink
                    label="Edit Details"
                    type="edit"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    }
                />
            )
        }
    ];

    return (
        <div className="flex flex-col w-full h-full min-h-screen pb-10 bg-[#F9FAFB]">
            {/* Main Content Area */}
            <div className="px-6 mt-5">
                {/* Filters Section */}
                <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-5 mb-6">
                    <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                        <div className="w-full sm:w-auto min-w-[200px]">
                            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 font-inherit">Organization</label>
                            <div className="relative">
                                <select className="bg-white border border-gray-200 text-gray-800 text-sm rounded py-2 pl-4 pr-9 w-full outline-none appearance-none cursor-pointer font-medium">
                                    <option>All Organization</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-auto min-w-[200px]">
                            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 font-inherit">Active Status</label>
                            <div className="relative">
                                <select className="bg-white border border-gray-200 text-gray-800 text-sm rounded py-2 pl-4 pr-9 w-full outline-none appearance-none cursor-pointer font-medium">
                                    <option>All Statuses</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-auto min-w-[200px]">
                            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 font-inherit">Role</label>
                            <div className="relative">
                                <select className="bg-white border border-gray-200 text-gray-800 text-sm rounded py-2 pl-4 pr-9 w-full outline-none appearance-none cursor-pointer font-medium">
                                    <option>All Role</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                        <button className="flex items-center gap-2 px-5 h-[38px] text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 cursor-pointer transition-all duration-150 hover:bg-gray-50 hover:border-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.27l-5.3 5.3"></path></svg>
                            Reset
                        </button>
                        <button className="flex items-center gap-2 px-5 h-[38px] text-sm font-medium rounded-lg border-none bg-blue-600 text-white cursor-pointer transition-all duration-150 hover:bg-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                            Apply Filters
                        </button>
                        <button className="flex items-center gap-2 px-5 h-[38px] text-sm font-medium rounded-lg border-none bg-slate-900 text-white cursor-pointer transition-all duration-150 hover:bg-slate-800">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Add New User
                        </button>
                    </div>
                </div>

                <hr className="border-none border-t border-gray-200 mb-6" />

                {/* Table Title Area */}
                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                    <span className="text-[13px] font-medium text-gray-400">Showing {users.length} total User</span>
                </div>

                {/* Main Table Container */}
                <div className="bg-white rounded-[20px] border border-gray-200 shadow-sm overflow-hidden p-1.5">
                    <Table columns={columns} data={users} />
                </div>

                {/* Footer Note */}
                <div className="mt-8 flex justify-center items-center gap-2 text-[11px] text-gray-400 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    AI assists detection. Final approval is human-controlled.
                </div>
            </div>
        </div>
    );
};

export default Users;