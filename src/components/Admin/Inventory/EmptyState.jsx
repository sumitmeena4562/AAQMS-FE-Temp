import React from 'react';
import { FiSearch, FiRefreshCcw } from 'react-icons/fi';
import Button from '../../UI/Button';

const EmptyState = ({ onReset }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in duration-500">
            <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-base flex items-center justify-center shadow-inner">
                    <FiSearch size={40} className="text-gray/20" />
                </div>
                <div className="absolute -right-2 -bottom-2 w-10 h-10 rounded-full bg-card border-4 border-base flex items-center justify-center text-rose-500 shadow-sm">
                    <FiSearch size={16} strokeWidth={3} />
                </div>
            </div>
            
            <h3 className="text-xl font-black text-title tracking-tight mb-2">No Assets Found</h3>
            <p className="text-gray text-[13px] font-medium max-w-[280px] leading-relaxed mb-8">
                We couldn't find any assets matching your current filters. Try adjusting your selection or search query.
            </p>
            
            <Button 
                onClick={onReset}
                icon={FiRefreshCcw}
                variant="outline"
                className="!h-10 !px-6 !text-[11px] !font-black !uppercase !tracking-widest border-rose-200 text-rose-500 hover:bg-rose-50"
            >
                Reset All Filters
            </Button>
        </div>
    );
};

export default EmptyState;
