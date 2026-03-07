import Table from '../UI/Table';
import DotStatus from '../UI/DotStatus';
import Button from '../UI/Button';
import { FiEdit2 } from 'react-icons/fi';

const UserTable = ({ data = [] }) => {
    const columns = [
        {
            header: 'EMPLOYEE NAME',
            accessor: 'name',
            render: (_, row) => (
                <div className="flex flex-col py-1">
                    <span className="font-bold text-[15px] text-slate-900 leading-snug">
                        {row.name}
                    </span>
                    <span className="text-[13px] text-slate-500 font-normal">
                        {row.email}
                    </span>
                </div>
            )
        },
        {
            header: 'ORGANIZATION',
            accessor: 'organization',
            render: (value) => (
                <span className="text-[14px] font-semibold text-slate-500 tracking-tight">
                    {value || '------'}
                </span>
            )
        },
        {
            header: 'ROLE',
            accessor: 'role',
            render: (value) => {
                const isCoordinator = value?.toLowerCase() === 'coordinator';
                return (
                    <span
                        className={`inline-flex items-center px-4 py-1.5 rounded-full text-[12px] font-bold tracking-wide shadow-sm
                        ${isCoordinator
                                ? 'bg-purple-50 text-purple-600 border border-purple-100/50'
                                : 'bg-blue-50 text-blue-600 border border-blue-100/50'}
                    `}
                    >
                        {value}
                    </span>
                );
            }
        },
        {
            header: 'ASSIGNMENT',
            accessor: 'assignment',
            render: (value) => {
                const displayValue = value?.toLowerCase() === 'unassigned' ? 'Unassigned' : 'Assigned';
                return (
                    <div className="scale-105 origin-left">
                        <DotStatus type={value?.toLowerCase()} text={displayValue} />
                    </div>
                );
            }
        },
        {
            header: 'STATUS',
            accessor: 'status',
            render: (value) => (
                <div className="scale-105 origin-left">
                    <DotStatus
                        type={value?.toLowerCase()}
                        text={value ? value.charAt(0).toUpperCase() + value.slice(1) : ''}
                    />
                </div>
            )
        },
        {
            header: 'ACTIONS',
            accessor: 'actions',
            render: (_, row) => (
                <Button
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 px-4 h-[38px] rounded-xl"
                    onClick={() => row.onEdit && row.onEdit(row)}
                >
                    <span className="text-[13px] font-bold">Edit Details</span>
                    <FiEdit2 className="w-3.5 h-3.5 opacity-70" />
                </Button>
            )
        }
    ];

    return (
        <div className="w-full flex flex-col gap-8 py-4">
            {/* Premium Table Card */}
            <div
                className="bg-white rounded-[40px] border border-slate-200/60 shadow-[0_25px_60px_rgba(0,0,0,0.05)] overflow-hidden"
                style={{ padding: '56px' }}
            >
                <Table columns={columns} data={data} />
            </div>
        </div>
    );
};

export default UserTable;
