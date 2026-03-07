import React from 'react';

const Table = ({ columns, data }) => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                    <tr className="border-b border-border">
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] whitespace-nowrap transition-colors hover:text-text-primary cursor-default"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="group transition-all duration-200 hover:bg-bg-hover"
                        >
                            {columns.map((col, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="py-6 px-8 text-font-size-sm text-text-secondary font-medium whitespace-nowrap align-middle"
                                >
                                    <div className="transition-transform duration-200 group-hover:translate-x-0.5">
                                        {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                                    </div>
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