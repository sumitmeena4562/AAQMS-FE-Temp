import React from 'react';

/**
 * Highly reusable Table component using Tailwind CSS.
 */
const Table = ({ 
    columns = [], 
    data = [], 
    onRowClick, 
    selectable = false, 
    selectedIds = [], 
    onSelectionChange,
    className = "",
    emptyMessage = "No data found"
}) => {
    const handleToggleAll = () => {
        if (onSelectionChange) {
            onSelectionChange(selectedIds.length === data.length ? [] : data.map(i => i.id));
        }
    };

    const handleToggleRow = (e, id) => {
        e.stopPropagation();
        if (onSelectionChange) {
            onSelectionChange(selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id]);
        }
    };

    return (
        <div className={`w-full overflow-x-auto no-scrollbar ${className}`}>
            <table className="w-full border-collapse min-w-[1000px]">
                <thead>
                    <tr className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200/60">
                        {selectable && (
                            <th className="px-6 py-5 w-14 text-left">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="w-4.5 h-4.5 rounded-[6px] border-slate-300 text-primary focus:ring-primary/20 cursor-pointer transition-all hover:border-primary/50"
                                        checked={data.length > 0 && selectedIds.length === data.length}
                                        onChange={handleToggleAll}
                                    />
                                </div>
                            </th>
                        )}
                        {columns.map((col, i) => (
                            <th 
                                key={i} 
                                className={`
                                    px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] whitespace-nowrap
                                    ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                                `}
                                style={{ width: col.width || 'auto' }}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 bg-white">
                        {data.length > 0 ? (
                            data.map((row, ri) => {
                                const isSelected = selectedIds.includes(row.id);
                                const isClickable = !!onRowClick;
                                
                                return (
                                    <tr
                                        key={row.id || ri}
                                        onClick={() => onRowClick && onRowClick(row)}
                                        className={`
                                            group transition-all duration-200
                                            ${isSelected ? 'bg-primary/[0.04]' : 'hover:bg-slate-50/70'}
                                            ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                                        `}
                                    >
                                        {selectable && (
                                            <td className="px-6 py-4 w-10 relative">
                                                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[2px_0_10px_rgba(var(--color-primary-rgb),0.3)]" />}
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer transition-all"
                                                        checked={isSelected}
                                                        onChange={e => handleToggleRow(e, row.id)}
                                                        onClick={e => e.stopPropagation()}
                                                    />
                                                </div>
                                            </td>
                                        )}
                                        {columns.map((col, ci) => (
                                            <td 
                                                key={ci} 
                                                className={`
                                                    px-6 py-4 text-[13px] font-medium text-slate-600 vertical-middle
                                                    ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                                                `}
                                            >
                                                {col.render ? col.render(row[col.accessor], row) : (row[col.accessor] || '-')}
                                            </td>
                                        ))}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-20 text-center">
                                <p className="text-slate-400 font-bold text-sm tracking-tight">{emptyMessage}</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;