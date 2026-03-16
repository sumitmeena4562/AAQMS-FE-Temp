import React from 'react';
import Table from '../UI/Table';
import UserAvatar from '../UI/UserAvatar';
import { FiExternalLink, FiEdit2 } from 'react-icons/fi';
import Badge from '../UI/Badge';
import DotStatus from '../UI/DotStatus';
import Button from '../UI/Button';

const UserTable = ({ data = [], selectedIds = [], onSelectionChange, onRowClick, onEdit }) => {
    const columns = [
        {
            header: 'Personnel Profile',
            accessor: 'name',
            width: '35%',
            render: (_, row) => (
                <div className="flex items-center gap-3 sm:gap-4 py-1.5">
                    <div className="relative group/avatar shrink-0">
                        <UserAvatar 
                            name={row.name} 
                            size="44px" 
                            className="shadow-[0_4px_12px_rgba(0,0,0,0.08)] border-2 border-white ring-1 ring-slate-100/50 group-hover/avatar:scale-110 transition-all duration-500 ease-out" 
                        />
                        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm transition-transform duration-300 group-hover/avatar:scale-110
                            ${row.status?.toLowerCase() === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} 
                        />
                    </div>
                    <div className="min-w-0">
                        <div className="text-[14px] font-bold text-slate-800 tracking-[-0.01em] leading-tight truncate group-hover:text-primary transition-colors duration-300">
                            {row.name}
                        </div>
                        <div className="text-[11px] font-medium text-slate-400 tracking-normal mt-0.5 truncate group-hover:text-slate-500 transition-colors duration-300">
                            {row.email}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Organization',
            accessor: 'organization',
            width: '20%',
            render: value => (
                <div className="flex flex-col py-1">
                    <span className={`text-[13px] font-bold truncate ${value ? 'text-slate-700' : 'text-slate-400 italic font-medium'}`}>
                        {value || 'Contractor'}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em] mt-1 opacity-80">Primary Unit</span>
                </div>
            )
        },
        {
            header: 'Access Level',
            accessor: 'role',
            align: 'center',
            width: '13%',
            render: value => (
                <Badge color={value} variant="light" size="sm" className="font-bold uppercase tracking-[0.12em] text-[9.5px] px-2.5 py-1 rounded-lg">
                    {value}
                </Badge>
            )
        },
        {
            header: 'Operational Status',
            accessor: 'assignment',
            align: 'center',
            width: '13%',
            render: (value) => (
                <div className="flex justify-center">
                    <DotStatus type={value} text={value === 'assigned' ? 'Assigned' : 'Standby'} size="sm" className="font-bold uppercase tracking-wider text-[10px]" />
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: 'actions',
            align: 'right',
            width: '19%',
            render: (_, row) => (
                <div className="flex items-center gap-1.5 sm:gap-2 justify-end">
                    <Button
                        variant="ghost"
                        onClick={e => { e.stopPropagation(); onRowClick && onRowClick(row); }}
                        className="!p-0 !h-9 !w-9 !rounded-xl text-slate-400 hover:!text-primary hover:!bg-primary/5 transition-all duration-300"
                        icon={FiExternalLink}
                        iconSize={18}
                    />
                    <Button
                        variant="primary"
                        onClick={e => { e.stopPropagation(); onEdit && onEdit(row); }}
                        className="!h-9 !px-3 sm:px-5 !rounded-lg !text-[11px] !font-bold !uppercase !tracking-wider shadow-[0_4px_12px_rgba(var(--color-primary-rgb),0.15)] hover:shadow-[0_6px_16px_rgba(var(--color-primary-rgb),0.25)] transition-all duration-300"
                        icon={FiEdit2}
                        iconSize={14}
                    >
                        <span className="hidden sm:inline">Edit</span>
                    </Button>
                </div>
            )
        }
    ];

    return (
        <Table
            columns={columns}
            data={data}
            selectable={true}
            selectedIds={selectedIds}
            onSelectionChange={onSelectionChange}
            onRowClick={onRowClick}
            className="rounded-xl overflow-hidden"
            emptyMessage="No personnel records found"
        />
    );
};

export default UserTable;
