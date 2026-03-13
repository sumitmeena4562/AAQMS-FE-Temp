import React from 'react';
import Table from '../UI/Table';
import UserAvatar from '../UI/UserAvatar';
import { FiExternalLink, FiEdit2 } from 'react-icons/fi';

const ROLE_STYLE = {
    coordinator:    'bg-sky-50 text-sky-700 border-sky-100',
    'field officer': 'bg-teal-50 text-teal-700 border-teal-100',
    admin:          'bg-indigo-50 text-indigo-700 border-indigo-200',
    default:        'bg-slate-50 text-slate-600 border-slate-200'
};

const UserTable = ({ data = [], selectedIds = [], onSelectionChange, onRowClick, onEdit }) => {
    const columns = [
        {
            header: 'Personnel Profile',
            accessor: 'name',
            render: (_, row) => (
                <div className="flex items-center gap-3.5 py-0.5">
                    <div className="relative group/avatar shrink-0">
                        <UserAvatar 
                            name={row.name} 
                            size="40px" 
                            className="shadow-sm border-2 border-white ring-1 ring-slate-200 group-hover/avatar:scale-105 transition-transform duration-300" 
                        />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm
                            ${row.status?.toLowerCase() === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} 
                        />
                    </div>
                    <div className="min-w-0">
                        <div className="text-[13px] font-black text-slate-900 tracking-tight leading-tight truncate group-hover:text-primary transition-colors">
                            {row.name}
                        </div>
                        <div className="text-[10px] font-black text-slate-400 tracking-wider uppercase mt-0.5 truncate opacity-80">
                            {row.email}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Organization',
            accessor: 'organization',
            render: value => (
                <div className="flex flex-col">
                    <span className={`text-[13px] font-bold truncate ${value ? 'text-slate-700' : 'text-slate-400 italic font-medium'}`}>
                        {value || 'Independent Contractor'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Primary Unit</span>
                </div>
            )
        },
        {
            header: 'Access Level',
            accessor: 'role',
            render: value => {
                const style = ROLE_STYLE[value?.toLowerCase()] || ROLE_STYLE.default;
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border rounded-md shadow-sm ${style}`}>
                        {value}
                    </span>
                );
            }
        },
        {
            header: 'Operational Status',
            accessor: 'assignment',
            render: (value) => (
                <div className="flex items-center gap-2">
                   <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border rounded-md shadow-inner
                       ${value === 'assigned' 
                           ? 'bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1' 
                           : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                       {value === 'assigned' && <div className="w-1 h-1 rounded-full bg-emerald-500" />}
                       {value || 'On Standby'}
                   </span>
                </div>
            )
        },
        {
            header: 'Personnel Actions',
            accessor: 'actions',
            render: (_, row) => (
                <div className="flex items-center gap-2 justify-end">
                    <button
                        title="View Detailed Profile"
                        onClick={e => { e.stopPropagation(); onRowClick && onRowClick(row); }}
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-300 active:scale-90"
                    >
                        <FiExternalLink size={16} />
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); onEdit && onEdit(row); }}
                        className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#072267] hover:bg-[#072267] hover:text-white border border-[#072267]/20 rounded-lg transition-all duration-300 shadow-sm active:scale-95 group/btn"
                    >
                        <FiEdit2 size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                        Edit
                    </button>
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
