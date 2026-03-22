import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiX, FiBox, FiMapPin, FiClock, FiUser, 
    FiShield, FiLayout, FiExternalLink, FiEdit2,
    FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import Button from '../../UI/Button';
import Badge from '../../UI/Badge';
import AIAnalysisModal from './AIAnalysisModal';

const AssetDrawer = ({ asset, isOpen, onClose }) => {
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = React.useState(false);
    
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
                        className="fixed inset-0 bg-title/20 backdrop-blur-[4px] z-[9998]"
                    />
                    
                    {/* Drawer Content */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-[480px] bg-card border-l border-border-main shadow-2xl z-[9999] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border-main flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-base flex items-center justify-center text-primary border border-border-main shadow-sm">
                                    <FiBox size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-lg font-black text-title tracking-tight leading-none">Asset Details</h2>
                                    <span className="text-[11px] font-bold text-gray uppercase tracking-widest mt-1 opacity-60">Management Console</span>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-base text-gray transition-colors"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
                            
                            {/* Asset Title Section */}
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col gap-1">
                                        <h1 className="text-2xl font-black text-title tracking-tight">{asset.name}</h1>
                                        <p className="text-gray font-medium text-[14px]">{asset.model}</p>
                                    </div>
                                    <Badge color={statusColor} variant="light" className="px-3 py-1.5 rounded-full font-black uppercase text-[10px] tracking-wider flex items-center gap-2">
                                        <StatusIcon size={14} />
                                        {asset.status}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-2xl bg-base border border-border-main/60">
                                        <span className="text-[10px] font-black text-gray/60 uppercase tracking-widest block mb-1">Unique Asset ID</span>
                                        <code className="text-[13px] font-black text-title font-mono">{asset.uniqueId}</code>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-base border border-border-main/60">
                                        <span className="text-[10px] font-black text-gray/60 uppercase tracking-widest block mb-1">Asset Category</span>
                                        <span className="text-[14px] font-black text-title uppercase">{asset.type}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Location Section */}
                            <div className="space-y-4">
                                <h3 className="text-[12px] font-black text-gray uppercase tracking-[0.2em]">Location Hierarchy</h3>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-3 p-3 bg-card border border-border-main rounded-xl hover:border-primary/30 transition-colors group">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                            <FiMapPin size={16} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-black text-title uppercase">{asset.org}</span>
                                            <span className="text-[11px] font-bold text-gray uppercase tracking-tighter">{asset.site}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-card border border-border-main rounded-xl hover:border-primary/30 transition-colors group">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                            <FiLayout size={16} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-black text-title uppercase">{asset.floor}</span>
                                            <span className="text-[11px] font-bold text-gray uppercase tracking-tighter">Zone {asset.zoneId}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Audit Section */}
                            <div className="space-y-4">
                                <h3 className="text-[12px] font-black text-gray uppercase tracking-[0.2em]">Compliance & Audit</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                                        <div className="flex items-center gap-3">
                                            <FiClock className="text-amber-500" size={18} />
                                            <div>
                                                <p className="text-[13px] font-black text-title leading-none">Last Audit</p>
                                                <p className="text-[11px] font-bold text-gray mt-1">{asset.lastAudit}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <FiUser size={12} className="text-gray" />
                                                <span className="text-[12px] font-bold text-title">{asset.auditor}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Insights CTA Section */}
                        <div className="mx-6 mb-6 p-4 rounded-2xl bg-danger/[0.03] border border-danger/10 flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-md bg-danger/10 text-danger">
                                    <FiAlertCircle size={14} />
                                </div>
                                <span className="text-[11px] font-black text-title uppercase tracking-wider">AI Discrepancy Detected</span>
                            </div>
                            <p className="text-[12px] text-gray font-medium leading-tight">62% risk score identified in recent visual audit.</p>
                            <Button 
                                onClick={() => setIsAnalysisModalOpen(true)}
                                variant="outline" 
                                color="danger"
                                icon={FiExternalLink} 
                                className="w-full !h-10 !text-[10px] !font-black !uppercase !tracking-widest !bg-white hover:!bg-danger/5"
                            >
                                View AI Detailed Analysis
                            </Button>
                        </div>

                        {/* Analysis Modal */}
                        <AIAnalysisModal 
                            asset={asset} 
                            isOpen={isAnalysisModalOpen} 
                            onClose={() => setIsAnalysisModalOpen(false)} 
                        />

                        {/* Footer - Actions */}
                        <div className="p-6 border-t border-border-main bg-base/30 grid grid-cols-2 gap-4">
                            <Button variant="outline" icon={FiEdit2} className="w-full !h-11 !text-[11px] !font-black !uppercase !tracking-widest">
                                Manage Asset
                            </Button>
                            <Button icon={FiCheckCircle} className="w-full !h-11 !text-[11px] !font-black !uppercase !tracking-widest shadow-lg shadow-primary/20">
                                Verify Logic
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AssetDrawer;
