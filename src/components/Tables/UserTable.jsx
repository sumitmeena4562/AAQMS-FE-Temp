import React from 'react';
import Table from '../UI/Table';
import DotStatus from '../UI/DotStatus';
import UserAvatar from '../UI/UserAvatar';
import { FiExternalLink, FiEdit2 } from 'react-icons/fi';
import { t } from '../../theme/theme';

const ROLE_STYLE = {
    coordinator:    { bg: t.color.coordinatorBg, color: t.color.coordinatorText, border: t.color.coordinatorBorder },
    'field officer':{ bg: t.color.fieldOfficerBg, color: t.color.fieldOfficerText, border: t.color.fieldOfficerBorder },
    admin:          { bg: t.color.adminBg, color: t.color.adminText, border: t.color.adminBorder },
};

const UserTable = ({ data = [], selectedIds = [], onSelectionChange, onRowClick, onEdit }) => {
    const columns = [
        {
            header: 'User',
            accessor: 'name',
            render: (_, row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: t.space.lg }}>
                    <UserAvatar name={row.name} size="32px" fontSize={t.fontSize.xxs} weight={900} />
                    <div>
                        <div style={{ fontSize: t.fontSize.md, fontWeight: 700, color: t.color.text, lineHeight: 1.2 }}>{row.name}</div>
                        <div style={{ fontSize: t.fontSize.xs, color: t.color.textPlaceholder, marginTop: 2, fontWeight: 500 }}>{row.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Organization',
            accessor: 'organization',
            render: value => (
                <span style={{ fontSize: t.fontSize.md, color: value ? t.color.textSecondary : t.color.textPlaceholder, fontStyle: value ? 'normal' : 'italic', fontWeight: 500 }}>
                    {value || 'Not assigned'}
                </span>
            )
        },
        {
            header: 'Role',
            accessor: 'role',
            render: value => {
                const s = ROLE_STYLE[value?.toLowerCase()] || { bg: t.color.bgMuted, color: t.color.textSecondary, border: t.color.border };
                return (
                    <span style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        fontSize: t.fontSize.xxs, fontWeight: 800,
                        background: s.bg, color: s.color,
                        border: `1px solid ${s.border}`,
                        borderRadius: t.radius.pill,
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em'
                    }}>
                        {value}
                    </span>
                );
            }
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (value) => (
                <DotStatus
                    type={value?.toLowerCase() === 'active' ? 'active' : 'inactive'}
                    text={value}
                />
            )
        },
        {
            header: 'Operations',
            accessor: 'assignment',
            render: (value) => (
                <div style={{ display: 'flex', gap: 4 }}>
                   <span style={{ 
                       padding:'2px 8px', 
                       fontSize: t.fontSize.xxs, 
                       fontWeight: 800, 
                       borderRadius: t.radius.sm, 
                       background: value === 'assigned' ? t.color.successBg : t.color.bgMuted, 
                       color: value === 'assigned' ? t.color.success : t.color.textMuted,
                       textTransform: 'uppercase',
                       letterSpacing: '0.04em',
                       border: `1px solid ${value === 'assigned' ? t.color.successBorder : t.color.border}`
                   }}>
                       {value || 'Standby'}
                   </span>
                </div>
            )
        },
        {
            header: '',
            accessor: 'actions',
            render: (_, row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: t.space.sm, justifyContent: 'flex-end' }}>
                    <button
                        title="View profile"
                        onClick={e => { e.stopPropagation(); onRowClick && onRowClick(row); }}
                        style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: t.color.textPlaceholder, borderRadius: t.radius.lg, display: 'flex' }}
                        onMouseEnter={e => { e.currentTarget.style.background = t.color.bgHover; e.currentTarget.style.color = t.color.text; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.color.textPlaceholder; }}
                    >
                        <FiExternalLink size={14} />
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); onEdit && onEdit(row); }}
                        style={{ 
                            padding: '6px 12px', 
                            fontSize: t.fontSize.sm, 
                            fontWeight: 700, 
                            color: t.color.primary, 
                            background: 'transparent', 
                            border: `1px solid ${t.color.border}`, 
                            borderRadius: t.radius.lg, 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = t.color.primaryBg; e.currentTarget.style.borderColor = t.color.primaryBorder; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = t.color.border; }}
                    >
                        <FiEdit2 size={12} />
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

