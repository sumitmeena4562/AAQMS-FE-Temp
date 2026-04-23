import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, MapPin, Globe, Briefcase, Mail, Phone, Info, Layout, Camera, Loader2 } from 'lucide-react';
import Badge from './Badge';
import { useOrganizationDetails } from '../../hooks/api/useOrgQueries';

const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-page/30 border border-border-main/40">
        <div className="w-10 h-10 rounded-xl bg-card border border-border-main shadow-sm flex items-center justify-center text-primary shrink-0 transition-transform hover:scale-105">
            <Icon size={18} />
        </div>
        <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-black text-gray uppercase tracking-widest leading-none mb-1.5 opacity-60">
                {label}
            </span>
            <span className="text-[14px] font-black text-title leading-tight break-words">
                {value || 'Not Specified'}
            </span>
        </div>
    </div>
);

const ImagePreview = ({ label, url }) => (
    <div className="flex flex-col gap-2">
        <span className="text-[9px] font-black text-gray uppercase tracking-widest pl-1">{label}</span>
        <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border-main bg-page/50 group">
            {url ? (
                <img src={url} alt={label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray/30 gap-2">
                    <Camera size={20} />
                    <span className="text-[10px] font-bold uppercase">No Image</span>
                </div>
            )}
        </div>
    </div>
);

const OrganizationDetailsModal = ({ isOpen, org, onClose, onEdit }) => {
    const { data: fullOrg, isLoading } = useOrganizationDetails(org?.id, { enabled: isOpen && !!org?.id });
    
    if (!org) return null;
    const displayOrg = fullOrg || org;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                    />

                    <Motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        className="relative w-full max-w-[850px] max-h-[90vh] bg-card border border-border-main rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
                    >
                        {isLoading && !fullOrg && (
                            <div className="absolute inset-0 z-[1100] bg-card/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Fetching Detailed Profile...</span>
                            </div>
                        )}
                        {/* Header Section with Profile */}
                        <div className="relative h-48 w-full shrink-0 bg-base overflow-hidden border-b border-border-main">
                            <img 
                                src={displayOrg.imagery?.profile || displayOrg.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'} 
                                alt={displayOrg.name} 
                                className="w-full h-full object-cover grayscale-[0.2]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                            
                            <div className="absolute top-6 right-6 flex gap-2">
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-md border border-border-main flex items-center justify-center text-title hover:bg-card transition-all shadow-sm"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full p-8 flex items-end justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-3xl bg-card p-1 shadow-xl border border-border-main -mb-12 overflow-hidden ring-4 ring-card select-none">
                                         <img src={displayOrg.imagery?.profile || 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'} alt="logo" className="w-full h-full object-cover rounded-2xl" />
                                    </div>
                                    <div className="pb-2">
                                        <h2 className="text-2xl font-black text-title leading-tight tracking-tight mb-1">{displayOrg.name}</h2>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="soft" className="!text-[9px] !px-2.5 !py-0.5 text-primary bg-primary/5">{displayOrg.industry}</Badge>
                                            <span className="w-1 h-1 rounded-full bg-title/40" />
                                            <span className="text-[10px] font-black text-title uppercase tracking-widest bg-card px-2 py-0.5 rounded-md border border-border-main shadow-sm flex items-center justify-center">
                                                ID: {displayOrg.id?.toString().substring(0, 8)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => onEdit?.(displayOrg)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-primary rounded-2xl text-white text-[11px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 shadow-sm mb-2"
                                >
                                    <Edit2 size={13} />
                                    Edit Details
                                </button>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="relative z-10 flex-1 overflow-y-auto px-8 pt-16 pb-10 custom-scrollbar mt-2">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
                                
                                {/* Info Section */}
                                <div className="space-y-8">
                                    <h4 className="text-[11px] font-black text-gray uppercase tracking-widest pl-1 mb-4 flex items-center gap-2">
                                        <Info size={12} className="text-primary" />
                                        Information Overview
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        <DetailItem icon={Layout} label="Occupancy Type" value={displayOrg.occupancyType} />
                                        <DetailItem icon={Globe} label="Classification" value={displayOrg.classification} />
                                        <DetailItem icon={MapPin} label="Physical Address" value={displayOrg.address} />
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <h4 className="text-[11px] font-black text-gray uppercase tracking-widest pl-1 mb-4 flex items-center gap-2">
                                        <Mail size={12} className="text-primary" />
                                        Contact Point
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        <DetailItem icon={Briefcase} label="Contact Person" value={displayOrg.contactPerson} />
                                        <DetailItem icon={Mail} label="Operational Email" value={displayOrg.contactEmail} />
                                        <DetailItem icon={Phone} label="Primary Phone" value={displayOrg.contactPhone} />
                                    </div>
                                </div>

                                {/* Imagery Row */}
                                <div className="md:col-span-2 space-y-6 pt-6 border-t border-border-main/40 mt-4">
                                    <h4 className="text-[11px] font-black text-gray uppercase tracking-widest pl-1 mb-4 flex items-center gap-2">
                                        <Camera size={12} className="text-primary" />
                                        Site Asset Documentation
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <ImagePreview label="North View" url={displayOrg.imagery?.north} />
                                        <ImagePreview label="South View" url={displayOrg.imagery?.south} />
                                        <ImagePreview label="East View" url={displayOrg.imagery?.east} />
                                        <ImagePreview label="West View" url={displayOrg.imagery?.west} />
                                        {displayOrg.imagery?.extra?.map((url, idx) => (
                                            <ImagePreview key={idx} label={`Other View ${idx + 1}`} url={url} />
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2 space-y-4 pt-6 border-t border-border-main/40">
                                    <h4 className="text-[11px] font-black text-gray uppercase tracking-widest pl-1 mb-2">Other Details</h4>
                                    <div className="bg-page/40 p-6 rounded-[24px] border border-border-main/40 min-h-[100px]">
                                        <p className="text-sm font-bold text-gray leading-relaxed italic opacity-80">
                                            {displayOrg.otherInfo ? `"${displayOrg.otherInfo}"` : 'No additional tactical information provided for this entity.'}
                                        </p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </Motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default OrganizationDetailsModal;
