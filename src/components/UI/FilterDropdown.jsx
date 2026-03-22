import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiCheck, FiX } from 'react-icons/fi';
import useClickOutside from '../../hooks/useClickOutside';

const FilterDropdown = ({ label, value, options = [], onChange, allLabel = 'All' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef(null);

    useClickOutside(containerRef, () => setIsOpen(false));

    useEffect(() => {
        const updatePosition = () => {
            if (isOpen && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setCoords({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width
                });
            }
        };

        updatePosition();

        if (isOpen) {
            window.addEventListener('resize', updatePosition);
            const handleScroll = (e) => {
                if (e.target.nodeType === 1 && !e.target.closest('[role="listbox"]')) {
                    setIsOpen(false);
                }
            };
            window.addEventListener('scroll', handleScroll, true);

            return () => {
                window.removeEventListener('resize', updatePosition);
                window.removeEventListener('scroll', handleScroll, true);
            };
        }
    }, [isOpen]);

    const isFilterActive = value !== undefined && value !== null && value !== '' && value !== 'All' && value !== 'all' && value !== allLabel;

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
                        minWidth: Math.max(coords.width, 120),
                        maxWidth: 220,
                        zIndex: 9999
                    }}
                    className="bg-card border border-border-main rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden p-1.5"
                    role="listbox"
                >
                    <button
                        onClick={() => { onChange(''); setIsOpen(false); }}
                        className={`w-full px-2.5 py-1.5 text-left rounded-lg transition-all duration-200 text-[12px] font-bold group flex items-center justify-between
                            ${!isFilterActive ? 'bg-primary cursor-default' : 'hover:bg-base text-body'}`}
                    >
                        <span className={!isFilterActive ? 'text-white' : 'truncate'}>{allLabel}</span>
                        {!isFilterActive && <FiCheck className="text-white shrink-0" size={13} />}
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
                                    className={`w-full px-2.5 py-1.5 text-left rounded-lg transition-all duration-200 text-[12px] font-bold mt-0.5 group flex items-center justify-between gap-3
                                        ${isSelected ? 'bg-primary text-white cursor-default' : 'hover:bg-base text-body'}`}
                                    role="option"
                                    aria-selected={isSelected}
                                >
                                    <span className="truncate">{lbl}</span>
                                    {isSelected && <FiCheck className="text-white shrink-0" size={13} />}
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
                className={`flex items-center gap-1.5 px-2 py-0.5 bg-card border rounded-md cursor-pointer transition-all duration-300 group whitespace-nowrap
                    ${isOpen
                        ? 'border-primary ring-4 ring-primary/5 shadow-md scale-[1.01]'
                        : isFilterActive
                            ? 'border-blue-300 bg-blue-50/80 hover:border-blue-400 hover:bg-blue-100/50 shadow-sm'
                            : 'border-border-main hover:border-border-hover shadow-sm'}`}
            >
                {isFilterActive ? (
                    <>
                        <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">{label}</span>
                        <span className="h-2 w-[1px] bg-blue-200 mx-0.5" />
                        <span className="text-[11px] font-bold text-blue-900">{getDisplayLabel()}</span>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange('');
                                setIsOpen(false);
                            }}
                            className="ml-0.5 p-0.5 text-blue-400 hover:text-rose-500 hover:bg-rose-50 rounded-sm transition-colors flex items-center justify-center"
                            title="Clear filter"
                        >
                            <FiX size={11} strokeWidth={3} />
                        </div>
                    </>
                ) : (
                    <>
                        <span className="text-[11px] font-bold text-body">{label}</span>
                        <FiChevronDown className={`text-gray transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'group-hover:text-body'}`} size={11} />
                    </>
                )}
            </button>

            {createPortal(dropdownMenu, document.body)}
        </div>
    );
};

export default FilterDropdown;
