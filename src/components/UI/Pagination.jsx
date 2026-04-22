import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from './Button';

/**
 * Premium Pagination Component
 * Features:
 * - Responsive page numbers
 * - "..." for large page counts
 * - "Showing X to Y of Z" info
 * - Premium styling with micro-animations
 */
const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    totalItems, 
    itemsPerPage,
    variant = "default", // "default" or "ghost"
    className = "" 
}) => {
    if (totalPages <= 1 && totalItems <= itemsPerPage) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    const isGhost = variant === "ghost";

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 w-full ${isGhost ? '' : 'px-6 py-4 bg-card border border-border-main rounded-2xl shadow-sm'} animate-in fade-in slide-in-from-bottom-2 ${className}`}>
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray uppercase tracking-[0.15em] leading-none mb-1">Navigation</span>
                <p className="text-[12px] font-bold text-title whitespace-nowrap">
                    Showing <span className="text-primary">{startItem}</span> to <span className="text-primary">{endItem}</span> of <span className="text-primary">{totalItems}</span>
                </p>
            </div>

            <div className="flex items-center gap-1.5 bg-base/50 p-1.5 rounded-xl border border-border-main/40">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
                        currentPage === 1 
                        ? 'text-gray/20 cursor-not-allowed' 
                        : 'text-gray hover:text-primary hover:bg-white shadow-sm active:scale-90 border border-transparent hover:border-border-main/50'
                    }`}
                >
                    <FiChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[200px] sm:max-w-none">
                    {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="w-9 h-9 flex items-center justify-center text-gray/40 text-[10px] font-black tracking-widest">
                                    •••
                                </span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(page)}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-[11px] font-black transition-all active:scale-95 ${
                                        currentPage === page
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25 border border-primary'
                                        : 'text-gray/60 hover:text-title hover:bg-white border border-transparent hover:border-border-main/40 shadow-sm'
                                    }`}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
                        currentPage >= totalPages 
                        ? 'text-gray/20 cursor-not-allowed' 
                        : 'text-gray hover:text-primary hover:bg-white shadow-sm active:scale-90 border border-transparent hover:border-border-main/50'
                    }`}
                >
                    <FiChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
