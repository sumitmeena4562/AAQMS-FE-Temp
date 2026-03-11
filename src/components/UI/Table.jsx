import React from 'react';

const S = {
    wrapper:    { width: '100%', overflowX: 'auto' },
    table:      { width: '100%', borderCollapse: 'collapse', minWidth: 700 },
    thead:      { backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' },
    th:         { padding: '10px 14px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', textAlign: 'left' },
    thCheck:    { padding: '10px 14px', width: 36 },
    tr:         (selected, clickable) => ({
        borderBottom: '1px solid #F3F4F6',
        backgroundColor: selected ? '#EEF2FF' : 'transparent',
        cursor: clickable ? 'pointer' : 'default',
        transition: 'background 0.1s',
    }),
    td:         { padding: '11px 14px', fontSize: 13, color: '#374151', whiteSpace: 'nowrap', verticalAlign: 'middle' },
    tdCheck:    { padding: '11px 14px', verticalAlign: 'middle', width: 36 },
    checkbox:   { width: 14, height: 14, cursor: 'pointer', accentColor: '#4F46E5' },
};

const Table = ({ columns, data, onRowClick, selectable = false, selectedIds = [], onSelectionChange }) => {
    const handleToggleAll = () => {
        onSelectionChange(selectedIds.length === data.length ? [] : data.map(i => i.id));
    };
    const handleToggleRow = (e, id) => {
        e.stopPropagation();
        onSelectionChange(selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id]);
    };

    return (
        <div style={S.wrapper}>
            <table style={S.table}>
                <thead style={S.thead}>
                    <tr>
                        {selectable && (
                            <th style={S.thCheck}>
                                <input
                                    type="checkbox"
                                    style={S.checkbox}
                                    checked={data.length > 0 && selectedIds.length === data.length}
                                    onChange={handleToggleAll}
                                />
                            </th>
                        )}
                        {columns.map((col, i) => (
                            <th key={i} style={S.th}>{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, ri) => {
                        const isSelected = selectedIds.includes(row.id);
                        return (
                            <tr
                                key={row.id || ri}
                                style={S.tr(isSelected, !!onRowClick)}
                                onClick={() => onRowClick && onRowClick(row)}
                                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = isSelected ? '#EEF2FF' : 'transparent'; }}
                            >
                                {selectable && (
                                    <td style={S.tdCheck}>
                                        <input
                                            type="checkbox"
                                            style={S.checkbox}
                                            checked={isSelected}
                                            onChange={e => handleToggleRow(e, row.id)}
                                            onClick={e => e.stopPropagation()}
                                        />
                                    </td>
                                )}
                                {columns.map((col, ci) => (
                                    <td key={ci} style={S.td}>
                                        {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Table;