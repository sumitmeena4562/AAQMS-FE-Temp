import React, { useState, useEffect } from "react";

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

            {/* Search Icon Container -  */}
            <div
                 className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center"
  style={{ color: 'var(--color-text-muted, #9CA3AF)' }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </div>

            {/* Input with strict inline padding */}
            <input
                type="text"
                value={query}
                placeholder={placeholder}
                onChange={(e) => setQuery(e.target.value)}
                className="block w-full text-sm rounded-xl focus:outline-none focus:ring-1 transition-all"
                style={{
                    paddingLeft: '32px',
                    paddingRight: '40px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    backgroundColor: 'var(--color-bg-secondary, #F9FAFB)',
                    border: '1px solid var(--color-border, #E5E7EB)',
                    color: 'var(--color-text-primary, #111827)',
                }}
            />

            {/* Clear Button */}
            {query && (
                <button
                    onClick={() => setQuery("")}
                    className="absolute inset-y-0 right-0 pr-[12px] flex items-center focus:outline-none group opacity-75 hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--color-text-muted, #9CA3AF)' }}
                    title="Clear search"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-gray-900 transition-colors">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            )}
        </div>
    );
};

export default Search;