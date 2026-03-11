import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const FilterDropdown = ({
    label,
    options = [],
    value,
    onChange,
    placeholder = "Select Option",
    className = "",
    minWidth = "160px"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`flex flex-col gap-1 ${className}`} ref={dropdownRef}>
            {/* Label on Top */}
            {label && (
                <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[var(--color-text-muted)] pl-3">
                    {label}
                </span>
            )}

            <div className="relative">
                {/* Trigger Button */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        height: '34px',
                        minWidth: minWidth,
                    }}
                    className={`flex items-center justify-between gap-2 px-4 bg-white border transition-all duration-200 cursor-pointer select-none w-full rounded-full
                        ${isOpen ? 'border-accent ring-2 ring-accent-soft' : 'border-border hover:border-border-hover'}
                        ${value ? 'bg-accent-soft border-accent' : ''}`}
                >
                    <span className={`text-[12.5px] font-medium whitespace-nowrap overflow-hidden text-ellipsis leading-tight
                        ${value ? 'text-text-primary' : 'text-text-secondary'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <FiChevronDown
                        className={`text-[14px] text-text-muted transition-transform duration-300 flex-shrink-0
                            ${isOpen ? 'rotate-180 text-accent' : ''}`}
                    />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div
                        className="absolute top-[calc(100%+8px)] left-0 z-50 py-1.5 bg-white border border-border shadow-xl min-w-full animate-in fade-in slide-in-from-top-2 duration-200"
                        style={{ borderRadius: '12px', minWidth: '220px' }}
                    >
                        <div className="max-h-[280px] overflow-y-auto scrollbar-none">
                            {/* Default "All" Option */}
                            <div
                                onClick={() => { onChange(""); setIsOpen(false); }}
                                className="px-4 py-2.5 text-[12.5px] font-bold text-text-muted hover:bg-bg-hover cursor-pointer transition-colors"
                            >
                                {placeholder}
                            </div>

                            <div className="h-[1px] bg-border/50 mx-2 my-1" />

                            {options.map((option, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`group flex items-center justify-between px-4 py-2.5 text-[13px] font-bold cursor-pointer transition-all
                                        ${value === option.value
                                            ? 'bg-primary/5 text-primary border-r-[3px] border-primary'
                                            : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'}`}
                                >
                                    <span>{option.label}</span>
                                    {value === option.value && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {options.length === 0 && (
                            <div className="px-4 py-6 text-center text-[12px] text-text-muted font-medium italic">
                                No options available
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterDropdown;
