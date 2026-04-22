import React, { useState, useRef, useEffect } from 'react';
import Table from './Table';
import TableSkeleton from './TableSkeleton';
import { FiSearch } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import { DESIGN_TOKENS } from '../../constants/designTokens';

/**
 * Premium DataTable Wrapper
 * Combines a Card, Header, Search/Filter bar, and the base Table component.
 * 
 * Props:
 *   title           - string: Table heading
 *   subtitle        - string: Badge text next to title (e.g. "Live Feed")
 *   rightContent    - ReactNode: Custom buttons/actions on far right header
 *   columns         - array: Column definitions
 *   data            - array: Data objects
 *   loading         - boolean: Show skeleton/loading state
 *   onRowClick      - function: Row click handler
 *   selectable      - boolean: Enable checkboxes
 *   selectedIds     - array: Controlled selection state
 *   onSelectionChange - function: Selection change handler
 *   emptyMessage    - string: Shown when data is empty
 *   searchProps     - object: { value, onChange, placeholder } - shows search bar
 *   filterContent   - ReactNode: Additional filter buttons/dropdowns
 *   footer          - ReactNode: Custom footer content
 *   selectionFooter - ReactNode: Specific footer shown when rows are selected
 *   className       - string: Extra classes for container
 */
const DataTable = React.memo(({
    title,
    subtitle,
    rightContent,
    columns = [],
    data = [],
    loading = false,
    onRowClick,
    selectable = false,
    selectedIds = [],
    onSelectionChange,
    emptyMessage,
    searchProps,
    filterContent,
    footer,
    selectionFooter,
    className = "",
    onRowMouseEnter
}) => {
    const hasSelection = selectable && selectedIds.length > 0;
    const scrollRef = useRef(null);
    const [showLeftFade, setShowLeftFade] = useState(false);
    const [showRightFade, setShowRightFade] = useState(false);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftFade(scrollLeft > 10);
        setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10);
    };

    useEffect(() => {
        handleScroll();
        // Use a small timeout to ensure DOM is updated
        const timer = setTimeout(handleScroll, 100);
        window.addEventListener('resize', handleScroll);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleScroll);
        };
    }, [filterContent, data]);

    const handleWheel = (e) => {
        if (!scrollRef.current) return;
        // If it's mostly vertical scroll, convert to horizontal for this container
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            scrollRef.current.scrollLeft += e.deltaY;
        }
    };

    return (
        <div className={`bg-card border border-border-main rounded-[var(--radius-card)] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col w-full transition-all duration-300 ${className}`}>
            
            {/* 1. Main Header / Selection Header */}
            {hasSelection && selectionFooter ? (
                <div className="flex items-center justify-between py-3 px-4 sm:px-6 bg-primary/[0.04] border-b border-primary/20 animate-in fade-in slide-in-from-top-4 duration-300">
                    {selectionFooter}
                </div>
            ) : (title || rightContent) && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 px-4 sm:px-6 border-b border-border-main/80 gap-4">
                    <div className="flex items-center gap-3">
                        {title && (
                            <h3 
                                className="text-xl font-black leading-none m-0 tracking-tight"
                                style={{ color: DESIGN_TOKENS.COLORS.TEXT_TITLE }}
                            >
                                {title}
                            </h3>
                        )}
                        {subtitle && (
                            <span 
                                className="inline-flex items-center text-[10px] font-black rounded-full px-2.5 py-0.5 uppercase tracking-wider"
                                style={{ 
                                    color: DESIGN_TOKENS.COLORS.TEXT_PRIMARY, 
                                    backgroundColor: DESIGN_TOKENS.COLORS.PRIMARY_SOFT,
                                    border: `1px solid ${DESIGN_TOKENS.COLORS.BORDER}`
                                }}
                            >
                                {subtitle}
                            </span>
                        )}
                    </div>

                    {rightContent && (
                        <div className="flex items-center gap-2">
                            {rightContent}
                        </div>
                    )}
                </div>
            )}

            {/* 2. Secondary Header: Search & Filters (Optional) */}
            {(searchProps || filterContent) && (
                <div className="flex flex-col lg:flex-row lg:items-center justify-between py-4 px-4 sm:px-6 bg-base/40 border-b border-border-main/60 gap-4">
                    {searchProps && (
                        <div className="relative w-full lg:max-w-md group shrink-0">
                            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray group-focus-within:text-primary transition-colors" size={16} />
                            <input
                                type="text"
                                value={searchProps.value}
                                onChange={searchProps.onChange}
                                placeholder={searchProps.placeholder || "Search..."}
                                className="w-full h-11 pl-10 pr-4 bg-card border border-border-main rounded-[var(--radius-input)] text-[13px] font-semibold placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                                style={{ color: DESIGN_TOKENS.COLORS.TEXT_BODY }}
                            />
                        </div>
                    )}
                    
                    {filterContent && (
                        <div className="relative flex-1 min-w-0 flex items-center h-full">
                            {/* Left Fade */}
                            <AnimatePresence>
                                {showLeftFade && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-base to-transparent pointer-events-none z-10" 
                                    />
                                )}
                            </AnimatePresence>

                            <div 
                                ref={scrollRef}
                                onScroll={handleScroll}
                                onWheel={handleWheel}
                                className="flex items-center gap-3.5 flex-1 min-w-0 overflow-x-auto no-scrollbar scroll-smooth py-1"
                            >
                                {filterContent}
                                {/* Spacer to allow fade interaction at the end */}
                                <div className="shrink-0 w-10 h-1" />
                            </div>

                            {/* Right Fade */}
                            <AnimatePresence>
                                {showRightFade && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-base to-transparent pointer-events-none z-[1] flex items-center justify-end" 
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-border-main mr-2 animate-pulse" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            )}

            {/* 3. Table Body */}
            <div className="w-full flex-1 relative min-h-[300px]">
                {loading ? (
                    <div className="absolute inset-0 bg-card/60 z-20 overflow-hidden">
                        <TableSkeleton rows={8} />
                    </div>
                ) : null}
                
                <Table
                    columns={columns}
                    data={data}
                    onRowClick={onRowClick}
                    onRowMouseEnter={onRowMouseEnter}
                    selectable={selectable}
                    selectedIds={selectedIds}
                    onSelectionChange={onSelectionChange}
                    emptyMessage={emptyMessage}
                />
            </div>

            {/* 4. Standard Footer (Optional) */}
            {!hasSelection && footer && (
                <div className="px-7 py-3 bg-base/50 border-t border-border-main flex items-center justify-between">
                    {footer}
                </div>
            )}
        </div>
    );
});

export default DataTable;
