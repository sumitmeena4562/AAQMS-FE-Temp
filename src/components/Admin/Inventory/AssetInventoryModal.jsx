import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiX, FiBox, FiMapPin, FiActivity, FiShield, FiCpu, 
    FiMaximize2, FiAlertTriangle, FiCheckCircle, FiInfo, FiLayout, FiAlertCircle,
    FiClock, FiUser
} from "react-icons/fi";
import Badge from '../../UI/Badge';
import Button from '../../UI/Button';

const AssetInventoryModal = ({ isOpen, onClose, asset }) => {
    const [isScanning, setIsScanning] = React.useState(false);
    const [scanProgress, setScanProgress] = React.useState(0);
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedAsset, setEditedAsset] = React.useState(asset);

    if (!isOpen || !asset) return null;

    const statusColor = {
        'Operational': 'success',
        'Warning': 'warning',
        'Faulty': 'danger',
        'Repairing': 'primary'
    }[asset.status] || 'gray';

    const StatusIcon = {
        'Operational': FiCheckCircle,
        'Warning': FiAlertTriangle,
        'Faulty': FiAlertCircle,
        'Repairing': FiActivity
    }[asset.status] || FiInfo;

    const handleScan = () => {
        setIsScanning(true);
        setScanProgress(0);
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsScanning(false), 500);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };

    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically call an API to save
        console.log("Saving asset details:", editedAsset);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 overflow-hidden">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-title/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ duration: 0.3, ease: "circOut" }}
                        className="relative w-full max-w-5xl bg-page rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20 select-none"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-border-main flex items-center justify-between bg-card shrink-0">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl bg-${statusColor}/10 text-${statusColor} flex items-center justify-center border border-${statusColor}/20`}>
                                    <FiBox size={24} />
                                </div>
                                <div className="flex flex-col">
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            value={editedAsset.name}
                                            onChange={(e) => setEditedAsset({...editedAsset, name: e.target.value})}
                                            className="text-base font-black text-title tracking-tight leading-none bg-base border border-border-main rounded px-2 py-1 outline-none"
                                        />
                                    ) : (
                                        <h2 className="text-base font-black text-title tracking-tight leading-none">{editedAsset.name}</h2>
                                    )}
                                    <span className="text-[9px] font-bold text-gray uppercase tracking-[0.2em] mt-1 opacity-60">Asset Details & AI Report</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="light" color={statusColor} className="py-1 px-3 flex items-center gap-2 text-[9px]">
                                    <StatusIcon size={11} /> {asset.status}
                                </Badge>
                                <button 
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-base text-gray transition-colors border border-border-main"
                                >
                                    <FiX size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Body - Optimized Layout */}
                        <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50/10 p-6 md:p-8 space-y-8">
                            
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                
                                {/* Left Column: Identity & History */}
                                <div className="lg:col-span-4 space-y-8">
                                    
                                    {/* Asset History */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-1 bg-primary rounded-full" />
                                            <h3 className="text-[10px] font-black text-title uppercase tracking-[0.2em]">Asset History</h3>
                                        </div>
                                        <div className="relative pl-4 space-y-6 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-border-main">
                                            <div className="relative">
                                                <div className="absolute -left-[18.5px] top-1 w-2.5 h-2.5 rounded-full bg-success border-2 border-page" />
                                                <p className="text-[11px] font-black text-title leading-tight">First Installed</p>
                                                <p className="text-[9px] font-bold text-gray/60 uppercase tracking-widest mt-0.5">Aug 12, 2023</p>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-[18.5px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-page" />
                                                <p className="text-[11px] font-black text-title leading-tight">Last AI Scan</p>
                                                <p className="text-[9px] font-bold text-gray/60 uppercase tracking-widest mt-0.5">{isScanning ? 'Scanning...' : '2 Hours Ago'}</p>
                                            </div>
                                            <div className="relative opacity-40">
                                                <div className="absolute -left-[18.5px] top-1 w-2.5 h-2.5 rounded-full bg-border-main border-2 border-page" />
                                                <p className="text-[11px] font-black text-title leading-tight">Next Scheduled Audit</p>
                                                <p className="text-[9px] font-bold text-gray/60 uppercase tracking-widest mt-0.5">Oct 15, 2023</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Specifications Grid */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-1 bg-amber-500 rounded-full" />
                                            <h3 className="text-[10px] font-black text-title uppercase tracking-[0.2em]">Specifications</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3.5 rounded-2xl bg-card border border-border-main/50 shadow-sm">
                                                <span className="text-[8px] font-bold text-gray/40 uppercase tracking-widest block mb-1">Serial No</span>
                                                {isEditing ? (
                                                    <input 
                                                        value={editedAsset.uniqueId}
                                                        onChange={(e) => setEditedAsset({...editedAsset, uniqueId: e.target.value})}
                                                        className="text-[11px] font-black text-title font-mono bg-base rounded w-full border-none outline-none"
                                                    />
                                                ) : (
                                                    <code className="text-[11px] font-black text-title font-mono">{editedAsset.uniqueId}</code>
                                                )}
                                            </div>
                                            <div className="p-3.5 rounded-2xl bg-card border border-border-main/50 shadow-sm">
                                                <span className="text-[8px] font-bold text-gray/40 uppercase tracking-widest block mb-1">Location</span>
                                                {isEditing ? (
                                                    <input 
                                                        value={editedAsset.floor}
                                                        onChange={(e) => setEditedAsset({...editedAsset, floor: e.target.value})}
                                                        className="text-[11px] font-black text-title uppercase font-sans bg-base rounded w-full border-none outline-none"
                                                    />
                                                ) : (
                                                    <span className="text-[11px] font-black text-title uppercase font-sans">{editedAsset.floor}</span>
                                                )}
                                            </div>
                                            <div className="p-3.5 rounded-2xl bg-card border border-border-main/50 shadow-sm col-span-2">
                                                <span className="text-[8px] font-bold text-gray/40 uppercase tracking-widest block mb-1">Asset Model</span>
                                                <span className="text-[11px] font-black text-title uppercase tracking-tighter">{asset.model} <span className="text-gray/20 mx-1">/</span> {asset.type}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location Info */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-1 bg-emerald-500 rounded-full" />
                                            <h3 className="text-[10px] font-black text-title uppercase tracking-[0.2em]">Location Details</h3>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-card border border-border-main/50 rounded-[20px] shadow-sm group">
                                            <div className="w-9 h-9 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                                                <FiMapPin size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-black text-title uppercase leading-none mb-1">{asset.org}</span>
                                                <span className="text-[9px] font-bold text-gray uppercase tracking-widest opacity-60 font-mono">Zone {asset.zone || '104'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* System Health */}
                                    <div className="p-5 rounded-[24px] bg-title text-white shadow-xl shadow-title/10 space-y-3 relative overflow-hidden group">
                                        <motion.div 
                                            animate={{ opacity: isScanning ? [0.4, 0.8, 0.4] : [0.1, 0.2, 0.1] }}
                                            transition={{ duration: isScanning ? 0.5 : 3, repeat: Infinity }}
                                            className="absolute top-0 right-0 p-3"
                                        >
                                            <FiShield size={60} />
                                        </motion.div>
                                        <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] block">System Health</span>
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-[9px] font-bold text-white/60 mb-0.5">Last Verified</p>
                                                <p className="text-[14px] font-black tracking-tight">{asset.lastAudit}</p>
                                            </div>
                                            <div className="px-2 py-0.5 rounded bg-white/10 border border-white/10 text-[8px] font-black uppercase">v2.4</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: AI Diagnostics */}
                                <div className="lg:col-span-8 space-y-6">
                                    
                                    {/* AI Status Bar */}
                                    <div className={`px-5 py-3 rounded-2xl ${isScanning ? 'bg-amber-500' : 'bg-primary'} shadow-lg shadow-primary/20 flex items-center justify-between transition-colors duration-500`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full bg-white ${isScanning ? 'animate-ping' : 'animate-pulse'}`} />
                                            <span className="text-[10px] font-black text-white uppercase tracking-[0.15em]">
                                                {isScanning ? `Scan in Progress: ${scanProgress}%` : 'AI Monitoring is Active'}
                                            </span>
                                        </div>
                                        <span className="text-[9px] font-bold text-white/60 uppercase">
                                            {isScanning ? 'Scanning ROI...' : 'Working Normally'}
                                        </span>
                                    </div>

                                    {/* Photo Comparison */}
                                    <div className="bg-card rounded-[32px] border border-border-main shadow-sm flex flex-col overflow-hidden relative">
                                        {isScanning && (
                                            <motion.div 
                                                initial={{ left: '-100%' }}
                                                animate={{ left: '100%' }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                className="absolute top-0 bottom-0 w-1 bg-primary/30 z-10 blur-sm"
                                            />
                                        )}
                                        <div className="px-6 py-3.5 border-b border-border-main flex items-center justify-between bg-base/40">
                                            <h3 className="text-[10px] font-black text-title uppercase tracking-[0.2em]">Photo Comparison</h3>
                                            <span className="text-[9px] font-bold text-gray/40 uppercase tracking-widest">98.4% Match</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2">
                                            {/* Baseline */}
                                            <div className="p-6 border-r border-border-main/50 space-y-4">
                                                <span className="text-[11px] font-black text-gray/60 flex items-center gap-2">
                                                    <FiCheckCircle size={12} className="text-success" /> Standard View
                                                </span>
                                                <div className="aspect-[2/1] rounded-2xl border border-border-main overflow-hidden bg-base">
                                                    <img 
                                                        src="https://images.unsplash.com/photo-1598018554941-0ed5d336302a?q=80&w=400&fit=crop" 
                                                        className="w-full h-full object-cover grayscale-[0.2]"
                                                        alt="Standard"
                                                    />
                                                </div>
                                            </div>
                                            {/* Current */}
                                            <div className="p-6 space-y-4 bg-danger/[0.01]">
                                                <span className="text-[11px] font-black text-gray/60 flex items-center gap-2">
                                                    <FiAlertTriangle size={12} className="text-danger" /> Latest Photo
                                                </span>
                                                <div className="aspect-[2/1] rounded-2xl border-2 border-dashed border-danger/20 overflow-hidden bg-base relative">
                                                    <img 
                                                        src="https://images.unsplash.com/photo-1598018554941-0ed5d336302a?q=80&w=400&fit=crop" 
                                                        className={`w-full h-full object-cover grayscale transition-opacity duration-300 ${isScanning ? 'opacity-10' : 'opacity-30'}`}
                                                        alt="Latest"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="flex flex-col items-center gap-1">
                                                            {isScanning ? (
                                                                <FiCpu className="text-primary animate-spin" size={24} />
                                                            ) : (
                                                                <>
                                                                    <FiActivity className="text-danger" size={18} />
                                                                    <span className="text-[8px] font-black text-danger uppercase tracking-widest">Difference Detected</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Scan History */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                        <div className="md:col-span-4 bg-card rounded-[32px] border border-border-main p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-sm relative">
                                            <h3 className="text-[10px] font-black text-gray/30 uppercase tracking-[0.2em]">Safety Score</h3>
                                            <div className="relative w-24 h-24">
                                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                                    <circle className="text-border-main stroke-current opacity-20" strokeWidth="8" cx="50" cy="50" r="42" fill="transparent"></circle>
                                                    <motion.circle 
                                                        initial={{ strokeDasharray: "0, 264" }}
                                                        animate={{ strokeDasharray: isScanning ? `${(scanProgress * 1.63)}, 264` : "163, 264" }}
                                                        transition={{ duration: 0.2 }}
                                                        className="text-danger stroke-current" 
                                                        strokeWidth="8" 
                                                        strokeLinecap="round" 
                                                        cx="50" cy="50" r="42" 
                                                        fill="transparent"
                                                        transform="rotate(-90 50 50)"
                                                    ></motion.circle>
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-[20px] font-black text-title">
                                                        {isScanning ? `${Math.floor(scanProgress * 0.62)}%` : '62%'}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-[8px] font-black text-danger uppercase tracking-widest">
                                                {isScanning ? 'Analyzing...' : 'Action Needed'}
                                            </span>
                                        </div>

                                        <div className="md:col-span-8 space-y-4">
                                            <div className="p-6 bg-card rounded-[32px] border border-border-main shadow-sm flex flex-col h-full bg-topographic">
                                                <h3 className="text-[10px] font-black text-gray/30 uppercase tracking-[0.2em] mb-4">Recent AI Scans</h3>
                                                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[140px] no-scrollbar">
                                                    <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-danger/[0.04] border border-border-main">
                                                        <div className="w-8 h-8 rounded-lg bg-danger/10 text-danger flex items-center justify-center shrink-0">
                                                            <FiAlertTriangle size={14} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[12px] font-bold text-title">Asset missing from position.</p>
                                                            <p className="text-[8px] font-black text-gray/40 uppercase">15 mins ago</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-base/30 border border-border-main">
                                                        <div className="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
                                                            <FiCheckCircle size={14} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[12px] font-bold text-title">Safety scan completed.</p>
                                                            <p className="text-[8px] font-black text-gray/40 uppercase">1 hour ago</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                        {/* Actions Footer */}
                        <div className="p-4 border-t border-border-main bg-base/30 shrink-0 flex items-center justify-end gap-3">
                            <Button 
                                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                                variant="outline" 
                                className="!h-9 !px-6 !text-[9px] !font-black !uppercase !tracking-widest rounded-xl"
                            >
                                {isEditing ? 'Save Changes' : 'Edit Asset'}
                            </Button>
                            <Button 
                                onClick={handleScan}
                                disabled={isScanning}
                                className="!h-9 !px-6 !text-[9px] !font-black !uppercase !tracking-widest rounded-xl disabled:opacity-50"
                            >
                                {isScanning ? 'Scanning...' : 'Scan Now'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AssetInventoryModal;
