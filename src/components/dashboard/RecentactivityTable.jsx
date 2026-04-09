import React from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();



    if (isError) return null;

    return (
        <DataTable
            title="Recent Activity"
            subtitle="Live Feed"
            rightContent={
                <>
                
                    <Button 
                        onClick={() => navigate('/admin/history')}
                        variant="ghost" 
                        size="sm" 
                        className="!rounded-md !h-[30px] !text-[12px] !text-primary !bg-primary/5 !border !border-primary/20 hover:!bg-primary/10"
                    >
                        View All History
                    </Button>
                </>
            }
            columns={columns}
            data={activityList || []}
            loading={isLoading}
            emptyMessage="No recent activity"
        />
    );
};

export default RecentActivityTable;
