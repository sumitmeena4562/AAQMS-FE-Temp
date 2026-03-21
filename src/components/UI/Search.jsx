import React, { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";

const Search = ({
    placeholder = "Search...",
    onSearch,
    className = ""
}) => {
    const [query, setQuery] = useState("");

    // debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onSearch) {
                onSearch(query);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, onSearch]);

    return (
        <div className={`relative w-full ${className}`}>

            {/* Search Icon Container */}
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center text-gray pointer-events-none">
                <FiSearch size={15} strokeWidth={3} />
            </div>

            {/* Input with explicit inline padding to guarantee no overlap */}
            <input
                type="text"
                value={query}
                placeholder={placeholder}
                onChange={(e) => setQuery(e.target.value)}
                style={{ paddingLeft: '42px' }}
                className="block w-full h-10 pr-10 text-[13px] font-medium rounded-full bg-page border border-border-main text-title placeholder-gray focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-50 transition-all duration-200 shadow-btn"
            />

            {/* Clear Button */}
            {query && (
                <button
                    onClick={() => setQuery("")}
                    className="absolute inset-y-0 right-0 pr-[12px] flex items-center focus:outline-none group opacity-75 hover:opacity-100 transition-opacity"
                    title="Clear search"
                >
                    <FiX className="text-gray group-hover:text-title transition-colors" size={14} strokeWidth={3} />
                </button>
            )}
        </div>
    );
};

export default Search;
