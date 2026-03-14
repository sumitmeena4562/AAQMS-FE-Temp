import React from 'react';
import {
    MdOutlineAssignmentInd,
    MdOutlineQrCodeScanner,
    MdOutlinePhotoCamera,
    MdOutlineWifiOff,
    MdMenu,
    MdNotificationsNone,
    MdAdd,
    MdHome,
    MdMap,
    MdHistory,
    MdSettings,
    MdKeyboardArrowDown,
    MdOutlineVerified
} from 'react-icons/md';
import { motion } from 'framer-motion';

const FieldFeature = ({ icon: Icon, title, description, index }) => (
    <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
        className="flex gap-5 mb-8 group"
    >
        <div className="min-w-[56px] h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary flex items-center justify-center border border-primary/10 shadow-lg shadow-primary/5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shrink-0">
            <Icon className="text-[26px]" />
        </div>
        <div>
            <h4 className="text-lg font-black text-slate-900 mb-2 tracking-tight group-hover:text-primary transition-colors">{title}</h4>
            <p className="text-[15px] leading-relaxed text-slate-500 max-w-sm font-medium">{description}</p>
        </div>
    </motion.div>
);

const MobileMockup = () => (
    <div className="relative flex justify-center perspective-lg">
        {/* Shadow Decoration */}
        <div className="absolute inset-0 w-[80%] h-[80%] bg-primary filter blur-[100px] opacity-10 top-[10%] left-[10%] z-0" />

        {/* Phone Frame */}
        <motion.div 
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.21, 1, 0.36, 1] }}
            className="w-[300px] h-[600px] bg-slate-900 rounded-[48px] p-2.5 relative z-10 shadow-2xl border border-white/10 ring-1 ring-slate-800 flex flex-col group"
        >
            {/* Internal Bezel */}
            <div className="flex-1 bg-slate-950 rounded-[38px] relative overflow-hidden flex flex-col">
                {/* Phone Notch */}
                <div className="w-28 h-6 bg-slate-950 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20" />

                {/* App Header */}
                <div className="pt-8 pb-5 px-5 bg-gradient-to-b from-slate-900 to-slate-950">
                    <div className="flex justify-between items-center mb-6">
                        <MdMenu className="text-slate-400 text-xl" />
                        <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">Asset AI</span>
                        <MdNotificationsNone className="text-slate-400 text-xl" />
                    </div>

                    <div className="mb-1">
                        <span className="text-slate-500 text-[9px] font-bold tracking-wider uppercase">Current Site</span>
                        <div className="flex items-center gap-1.5 text-white text-base font-black">
                            Warehouse B <MdKeyboardArrowDown className="text-primary text-lg" />
                        </div>
                    </div>
                </div>

                {/* App Content Area */}
                <div className="flex-1 bg-slate-50 rounded-t-[28px] p-5 flex flex-col gap-4 shadow-inner overflow-hidden">
                    <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Assigned Audits</span>

                    {/* App Task Cards */}
                    <motion.div 
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="bg-white p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-slate-100 cursor-pointer"
                    >
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                            <MdOutlineQrCodeScanner className="text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-black text-slate-800 truncate">Shelf 4A Audit</div>
                            <div className="text-[10px] text-slate-400 font-bold">24 items • High</div>
                        </div>
                        <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter shrink-0">Go</div>
                    </motion.div>

                    <motion.div 
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="bg-white p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-slate-100 opacity-80"
                    >
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                            <MdHistory className="text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-black text-slate-800 truncate">Zone 3 Safety</div>
                            <div className="text-[10px] text-slate-400 font-bold">Hazard • 4pm</div>
                        </div>
                        <div className="bg-slate-100 text-slate-400 px-2 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-tighter shrink-0">Later</div>
                    </motion.div>

                    <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase mt-2">Quick Utilities</span>

                    <div className="grid grid-cols-2 gap-4">
                        <motion.div whileHover={{ scale: 1.05 }} className="bg-white h-16 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-slate-400 shadow-sm border border-slate-100 cursor-pointer group/item">
                            <MdOutlineQrCodeScanner className="text-xl text-primary transition-transform group-hover/item:scale-110" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Scan</span>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} className="bg-white h-16 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-slate-400 shadow-sm border border-slate-100 cursor-pointer group/item">
                            <MdOutlinePhotoCamera className="text-xl text-primary transition-transform group-hover/item:scale-110" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Snap</span>
                        </motion.div>
                    </div>

                    <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase mt-2">Quick Utilities</span>
                </div>

                {/* App Bottom Nav */}
                <div className="h-16 bg-white border-t border-slate-100 flex justify-around items-center px-2 pb-2 relative z-20">
                    <MdHome className="text-xl text-primary" />
                    <MdMap className="text-xl text-slate-300" />
                    <div className="relative">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center border-4 border-white shadow-lg shadow-primary/20 text-white cursor-pointer active:scale-95 transition-transform">
                            <MdAdd className="text-2xl" />
                        </div>
                    </div>
                    <MdHistory className="text-xl text-slate-300" />
                    <MdSettings className="text-xl text-slate-300" />
                </div>
            </div>
        </motion.div>

        {/* Floating Verified Badge */}
        <motion.div 
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-4 border border-slate-100 ring-1 ring-slate-100 group cursor-default"
        >
            <div 
                className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform"
            >
                <MdOutlineVerified className="text-xl" />
            </div>
            <div>
                <div className="text-[13px] font-black text-slate-900 leading-none mb-1">Audit Live</div>
                <div className="text-[10px] text-emerald-500 font-black uppercase tracking-widest leading-none">100% Synced</div>
            </div>
        </motion.div>
    </div>
);

const FieldApp = () => {
    return (
        <section id="mobile" className="py-16 px-6 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
            {/* Background Decorative Mesh */}
            <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center relative z-10">
                {/* Left Side: Content */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.21, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-4 text-[10px] font-black text-primary tracking-widest uppercase mb-4">
                        <div className="w-10 h-px bg-primary/30"></div>
                        Next-Gen Inspection
                    </div>

                    <h2 className="text-[clamp(1.75rem,4vw,2.4rem)] font-black text-slate-900 mb-6 tracking-tighter leading-[1.05]">
                        Field Inspections in Your <span className="text-primary">Pocket.</span>
                    </h2>

                    <p className="text-base text-slate-500 leading-relaxed mb-10 max-w-xl font-medium">
                        Equip your workforce with a powerful, intuitive mobile interface designed for the rigorous demands of real-world environment audits.
                    </p>

                    <div className="flex flex-col gap-2">
                        {[
                            { icon: MdOutlineAssignmentInd, title: "Personal ID Login", description: "Secure, individual access ensures accountability for every action taken." },
                            { icon: MdOutlineQrCodeScanner, title: "QR Scan Capability", description: "Lightning-fast scanning to verify asset presence and pull up specs instantly." },
                            { icon: MdOutlinePhotoCamera, title: "Photo/Video Evidence", description: "Capture visual proof of compliance or damage directly within the audit workflow." },
                            { icon: MdOutlineWifiOff, title: "Low Connectivity Mode", description: "Complete audits offline; data syncs automatically when connection is restored." }
                        ].map((feat, i) => (
                            <FieldFeature key={i} {...feat} index={i} />
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: Mobile Mockup */}
                <MobileMockup />
            </div>
        </section>
    );
};

export default FieldApp;
