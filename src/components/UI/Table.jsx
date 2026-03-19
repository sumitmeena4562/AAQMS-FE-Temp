import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

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
    // O(1) performance boost: Convert selected array to a Set
    const selectedIdSet = useMemo(() => new Set(selectedIds.map(String)), [selectedIds]);

    const isAllSelected = data.length > 0 && data.every(item => selectedIdSet.has(String(item.id)));

    const handleToggleAll = () => {
        if (onSelectionChange) {
            if (isAllSelected) {
                // Remove all visible IDs from the selection
                const visibleIds = data.map(item => String(item.id));
                onSelectionChange(selectedIds.filter(id => !visibleIds.includes(String(id))));
            } else {
                // Add all missing visible IDs to the selection
                const newSelection = [...selectedIds];
                data.forEach(item => {
                    const idStr = String(item.id);
                    if (!newSelection.some(id => String(id) === idStr)) {
                        newSelection.push(item.id);
                    }
                });
                onSelectionChange(newSelection);
            }
        }
    };

    const handleToggleRow = (e, id) => {
        e.stopPropagation();
        if (onSelectionChange) {
            const idStr = String(id);
            const isSelected = selectedIdSet.has(idStr);
            if (isSelected) {
                onSelectionChange(selectedIds.filter(sid => String(sid) !== idStr));
            } else {
                onSelectionChange([...selectedIds, id]);
            }
        }
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Table View */}
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse min-w-[1000px] lg:min-w-full">
                    <thead>
                        <tr className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200/60">
                            {selectable && (
                                <th className="px-4 sm:px-6 py-5 w-14 text-left">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="w-4.5 h-4.5 rounded-[6px] border-slate-300 text-primary focus:ring-primary/20 cursor-pointer transition-all hover:border-primary/50"
                                            checked={isAllSelected}
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
                                const isSelected = selectedIdSet.has(String(row.id));
                                const isClickable = !!onRowClick;

                                return (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: ri * 0.04 }}
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
                                    </motion.tr>
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
        </div>
    );
};

export default Table;