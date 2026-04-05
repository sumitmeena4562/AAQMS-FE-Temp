import React, { useMemo } from 'react';
import Table from '../UI/Table';
import UserAvatar from '../UI/UserAvatar';
import { FiExternalLink, FiEdit2 } from 'react-icons/fi';
import Badge from '../UI/Badge';
import DotStatus from '../UI/DotStatus';
import Button from '../UI/Button';

const UserTable = ({
    data = [],
    selectedIds = [],
    onSelectionChange,
    onRowClick,
    onEdit
}) => {

    const columns = useMemo(() => [
        {
            header: 'Personnel Profile',
            accessor: 'name',
            minWidth: '240px',
            render: (_, row) => (
                <div className="flex items-center gap-3 sm:gap-4 py-1.5">
                    <div className="relative group/avatar shrink-0">
                        <UserAvatar
                            name={row?.name}
                            size="44px"
                            className="shadow-[0_4px_12px_rgba(0,0,0,0.08)] border-2 border-white ring-1 ring-slate-100/50 group-hover/avatar:scale-110 transition-all duration-500 ease-out"
                        />

                        <div
                            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm transition-transform duration-300 group-hover/avatar:scale-110
                            ${row?.status?.toLowerCase?.() === 'active'
                                    ? 'bg-emerald-500'
                                    : 'bg-border-main'
                                }`}
                        />
                    </div>

                    <div className="min-w-0">
                        <div className="text-[14px] font-bold text-title tracking-[-0.01em] leading-tight truncate transition-colors duration-300">
                            {row?.name}
                        </div>

                        <div className="text-[11px] font-medium text-gray tracking-normal mt-0.5 truncate transition-colors duration-300">
                            {row?.email}
                        </div>
                    </div>
                </div>
            )
        },

        {
            header: 'Organization',
            accessor: 'organization',
            minWidth: '180px',
            render: (value) => (
                <div className="flex flex-col py-1">
                    <span className={`text-[13px] font-bold truncate ${value
                        ? 'text-body'
                        : 'text-gray italic font-medium'
                        }`}>
                        {value || 'Contractor'}
                    </span>

                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em] mt-1 opacity-80">
                        Primary Unit
                    </span>
                </div>
            )
        },

        {
            header: 'Access Level',
            accessor: 'role',
            align: 'center',
            minWidth: '140px',
            render: (value) => (
                <Badge
                    color={value}
                    variant="light"
                    size="sm"
                    className="font-bold uppercase tracking-[0.12em] text-[9.5px] px-2.5 py-1 rounded-lg"
                >
                    {value}
                </Badge>
            )
        },

        {
            header: 'Operational Status',
            accessor: 'assignment',
            align: 'center',
            minWidth: '150px',
            render: (value) => (
                <div className="flex justify-center">
                    <DotStatus
                        type={value}
                        text={value === 'assigned' ? 'Assigned' : 'Standby'}
                        size="sm"
                        className="font-bold uppercase tracking-wider text-[10px]"
                    />
                </div>
            )
        },

        {
            header: 'Actions',
            accessor: 'actions',
            minWidth: '160px',
            render: (_, row) => (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-2 justify-end">
                    <Button
                        variant="ghost"
                        aria-label="View user"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRowClick && onRowClick(row);
                        }}
                        className="!h-11 sm:!h-9 !w-full sm:!w-9 !rounded-[var(--radius-button)] text-gray hover:!text-primary hover:!bg-primary/5 transition-all duration-300 border border-border-main/20 sm:border-none shadow-sm sm:shadow-none bg-base sm:bg-transparent"
                        icon={FiExternalLink}
                        iconSize={18}
                    >
                        <span className="sm:hidden font-bold text-[11px] uppercase tracking-wider ml-2">View Full Profile</span>
                    </Button>

                    <Button
                        variant="primary"
                        aria-label="Edit user"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit && onEdit(row);
                        }}
                        className="!h-11 sm:!h-9 !px-4 sm:!px-5 !w-full sm:!w-auto !rounded-[var(--radius-button)] sm:!rounded-[var(--radius-button)] !text-[11px] !font-bold !uppercase !tracking-wider shadow-[0_4px_12px_rgba(var(--color-primary-rgb),0.15)] hover:shadow-[0_6px_16px_rgba(var(--color-primary-rgb),0.25)] transition-all duration-300"
                        icon={FiEdit2}
                        iconSize={14}
                    >
                        Edit Personnel
                    </Button>
                </div>
            )
        }

    ], [onRowClick, onEdit]);


    return (
        <div className="w-full overflow-x-auto">
            <Table
                columns={columns}
                data={data}
                selectable
                selectedIds={selectedIds}
                onSelectionChange={onSelectionChange}
                onRowClick={onRowClick}
                className="rounded-xl overflow-hidden"
                emptyMessage="No personnel records found"
            />
        </div>
    );
};

export default UserTable;