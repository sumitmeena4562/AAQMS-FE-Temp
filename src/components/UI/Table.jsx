import React from 'react';

const Table = ({ columns, data }) => {
    return (
        <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="bg-[#EEF2FF]"> {/* Refined Indigo-50 header */}
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                            >
                                <div className="flex items-center gap-2">
                                    {col.header}
                                    {col.accessor !== 'actions' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
                                            <path d="m7 15 5 5 5-5"></path>
                                            <path d="m7 9 5-5 5 5"></path>
                                        </svg>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="border-b border-gray-100 transition-colors duration-150 hover:bg-gray-50"
                        >
                            {columns.map((col, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="px-6 py-4 text-[13px] text-gray-700 font-medium"
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
