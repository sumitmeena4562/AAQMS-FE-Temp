import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FiArrowLeft, FiAlertTriangle, FiInfo, FiCheckCircle, 
    FiCalendar, FiUser, FiMaximize2, FiActivity, FiMapPin
} from 'react-icons/fi';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';

const AIAnalysisDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock Detail Data (Matching user image)
    const analysisData = {
        zone: "Zone 104",
        asset: "Fire extinguisher",
        status: "Active Risk Alert",
        assetId: "FE-ZN104-091",
        capturedBy: "John Doe",
        timestamp: "24 Oct 2023, 10:30 AM",
        discrepancy: 62,
        confidence: 98.4,
        observations: [
            { type: 'error', text: "Object Fire Extinguisher (Type A) missing from detected coordinates [x:450, y:320]." },
            { type: 'warning', text: "Safety zone violation: Equipment gap exceeds 24 hours." },
            { type: 'info', text: "Last verified presence: 23 Aug 2023, 18:00 PM by AI Patrol Bot 04." }
        ]
    };

    return (
        <div className="min-h-screen bg-page p-4 sm:p-6 lg:p-8 font-sans">
            {/* Top Navigation */}
            <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray hover:text-title transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full border border-border-main flex items-center justify-center group-hover:bg-card">
                        <FiArrowLeft size={16} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Back to Inventory</span>
                </button>
                
                <div className="flex items-center gap-3">
                    <Badge variant="light" color="danger" className="animate-pulse shadow-sm border border-danger/20">
                        <FiActivity className="mr-1" /> {analysisData.status}
                    </Badge>
                </div>
            </div>

            {/* Header Card */}
            <div className="max-w-7xl mx-auto bg-card rounded-[var(--radius-card)] border border-border-main p-6 sm:p-8 mb-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-danger/5 text-danger flex items-center justify-center shrink-0 border border-danger/10">
                            <FiAlertTriangle size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl sm:text-3xl font-black text-title tracking-tight">
                                    {analysisData.zone} <span className="text-gray/40 font-medium px-2">—</span> 
                                    <span className="text-title/80 font-bold">{analysisData.asset}</span>
                                </h1>
                            </div>
                            <p className="text-sm text-gray font-medium max-w-xl leading-relaxed">
                                Comparing live site audit data against baseline safety standards. Detected discrepancies require immediate attention.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 lg:border-l lg:border-border-main/50 lg:pl-8">
                        <div className="bg-base px-4 py-3 rounded-xl border border-border-main min-w-[120px]">
                            <span className="text-[10px] font-black text-gray/50 uppercase tracking-widest block mb-1">Asset ID</span>
                            <span className="text-sm font-black text-title font-mono">{analysisData.assetId}</span>
                        </div>
                        <div className="bg-base px-4 py-3 rounded-xl border border-border-main min-w-[120px]">
                            <span className="text-[10px] font-black text-gray/50 uppercase tracking-widest block mb-1">Captured By</span>
                            <span className="text-sm font-black text-title flex items-center gap-1.5 underline decoration-gray/30 decoration-2 underline-offset-4">
                                <FiUser className="text-gray" /> {analysisData.capturedBy}
                            </span>
                        </div>
                        <div className="bg-base px-4 py-3 rounded-xl border border-border-main min-w-[120px]">
                            <span className="text-[10px] font-black text-gray/50 uppercase tracking-widest block mb-1">Timestamp</span>
                            <span className="text-sm font-black text-title flex items-center gap-1.5 opacity-80">
                                <FiCalendar className="text-gray" /> {analysisData.timestamp}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Evidence Table/Grid */}
            <div className="max-w-7xl mx-auto mb-6">
                <div className="bg-card rounded-[var(--radius-card)] border border-border-main shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-border-main flex items-center justify-between bg-base/30">
                        <h3 className="text-xs font-black text-title uppercase tracking-widest">Visual Evidence Comparison</h3>
                        <button className="text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-1 hover:underline">
                            <FiMaximize2 /> Expand View
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Baseline Image */}
                        <div className="p-6 border-r border-border-main/50 relative">
                             <div className="flex items-center gap-2 mb-4">
                                <div className="w-5 h-5 rounded-full bg-success/10 text-success flex items-center justify-center">
                                    <FiCheckCircle size={12} />
                                </div>
                                <span className="text-sm font-black text-title tracking-tight">Baseline Master Image</span>
                                <span className="ml-auto text-[10px] font-bold text-gray/50 bg-base px-2 py-0.5 rounded uppercase">Reference: Aug 2023</span>
                             </div>
                             <div className="aspect-[4/3] rounded-2xl border-2 border-success/20 overflow-hidden bg-base relative group">
                                <img 
                                    src="https://images.unsplash.com/photo-1598018554941-0ed5d336302a?q=80&w=600&auto=format&fit=crop" 
                                    alt="Baseline" 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black text-white/90 uppercase tracking-widest">Standard Compliance</span>
                                </div>
                             </div>
                             <p className="mt-4 text-xs text-gray font-medium leading-relaxed opacity-80">
                                Expected state: Fire extinguisher present, mounted correctly at 1.2m height, accessible, with no obstructions.
                             </p>
                        </div>

                        {/* Current Audit Photo */}
                        <div className="p-6 relative">
                             <div className="flex items-center gap-2 mb-4">
                                <div className="w-5 h-5 rounded-full bg-danger/10 text-danger flex items-center justify-center">
                                    <FiAlertTriangle size={12} />
                                </div>
                                <span className="text-sm font-black text-title tracking-tight">Current Audit Photo</span>
                                <span className="ml-auto text-[10px] font-bold text-gray/50 bg-base px-2 py-0.5 rounded uppercase">Reference: Aug 2025</span>
                             </div>
                             <div className="aspect-[4/3] rounded-2xl border-2 border-danger/20 overflow-hidden bg-base relative group">
                                <img 
                                    src="https://images.unsplash.com/photo-1598018554941-0ed5d336302a?q=80&w=600&auto=format&fit=crop" 
                                    alt="Current Audit" 
                                    className="w-full h-full object-cover grayscale opacity-60"
                                />
                                {/* AI Highlighting Mock */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-1/3 h-1/2 border-2 border-dashed border-danger animate-pulse bg-danger/10 relative rounded-lg">
                                        <span className="absolute -top-6 left-0 right-0 text-center uppercase text-[10px] font-black text-danger tracking-widest">Missing Object</span>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 animate-bounce">
                                    <span className="px-2.5 py-1 bg-danger text-white rounded-md text-[9px] font-black uppercase tracking-widest shadow-lg">Alert</span>
                                </div>
                             </div>
                             <p className="mt-4 text-xs text-gray font-medium leading-relaxed opacity-80">
                                Detected state: Designated mounting bracket is empty. No fire safety equipment detected in the defined ROI (Region of Interest).
                             </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analysis & Insights Section */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12 text-sans">
                {/* Risk Indicator Card */}
                <div className="lg:col-span-4 bg-card rounded-[var(--radius-card)] border border-border-main p-8 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-danger/[0.03] to-transparent pointer-events-none" />
                    
                    <h3 className="text-xs font-black text-gray/40 uppercase tracking-[0.2em] mb-8 relative z-10">AI Analysis & Insights</h3>

                    <div className="relative w-48 h-48 mb-8 z-10 group-hover:scale-105 transition-transform duration-500">
                        {/* Static Radial (Simplified for CSS) */}
                        <svg className="w-full h-full" viewBox="0 0 100 100 tracking-tighter">
                            <circle className="text-border-main stroke-current" strokeWidth="8" cx="50" cy="50" r="42" fill="transparent"></circle>
                            <circle 
                                className="text-danger stroke-current" 
                                strokeWidth="8" 
                                strokeDasharray={`${analysisData.discrepancy * 2.64}, 264`} 
                                strokeLinecap="round" 
                                cx="50" cy="50" r="42" 
                                fill="transparent"
                                transform="rotate(-90 50 50)"
                            ></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black text-title tabular-nums">{analysisData.discrepancy}%</span>
                        </div>
                    </div>

                    <div className="space-y-1 relative z-10">
                        <h4 className="text-lg font-black text-title leading-tight">High Risk Discrepancy</h4>
                        <p className="text-[11px] font-bold text-gray uppercase tracking-widest">Confidence Score: {analysisData.confidence}%</p>
                    </div>
                </div>

                {/* Observations List */}
                <div className="lg:col-span-8 bg-card rounded-[var(--radius-card)] border border-border-main p-8 shadow-sm relative overflow-hidden">
                    <div className="space-y-6 relative z-10">
                        {analysisData.observations.map((obs, idx) => (
                            <div key={idx} className={`flex items-start gap-4 p-4 rounded-2xl border transition-all hover:shadow-sm ${
                                obs.type === 'error' ? 'bg-danger/[0.02] border-danger/10' : 
                                obs.type === 'warning' ? 'bg-warning/[0.02] border-warning/10' : 
                                'bg-info/[0.02] border-info/10'
                            }`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                    obs.type === 'error' ? 'text-danger' : 
                                    obs.type === 'warning' ? 'text-warning' : 'text-info'
                                }`}>
                                   {obs.type === 'error' && <FiAlertTriangle size={18} />}
                                   {obs.type === 'warning' && <FiInfo size={18} />}
                                   {obs.type === 'info' && <FiClock size={18} />}
                                </div>
                                <div className="space-y-1">
                                    <p className={`text-sm font-black leading-relaxed ${
                                        obs.type === 'error' ? 'text-title' : 'text-gray/80 font-bold'
                                    }`}>
                                        {obs.text}
                                    </p>
                                    {obs.type === 'info' && (
                                        <p className="text-[10px] font-bold text-gray uppercase tracking-widest opacity-60">Status verified via autonomous audit</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="mt-8 text-center text-[10px] font-black text-gray/30 uppercase tracking-[0.2em] border-t border-border-main/50 pt-6">
                        AI assists detection. Final approval is human-controlled.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AIAnalysisDetail;
