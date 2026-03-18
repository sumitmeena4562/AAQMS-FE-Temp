import React, { useState, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import useClickOutside from '../../hooks/useClickOutside';

const FilterDropdown = ({ label, value, options = [], onChange, allLabel = 'All' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useClickOutside(containerRef, () => setIsOpen(false));

    // Get display label for current value
    const getDisplayLabel = () => {
        if (!value) return allLabel;
        const option = options.find(opt => 
            typeof opt === 'string' ? opt === value : opt.value === value
        );
        return typeof option === 'string' ? option : (option?.label || value);
    };

    return (
        <div ref={containerRef} className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 bg-white border rounded-xl cursor-pointer transition-all duration-200 group
                    ${isOpen ? 'border-primary ring-4 ring-primary/5 shadow-sm' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}
            >
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}:</span>
                <span className="text-[13px] font-bold text-slate-700">{getDisplayLabel()}</span>
                <FiChevronDown className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} size={14} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <Motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        className="absolute top-[calc(100%+8px)] left-0 min-w-[180px] bg-white border border-slate-200 rounded-xl shadow-xl z-[100] overflow-hidden p-1.5"
                    >
                        <button 
                            onClick={() => { onChange(''); setIsOpen(false); }}
                            className={`w-full px-3 py-2 text-left rounded-lg transition-colors text-[13px] font-bold
                                ${!value ? 'bg-primary/[0.06] text-primary' : 'hover:bg-slate-50 text-slate-600'}`}
                        >
                            {allLabel}
                        </button>
                        <div className="max-h-[240px] overflow-y-auto no-scrollbar pt-1">
                            {options.map((opt, i) => {
                                const val = typeof opt === 'string' ? opt : opt.value;
                                const lbl = typeof opt === 'string' ? opt : opt.label;
                                const isSelected = value === val;
                                
                                return (
                                    <button 
                                        key={val || i}
                                        onClick={() => { onChange(val); setIsOpen(false); }}
                                        className={`w-full px-3 py-2 text-left rounded-lg transition-colors text-[13px] font-bold mt-0.5
                                            ${isSelected ? 'bg-primary/[0.06] text-primary' : 'hover:bg-slate-50 text-slate-600'}`}
                                    >
                                        {lbl}
                                    </button>
                                );
                            })}
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FilterDropdown;
