import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiX, FiBox, FiMapPin, FiClock, FiUser, 
    FiAlertTriangle, FiAlertCircle, FiCheckCircle, FiMaximize2, FiActivity,
    FiShield, FiLayout, FiInfo
} from 'react-icons/fi';
import Badge from '../../UI/Badge';
import Button from '../../UI/Button';

const AssetInventoryModal = ({ asset, isOpen, onClose }) => {
    if (!asset) return null;

    const statusColor = asset.status === 'Verified' ? 'success' : asset.status === 'Mismatch' ? 'danger' : 'warning';
    const StatusIcon = asset.status === 'Verified' ? FiCheckCircle : asset.status === 'Mismatch' ? FiAlertCircle : FiClock;

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
                        className="fixed inset-0 bg-title/40 backdrop-blur-md z-[10000]"
                    />
                    
                    {/* Unified Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        className="fixed inset-4 md:inset-8 lg:inset-12 bg-page rounded-[32px] border border-border-main shadow-2xl z-[10001] flex flex-col overflow-hidden max-w-7xl mx-auto"
                    >
                        {/* Header - Compact & Premium */}
                        <div className="px-8 py-5 border-b border-border-main bg-card flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-base flex items-center justify-center text-primary border border-border-main shadow-sm">
                                    <FiBox size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-lg font-black text-title tracking-tight leading-none">{asset.name}</h2>
                                    <span className="text-[10px] font-bold text-gray uppercase tracking-[0.2em] mt-1.5 opacity-60">Asset Overview & AI Audit</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="light" color={statusColor} className="py-1 px-3 flex items-center gap-2">
                                    <StatusIcon size={12} /> {asset.status}
                                </Badge>
                                <button 
                                    onClick={onClose}
                                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-base text-gray transition-colors border border-border-main"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Body - Two Column Hybrid */}
                        <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50/20 p-8 space-y-8">
                            
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                
                                {/* Left Column: Metadata & Location (Drawer Content) */}
                                <div className="lg:col-span-4 space-y-8">
                                    {/* Quick Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-[11px] font-black text-gray/40 uppercase tracking-[0.3em]">Identity & Type</h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="p-4 rounded-2xl bg-card border border-border-main/60 shadow-sm">
                                                <span className="text-[9px] font-black text-gray/50 uppercase tracking-widest block mb-1">Unique ID</span>
                                                <code className="text-sm font-black text-title font-mono">{asset.uniqueId}</code>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-card border border-border-main/60 shadow-sm">
                                                <span className="text-[9px] font-black text-gray/50 uppercase tracking-widest block mb-1">Model / Category</span>
                                                <span className="text-sm font-black text-title uppercase">{asset.model} • {asset.type}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location Hierarchy */}
                                    <div className="space-y-4">
                                        <h3 className="text-[11px] font-black text-gray/40 uppercase tracking-[0.3em]">Location Info</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-4 bg-card border border-border-main rounded-2xl shadow-sm">
                                                <div className="w-9 n-9 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                                                    <FiMapPin size={16} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-title uppercase">{asset.org}</span>
                                                    <span className="text-[10px] font-bold text-gray uppercase opacity-60">Site: Main Campus</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-card border border-border-main rounded-2xl shadow-sm">
                                                <div className="w-9 n-9 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                                    <FiLayout size={16} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-title uppercase">{asset.floor}</span>
                                                    <span className="text-[10px] font-bold text-gray uppercase opacity-60">Zone {asset.zone || '104'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Latest Audit */}
                                    <div className="space-y-4">
                                        <h3 className="text-[11px] font-black text-gray/40 uppercase tracking-[0.3em]">Audit Tracking</h3>
                                        <div className="p-4 rounded-2xl bg-amber-50/30 border border-amber-100 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <FiClock className="text-amber-500" size={18} />
                                                <div>
                                                    <p className="text-xs font-black text-title">Last Audit</p>
                                                    <p className="text-[10px] font-bold text-gray mt-0.5">{asset.lastAudit}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 opacity-60">
                                                <FiUser size={12} className="text-gray" />
                                                <span className="text-[10px] font-bold text-title">Admin</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: AI Analysis (Mockup Content) */}
                                <div className="lg:col-span-8 space-y-8">
                                    
                                    {/* Visual Comparison Grid */}
                                    <div className="bg-card rounded-3xl border border-border-main shadow-sm flex flex-col overflow-hidden">
                                        <div className="px-6 py-4 border-b border-border-main flex items-center justify-between bg-base/50">
                                            <h3 className="text-[10px] font-black text-title uppercase tracking-[0.2em]">Visual Evidence Comparison</h3>
                                            <FiMaximize2 className="text-gray/40" size={14} />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2">
                                            {/* Baseline */}
                                            <div className="p-6 border-r border-border-main/50 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-black text-title flex items-center gap-1.5">
                                                        <FiCheckCircle className="text-success" /> Baseline Image
                                                    </span>
                                                    <span className="text-[8px] font-bold text-gray/40 uppercase">Aug 2023</span>
                                                </div>
                                                <div className="aspect-video rounded-2xl border border-success/20 overflow-hidden bg-base">
                                                    <img 
                                                        src="https://images.unsplash.com/photo-1598018554941-0ed5d336302a?q=80&w=400&fit=crop" 
                                                        className="w-full h-full object-cover grayscale-[0.3]"
                                                        alt="Baseline"
                                                    />
                                                </div>
                                            </div>
                                            {/* Current */}
                                            <div className="p-6 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-black text-title flex items-center gap-1.5">
                                                        <FiAlertTriangle className="text-danger" /> Current Audit
                                                    </span>
                                                    <span className="text-[8px] font-bold text-gray/40 uppercase">Aug 2025</span>
                                                </div>
                                                <div className="aspect-video rounded-2xl border border-danger/20 overflow-hidden bg-base relative">
                                                    <img 
                                                        src="https://images.unsplash.com/photo-1598018554941-0ed5d336302a?q=80&w=400&fit=crop" 
                                                        className="w-full h-full object-cover grayscale opacity-40"
                                                        alt="Current"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center p-6">
                                                        <div className="w-full h-full border border-dashed border-danger/50 bg-danger/5 rounded-xl flex items-center justify-center animate-pulse">
                                                            <span className="text-[8px] font-black text-danger uppercase tracking-widest">Missing Object</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Insights & Gauge Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                        <div className="md:col-span-4 bg-card rounded-3xl border border-border-main p-8 flex flex-col items-center justify-center text-center space-y-6">
                                            <h3 className="text-[9px] font-black text-gray/30 uppercase tracking-[0.3em]">Risk Score</h3>
                                            <div className="relative w-28 h-28">
                                                <svg className="w-full h-full" viewBox="0 0 100 100 text-sans">
                                                    <circle className="text-border-main stroke-current" strokeWidth="6" cx="50" cy="50" r="44" fill="transparent"></circle>
                                                    <circle 
                                                        className="text-danger stroke-current" 
                                                        strokeWidth="8" 
                                                        strokeDasharray="163, 276" 
                                                        strokeLinecap="round" 
                                                        cx="50" cy="50" r="44" 
                                                        fill="transparent"
                                                        transform="rotate(-90 50 50)"
                                                    ></circle>
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-2xl font-black text-title">62%</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-black text-title">High Risk Alert</h4>
                                                <p className="text-[9px] font-black text-gray/40 uppercase tracking-widest leading-none">Confidence: 98.4%</p>
                                            </div>
                                        </div>

                                        <div className="md:col-span-8 p-6 bg-card rounded-3xl border border-border-main space-y-4">
                                            <h3 className="text-[9px] font-black text-gray/30 uppercase tracking-[0.3em]">AI Findings</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3 p-3 rounded-xl bg-danger/[0.03] border border-danger/5">
                                                    <FiAlertTriangle className="text-danger shrink-0" size={14} />
                                                    <p className="text-xs font-bold text-title/80 leading-normal">Asset missing from detected coordinates [x:450, y:320].</p>
                                                </div>
                                                <div className="flex items-start gap-3 p-3 rounded-xl bg-warning/[0.03] border border-warning/5">
                                                    <FiInfo className="text-warning shrink-0" size={14} />
                                                    <p className="text-xs font-bold text-title/80 leading-normal">Safety zone violation: Equipment gap exceeds limits.</p>
                                                </div>
                                            </div>
                                            <div className="pt-4 border-t border-border-main/50 flex items-center justify-center">
                                                <span className="text-[8px] font-black text-gray/30 uppercase tracking-[0.3em]">Vision AI Active Monitoring</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                        {/* Actions Footer */}
                        <div className="p-6 border-t border-border-main bg-base/30 shrink-0 flex items-center justify-end gap-3 font-sans">
                            <Button variant="outline" className="!h-10 !px-6 !text-[10px] !font-black !uppercase !tracking-widest rounded-xl">
                                Manage Asset
                            </Button>
                            <Button className="!h-10 !px-6 !text-[10px] !font-black !uppercase !tracking-widest rounded-xl shadow-lg shadow-primary/20">
                                Verify Location Logic
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AssetInventoryModal;
