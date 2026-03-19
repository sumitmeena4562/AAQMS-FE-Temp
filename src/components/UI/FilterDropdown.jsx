import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import useClickOutside from '../../hooks/useClickOutside';

const FilterDropdown = ({ label, value, options = [], onChange, allLabel = 'All' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef(null);

    useClickOutside(containerRef, () => setIsOpen(false));

    // Update position when opening
    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    }, [isOpen]);

    // Universal check for empty or 'All' values (Handles boolean 'false' properly)
    const isFilterActive = value !== undefined && value !== null && value !== '' && value !== 'All' && value !== 'all' && value !== allLabel;

    // Get display label for current value
    const getDisplayLabel = () => {
        if (!isFilterActive) return allLabel;
        const option = options.find(opt =>
            typeof opt === 'string' ? opt === value : opt.value === value
        );
        return typeof option === 'string' ? option : (option?.label || value);
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
                        top: coords.top + 8,
                        left: coords.left,
                        width: 'max-content',
                        minWidth: Math.max(coords.width, 140),
                        maxWidth: 220,
                        zIndex: 9999
                    }}
                    className="bg-white border border-slate-200 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden p-1.5"
                    role="listbox" // ARIA role for a list of options
                    aria-activedescendant={value ? `option-${value}` : undefined} // Indicate the currently active option
                >
                    <button
                        onClick={() => { onChange(''); setIsOpen(false); }}
                        className={`w-full px-3 py-2 text-left rounded-lg transition-all duration-200 text-[13px] font-bold group flex items-center justify-between
                            ${!isFilterActive ? 'bg-primary cursor-default' : 'hover:bg-slate-50 text-slate-600'}`}
                    >
                        <span className={!isFilterActive ? 'text-white' : 'truncate'}>{allLabel}</span>
                        {!isFilterActive && <FiCheck className="text-white shrink-0" size={14} />}
                    </button>
                    <div className="max-h-[240px] overflow-y-auto no-scrollbar pt-1">
                        {options.map((opt, i) => {
                            const val = typeof opt === 'string' ? opt : opt.value;
                            const lbl = typeof opt === 'string' ? opt : opt.label;
                            const isSelected = value === val;

                            return (
                                <button
                                    key={val !== undefined && val !== null ? val : i}
                                    id={`option-${val}`}
                                    onClick={() => { onChange(val); setIsOpen(false); }}
                                    className={`w-full px-3 py-2 text-left rounded-lg transition-all duration-200 text-[13px] font-bold mt-0.5 group flex items-center justify-between gap-3
                                        ${isSelected ? 'bg-primary cursor-default' : 'hover:bg-slate-50 text-slate-600'}`}
                                    role="option"
                                    aria-selected={isSelected}
                                    title={typeof lbl === 'string' ? lbl : undefined}
                                >
                                    <span className={`truncate ${isSelected ? 'text-white' : ''}`}>{lbl}</span>
                                    {isSelected && <FiCheck className="text-white shrink-0" size={14} />}
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
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1 bg-white border rounded-lg cursor-pointer transition-all duration-300 group whitespace-nowrap
                    ${isOpen ? 'border-primary ring-4 ring-primary/5 shadow-md scale-[1.01]' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}
            >
                {isFilterActive ? (
                    <>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                        <span className="h-2.5 w-[1px] bg-slate-200 mx-0.5" />
                        <span className="text-[12px] font-bold text-slate-700">{getDisplayLabel()}</span>
                    </>
                ) : (
                    <span className="text-[12px] font-bold text-slate-700">{label}</span>
                )}
                <FiChevronDown className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'group-hover:text-slate-600'}`} size={12} />
            </button>

            {createPortal(dropdownMenu, document.body)}
        </div>
    );
};

export default FilterDropdown;
