import React from 'react';
import { 
    FiX, FiBox, FiMapPin, FiActivity, FiShield, FiCpu, 
    FiAlertTriangle, FiCheckCircle, FiInfo, FiLayout, FiAlertCircle
} from "react-icons/fi";


const AssetInventoryModal = ({ isOpen, onClose, asset }) => {
    const [showInfo, setShowInfo] = React.useState(true);

    if (!isOpen || !asset) return null;

    // Helper for normalized IDs
    const getID = (obj) => {
        if (!obj) return '';
        if (typeof obj === 'string' || typeof obj === 'number') return String(obj);
        return String(obj.id || obj.pk || '');
    };

    const statusTheme = {
        'Verified': { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: FiCheckCircle, text: 'Verified' },
        'Mismatch': { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: FiAlertCircle, text: 'Mismatch' },
        'Pending': { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: FiClock, text: 'Pending' }
    }[asset.status] || { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', icon: FiInfo, text: asset.status || 'Unknown' };

    const StatusIcon = statusTheme.icon;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-12 overflow-hidden bg-[var(--color-title)]/40 backdrop-blur-xl transition-all duration-300">
            {/* Main Container - Elite Dashboard Style */}
            <div className="relative w-full max-w-6xl h-full max-h-[850px] bg-card rounded-3xl shadow-[0_32px_128px_-16px_rgba(0,0,0,0.15)] border border-border-main/50 flex flex-col md:row overflow-hidden select-none">
                
                {/* Left Sidebar: Asset Identity */}
                <div className="w-full md:w-[320px] bg-base border-r border-border-main/60 p-8 flex flex-col shrink-0">
                    <div className="mb-10 text-center">
                        <div className="w-24 h-24 rounded-3xl bg-card shadow-xl shadow-primary/5 flex items-center justify-center mx-auto mb-6 border border-border-main group relative overflow-hidden">
                             <div className="absolute inset-0 bg-primary opacity-[0.03] group-hover:opacity-[0.06] transition-opacity" />
                             <FiBox size={40} className="relative z-10" style={{ color: statusTheme.color }} />
                        </div>
                        <h2 className="text-xl font-black text-title tracking-tight leading-tight uppercase">{asset.name || asset.asset_name}</h2>
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-card border border-border-main shadow-sm text-gray">
                             #{asset.unique_id || 'NO-ID'}
                        </div>
                    </div>

                    <div className="space-y-8 flex-1">
                        {/* Status Summary */}
                        <div className="p-5 rounded-2xl bg-card border border-border-main shadow-sm space-y-4">
                             <div className="flex items-center justify-between">
                                 <h3 className="text-[10px] font-black text-gray uppercase tracking-widest leading-none">AI Verification</h3>
                                 <span className="text-[10px] font-black text-title px-2 py-0.5 rounded bg-base uppercase">{asset.status || 'PENDING'}</span>
                             </div>
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: statusTheme.bg }}>
                                     <StatusIcon size={20} style={{ color: statusTheme.color }} />
                                 </div>
                                 <div className="flex flex-col">
                                     <span className="text-[14px] font-black text-title uppercase">{statusTheme.text}</span>
                                     <span className="text-[9px] font-bold text-gray uppercase tracking-tighter">System Confirmation</span>
                                 </div>
                             </div>
                        </div>

                        {/* Location Context */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-gray uppercase tracking-widest leading-none px-1">Location Context</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 p-3 rounded-2xl bg-card/50 border border-border-main/40">
                                    <div className="w-10 h-10 rounded-xl bg-card border border-border-main flex items-center justify-center text-gray/60 shadow-sm">
                                        <FiBriefcase size={18} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[9px] font-black text-gray uppercase tracking-widest">Organization</span>
                                        <span className="text-[12px] font-bold text-title leading-tight truncate mt-0.5">{asset.organisation_name || 'Enterprise'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-2xl bg-card/50 border border-border-main/40">
                                    <div className="w-10 h-10 rounded-xl bg-card border border-border-main flex items-center justify-center text-gray/60 shadow-sm">
                                        <FiMapPin size={18} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[9px] font-black text-gray uppercase tracking-widest">Site & Floor</span>
                                        <span className="text-[12px] font-bold text-title leading-tight truncate mt-0.5">{asset.site_name || 'Main Depot'} • {asset.floor_name || 'L0'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-2xl bg-card/50 border border-border-main/40">
                                    <div className="w-10 h-10 rounded-xl bg-card border border-border-main flex items-center justify-center text-gray/60 shadow-sm">
                                        <FiLayout size={18} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[9px] font-black text-gray uppercase tracking-widest">Defined Zone</span>
                                        <span className="text-[12px] font-bold text-title leading-tight truncate mt-0.5">{asset.zone_name || 'General Area'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                         onClick={onClose}
                         className="mt-8 w-full py-4 rounded-2xl bg-title text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-title/10 active:scale-[0.98] transition-all hover:bg-primary"
                    >
                        DISMISS
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col bg-card overflow-hidden">
                    {/* Top Stats Bar */}
                    <div className="px-10 py-6 border-b border-border-main flex items-center justify-between bg-base/30">
                         <div className="flex items-center gap-10">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-gray uppercase tracking-widest">Asset Category</span>
                                <span className="text-[14px] font-black text-title mt-0.5 uppercase tracking-tight">{asset.category || asset.model_name || 'General Asset'}</span>
                            </div>
                            <div className="w-px h-8 bg-border-main/60" />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-gray uppercase tracking-widest">Verification ID</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[14px] font-black text-title uppercase tracking-wider">VID-{String(asset.id).padStart(5, '0')}</span>
                                </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                             <button 
                                onClick={() => setShowInfo(!showInfo)}
                                className={`w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center border ${showInfo ? 'bg-title text-white border-title' : 'bg-card text-gray hover:text-title border-border-main shadow-sm'}`}
                             >
                                 <FiInfo size={18} />
                             </button>
                             <button 
                                onClick={onClose}
                                className="w-10 h-10 rounded-xl bg-card border border-border-main flex items-center justify-center text-gray hover:text-danger hover:border-danger/30 transition-all shadow-sm"
                             >
                                 <FiX size={18} />
                             </button>
                         </div>
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-base/5">
                        {/* Visual Verification Grid */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[11px] font-black text-title uppercase tracking-[0.2em] flex items-center gap-3">
                                    <FiActivity className="text-primary" /> Visual Analytics
                                </h3>
                                <div className="h-px flex-1 ml-6 bg-border-main/60 rounded-full" />
                            </div>
                            
                            {(() => {
                                const baselineImg = asset.media?.find(m => m.media_tag === 'BASELINE')?.media_url;
                                const latestImg = asset.media?.find(m => m.media_tag === 'INSPECTION')?.media_url || asset.media?.[0]?.media_url;
                                const placeholder = "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop";

                                return (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-4 group">
                                            <div className="flex items-center justify-between px-2">
                                                <span className="text-[11px] font-black text-title flex items-center gap-2 uppercase tracking-tighter">
                                                    <FiCheckCircle size={14} className="text-emerald-500" /> Baseline Master
                                                </span>
                                                <span className="text-[9px] font-bold text-gray/50 uppercase font-mono tracking-widest">
                                                    {baselineImg ? 'Digital Twin Verified' : 'Standard Baseline'}
                                                </span>
                                            </div>
                                            <div className="aspect-[16/10] rounded-2xl border border-border-main overflow-hidden bg-base shadow-lg shadow-title/5 relative group-hover:border-primary/30 transition-all">
                                                <img 
                                                    src={baselineImg || placeholder} 
                                                    className={`w-full h-full object-cover ${!baselineImg ? 'opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700' : ''}`}
                                                    alt="Baseline"
                                                />
                                                {!baselineImg && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-card/40 backdrop-blur-[2px]">
                                                        <span className="text-[10px] font-black text-gray uppercase tracking-widest bg-card px-4 py-2 rounded-lg border border-border-main shadow-sm">Baseline Placeholder</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4 group">
                                            <div className="flex items-center justify-between px-2">
                                                <span className="text-[11px] font-black text-title flex items-center gap-2 uppercase tracking-tighter">
                                                    {asset.status === 'Verified' ? <FiCheckCircle size={14} className="text-emerald-500" /> : <FiAlertTriangle size={14} className="text-rose-500" />}
                                                    Latest Inspection
                                                </span>
                                                <span className={`text-[9px] font-bold uppercase font-mono tracking-widest ${asset.status === 'Mismatch' ? 'text-rose-500' : 'text-gray/50'}`}>
                                                    {asset.status === 'Mismatch' ? 'Discrepancy Alarm' : 'System Sync'}
                                                </span>
                                            </div>
                                            <div className={`relative aspect-[16/10] rounded-2xl border-2 overflow-hidden bg-base shadow-lg shadow-title/5 flex items-center justify-center transition-all ${asset.status === 'Mismatch' ? 'border-rose-500/30' : 'border-border-main group-hover:border-primary/30'}`}>
                                                <img 
                                                    src={latestImg || placeholder} 
                                                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${asset.status === 'Mismatch' ? 'opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100' : 'opacity-100'}`}
                                                    alt="Current"
                                                />
                                                
                                                {asset.status === 'Mismatch' && (
                                                    <div className="relative z-10 text-center p-6 bg-card/80 backdrop-blur-md rounded-2xl border border-rose-500/20 shadow-xl group-hover:opacity-0 transition-opacity">
                                                        <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                                                            <FiAlertCircle size={28} />
                                                        </div>
                                                        <p className="text-[14px] font-black text-rose-500 uppercase tracking-widest">AI Mismatch</p>
                                                        <p className="text-[9px] font-bold text-rose-500/60 mt-1 uppercase tracking-tighter">Spatial Deviation Detected</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Recent Activity Log */}
                        {showInfo && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[11px] font-black text-title uppercase tracking-[0.2em] flex items-center gap-3">
                                        <FiClock className="text-primary" /> Audit Trail
                                    </h3>
                                    <div className="h-px flex-1 ml-6 bg-border-main/60 rounded-full" />
                                </div>
                                <div className="bg-card rounded-2xl border border-border-main overflow-hidden shadow-sm">
                                    <div className="p-8 space-y-6">
                                        {[1, 2].map((log, i) => (
                                            <div key={i} className={`flex items-start gap-6 ${i === 0 ? '' : 'pt-6 border-t border-border-main/50'}`}>
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${i === 0 && asset.status === 'Mismatch' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/10' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10'}`}>
                                                    {i === 0 && asset.status === 'Mismatch' ? <FiAlertCircle size={18} /> : <FiCheckCircle size={18} />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="text-[13px] font-black text-title uppercase tracking-tight">{i === 0 && asset.status === 'Mismatch' ? 'Verification Alert' : 'System Verification'}</p>
                                                        <span className="text-[9px] font-black text-gray uppercase tracking-widest bg-base px-2 py-0.5 rounded border border-border-main/40">{i === 0 ? 'LATEST' : '2H AGO'}</span>
                                                    </div>
                                                    <p className="text-[12px] font-medium text-gray leading-relaxed mt-2 max-w-2xl">
                                                        {i === 0 && asset.status === 'Mismatch'
                                                            ? 'AI detection identified a spatial deviation from the baseline model. Manual intervention recommended to verify physical orientation.' 
                                                            : 'All visual parameters analyzed and confirmed. The asset matches the baseline master image with 99.8% confidence.'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="px-8 py-4 bg-base/40 border-t border-border-main/60 flex items-center justify-between">
                                        <span className="text-[9px] font-black text-gray uppercase tracking-widest">Showing encrypted system logs</span>
                                        <button className="text-[9px] font-black text-title uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 group">
                                            Export History <FiX className="rotate-45 group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="px-10 py-6 bg-base/20 border-t border-border-main flex items-center justify-end gap-4">
                         <div className="flex-1 flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                             <span className="text-[9px] font-black text-gray uppercase tracking-[0.2em]">Real-time Telemetry Active</span>
                         </div>
                         <button 
                             disabled
                             className="px-8 py-3.5 rounded-xl bg-title text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-title/10 opacity-40 cursor-not-allowed transition-all"
                         >
                                SYSTEM AUDIT
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetInventoryModal;
