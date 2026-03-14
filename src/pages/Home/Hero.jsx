import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';

// Icon components for decorative elements
const DroneIcon = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M8 2L12 12L16 2" />
        <path d="M2 8L12 12L2 16" />
        <path d="M22 8L12 12L22 16" />
        <path d="M8 22L12 12L16 22" />
    </svg>
);

const ShieldIcon = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

// Status icons
const CheckIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

const AlertIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);

const MonitorStatusTag = ({ text, type = "success" }) => {
    const styles = {
        success: "bg-success-bg text-success border-success/20",
        warning: "bg-warning/10 text-warning border-warning/20",
        danger: "bg-danger/10 text-danger border-danger/20"
    };
    return (
        <span className={`px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest ${styles[type]}`}>
            {text}
        </span>
    );
};

const CommandPanelRow = ({ label, value, icon: Icon, type }) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
        <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:text-primary transition-colors`}>
                <Icon size={14} />
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{label}</span>
        </div>
        <span className="text-[10px] font-black text-slate-900">{value}</span>
    </div>
);

const Hero = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const capabilities = [
        { label: "Site Planning", icon: "📍" },
        { label: "Asset Audits", icon: "📋" },
        { label: "AI Comparison", icon: "🧠" },
        { label: "Risk Reports", icon: "📊" }
    ];

    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-white">
            {/* --- Alchemy Background (Halo Effect) --- */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Large Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white" />
                
                {/* Main Purple Arcs - More Defined for Portal Effect */}
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[150%] max-w-[1500px] aspect-square rounded-full border-[1px] border-primary/10 blur-[2px]" />
                <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[130%] max-w-[1300px] aspect-square rounded-full border-[80px] border-primary/5 blur-3xl opacity-60" />
                <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[110%] max-w-[1100px] aspect-square rounded-full border-[60px] border-primary/10 blur-2xl opacity-70" />
                <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[90%] max-w-[900px] aspect-square rounded-full border-[40px] border-primary/[0.15] blur-xl opacity-80" />
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[80%] max-w-[800px] aspect-square rounded-full bg-gradient-to-b from-primary/[0.08] to-transparent blur-3xl opacity-50" />

                {/* Orbital Lines - Slightly deeper */}
                <div className="absolute top-[42%] left-1/2 -translate-x-1/2 w-[85%] max-w-[850px] aspect-square rounded-full border border-primary/[0.08]" />
                <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[75%] max-w-[750px] aspect-square rounded-full border border-primary/[0.05]" />
                
                {/* Floating Nodes */}
                <div className="absolute top-[38%] left-[28%] w-1.5 h-1.5 rounded-full bg-primary/20" />
                <div className="absolute top-[42%] right-[22%] w-2 h-2 rounded-full bg-primary/10" />
            </div>

            {/* --- Main Content --- */}
            <motion.div
                className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl -mt-20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Mini Badge */}
                <motion.div 
                    variants={itemVariants} 
                    className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-[10px] font-bold tracking-tight text-primary-dark/60 bg-white border border-slate-100 rounded-full shadow-sm cursor-default"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Insight Boost
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="mb-8 font-black leading-[1.02] tracking-tighter text-slate-900 text-[clamp(2.5rem,8.5vw,5.5rem)]"
                >
                    Empower Audits <br />
                    with <span className="text-primary">Expert Insights</span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="mb-12 text-base lg:text-lg font-medium leading-relaxed text-slate-400 max-w-2xl px-4"
                >
                    Unlock your operational potential with our comprehensive resources, <br className="hidden md:block" />
                    tailored to guide you every step of the way.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-10">
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: 'var(--color-primary-dark)' }}
                        whileTap={{ scale: 0.98 }}
                        className="px-10 py-4 text-xs font-black text-white bg-primary rounded-xl shadow-xl shadow-primary/20 uppercase tracking-[0.2em] transition-all"
                    >
                        Start Auditing
                    </motion.button>
                    
                    <div className="flex items-center gap-4 border-l border-slate-100 pl-8">
                        <span className="text-4xl font-black text-slate-900 tracking-tighter">10</span>
                        <div className="text-[10px] font-bold text-slate-400 leading-tight text-left uppercase tracking-tighter">
                            years of <br /> reliability
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* --- Capability Bar --- */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="absolute bottom-16 w-full max-w-6xl px-12 z-30"
            >
                <div className="flex flex-wrap items-center justify-between gap-12 pt-12 border-t border-slate-100/80">
                    {capabilities.map((cap, i) => (
                        <div key={i} className="flex items-center gap-5 group cursor-pointer transition-all hover:translate-y-[-4px]">
                            <div className="text-3xl filter grayscale group-hover:grayscale-0 transition-all group-hover:scale-110 drop-shadow-sm">{cap.icon}</div>
                            <div className="flex flex-col">
                                <span className="text-[14px] font-black text-slate-800 tracking-tight leading-none mb-1">{cap.label}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80">Management</span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;





