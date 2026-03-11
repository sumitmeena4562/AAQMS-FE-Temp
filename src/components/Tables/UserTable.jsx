import Table from '../UI/Table';
import DotStatus from '../UI/DotStatus';
import UserAvatar from '../UI/UserAvatar';
import { FiExternalLink } from 'react-icons/fi';

const ROLE_STYLE = {
    coordinator:    { bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' },
    'field officer':{ bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
    admin:          { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
};

const UserTable = ({ data = [], selectedIds = [], onSelectionChange, onRowClick }) => {
    const columns = [
        {
            header: 'User',
            accessor: 'name',
            render: (_, row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <UserAvatar name={row.name} size="30px" fontSize="11px" />
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>{row.name}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{row.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Organization',
            accessor: 'organization',
            render: value => (
                <span style={{ fontSize: 13, color: value ? '#374151' : '#D1D5DB', fontStyle: value ? 'normal' : 'italic' }}>
                    {value || 'Not assigned'}
                </span>
            )
        },
        {
            header: 'Role',
            accessor: 'role',
            render: value => {
                const s = ROLE_STYLE[value?.toLowerCase()] || { bg: '#F3F4F6', color: '#374151', border: '#E5E7EB' };
                return (
                    <span style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        fontSize: 11, fontWeight: 600,
                        background: s.bg, color: s.color,
                        border: `1px solid ${s.border}`,
                        borderRadius: 20,
                    }}>
                        {value}
                    </span>
                );
            }
        },
        {
            header: 'Assignment',
            accessor: 'assignment',
            render: value => (
                <DotStatus
                    type={value?.toLowerCase() === 'assigned' ? 'assigned' : 'unassigned'}
                    text={value}
                />
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: value => (
                <DotStatus
                    type={value?.toLowerCase()}
                    text={value}
                />
            )
        },
        {
            header: '',
            accessor: 'actions',
            render: (_, row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    <button
                        title="View profile"
                        onClick={e => { e.stopPropagation(); onRowClick && onRowClick(row); }}
                        style={{ padding: '4px 6px', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', borderRadius: 5 }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#374151'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#9CA3AF'; }}
                    >
                        <FiExternalLink size={13} />
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); row.onEdit && row.onEdit(row); }}
                        style={{ padding: '4px 10px', fontSize: 12, fontWeight: 600, color: '#4F46E5', background: 'none', border: '1px solid transparent', borderRadius: 6, cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.border = '1px solid #C7D2FE'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.border = '1px solid transparent'; }}
                    >
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
        />
    );
};

export default UserTable;
