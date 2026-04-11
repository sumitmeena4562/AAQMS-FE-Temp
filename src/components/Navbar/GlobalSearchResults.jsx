import React, { useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiBox, FiBriefcase, FiArrowRight, FiLoader, FiUser, FiInfo, FiLayers, FiActivity, FiMap, FiTarget, FiHome, FiSettings, FiBarChart2 } from 'react-icons/fi';
import useSearchStore from '../../store/useSearchStore';
import { userService } from '../../services/userService';
import { inventoryService } from '../../services/inventoryService';
import { organizationService } from '../../services/organizationService';
import useDebounce from '../../hooks/useDebounce';

// --- SYSTEM PAGES CONFIGURATION ---
const SYSTEM_PAGES = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FiHome, category: 'navigation' },
    { name: 'User Management', path: '/admin/users', icon: FiUsers, category: 'navigation' },
    { name: 'Inventory', path: '/admin/inventory', icon: FiBox, category: 'navigation' },
    { name: 'Organizations', path: '/admin/organizations', icon: FiBriefcase, category: 'navigation' },
    { name: 'Coordinators', path: '/admin/coordinators', icon: FiUsers, category: 'navigation' },
    { name: 'Site Plan', path: '/admin/site-plan', icon: FiMap, category: 'navigation' },
    { name: 'Floor Plan', path: '/admin/floor-plan', icon: FiLayers, category: 'navigation' },
    { name: 'Zones', path: '/admin/zones', icon: FiTarget, category: 'navigation' },
    { name: 'Risk Alerts', path: '/admin/risk-alerts', icon: FiActivity, category: 'navigation' },
    { name: 'Reports', path: '/admin/reports', icon: FiBarChart2, category: 'navigation' },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings, category: 'navigation' },
];

