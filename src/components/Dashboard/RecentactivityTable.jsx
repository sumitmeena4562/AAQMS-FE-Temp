import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../UI/DataTable';
import Button from '../UI/Button';

// ── Column definitions ──
const columns = [
    {
        header: 'Operation',
        accessor: 'type',
        render: (_, row) => {
            const Icon = row.icon;
            return (
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-black/5 ${row.iconBgClass} ${row.iconTextClass}`}>
                        <Icon size={14} />
                    </div>
                    <span className="text-[13px] font-bold text-title whitespace-nowrap tracking-tight">
                        {row.type}
                    </span>
                </div>
            );
        },
    },
    {
        header: 'Context',
        accessor: 'user',
        render: (_, row) => (
            <div className="flex flex-col min-w-[120px]">
                <span className="text-[13px] text-title font-bold leading-none">{row.user}</span>
                <span className="text-[11px] text-slate-500 font-medium mt-1 uppercase tracking-wider">{row.entity}</span>
            </div>
        ),
    },
    {
        header: 'Audit Details',
        accessor: 'details',
        render: (value) => (
            <span className="text-[13px] text-body/90 font-medium min-w-[220px] max-w-[400px] break-words line-clamp-2">
                {value}
            </span>
        ),
    },
    {
        header: 'Timestamp',
        accessor: 'time',
        render: (value, row) => (
            <div className="flex items-center gap-2.5 whitespace-nowrap">
                <div className={`w-1.5 h-1.5 rounded-full ${
                    row.statusVariant === 'danger' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 
                    row.statusVariant === 'warning' ? 'bg-orange-500' :
                    row.statusVariant === 'success' ? 'bg-emerald-500' : 'bg-primary'
                }`} />
                <span className="text-[13px] text-slate-600 font-bold tracking-tight">{value}</span>
            </div>
        ),
    },
];

const RecentActivityTable = ({ data, isLoading, isError }) => {
    const navigate = useNavigate();
    if (isError) return null;

    return (
        <DataTable
            title="Recent Activity"
            subtitle="Live Feed"
            rightContent={
                <Button 
                    onClick={() => navigate('/admin/history')}
                    variant="ghost" 
                    size="sm" 
                    className="!rounded-md !h-[30px] !text-[12px] !text-primary !bg-primary/5 !border !border-primary/20 hover:!bg-primary/10 px-3"
                >
                    View All History
                </Button>
            }
            columns={columns}
            data={data || []}
            loading={isLoading}
            emptyMessage="No recent activity"
        />
    );
};

export default RecentActivityTable;
