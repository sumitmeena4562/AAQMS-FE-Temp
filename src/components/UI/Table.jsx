import React from 'react';

const Table = ({ columns, data }) => {
    return (
        <div className="w-full bg-white rounded-[28px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-max border-collapse text-left">
                    <thead>
                        {/* Image mein header white hai, isliye bg-white aur border-b lagaya hai */}
                        <tr className="bg-white border-b border-gray-100"> 
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-5 text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                >
                                    <div className="flex items-center gap-2">
                                        {col.header}
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
                                        className="px-6 py-4 text-[14px] text-gray-700 font-medium whitespace-nowrap"
                                    >
                                        {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;