const ResultSection = ({ title, icon: Icon, items, onSelect, type, query }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-3 mt-4 mb-2">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-base text-gray/60 border border-border-main/50">
                        <Icon size={14} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray/60">{title}</span>
                </div>
                {type !== 'pages' && (
                    <button 
                        onClick={() => onSelect(null, type)}
                        className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 group"
                    >
                        View All <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                )}
            </div>
            
            <div className="flex flex-col gap-1">
                {items.slice(0, type === 'pages' ? 5 : 3).map((item) => (
                    <button
                        key={item.id || item.path}
                        onClick={() => onSelect(item, type)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-base transition-all text-left group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-white border border-border-main flex items-center justify-center shrink-0 shadow-sm group-hover:border-primary/30 transition-all">
                            {type === 'pages' ? (
                                <item.icon size={14} className="text-gray/60 group-hover:text-primary transition-colors" />
                            ) : type === 'personnel' ? (
                                <FiUser size={14} />
                            ) : type === 'inventory' ? (
                                <FiBox size={14} />
                            ) : (
                                <FiBriefcase size={14} />
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[13px] font-bold text-title truncate group-hover:text-primary transition-colors">
                                {item.name || item.asset_name || item.organisation_name}
                            </span>
                            <span className="text-[10px] text-gray/60 truncate font-medium uppercase tracking-tighter">
                                {type === 'pages' ? 'Quick Navigation' : (item.role || item.unique_id || item.industry || 'System Entity')}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

const GlobalSearchResults = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { query, setResults, results, isGlobalLoading, setGlobalLoading, clearSearch } = useSearchStore();
    const debouncedQuery = useDebounce(query, 500);
    const containerRef = useRef(null);
    const abortControllerRef = useRef(null);

    // ── GLOABL ESCAPE LISTENER ──
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // ── CLICK OUTSIDE LISTENER ──
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // ── INSTANT SEARCH FOR PAGES (0ms Delay) ──
    const matchingPages = useMemo(() => {
        if (!query || query.trim().length < 2) return [];
        return SYSTEM_PAGES.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase().trim())
        );
    }, [query]);

    // ── DEBOUNCED SEARCH FOR DATA (500ms Delay) ──
    useEffect(() => {
        if (!debouncedQuery || debouncedQuery.trim().length < 2) {
            setResults({ personnel: [], inventory: [], organizations: [], pages: [] });
            return;
        }

        // Production-Ready: Abort previous requests
        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();

        const fetchResults = async () => {
            setGlobalLoading(true);
            try {
                /**
                 * Production-Ready: Handle failures gracefully.
                 * If one service fails, we still want to show results from others.
                 */
                const results_raw = await Promise.allSettled([
                    userService.getUsers({}, debouncedQuery, 1, 3),
                    inventoryService.getInventory({ search: debouncedQuery, page_size: 3 }),
                    organizationService.getOrganizations({ search: debouncedQuery, page_size: 3 })
                ]);

                // Extract values from settled promises
                const usersRes = results_raw[0].status === 'fulfilled' ? results_raw[0].value : { users: [] };
                const inventoryRes = results_raw[1].status === 'fulfilled' ? results_raw[1].value : { results: [] };
                const orgsRes = results_raw[2].status === 'fulfilled' ? results_raw[2].value : { results: [] };

                // Double check we haven't started a new search (race condition protection)
                if (abortControllerRef.current?.signal.aborted) return;

                setResults({
                    pages: SYSTEM_PAGES.filter(p => p.name.toLowerCase().includes(debouncedQuery.toLowerCase().trim())),
                    personnel: usersRes.users || [],
                    inventory: inventoryRes.results || [],
                    organizations: orgsRes.results || (Array.isArray(orgsRes) ? orgsRes : [])
                });
            } catch (err) {
                console.error("Global search failed:", err);
            } finally {
                setGlobalLoading(false);
            }
        };

        fetchResults();
        
        return () => {
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, [debouncedQuery, setResults, setGlobalLoading]);

    const handleSelect = (item, type) => {
        if (!item) {
            // "View All" logic
            if (type === 'personnel') navigate('/admin/users');
            if (type === 'inventory') navigate('/admin/inventory');
            if (type === 'organizations') navigate('/admin/organizations');
        } else {
            // Specific item logic
            if (type === 'pages') {
                navigate(item.path);
            } else if (type === 'personnel') {
                navigate(`/admin/users?search=${encodeURIComponent(item.name)}`);
            } else if (type === 'inventory') {
                navigate(`/admin/inventory?search=${encodeURIComponent(item.unique_id || item.name)}`);
            } else if (type === 'organizations') {
                navigate(`/admin/organizations?search=${encodeURIComponent(item.name || item.organisation_name)}`);
            }
        }
        onClose();
        clearSearch();
    };

    // Use query-based matchingPages for the UI to feel instant
    const activePages = matchingPages.length > 0 ? matchingPages : results.pages;

    const hasResults = 
        activePages.length > 0 || 
        (results?.personnel?.length || 0) > 0 || 
        (results?.inventory?.length || 0) > 0 || 
        (results?.organizations?.length || 0) > 0;

    return (
        <AnimatePresence>
            {isOpen && query && (
                <motion.div
                    ref={containerRef}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-card border border-border-main rounded-2xl shadow-xl overflow-hidden z-[2000] p-2 flex flex-col min-h-[100px] max-h-[600px] overflow-y-auto custom-scrollbar"
                >
                    <div className="flex flex-col divide-y divide-border-main/30">
                        {/* Instant Modules Section */}
                        <ResultSection 
                            title="System Modules" 
                            icon={FiLayers} 
                            items={activePages} 
                            onSelect={handleSelect} 
                            type="pages" 
                            query={query} 
                        />

                        {isGlobalLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-3">
                                <FiLoader className="w-6 h-6 text-primary animate-spin" />
                                <span className="text-[11px] font-black uppercase tracking-widest text-gray/40">Fetching universal archives...</span>
                            </div>
                        ) : hasResults ? (
                            <>
                                <ResultSection 
                                    title="Personnel" 
                                    icon={FiUsers} 
                                    items={results.personnel} 
                                    onSelect={handleSelect} 
                                    type="personnel" 
                                    query={query} 
                                />
                                <ResultSection 
                                    title="Inventory" 
                                    icon={FiBox} 
                                    items={results.inventory} 
                                    onSelect={handleSelect} 
                                    type="inventory" 
                                    query={query} 
                                />
                                <ResultSection 
                                    title="Organizations" 
                                    icon={FiBriefcase} 
                                    items={results.organizations} 
                                    onSelect={handleSelect} 
                                    type="organizations" 
                                    query={query} 
                                />
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                                <div className="w-12 h-12 rounded-2xl bg-base border border-border-main flex items-center justify-center mb-4 text-gray/30">
                                    <FiInfo size={24} />
                                </div>
                                <h4 className="text-[14px] font-black text-title uppercase tracking-tight">No Exact Matches</h4>
                                <p className="text-[11px] text-gray/60 font-medium mt-1">Try refining your search query or check the archives manually.</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 p-3 bg-base/50 rounded-xl border border-border-main text-[9px] font-black text-gray/40 uppercase tracking-[0.2em] text-center">
                        AI-Powered Universal Search
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlobalSearchResults;
