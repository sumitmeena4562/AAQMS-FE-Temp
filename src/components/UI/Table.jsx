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
    rowClassName,
    emptyMessage = "No data found",
    loading = false
}) => {
    // O(1) performance boost: Convert selected array to a Set
    const selectedIdSet = useMemo(() => new Set(selectedIds.map(String)), [selectedIds]);

    const isAllSelected = data.length > 0 && data.every(item => selectedIdSet.has(String(item.id)));
    
    // Skeleton Rows
    const skeletons = useMemo(() => Array(8).fill(null), []);

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
                <table className="w-full border-collapse min-w-[700px] lg:min-w-full">
                    <thead>
                        <tr className="bg-base border-b border-border-main/80">
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className={`
                                        px-6 py-4.5 text-[10px] font-black text-body uppercase tracking-[0.15em] whitespace-nowrap border-b border-border-main/50 bg-base/30
                                        ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                                        ${col.className || ''}
                                    `}
                                    style={{ width: col.width || 'auto' }}
                                >
                                    {col.header}
                                </th>
                            ))}
                            {selectable && (
                                <th className="px-2 py-3 w-7 text-right">
                                    <div className="flex items-center justify-end">
                                        <input
                                            type="checkbox"
                                            className="w-3.5 h-3.5 rounded-[4px] border-border-main text-primary focus:ring-primary/20 cursor-pointer transition-all hover:border-primary/50"
                                            checked={isAllSelected}
                                            onChange={handleToggleAll}
                                        />
                                    </div>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-main/80 bg-card">
                        {loading ? (
                            skeletons.map((_, i) => (
                                <tr key={`skeleton-${i}`} className="animate-pulse">
                                    {columns.map((col, ci) => (
                                        <td key={`skeleton-cell-${ci}`} className="px-2.5 py-4">
                                            <div className={`h-4 bg-base-300 rounded-lg w-full ${col.align === 'center' ? 'mx-auto' : ''}`} style={{ width: col.width || '100%', maxWidth: '120px' }}></div>
                                        </td>
                                    ))}
                                    {selectable && <td className="px-2 py-4"><div className="w-4 h-4 bg-base-300 rounded mx-auto"></div></td>}
                                </tr>
                            ))
                        ) : data.length > 0 ? (
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
                                            ${isSelected ? 'bg-primary/[0.04]' : 'hover:bg-base/70'}
                                            ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                                            ${rowClassName ? rowClassName(row) : ''}
                                        `}
                                    >
                                        {columns.map((col, ci) => (
                                            <td
                                                key={ci}
                                                className={`
                                                    px-2.5 py-2.5 text-[12px] font-medium text-body vertical-middle
                                                    ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                                                    ${col.className || ''}
                                                `}
                                            >
                                                {col.render ? col.render(row[col.accessor], row) : (row[col.accessor] || '-')}
                                            </td>
                                        ))}
                                        {selectable && (
                                            <td className="px-2 py-2.5 w-7 relative focus-within:z-10">
                                                {isSelected && <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-primary shadow-[-1px_0_8px_rgba(var(--color-primary-rgb),0.2)]" />}
                                                <div className="flex items-center justify-end">
                                                    <input
                                                        type="checkbox"
                                                        className="w-3.5 h-3.5 rounded-[4px] border-border-main text-primary focus:ring-primary/20 cursor-pointer transition-all hover:border-primary/50"
                                                        checked={isSelected}
                                                        onChange={e => handleToggleRow(e, row.id)}
                                                        onClick={e => e.stopPropagation()}
                                                    />
                                                </div>
                                            </td>
                                        )}
                                    </motion.tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-24 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3 opacity-60">
                                        <div className="w-12 h-12 rounded-full bg-base flex items-center justify-center">
                                            <p className="text-xl">📊</p>
                                        </div>
                                        <div className="text-gray font-bold text-sm tracking-tight">{emptyMessage}</div>
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