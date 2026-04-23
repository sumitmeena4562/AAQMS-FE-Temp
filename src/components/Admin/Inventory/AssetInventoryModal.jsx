import React from 'react';
import { 
    FiX, FiBox, FiMapPin, FiActivity, FiShield, FiCpu, 
    FiAlertTriangle, FiCheckCircle, FiInfo, FiLayout, FiAlertCircle
} from "react-icons/fi";


const AssetInventoryModal = ({ isOpen, onClose, asset }) => {
    const [showInfo, setShowInfo] = React.useState(true);

    if (!isOpen || !asset) return null;

    const statusTheme = {
        'Operational': { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: FiCheckCircle },
        'Warning': { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: FiAlertTriangle },
        'Faulty': { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: FiAlertCircle },
        'Repairing': { color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)', icon: FiActivity }
    }[asset.status] || { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', icon: FiInfo };

    const StatusIcon = statusTheme.icon;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-12 overflow-hidden bg-slate-900/40 backdrop-blur-xl transition-all duration-300">
            {/* Main Container - Dashboard Style */}
            <div className="relative w-full max-w-6xl h-full max-h-[850px] bg-white rounded-2xl shadow-[0_32px_128px_-16px_rgba(0,0,0,0.15)] border border-white/50 flex flex-col md:flex-row overflow-hidden select-none">
                
                {/* Left Sidebar: Asset Identity */}
                <div className="w-full md:w-[320px] bg-slate-50 border-r border-slate-200/60 p-10 flex flex-col shrink-0">
                    <div className="mb-10 text-center">
                        <div className="w-24 h-24 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center mx-auto mb-6 border border-slate-100 group">
                            <FiBox size={40} style={{ color: statusTheme.color }} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{asset.name}</h2>
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 shadow-sm text-slate-500">
                             {asset.uniqueId}
                        </div>
                    </div>

                    <div className="space-y-10 flex-1">
                        {/* Health Index */}
                        <div className="space-y-4">
                             <div className="flex items-center justify-between">
                                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Health Index</h3>
                                 <span className="text-[10px] font-black text-slate-900 px-2 py-0.5 rounded bg-slate-200">v2.4</span>
                             </div>
                             <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                                 <div className="flex items-center justify-between">
                                     <span className="text-[28px] font-black text-slate-900">94.2<span className="text-slate-300">%</span></span>
                                     <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: statusTheme.color }} />
                                 </div>
                                 <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                     <div className="h-full rounded-full" style={{ width: '94.2%', backgroundColor: statusTheme.color }} />
                                 </div>
                             </div>
                        </div>

                        {/* Location Context */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Location Context</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                        <FiMapPin size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Organizaton</span>
                                        <span className="text-[13px] font-black text-slate-900 leading-none mt-1">{asset.org}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                        <FiLayout size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Floor & Zone</span>
                                        <span className="text-[13px] font-black text-slate-900 leading-none mt-1">{asset.floor} <span className="text-slate-300 mx-1">/</span>{asset.zone || '104'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                         onClick={onClose}
                         className="mt-10 w-full py-4 rounded-3xl bg-slate-900 shadow-xl shadow-slate-900/20 active:scale-95 transition-all text-white text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        CLOSE
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col bg-white overflow-hidden">
                    {/* Top Stats Bar */}
                    <div className="px-12 py-6 border-b border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Audit</span>
                                <span className="text-[13px] font-black text-slate-900 mt-1">{asset.lastAudit}</span>
                            </div>
                            <div className="w-px h-6 bg-slate-200" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asset Status</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusTheme.color }} />
                                    <span className="text-[13px] font-black text-slate-900 uppercase ">{asset.status}</span>
                                </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                             <button 
                                onClick={() => setShowInfo(!showInfo)}
                                className={`w-10 h-10 rounded-2xl ${showInfo ? 'bg-slate-900 text-white' : 'bg-[#f8faff] text-[#94a3b8]'} border border-[#eef2ff] flex items-center justify-center hover:text-slate-50 transition-all`}
                             >
                                 <FiInfo size={20} />
                             </button>
                             <button 
                                onClick={onClose}
                                className="w-10 h-10 rounded-2xl bg-[#f8faff] border border-[#eef2ff] flex items-center justify-center text-[#94a3b8] hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                             >
                                 <FiX size={20} />
                             </button>
                         </div>
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar bg-slate-50/30">
                        {/* Specifications Grid */}
                        {showInfo && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Specifications</h3>
                                    <div className="h-0.5 flex-1 mx-6 bg-slate-100 rounded-full" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm group">
                                        <FiShield className="mb-3 text-slate-300" size={20} />
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Standard</p>
                                        <p className="text-[13px] font-black text-slate-900">ISO 9001:2015</p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm group">
                                        <FiCpu className="mb-3 text-slate-300" size={20} />
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Model Series</p>
                                        <p className="text-[13px] font-black text-slate-900">{asset.model}</p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm group">
                                        <FiActivity className="mb-3 text-slate-300" size={20} />
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Type Code</p>
                                        <p className="text-[13px] font-black text-slate-900">{asset.type}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Visual Diagnostics */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Visual Diagnostics</h3>
                                <div className="h-0.5 flex-1 mx-6 bg-slate-100 rounded-full" />
                            </div>
                            
                            {/* Derive Images from Backend Data */}
                            {(() => {
                                const baselineImg = asset.media?.find(m => m.media_tag === 'BASELINE')?.media_url;
                                const latestImg = asset.media?.find(m => m.media_tag === 'INSPECTION')?.media_url || asset.media?.[0]?.media_url;
                                const placeholder = "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop";

                                return (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between px-2">
                                                <span className="text-[11px] font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter">
                                                    <FiCheckCircle size={14} className="text-success" /> Baseline Standard
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">
                                                    {baselineImg ? 'Baseline Captured' : 'No Baseline Image'}
                                                </span>
                                            </div>
                                            <div className="aspect-[16/10] rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 shadow-lg shadow-slate-200/50 relative">
                                                <img 
                                                    src={baselineImg || placeholder} 
                                                    className={`w-full h-full object-cover ${!baselineImg ? 'opacity-40 grayscale' : ''}`}
                                                    alt="Baseline"
                                                />
                                                {!baselineImg && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Twin Unavailable</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between px-2">
                                                <span className="text-[11px] font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter">
                                                    {asset.status === 'Verified' ? <FiCheckCircle size={14} className="text-success" /> : <FiAlertTriangle size={14} className="text-danger" />}
                                                    Latest Audit View
                                                </span>
                                                <span className={`text-[9px] font-bold uppercase font-mono ${asset.status === 'Mismatch' ? 'text-danger' : 'text-slate-400'}`}>
                                                    {asset.status === 'Mismatch' ? 'Discrepancy Detected' : 'Verified Scan'}
                                                </span>
                                            </div>
                                            <div className={`relative aspect-[16/10] rounded-2xl border-2 overflow-hidden bg-slate-50 flex items-center justify-center group ${asset.status === 'Mismatch' ? 'border-dashed border-danger/30' : 'border-slate-200 shadow-lg shadow-slate-200/50'}`}>
                                                <img 
                                                    src={latestImg || placeholder} 
                                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity ${asset.status === 'Mismatch' ? 'opacity-40 grayscale group-hover:opacity-60' : 'opacity-100'}`}
                                                    alt="Current"
                                                />
                                                
                                                {asset.status === 'Mismatch' ? (
                                                    <div className="relative z-10 text-center p-8">
                                                        <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto mb-4 border border-danger/20">
                                                            <FiActivity size={32} />
                                                        </div>
                                                        <p className="text-[14px] font-black text-danger uppercase tracking-[0.1em]">AI Alert: Mismatch</p>
                                                        <p className="text-[10px] font-medium text-danger/60 mt-1 px-4 py-1 rounded-full bg-danger/5 border border-danger/10 inline-block uppercase tracking-widest">Confidence 98.4%</p>
                                                    </div>
                                                ) : !latestImg && (
                                                     <div className="relative z-10 text-center">
                                                        <FiBox size={32} className="text-slate-300 mx-auto mb-2" />
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Recent Scan</p>
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
                                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Activity History</h3>
                                    <div className="h-0.5 flex-1 mx-6 bg-slate-100 rounded-full" />
                                </div>
                                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                    <div className="p-8 space-y-6">
                                        {[1, 2].map((log, i) => (
                                            <div key={i} className={`flex items-start gap-6 ${i === 0 ? '' : 'pt-6 border-t border-slate-50'}`}>
                                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${i === 0 ? 'bg-danger/10 text-danger border border-danger/10' : 'bg-success/10 text-success border border-success/10'}`}>
                                                    {i === 0 ? <FiAlertCircle size={18} /> : <FiCheckCircle size={18} />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="text-[13px] font-black text-slate-900 uppercase">{i === 0 ? 'Safety Violation' : 'Routine Scan'}</p>
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{i === 0 ? '15m ago' : '1h ago'}</span>
                                                    </div>
                                                    <p className="text-[12px] font-medium text-slate-500 leading-relaxed font-sans mt-2">
                                                        {i === 0 
                                                            ? 'Critical mismatch detected between baseline and current audit. Asset positioned outside of defined boundary.' 
                                                            : 'All safety parameters verified. Physical orientation matches the baseline master image.'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Showing last 2 events</span>
                                        <button className="text-[9px] font-black text-slate-900 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Download Logs</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="px-12 py-8 bg-white border-t border-slate-100 flex items-center justify-end gap-4 shadow-[0_-1px_0_rgba(148,163,184,0.1)]">
                         <div className="flex-1">
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Admin Level Clearance Required</span>
                         </div>
                         <button 
                             disabled
                             className="px-8 py-4 rounded-3xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 opacity-50 cursor-not-allowed transition-all"
                             title="Coming Soon in Phase 2"
                         >
                               REQUEST AUDIT
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetInventoryModal;
