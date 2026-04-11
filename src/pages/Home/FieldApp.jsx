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
import Section from '../../components/UI/Section';
import SectionHeader from '../../components/UI/SectionHeader';

const FieldFeature = ({ icon: Icon, title, description, index }) => (
    <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 + (index * 0.1), ease: [0.22, 1, 0.36, 1] }}
        className="flex gap-6 group items-start w-full"
    >
        <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500 shrink-0 mt-1">
            <Icon className="text-[22px]" />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
            <h4 className="text-[18px] sm:text-[20px] font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors leading-tight">
                {title}
            </h4>
            <p className="text-[14px] sm:text-[15px] leading-relaxed text-slate-500 font-medium opacity-90 w-full">
                {description}
            </p>
        </div>
    </motion.div>
);

const MobileMockup = () => (
    <div className="relative flex justify-center lg:justify-end perspective-lg lg:pr-10">
        {/* Glow Decoration */}
        <div className="absolute inset-0 w-[90%] h-[90%] bg-primary/10 filter blur-[80px] top-[5%] left-[5%] z-0" />

        {/* Phone Frame - 2x More Compact */}
        <motion.div 
            initial={{ opacity: 0, y: 30, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="w-[180px] sm:w-[200px] aspect-[1/2] bg-slate-900 rounded-[32px] p-1.5 relative z-10 shadow-2xl border border-white/10 ring-1 ring-slate-800 flex flex-col group overflow-hidden"
        >
            {/* Internal Screen */}
            <div className="flex-1 bg-slate-950 rounded-[28px] relative overflow-hidden flex flex-col">
                {/* Phone Notch */}
                <div className="w-14 h-4 bg-slate-950 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl z-20" />

                {/* App Header */}
                <div className="pt-6 pb-3 px-3 bg-slate-900/50 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-4">
                        <MdMenu className="text-slate-400 text-xs" />
                        <span className="text-white text-[7px] font-black tracking-[0.15em] uppercase">Asset Intelligence</span>
                        <MdNotificationsNone className="text-slate-400 text-xs" />
                    </div>

                    <div>
                        <span className="text-slate-500 text-[6px] font-black tracking-widest uppercase">Location</span>
                        <div className="flex items-center gap-1 text-white text-[10px] font-black">
                            Center Zone B <MdKeyboardArrowDown className="text-primary text-xs" />
                        </div>
                    </div>
                </div>

                {/* App Scrollable Area */}
                <div className="flex-1 bg-slate-50 rounded-t-[24px] p-3 flex flex-col gap-2.5 shadow-inner">
                    <span className="text-[7px] font-black text-slate-400 tracking-widest uppercase">Tasks</span>

                    {/* App Task Cards */}
                    <div className="bg-white p-2.5 rounded-xl flex items-center gap-2 shadow-sm border border-slate-100">
                        <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                            <MdOutlineQrCodeScanner className="text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[9px] font-black text-slate-800 truncate leading-none mb-0.5">Shelf 4A</div>
                            <div className="text-[6px] text-slate-400 font-bold">24 items</div>
                        </div>
                        <div className="bg-slate-900 text-white px-2 py-1 rounded-md text-[6px] font-black uppercase shrink-0">Audit</div>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl flex items-center gap-2 shadow-sm border border-slate-100 opacity-60">
                        <div className="w-6 h-6 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500 shrink-0">
                            <MdHistory className="text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[9px] font-black text-slate-800 truncate leading-none mb-0.5">Zone 3</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                        <div className="bg-white h-10 rounded-xl flex flex-col items-center justify-center gap-1 text-primary shadow-sm border border-slate-100">
                            <MdOutlineQrCodeScanner className="text-sm" />
                            <span className="text-[6px] font-black uppercase">Scan</span>
                        </div>
                        <div className="bg-white h-10 rounded-xl flex flex-col items-center justify-center gap-1 text-primary shadow-sm border border-slate-100">
                            <MdOutlinePhotoCamera className="text-sm" />
                            <span className="text-[6px] font-black uppercase">Snap</span>
                        </div>
                    </div>
                </div>

                {/* App Bottom Nav */}
                <div className="h-10 bg-white border-t border-slate-100 flex justify-around items-center px-1 pb-1 relative z-20">
                    <MdHome className="text-sm text-primary" />
                    <MdMap className="text-sm text-slate-300" />
                    <div className="relative">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-lg text-white">
                            <MdAdd className="text-lg" />
                        </div>
                    </div>
                    <MdHistory className="text-sm text-slate-300" />
                    <MdSettings className="text-sm text-slate-300" />
                </div>
            </div>
        </motion.div>

        {/* Floating Verified Badge - Compact */}
        <motion.div 
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute -right-2 sm:-right-4 top-[35%] bg-white p-2.5 rounded-xl shadow-xl z-20 flex items-center gap-3 border border-slate-100 ring-1 ring-slate-100 group"
        >
            <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <MdOutlineVerified className="text-sm" />
            </div>
            <div>
                <div className="text-[10px] font-black text-slate-900 leading-none mb-0.5">Secure</div>
                <div className="text-[7px] text-emerald-500 font-black uppercase tracking-widest leading-none">Verified</div>
            </div>
        </motion.div>
    </div>
);

const FieldApp = () => {
    return (
        <section 
            id="mobile" 
            className="relative py-16 sm:py-24 px-6 overflow-hidden bg-[#f4f7ff]"
        >
            {/* Blueprint Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.3]" 
                style={{ 
                    backgroundImage: `radial-gradient(#072267 0.5px, transparent 0.5px)`, 
                    backgroundSize: '24px 24px' 
                }} 
            />

            <div className="container mx-auto px-6 relative z-10">
                <SectionHeader
                    badge="Field Operations"
                    title={<>Simple Mobile Audits <br className="hidden sm:block" /> for Field Teams</>}
                    description="Our easy-to-use mobile tool helps your field team sync audit data instantly from any location."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto mt-12 sm:mt-16">
                    {/* Left Side: Features List */}
                    <div className="flex flex-col gap-8 order-2 md:order-1 w-full">
                        {[
                            { icon: MdOutlineAssignmentInd, title: "Officer Login", description: "Secure login for every staff member for clear audit trails." },
                            { icon: MdOutlineQrCodeScanner, title: "Quick QR Scan", description: "Easily scan any asset to verify its location and details instantly." },
                            { icon: MdOutlinePhotoCamera, title: "Photo Evidence", description: "Attach mandatory photos to your audits for 100% proof." },
                            { icon: MdOutlineWifiOff, title: "Works Offline", description: "Audit items even without internet; data syncs when you're back online." }
                        ].map((feat, i) => (
                            <FieldFeature key={i} {...feat} index={i} />
                        ))}
                    </div>

                    {/* Right Side: Mobile Mockup */}
                    <div className="order-1 md:order-2 flex justify-center md:justify-end">
                        <MobileMockup />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FieldApp;
