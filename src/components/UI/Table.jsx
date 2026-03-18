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
        <div className={`w-full ${className}`}>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse min-w-[1000px] lg:min-w-full">
                    <thead>
                        <tr className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200/60">
                            {selectable && (
                                <th className="px-4 sm:px-6 py-5 w-14 text-left">
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
                                        px-4 sm:px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] whitespace-nowrap
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
                                            group transition-all duration-300
                                            ${isSelected ? 'bg-primary/[0.04]' : 'hover:bg-slate-50/70'}
                                            ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                                        `}
                                    >
                                        {selectable && (
                                            <td className="px-4 sm:px-6 py-4 w-10 relative">
                                                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[2px_0_12px_rgba(var(--color-primary-rgb),0.3)]" />}
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4.5 h-4.5 rounded-[6px] border-slate-300 text-primary focus:ring-primary/20 cursor-pointer transition-all hover:border-primary/50"
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
                                                    px-4 sm:px-6 py-4 text-[13px] font-medium text-slate-600 vertical-middle
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
                                <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-24 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3 opacity-60">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                            <p className="text-xl">📊</p>
                                        </div>
                                        <p className="text-slate-400 font-bold text-sm tracking-tight">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden grid grid-cols-1 gap-4 px-0.5 py-3">
                {data.length > 0 ? (
                    data.map((row, ri) => {
                        const isSelected = selectedIds.includes(row.id);
                        return (
                            <div 
                                key={row.id || ri}
                                onClick={() => onRowClick && onRowClick(row)}
                                className={`
                                    relative p-4 rounded-2xl border transition-all duration-300 active:scale-[0.98]
                                    ${isSelected 
                                        ? 'bg-white border-primary shadow-[0_12px_30px_-8px_rgba(var(--color-primary-rgb),0.12)]' 
                                        : 'bg-white border-slate-100 shadow-sm shadow-slate-200/40 hover:border-slate-200'}
                                `}
                            >
                                {selectable && (
                                    <div className="absolute top-4 right-4 z-10" onClick={e => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded-[6px] border-slate-300 text-primary focus:ring-primary/20 pointer-events-auto shadow-sm"
                                            checked={isSelected}
                                            onChange={e => handleToggleRow(e, row.id)}
                                        />
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {columns.map((col, ci) => (
                                        <div key={ci} className={`flex flex-col space-y-1.5 ${col.accessor === 'actions' ? 'pt-4 border-t border-slate-50' : ''}`}>
                                            {col.header && col.accessor !== 'name' && col.accessor !== 'actions' && (
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em] opacity-90">{col.header}</span>
                                            )}
                                            <div className={`${col.accessor === 'actions' ? 'w-full' : ''}`}>
                                                {col.render ? col.render(row[col.accessor], row) : (row[col.accessor] || '-')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-20 text-center bg-white rounded-2xl border border-slate-100 shadow-sm mx-1">
                        <p className="text-slate-400 font-bold text-sm">{emptyMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Table;