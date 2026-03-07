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
                    <span className="font-extrabold text-[15px] text-text-primary leading-snug">
                        {row.name}
                    </span>
                    <span className="text-[13px] text-text-muted font-medium">
                        {row.email}
                    </span>
                </div>
            )
        },
        {
            header: 'ORGANIZATION',
            accessor: 'organization',
            render: (value) => (
                <span className="text-[14px] font-bold text-text-secondary tracking-tight">
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
                        className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                        ${isCoordinator
                                ? 'bg-bg-tertiary text-text-primary border border-border'
                                : 'bg-bg-primary text-text-secondary border border-border'}
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
                    <div className="scale-95 origin-left font-bold italic">
                        <DotStatus type={value?.toLowerCase()} text={displayValue} />
                    </div>
                );
            }
        },
        {
            header: 'STATUS',
            accessor: 'status',
            render: (value) => (
                <div className="scale-95 origin-left font-bold italic">
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
                    className="text-text-primary hover:bg-bg-tertiary px-5 h-[36px] rounded-full border border-transparent hover:border-border-hover transition-all"
                    onClick={() => row.onEdit && row.onEdit(row)}
                >
                    <span className="text-[12px] font-black uppercase tracking-wider">Edit</span>
                    <FiEdit2 className="w-3.5 h-3.5" />
                </Button>
            )
        }
    ];

    return (
        <div className="w-full">
            <div className="p-8" style={{padding:'1% 2% 1% 5%'} }>
                {/* Custom Header Injection via Table component styling if supported, 
                    otherwise we rely on the columns definition which 'Table' component should use */}
                <Table columns={columns} data={data} />
            </div>
        </div>
    );
};

export default UserTable;
