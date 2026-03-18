import React from 'react';
import Table from '../UI/Table';
import Button from '../UI/Button';
import {
    FiAlertTriangle,
    FiUserPlus,
    FiPackage,
    FiCheckCircle,
    FiSettings,
    FiFilter,
} from 'react-icons/fi';

// ── Static Activity Data ──
const ACTIVITY = [
    {
        id: '1',
        type: 'Inventory Mismatch',
        icon: FiAlertTriangle,
        iconBgClass: 'bg-red-50',
        iconTextClass: 'text-red-600',
        user: 'System AI',
        entity: 'Zone B-12',
        details: 'Fire Extinguisher missing in Zone 15-12',
        time: '2 mins ago',
    },
    {
        id: '2',
        type: 'User Onboarding',
        icon: FiUserPlus,
        iconBgClass: 'bg-blue-50',
        iconTextClass: 'text-blue-600',
        user: 'Sarah Jenkins',
        entity: 'Acme Corp',
        details: 'Added 5 new field officers',
        time: '15 mins ago',
    },
    {
        id: '3',
        type: 'Inventory Update',
        icon: FiPackage,
        iconBgClass: 'bg-orange-50',
        iconTextClass: 'text-orange-600',
        user: 'Mike Ross',
        entity: 'Safety Gear Depot',
        details: 'Stock level adjustment (-50 units)',
        time: '1 hour ago',
    },
    {
        id: '4',
        type: 'Report Approval',
        icon: FiCheckCircle,
        iconBgClass: 'bg-purple-50',
        iconTextClass: 'text-purple-600',
        user: 'David Kim',
        entity: 'Monthly Compliance',
        details: 'Report #8821 approved',
        time: '2 hours ago',
    },
    {
        id: '5',
        type: 'System Config',
        icon: FiSettings,
        iconBgClass: 'bg-slate-100',
        iconTextClass: 'text-slate-500',
        user: 'Admin User',
        entity: 'Global Settings',
        details: 'Updated API rate limits',
        time: '4 hours ago',
    },
];

// ── Column definitions for reusable Table.jsx ──
const columns = [
    {
        header: 'Event Type',
        accessor: 'type',
        render: (_, row) => {
            const Icon = row.icon;
            return (
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${row.iconBgClass} ${row.iconTextClass}`}>
                        <Icon size={16} />
                    </div>
                    <span className="text-[13px] font-semibold text-slate-900 whitespace-nowrap">
                        {row.type}
                    </span>
                </div>
            );
        },
    },
    {
        header: 'User / Source',
        accessor: 'user',
        render: (value) => (
            <span className="text-[13px] text-slate-800 font-medium whitespace-nowrap">{value}</span>
        ),
    },
    {
        header: 'Entity',
        accessor: 'entity',
        render: (value) => (
            <span className="text-[13px] text-slate-600 whitespace-nowrap">{value}</span>
        ),
    },
    {
        header: 'Details',
        accessor: 'details',
        render: (value) => (
            <span className="text-[13px] text-slate-500 min-w-[200px] block">{value}</span>
        ),
    },
    {
        header: 'Time',
        accessor: 'time',
        render: (value) => (
            <span className="text-[13px] text-slate-400 font-medium whitespace-nowrap">{value}</span>
        ),
    },
    
];

// ── Main Component ──
const RecentActivityTable = () => {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-pro flex flex-col w-full">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 px-6 border-b border-slate-100 gap-4">
                {/* Left */}
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900 leading-none m-0">
                        Recent Activity
                    </h3>
                    <span className="inline-flex items-center text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-0.5">
                        Live Feed
                    </span>
                </div>
                {/* Right */}
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" icon={FiFilter} className="!rounded-md !h-[30px] !text-[12px]">
                        Filter
                    </Button>
                    <Button variant="ghost" size="sm" className="!rounded-md !h-[30px] !text-[12px] !text-primary !bg-primary/5 !border !border-primary/20 hover:!bg-primary/10">
                        View All Logs
                    </Button>
                </div>
            </div>

            {/* Table Section — uses reusable Table.jsx */}
            <div className="w-full px-2">
                <Table
                    columns={columns}
                    data={ACTIVITY}
                    emptyMessage="No recent activity"
                />
            </div>
        </div>
    );
};

export default RecentActivityTable;
