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
            {/* Main Content Area */}
            <div className="px-6 mt-5">
                {/* Filters Section */}
                <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-5 mb-6">
                    <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                        <div className="w-full sm:w-auto min-w-[200px]">
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontFamily: 'inherit' }}>Organization</label>
                            <div className="relative">
                                <select style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#1F2937', fontSize: '14px', borderRadius: '4px', width: '100%', padding: '8px 36px 8px 16px', outline: 'none', appearance: 'none', cursor: 'pointer', fontWeight: 500 }}>
                                    <option>All Organization</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none" style={{ color: '#6B7280' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-auto min-w-[200px]">
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontFamily: 'inherit' }}>Active Status</label>
                            <div className="relative">
                                <select style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#1F2937', fontSize: '14px', borderRadius: '4px', width: '100%', padding: '8px 36px 8px 16px', outline: 'none', appearance: 'none', cursor: 'pointer', fontWeight: 500 }}>
                                    <option>All Statuses</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none" style={{ color: '#6B7280' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-auto min-w-[200px]">
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontFamily: 'inherit' }}>Role</label>
                            <div className="relative">
                                <select style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#1F2937', fontSize: '14px', borderRadius: '4px', width: '100%', padding: '8px 36px 8px 16px', outline: 'none', appearance: 'none', cursor: 'pointer', fontWeight: 500 }}>
                                    <option>All Role</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none" style={{ color: '#6B7280' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '0 20px', height: '38px', fontSize: '14px', fontWeight: 500,
                            borderRadius: '8px', border: '1px solid #D1D5DB',
                            background: '#FFFFFF', color: '#374151', cursor: 'pointer',
                            transition: 'all 150ms ease'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = '#9CA3AF'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.borderColor = '#D1D5DB'; }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.27l-5.3 5.3"></path></svg>
                            Reset
                        </button>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '0 20px', height: '38px', fontSize: '14px', fontWeight: 500,
                            borderRadius: '8px', border: 'none',
                            background: '#2563EB', color: '#FFFFFF', cursor: 'pointer',
                            transition: 'all 150ms ease'
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = '#1D4ED8'}
                            onMouseLeave={e => e.currentTarget.style.background = '#2563EB'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                            Apply Filters
                        </button>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '0 20px', height: '38px', fontSize: '14px', fontWeight: 500,
                            borderRadius: '8px', border: 'none',
                            background: '#0F172A', color: '#FFFFFF', cursor: 'pointer',
                            transition: 'all 150ms ease'
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = '#1E293B'}
                            onMouseLeave={e => e.currentTarget.style.background = '#0F172A'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
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