import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiX, FiAlertTriangle, FiInfo, FiCheckCircle, 
    FiCalendar, FiUser, FiMaximize2, FiActivity, FiClock
} from 'react-icons/fi';
import Badge from '../../UI/Badge';

const AIAnalysisModal = ({ asset, isOpen, onClose }) => {
    if (!asset) return null;

    // Mock Detail Data (Matching user image)
    const analysisData = {
        zone: asset.zone || "Zone 104",
        assetName: asset.name || "Fire extinguisher",
        status: "Active Risk Alert",
        assetId: asset.uniqueId || "FE-ZN104-091",
        capturedBy: "John Doe",
        timestamp: "24 Oct 2023, 10:30 AM",
        discrepancy: 62,
        confidence: 98.4,
        observations: [
            { type: 'error', text: `Object ${asset.name} missing from detected coordinates [x:450, y:320].` },
            { type: 'warning', text: "Safety zone violation: Equipment gap exceeds 24 hours." },
            { type: 'info', text: "Last verified presence: 23 Aug 2023, 18:00 PM by AI Patrol Bot 04." }
        ]
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
                        className="fixed inset-0 bg-title/60 backdrop-blur-md z-[10000]"
                    />
                    
                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-4 md:inset-10 lg:inset-20 bg-page rounded-[32px] border border-border-main shadow-2xl z-[10001] flex flex-col overflow-hidden max-w-7xl mx-auto"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-border-main bg-card flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-danger/5 text-danger flex items-center justify-center border border-danger/10">
                                    <FiAlertTriangle size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-xl font-black text-title tracking-tight leading-none">AI Analysis Report</h2>
                                    <span className="text-[10px] font-bold text-gray uppercase tracking-[0.2em] mt-1.5 opacity-60">Visual Evidence System</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="light" color="danger" className="animate-pulse py-1.5 px-3">
                                    <FiActivity className="mr-1.5" /> High Risk
                                </Badge>
                                <button 
                                    onClick={onClose}
                                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-base text-gray transition-colors border border-border-main"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Body */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar bg-slate-50/30">
                            
                            {/* Summary Section */}
                            <div className="bg-card rounded-3xl border border-border-main p-8 shadow-sm">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                    <div className="space-y-3">
                                        <h1 className="text-3xl font-black text-title tracking-tighter">
                                            {analysisData.zone} <span className="text-gray/20 font-light mx-2">|</span> {analysisData.assetName}
                                        </h1>
                                        <p className="text-sm text-gray font-medium max-w-xl leading-relaxed opacity-80">
                                            Comparing live site audit data against baseline safety standards. Detected discrepancies require immediate attention.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="bg-base px-5 py-3.5 rounded-2xl border border-border-main/60">
                                            <span className="text-[9px] font-black text-gray/40 uppercase tracking-widest block mb-1">Asset ID</span>
                                            <span className="text-sm font-black text-title font-mono">{analysisData.assetId}</span>
                                        </div>
                                        <div className="bg-base px-5 py-3.5 rounded-2xl border border-border-main/60">
                                            <span className="text-[9px] font-black text-gray/40 uppercase tracking-widest block mb-1">Captured By</span>
                                            <span className="text-sm font-black text-title flex items-center gap-2">
                                                <FiUser className="text-gray/40" /> {analysisData.capturedBy}
                                            </span>
                                        </div>
                                        <div className="bg-base px-5 py-3.5 rounded-2xl border border-border-main/60">
                                            <span className="text-[9px] font-black text-gray/40 uppercase tracking-widest block mb-1">Timestamp</span>
                                            <span className="text-sm font-black text-title flex items-center gap-2">
                                                <FiCalendar className="text-gray/40" /> {analysisData.timestamp}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comparison Grid */}
                            <div className="bg-card rounded-3xl border border-border-main shadow-sm overflow-hidden">
                                <div className="px-8 py-5 border-b border-border-main flex items-center justify-between bg-base/50">
                                    <h3 className="text-[11px] font-black text-title uppercase tracking-[0.25em]">Visual Evidence Comparison</h3>
                                    <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5 hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all">
                                        <FiMaximize2 size={12} /> Expand Images
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    {/* Baseline */}
                                    <div className="p-8 border-r border-border-main/50 space-y-5">
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2 text-sm font-black text-title">
                                                <div className="w-5 h-5 rounded-full bg-success/10 text-success flex items-center justify-center">
                                                    <FiCheckCircle size={12} />
                                                </div>
                                                Baseline Master Image
                                            </span>
                                            <span className="text-[9px] font-black text-gray/40 bg-base px-2 py-1 rounded-md uppercase tracking-wider">Aug 2023</span>
                                        </div>
                                        <div className="aspect-video rounded-[32px] border-2 border-success/20 overflow-hidden bg-base relative group">
                                            <img 
                                                src="https://images.unsplash.com/photo-1598018554941-0ed5d336302a?q=80&w=800&auto=format&fit=crop" 
                                                alt="Baseline" 
                                                className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                                            />
                                            <div className="absolute bottom-6 left-6">
                                                <span className="px-4 py-2 bg-title/80 backdrop-blur-xl border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest">Standard Compliance</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray font-medium leading-relaxed opacity-70 italic">
                                            Expected state: Asset present, mounted correctly, accessible with no obstructions.
                                        </p>
                                    </div>

                                    {/* Current */}
                                    <div className="p-8 space-y-5">
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2 text-sm font-black text-title">
                                                <div className="w-5 h-5 rounded-full bg-danger/10 text-danger flex items-center justify-center">
                                                    <FiAlertTriangle size={12} />
                                                </div>
                                                Current Audit Photo
                                            </span>
                                            <span className="text-[9px] font-black text-gray/40 bg-base px-2 py-1 rounded-md uppercase tracking-wider">Aug 2025</span>
                                        </div>
                                        <div className="aspect-video rounded-[32px] border-2 border-danger/20 overflow-hidden bg-base relative group">
                                            <img 
                                                src="https://images.unsplash.com/photo-1598018554941-0ed5d336302a?q=80&w=800&auto=format&fit=crop" 
                                                alt="Current" 
                                                className="w-full h-full object-cover grayscale opacity-40"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-10">
                                                <div className="w-full h-full border-2 border-dashed border-danger/60 bg-danger/10 rounded-2xl flex items-center justify-center relative animate-pulse">
                                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-danger text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-md shadow-xl">Missing Object</span>
                                                </div>
                                            </div>
                                            <div className="absolute top-6 right-6">
                                                <span className="px-3 py-1.5 bg-danger text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-2xl animate-bounce">Alert</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray font-medium leading-relaxed opacity-70 italic">
                                            Detected state: Designated area is empty. ROI violation detected.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Logic & insights */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
                                <div className="lg:col-span-4 bg-card rounded-[40px] border border-border-main p-10 flex flex-col items-center justify-center text-center space-y-8 shadow-sm">
                                    <h3 className="text-[10px] font-black text-gray/30 uppercase tracking-[0.3em]">Discrepancy Score</h3>
                                    
                                    <div className="relative w-40 h-40">
                                        <svg className="w-full h-full" viewBox="0 0 100 100">
                                            <circle className="text-border-main stroke-current" strokeWidth="6" cx="50" cy="50" r="44" fill="transparent"></circle>
                                            <motion.circle 
                                                initial={{ strokeDasharray: "0, 276" }}
                                                animate={{ strokeDasharray: `${analysisData.discrepancy * 2.76}, 276` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="text-danger stroke-current" 
                                                strokeWidth="10" 
                                                strokeLinecap="round" 
                                                cx="50" cy="50" r="44" 
                                                fill="transparent"
                                                transform="rotate(-90 50 50)"
                                            ></motion.circle>
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-4xl font-black text-title">{analysisData.discrepancy}%</span>
                                            <span className="text-[11px] font-bold text-gray uppercase tracking-tighter opacity-50">Critical</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h4 className="text-lg font-black text-title tracking-tight underline decoration-danger/20 decoration-4 underline-offset-4">High Risk Alert</h4>
                                        <p className="text-[10px] font-black text-gray/40 uppercase tracking-widest">Confidence: {analysisData.confidence}%</p>
                                    </div>
                                </div>

                                <div className="lg:col-span-8 space-y-4">
                                    <h3 className="text-[10px] font-black text-gray/30 uppercase tracking-[0.3em] ml-4">Detailed Findings</h3>
                                    <div className="p-8 bg-card rounded-[40px] border border-border-main shadow-sm space-y-6">
                                        {analysisData.observations.map((obs, i) => (
                                            <div key={i} className={`flex items-start gap-4 p-5 rounded-3xl border transition-all ${
                                                obs.type === 'error' ? 'bg-danger/[0.03] border-danger/10' : 
                                                obs.type === 'warning' ? 'bg-warning/[0.03] border-warning/10' : 
                                                'bg-info/[0.03] border-info/10'
                                            }`}>
                                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                                                    obs.type === 'error' ? 'bg-danger/10 text-danger border-danger/10' : 
                                                    obs.type === 'warning' ? 'bg-warning/10 text-warning border-warning/10' : 
                                                    'bg-info/10 text-info border-info/10'
                                                }`}>
                                                   {obs.type === 'error' && <FiAlertTriangle size={20} />}
                                                   {obs.type === 'warning' && <FiInfo size={20} />}
                                                   {obs.type === 'info' && <FiClock size={20} />}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[14px] font-bold text-title leading-relaxed">{obs.text}</p>
                                                    <p className="text-[10px] font-black text-gray/40 uppercase tracking-widest">Auto-detected by Vision AI Core</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="pt-6 border-t border-border-main/50 text-center">
                                            <p className="text-[9px] font-black text-gray/20 uppercase tracking-[0.4em]">Integrated Compliance Verification System</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AIAnalysisModal;
