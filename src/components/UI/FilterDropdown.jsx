import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiCheck, FiX } from 'react-icons/fi';

const FilterDropdown = React.memo(({ 
    label, value, options = [], onChange, allLabel = 'All', 
    multiple = false, disabled = false, loading = false 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef(null);

    // Custom click outside handler that understands Portals
    useEffect(() => {
        const updatePosition = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setCoords({
                    top: rect.bottom + 6, // Fixed positioning: no window.scrollY
                    left: rect.left,
                    width: rect.width
                });
            }
        };

        const handleClickOutside = (event) => {
            if (containerRef.current?.contains(event.target)) return;
            const portalMenu = event.target.closest('[role="listbox"]');
            if (portalMenu) return;
            setIsOpen(false);
        };

        if (isOpen) {
            updatePosition();
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true); // Update on scroll
            
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('touchstart', handleClickOutside);
                window.removeEventListener('resize', updatePosition);
                window.removeEventListener('scroll', updatePosition, true);
            };
        }
    }, [isOpen]);

    const isFilterActive = multiple
        ? (Array.isArray(value) && value.length > 0)
        : (value !== undefined && value !== null && value !== '' && value !== 'All' && value !== 'all' && value !== allLabel);

    const handleSelect = (val) => {
        if (!multiple) {
            onChange(val);
            setIsOpen(false);
            return;
        }

        if (val === '' || val === 'all') {
            onChange([]);
            return;
        }

        if (val === 'select_all') {
            const allOptionValues = options.map(opt => typeof opt === 'string' ? opt : opt.value);
            const currentValues = Array.isArray(value) ? value : [];
            
            // Type-agnostic check for select all
            const isAllSelected = allOptionValues.every(ov => 
                currentValues.some(cv => String(cv) === String(ov))
            );

            if (isAllSelected) {
                onChange([]); // Deselect all
            } else {
                onChange(allOptionValues); // Select all
            }
            return;
        }

        const currentValues = Array.isArray(value) ? [...value] : [];
        const index = currentValues.findIndex(v => String(v) === String(val));
        
        if (index !== -1) {
            currentValues.splice(index, 1);
            onChange(currentValues);
        } else {
            onChange([...currentValues, val]);
        }
    };

    const dropdownMenu = (
        <AnimatePresence>
            {isOpen && (
                <Motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    style={{
                        position: 'fixed',
                        top: coords.top,
                        left: coords.left,
                        width: 'max-content',
                        minWidth: Math.max(coords.width, 140),
                        maxWidth: 240, // Professional balanced width
                        zIndex: 9999
                    }}
                    className="bg-card border border-border-main rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] overflow-hidden p-1"
                    role="listbox"
                >
                    <button
                        onClick={() => handleSelect('')}
                        className={`w-full px-3 py-1.5 text-left rounded-lg transition-all duration-200 text-[10.5px] font-black uppercase tracking-widest group flex items-center gap-2.5
                            ${!isFilterActive ? 'bg-[var(--color-hover-blue)] text-white cursor-default' : 'hover:bg-[var(--color-hover-blue-soft)] text-gray/60'}`}
                    >
                        <div className="flex items-center justify-center w-4 h-4">
                            {!isFilterActive && <FiCheck size={12} />}
                        </div>
                        <span className="truncate">{allLabel}</span>
                    </button>

                    <div className="max-h-[240px] overflow-y-auto pt-0.5 custom-scrollbar">
                        {options.map((opt, i) => {
                            const val = typeof opt === 'string' ? opt : opt.value;
                            const lbl = typeof opt === 'string' ? opt : opt.label;
                            const isSelected = multiple
                                ? (Array.isArray(value) && value.some(v => String(v) === String(val)))
                                : (String(value) === String(val));

                            return (
                                <button
                                    key={val !== undefined && val !== null ? val : i}
                                    id={`option-${val}`}
                                    onClick={() => handleSelect(val)}
                                    className={`w-full px-3 py-1.25 text-left rounded-lg transition-all duration-200 text-[11.5px] font-bold mt-0.5 group flex items-center gap-2.5
                                        ${isSelected ? 'bg-[var(--color-hover-blue-soft)] text-[var(--color-hover-blue)]' : 'hover:bg-[var(--color-hover-blue-soft)]/50 text-body'}`}
                                    role="option"
                                    aria-selected={isSelected}
                                >
                                    {multiple ? (
                                        <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center shrink-0
                                            ${isSelected ? 'bg-primary border-primary' : 'border-border-main/60 bg-white group-hover:border-primary'}`}>
                                            {isSelected && <FiCheck className="text-white" size={10} strokeWidth={4} />}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center w-4 h-4 shrink-0">
                                            {isSelected && <FiCheck size={12} />}
                                        </div>
                                    )}
                                    <span className="truncate">{lbl}</span>
                                </button>
                            );
                        })}
                    </div>
                </Motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div ref={containerRef} className="relative inline-block">
            <button
                disabled={disabled || loading}
                onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 bg-card border rounded-md transition-all duration-300 group whitespace-nowrap
                    ${(disabled || loading)
                        ? 'opacity-60 cursor-not-allowed border-border-main/80 bg-base/30' 
                        : 'cursor-pointer'}
                    ${isOpen
                        ? 'border-[var(--color-hover-blue)] ring-4 ring-[var(--color-hover-blue)]/5 shadow-md scale-[1.01]'
                        : isFilterActive
                            ? 'border-[var(--color-hover-blue)]/30 bg-[var(--color-hover-blue-soft)] hover:border-[var(--color-hover-blue)]/50 hover:bg-[var(--color-hover-blue-soft)] shadow-sm'
                            : !(disabled || loading) ? 'border-border-main hover:border-[var(--color-hover-blue)]/50 shadow-sm' : ''}`}
            >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <span className="text-[11px] font-bold text-gray">{label}...</span>
                    </div>
                ) : isFilterActive ? (
                    <>
                        <div className="flex flex-col items-start leading-tight">
                            <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.12em]">{label}</span>
                            <span className="text-[10px] font-bold text-primary truncate max-w-[140px]">
                                {(() => {
                                    const getLabel = (val) => {
                                        const opt = options.find(o => String(typeof o === 'string' ? o : o.value) === String(val));
                                        if (opt) return typeof opt === 'string' ? opt : opt.label;
                                        // If GUID-like and not found, show loading
                                        if (typeof val === 'string' && val.includes('-') && val.length > 20) return 'Loading...';
                                        return val;
                                    };

                                    if (multiple && Array.isArray(value)) {
                                        if (value.length > 1) return `${value.length} Selected`;
                                        if (value.length === 1) return getLabel(value[0]);
                                    }
                                    if (!multiple) return getLabel(value);
                                    return '';
                                })()}
                            </span>
                        </div>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelect('');
                            }}
                            className="ml-1 p-0.5 text-primary/40 hover:text-danger hover:bg-danger/10 rounded-sm transition-colors flex items-center justify-center"
                            title="Clear filter"
                        >
                            <FiX size={10} strokeWidth={3} />
                        </div>
                    </>
                ) : (
                    <>
                        <span className="text-[11px] font-bold text-body">{label}</span>
                        <FiChevronDown className={`text-gray/50 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'group-hover:text-body'}`} size={11} />
                    </>
                )}
            </button>

            {createPortal(dropdownMenu, document.body)}
        </div>
    );
});

export default FilterDropdown;
