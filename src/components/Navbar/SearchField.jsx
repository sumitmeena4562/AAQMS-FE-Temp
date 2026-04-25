import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import useSearchStore from '../../store/useSearchStore';
import GlobalSearchResults from './GlobalSearchResults';

const SearchField = () => {
    const location = useLocation();
    const { query, setQuery, clearSearch } = useSearchStore();
    const [isPopupOpen, setIsPopupOpen] = React.useState(false);
    
    const isDashboard = location.pathname === '/admin/dashboard';

    // Contextual Placeholders
    const getPlaceholder = () => {
        const path = location.pathname;
        if (path.includes('/admin/users')) return "Search personnel...";
        if (path.includes('/admin/coordinators')) return "Search coordinators...";
        if (path.includes('/admin/inventory')) return "Search unique ID or asset...";
        if (path.includes('/admin/organizations')) return "Search organizations...";
        if (path.includes('/admin/site-plan')) return "Search sites...";
        if (path.includes('/admin/floor-plan')) return "Search floors...";
        return "Search anything...";
    };

    // Optional: Clear search when switching major modules to avoid confusion
    useEffect(() => {
        // You could add logic here to clear search on navigation if desired
        // For now, let's keep it persistent as it feels more "Global"
    }, [location.pathname]);

    return (
        <div className="relative group hidden sm:block">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-primary transition-colors pointer-events-none">
                <FiSearch size={16} strokeWidth={2.5} />
            </span>
            <input
                className="pl-11 pr-10 py-2 bg-base/50 border border-slate-400/50 rounded-full text-sm font-bold text-body outline-none focus:outline-none focus:!outline-none transition-all duration-300 focus:bg-card focus:border-primary/30 focus:shadow-[0_0_15px_0px_rgba(7,34,103,0.1),0_0_0_4px_rgba(7,34,103,0.05)] w-[380px]"
                placeholder={getPlaceholder()}
                value={query}
                onChange={e => {
                    setQuery(e.target.value);
                    if (isDashboard) setIsPopupOpen(true);
                }}
                onFocus={() => {
                    if (isDashboard && query) setIsPopupOpen(true);
                }}
            />
            {query && (
                <button
                    onClick={() => {
                        clearSearch();
                        setIsPopupOpen(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray hover:text-rose-500 transition-colors"
                >
                    <FiX size={14} />
                </button>
            )}

            {isDashboard && (
                <GlobalSearchResults 
                    isOpen={isPopupOpen} 
                    onClose={() => setIsPopupOpen(false)} 
                />
            )}
        </div>
    );
};

export default SearchField;
