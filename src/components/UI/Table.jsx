import React from 'react';

const Table = ({ columns, data }) => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                    <tr className="border-b border-slate-100">
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="group transition-colors duration-200 hover:bg-slate-50/50"
                        >
                            {columns.map((col, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="py-6 px-6 text-[14px] text-slate-700 font-medium whitespace-nowrap align-middle"
                                >
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