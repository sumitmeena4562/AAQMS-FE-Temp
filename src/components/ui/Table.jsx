import React from 'react';

const Table = ({ columns, data }) => {
    return (
        <div style={{
            width: '100%',
            overflowX: 'auto',
            background: '#fff',
            borderRadius: 'var(--radius-lg)'
        }}>
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left'
            }}>
                <thead>
                    <tr style={{ background: '#E0E7FF' }}> {/* Light blue header matching design */}
                        {columns.map((col, index) => (
                            <th key={index} style={{
                                padding: '12px 24px',
                                fontSize: '11px',
                                fontWeight: 700,
                                color: 'var(--color-text-secondary)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} style={{
                            borderBottom: '1px solid var(--color-border-light)',
                            transition: 'background var(--transition-fast)'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-secondary)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                        >
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} style={{
                                    padding: '16px 24px',
                                    fontSize: '13px',
                                    color: 'var(--color-text-primary)'
                                }}>
                                    {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
