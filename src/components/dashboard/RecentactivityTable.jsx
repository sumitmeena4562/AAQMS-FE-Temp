import React from 'react';
import DataTable from '../UI/DataTable';
import Button from '../UI/Button';
import { FiFilter, FiBox } from 'react-icons/fi';
import { useRecentActivity } from '../../hooks/useDashboardQueries';

// ── Column definitions ──
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
                    <span className="text-[13px] font-semibold text-title whitespace-nowrap">
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
            <span className="text-[13px] text-body font-medium whitespace-nowrap">{value}</span>
        ),
    },
    {
        header: 'Entity',
        accessor: 'entity',
        render: (value) => (
            <span className="text-[13px] text-body whitespace-nowrap">{value}</span>
        ),
    },
    {
        header: 'Details',
        accessor: 'details',
        render: (value) => (
            <span className="text-[13px] text-gray min-w-[200px] block">{value}</span>
        ),
    },
    {
        header: 'Time',
        accessor: 'time',
        render: (value) => (
            <span className="text-[13px] text-gray font-medium whitespace-nowrap">{value}</span>
        ),
    },
];

const RecentActivityTable = () => {
    const { data: activityList, isLoading, isError } = useRecentActivity();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl shadow-sm border border-gray-100 group transition-all duration-300 hover:shadow-md cursor-wait">
                <FiBox className="text-primary animate-pulse mb-3 group-hover:scale-110 transition-transform duration-300" size={44} />
                <span className="text-sm font-semibold text-gray-500 group-hover:text-primary transition-colors">Loading Live Feed...</span>
            </div>
        );
    }

    if (isError) return null;

    return (
        <DataTable
            title="Recent Activity"
            subtitle="Live Feed"
            rightContent={
                <>
                    <Button variant="outline" size="sm" icon={FiFilter} className="!rounded-md !h-[30px] !text-[12px]">
                        Filter
                    </Button>
                    <Button variant="ghost" size="sm" className="!rounded-md !h-[30px] !text-[12px] !text-primary !bg-primary/5 !border !border-primary/20 hover:!bg-primary/10">
                        View All Logs
                    </Button>
                </>
            }
            columns={columns}
            data={activityList}
            emptyMessage="No recent activity"
        />
    );
};

export default RecentActivityTable;
