import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiCheck, FiX } from 'react-icons/fi';
import useClickOutside from '../../hooks/useClickOutside';

const FilterDropdown = ({ label, value, options = [], onChange, allLabel = 'All', multiple = false, disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef(null);

    // Custom click outside handler that understands Portals
    useEffect(() => {
        const updatePosition = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setCoords({
                    top: rect.bottom + window.scrollY + 6,
                    left: rect.left + window.scrollX,
                    width: rect.width
                });
            }
        };

        const handleClickOutside = (event) => {
            // Check if click is on the trigger button
            if (containerRef.current?.contains(event.target)) return;
            
            // Check if click is inside any portal-rendered dropdown
            const portalMenu = event.target.closest('[role="listbox"]');
            if (portalMenu) return;

            setIsOpen(false);
        };

        if (isOpen) {
            updatePosition(); // Immediate call on open
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
            window.addEventListener('resize', updatePosition);
            
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('touchstart', handleClickOutside);
                window.removeEventListener('resize', updatePosition);
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
                        position: 'absolute',
                        top: coords.top,
                        left: coords.left,
                        width: 'max-content',
                        minWidth: Math.max(coords.width, 160),
                        maxWidth: 240,
                        zIndex: 9999
                    }}
                    className="bg-card border border-border-main rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden p-1.5"
                    role="listbox"
                >
                    <button
                        onClick={() => handleSelect('')}
                        className={`w-full px-3 py-2 text-left rounded-lg transition-all duration-200 text-[11.5px] font-black uppercase tracking-widest group flex items-center gap-3
                            ${!isFilterActive ? 'bg-primary text-white cursor-default' : 'hover:bg-base text-gray/60'}`}
                    >
                        <div className="flex items-center justify-center w-4 h-4">
                            {!isFilterActive && <FiCheck size={13} />}
                        </div>
                        <span className="truncate">{allLabel}</span>
                    </button>

                    {multiple && options.length > 0 && (
                        <button
                            onClick={() => handleSelect('select_all')}
                            className="w-full px-3 py-1.5 text-left rounded-lg transition-all duration-200 text-[10.5px] font-bold text-primary hover:bg-primary/5 flex items-center gap-3 border-b border-border-main/40 mb-1"
                        >
                            <div className="w-4" /> {/* Spacer to align with others */}
                            <span>{Array.isArray(value) && value.length === options.length ? 'Deselect All' : 'Select All'}</span>
                        </button>
                    )}

                    <div className="max-h-[240px] overflow-y-auto no-scrollbar pt-1">
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
                                    className={`w-full px-3 py-2 text-left rounded-lg transition-all duration-200 text-[12px] font-bold mt-0.5 group flex items-center gap-3
                                        ${isSelected ? 'bg-primary/5 text-primary' : 'hover:bg-base text-body'}`}
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
                                            {isSelected && <FiCheck size={13} />}
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
                disabled={disabled}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 bg-card border rounded-md transition-all duration-300 group whitespace-nowrap
                    ${disabled 
                        ? 'opacity-60 cursor-not-allowed border-border-main/80 bg-base/30' 
                        : 'cursor-pointer'}
                    ${isOpen
                        ? 'border-primary ring-4 ring-primary/5 shadow-md scale-[1.01]'
                        : isFilterActive
                            ? 'border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 shadow-sm'
                            : !disabled ? 'border-border-main hover:border-border-hover shadow-sm' : ''}`}
            >
                {isFilterActive ? (
                    <>
                        <div className="flex flex-col items-start leading-tight">
                            <span className="text-[8px] font-black text-primary/60 uppercase tracking-[0.12em]">{label}</span>
                            <span className="text-[10px] font-bold text-primary truncate max-w-[80px]">
                                {multiple && Array.isArray(value) && value.length > 1 
                                    ? `${value.length} Selected` 
                                    : multiple && Array.isArray(value) && value.length === 1
                                        ? options.find(o => String(typeof o === 'string' ? o : o.value) === String(value[0]))?.label || value[0]
                                        : !multiple ? options.find(o => String(typeof o === 'string' ? o : o.value) === String(value))?.label || value : ''}
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
};

export default FilterDropdown;
