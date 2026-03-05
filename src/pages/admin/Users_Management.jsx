import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import DotStatus from '../../components/ui/DotStatus';
import ActionLink from '../../components/ui/ActionLink';


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
    const [searchQuery, setSearchQuery] = useState("");

    // Define table columns matching the design
    const columns = [
        {
            header: "EMPLOYEE NAME",
            accessor: "employeeName",
            render: (name, row) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-[#111827]">{name}</span>
                    <span className="text-xs text-[#9CA3AF] mt-0.5">{row.email}</span>
                </div>
            )
        },
        {
            header: "ORGANIZATION",
            accessor: "organization",
            render: (org) => <span className="text-sm font-medium text-[#4B5563]">{org}</span>
        },
        {
            header: "ROLE",
            accessor: "role",
            render: (role) => {
                const colorMap = {
                    'Coordinator': { bg: '#FEF3C7', text: '#D97706' },
                    'Field Officer': { bg: '#DBEAFE', text: '#2563EB' }
                };
                const c = colorMap[role] || { bg: '#F3F4F6', text: '#4B5563' };
                return (
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: c.bg,
                        color: c.text
                    }}>
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
        <div className="flex flex-col w-full h-full min-h-screen pb-10" style={{ background: '#F9FAFB' }}>
            {/* Top Bar */}
            <div className="flex justify-between items-center py-3 px-6 border-b" style={{ borderColor: '#E5E7EB', background: '#FFFFFF' }}>
                <div className="flex items-center gap-2">
                    <span style={{ color: '#9CA3AF', fontSize: 13 }}>›</span>
                    <span style={{
                        fontWeight: 600,
                        color: '#2563EB',
                        background: '#EFF6FF',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        textDecoration: 'underline',
                        textUnderlineOffset: '2px'
                    }}>Organizations</span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4" style={{ color: '#9CA3AF' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', fontSize: '13px' }}
                            className="text-[#111827] rounded-full block w-56 pl-10 py-2 outline-none transition-all focus:ring-1 focus:ring-blue-400"
                            placeholder="Search organizations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Bell Icon */}
                    <button style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6B7280' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    </button>

                    {/* Profile Avatar */}
                    <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer'
                    }}>U</div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="px-6 mt-5">
                {/* Filters Section */}
                <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4 mb-6">
                    <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                        <div className="w-full sm:w-auto min-w-[180px]">
                            <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', marginLeft: '4px' }}>Organization</label>
                            <div className="relative">
                                <select style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#1E293B', fontSize: '13px', borderRadius: '9999px', width: '100%', padding: '9px 40px 9px 16px', outline: 'none', appearance: 'none', cursor: 'pointer', fontWeight: 500 }}>
                                    <option>All Organization</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none" style={{ color: '#94A3B8' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-auto min-w-[180px]">
                            <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', marginLeft: '4px' }}>Active Status</label>
                            <div className="relative">
                                <select style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#1E293B', fontSize: '13px', borderRadius: '9999px', width: '100%', padding: '9px 40px 9px 16px', outline: 'none', appearance: 'none', cursor: 'pointer', fontWeight: 500 }}>
                                    <option>All Statuses</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none" style={{ color: '#94A3B8' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-auto min-w-[180px]">
                            <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', marginLeft: '4px' }}>Role</label>
                            <div className="relative">
                                <select style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#1E293B', fontSize: '13px', borderRadius: '9999px', width: '100%', padding: '9px 40px 9px 16px', outline: 'none', appearance: 'none', cursor: 'pointer', fontWeight: 500 }}>
                                    <option>All Role</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none" style={{ color: '#94A3B8' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full xl:w-auto">
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '0 18px', height: '40px', fontSize: '13px', fontWeight: 500,
                            borderRadius: '9999px', border: '1px solid #E5E7EB',
                            background: '#FFFFFF', color: '#4B5563', cursor: 'pointer',
                            transition: 'all 150ms ease'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                            Reset
                        </button>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '0 18px', height: '40px', fontSize: '13px', fontWeight: 500,
                            borderRadius: '9999px', border: 'none',
                            background: '#3B82F6', color: '#FFFFFF', cursor: 'pointer',
                            transition: 'all 150ms ease'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                            Apply Filters
                        </button>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '0 18px', height: '40px', fontSize: '13px', fontWeight: 500,
                            borderRadius: '9999px', border: 'none',
                            background: '#0F172A', color: '#FFFFFF', cursor: 'pointer',
                            transition: 'all 150ms ease'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Add New User
                        </button>
                    </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', marginBottom: '24px' }} />

                {/* Table Title Area */}
                <div className="flex justify-between items-end mb-4">
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>User Management</h2>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#9CA3AF' }}>Showing {users.length} total User</span>
                </div>

                {/* Main Table Container */}
                <div style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                    padding: '6px'
                }}>
                    <Table columns={columns} data={users} />
                </div>

                {/* Footer Note */}
                <div className="mt-8 flex justify-center items-center gap-2" style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    AI assists detection. Final approval is human-controlled.
                </div>
            </div>
        </div>
    );
};

export default Users;