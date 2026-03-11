import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSearch, FiCheck, FiChevronRight, FiUsers, FiShield, FiActivity, FiTag, FiBriefcase, FiUserCheck, FiFilter } from 'react-icons/fi';
import Button from '../UI/Button';

const CATEGORIES = [
    { id: 'identity', label: 'Identity & Roles', icon: FiUsers },
    { id: 'organization', label: 'Organization Info', icon: FiShield },
    { id: 'assignment', label: 'Work Assignment', icon: FiBriefcase },
    { id: 'status', label: 'Platform Status', icon: FiActivity },
    { id: 'verification', label: 'Security & Trust', icon: FiUserCheck },
];

const UserFilterHub = ({ isOpen, onClose, filters, setFilters, availableOptions, totalCount, activeCount }) => {
    const [activeCategory, setActiveCategory] = useState('identity');
    const [filterSearch, setFilterSearch] = useState('');

    const activeFilterCount = Object.values(filters).filter(v => v && v !== 'all').length;

    const handleReset = () => {
        setFilters({
            organization: '',
            role: '',
            status: 'all',
            assignment: '',
            verification: '',
            activity: ''
        });
    };

    const removeFilter = (key) => {
        setFilters({ ...filters, [key]: key === 'status' ? 'all' : '' });
    };

    // Filter Chips Render
    const renderActiveChips = () => {
        const chips = [];
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== 'all') {
                chips.push({ key, value });
            }
        });

        if (chips.length === 0) return null;

        return (
            <div className="flex flex-wrap gap-2 px-8 py-4 border-b border-border/40 bg-bg-secondary/20">
                {chips.map(chip => (
                    <div key={chip.key} className="flex items-center gap-2 px-4 py-1.5 bg-white border border-border shadow-sm rounded-full">
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{chip.key}:</span>
                        <span className="text-[12px] font-bold text-text-primary capitalize">{chip.value}</span>
                        <button onClick={() => removeFilter(chip.key)} className="ml-1 hover:text-danger p-0.5 rounded-full hover:bg-danger/5 transition-all">
                            <FiX className="text-[14px]" />
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Filter Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 40, stiffness: 400 }}
                        className="fixed right-0 top-0 h-screen w-full max-w-[850px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[101] flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-border/50 flex items-center justify-between">
                            <div className="flex flex-col">
                                <h2 className="text-[24px] font-black text-text-primary tracking-tighter">Additional Filters</h2>
                                <p className="text-[12px] font-bold text-text-muted tracking-tight">
                                    <span className="text-primary">{activeCount}</span> records found matching criteria
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="primary" onClick={onClose} className="px-8 py-2.5 rounded-full text-[12px] font-black uppercase tracking-widest h-auto">
                                    Apply Filters
                                </Button>
                                <button onClick={onClose} className="p-2 hover:bg-bg-secondary rounded-full transition-all text-text-muted">
                                    <FiX className="text-[22px]" />
                                </button>
                            </div>
                        </div>

                        {/* Search Internal Filters */}
                        <div className="px-8 py-4 border-b border-border/50">
                            <div className="relative group">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors text-[18px] opacity-40" />
                                <input
                                    type="text"
                                    placeholder="Search for a specific filter category..."
                                    value={filterSearch}
                                    onChange={(e) => setFilterSearch(e.target.value)}
                                    className="w-full pl-12 pr-6 py-3.5 bg-bg-secondary border-none rounded-xl outline-none text-[14px] font-semibold placeholder:text-text-muted/60"
                                />
                            </div>
                        </div>

                        {/* Active Filter Tags */}
                        {renderActiveChips()}

                        {/* Main Body */}
                        <div className="flex flex-1 overflow-hidden">
                            {/* Left Side: Categories */}
                            <div className="w-[300px] border-r border-border/50 overflow-y-auto pt-4 bg-bg-secondary/10">
                                {CATEGORIES.map(cat => {
                                    const Icon = cat.icon;
                                    const isActive = activeCategory === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`w-full flex items-center justify-between px-8 py-5 transition-all
                                                ${isActive ? 'bg-white border-y border-border/30 relative' : 'hover:bg-bg-hover'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2.5 rounded-xl transition-all ${isActive ? 'bg-primary/10 text-primary shadow-sm' : 'bg-bg-secondary text-text-muted'}`}>
                                                    <Icon className="text-[18px]" />
                                                </div>
                                                <span className={`text-[13px] font-black uppercase tracking-wider ${isActive ? 'text-text-primary' : 'text-text-muted opacity-70'}`}>
                                                    {cat.label}
                                                </span>
                                            </div>
                                            {isActive && (
                                                <motion.div layoutId="catActive" className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-black rounded-r-full" />
                                            )}
                                            <FiChevronRight className={`text-[16px] transition-all ${isActive ? 'text-primary' : 'opacity-20'}`} />
                                        </button>
                                    );
                                })}
                                <div className="mt-8 px-8">
                                    <button 
                                        onClick={handleReset}
                                        className="text-[11px] font-black uppercase tracking-widest text-danger hover:underline"
                                    >
                                        Clear all choices
                                    </button>
                                </div>
                            </div>

                            {/* Right Side: Options Container */}
                            <div className="flex-1 overflow-y-auto p-12 bg-white">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeCategory}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-10"
                                    >
                                        <h3 className="text-[20px] font-black text-text-primary uppercase tracking-[0.1em] border-b border-border pb-4">{activeCategory.replace(/([A-Z])/g, ' $1').trim()}</h3>

                                        {/* Dynamic content based on category */}
                                        <div className="space-y-6">
                                            {activeCategory === 'identity' && (
                                                <div className="space-y-8">
                                                    <div className="space-y-4">
                                                        <label className="text-[11px] font-black uppercase tracking-widest text-primary italic">Select Application Role</label>
                                                        <div className="grid grid-cols-1 gap-3">
                                                            {availableOptions.roles.map(role => (
                                                                <button
                                                                    key={role}
                                                                    onClick={() => setFilters({ ...filters, role: filters.role === role ? '' : role })}
                                                                    className={`flex items-center justify-between px-6 py-4 rounded-2xl border transition-all ${filters.role === role ? 'bg-black text-white border-black shadow-lg translate-x-1' : 'bg-white border-border/60 hover:border-primary/40'}`}
                                                                >
                                                                    <span className="text-[14px] font-bold">{role}</span>
                                                                    {filters.role === role && <FiCheck className="text-primary" />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {activeCategory === 'organization' && (
                                                <div className="space-y-8">
                                                     <div className="space-y-4">
                                                        <label className="text-[11px] font-black uppercase tracking-widest text-primary italic">Associated Organizations</label>
                                                        <div className="grid grid-cols-1 gap-3">
                                                            {availableOptions.organizations.map(org => (
                                                                <button
                                                                    key={org}
                                                                    onClick={() => setFilters({ ...filters, organization: filters.organization === org ? '' : org })}
                                                                    className={`flex items-center justify-between px-6 py-4 rounded-2xl border transition-all ${filters.organization === org ? 'bg-black text-white border-black shadow-lg translate-x-1' : 'bg-white border-border/60 hover:border-primary/40'}`}
                                                                >
                                                                    <span className="text-[14px] font-bold">{org}</span>
                                                                    {filters.organization === org && <FiCheck className="text-primary" />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {activeCategory === 'status' && (
                                                <div className="space-y-8">
                                                     <div className="space-y-4">
                                                        <label className="text-[11px] font-black uppercase tracking-widest text-primary italic">Platform Status</label>
                                                        <div className="flex flex-col gap-3">
                                                            {['all', 'active', 'inactive'].map(status => (
                                                                <button
                                                                    key={status}
                                                                    onClick={() => setFilters({ ...filters, status })}
                                                                    className={`flex items-center justify-between px-6 py-4 rounded-2xl border transition-all ${filters.status === status ? 'bg-black text-white border-black shadow-lg' : 'bg-white border-border/60 hover:bg-bg-secondary'}`}
                                                                >
                                                                    <span className="text-[14px] font-bold uppercase tracking-widest">{status === 'all' ? 'All Platform Users' : status}</span>
                                                                    {filters.status === status && <FiCheck />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {activeCategory === 'assignment' && (
                                                <div className="space-y-8">
                                                     <div className="space-y-4">
                                                        <label className="text-[11px] font-black uppercase tracking-widest text-primary italic">Work Status</label>
                                                        <div className="flex flex-col gap-3">
                                                            {['assigned', 'unassigned'].map(as => (
                                                                <button
                                                                    key={as}
                                                                    onClick={() => setFilters({ ...filters, assignment: filters.assignment === as ? '' : as })}
                                                                    className={`flex items-center justify-between px-6 py-4 rounded-2xl border transition-all ${filters.assignment === as ? 'bg-black text-white border-black shadow-lg' : 'bg-white border-border/60 hover:bg-bg-secondary'}`}
                                                                >
                                                                    <span className="text-[14px] font-bold uppercase tracking-widest">{as}</span>
                                                                    {filters.assignment === as && <FiCheck />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {activeCategory === 'verification' && (
                                                <div className="space-y-8">
                                                    <div className="space-y-4">
                                                        <label className="text-[11px] font-black uppercase tracking-widest text-primary italic">Security Verification</label>
                                                        <div className="flex flex-col gap-3">
                                                             {[
                                                                { label: 'Verified Accounts', value: 'verified' },
                                                                { label: 'Pending Verification', value: 'pending' }
                                                             ].map(v => (
                                                                <button
                                                                    key={v.value}
                                                                    onClick={() => setFilters({ ...filters, verification: filters.verification === v.value ? '' : v.value })}
                                                                    className={`flex items-center justify-between px-6 py-4 rounded-2xl border transition-all ${filters.verification === v.value ? 'bg-black text-white border-black shadow-lg' : 'bg-white border-border/60 hover:bg-bg-secondary'}`}
                                                                >
                                                                    <span className="text-[14px] font-bold uppercase tracking-widest">{v.label}</span>
                                                                    {filters.verification === v.value && <FiCheck />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Footer Call to Action */}
                        <div className="p-8 border-t border-border/50 bg-bg-secondary/10 flex justify-between items-center">
                            <span className="text-[12px] font-bold text-text-muted italic">Selection updates in real-time below</span>
                            <div className="flex gap-4">
                                <Button variant="ghost" onClick={handleReset} className="text-[12px] font-black uppercase">Clear All</Button>
                                <Button variant="primary" onClick={onClose} className="px-10 py-3 rounded-full text-[13px] font-black uppercase shadow-premium">Save Selection</Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default UserFilterHub;
