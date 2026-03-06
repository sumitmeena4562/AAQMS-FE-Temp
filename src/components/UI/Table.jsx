import React from 'react';

const Table = ({ columns, data }) => {
    return (
        <div className="w-full overflow-x-auto bg-white rounded-lg">
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="bg-[#E0E7FF]"> {/* Light blue header matching design */}
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider"
                            >
                                {col.header}
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
