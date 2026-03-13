import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
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

const LocalStatusRow = ({ title, subtitle, icon: Icon, status, statusText, extraText }) => {
    const statusConfig = {
        success: { bg: "bg-success-bg", text: "text-success" },
        alert: { bg: "bg-danger/10", text: "text-danger" },
        pending: { bg: "bg-warning/10", text: "text-warning" }
    };
    
    const { bg, text } = statusConfig[status] || statusConfig.success;

    return (
        <motion.div 
            whileHover={{ x: 4 }}
            className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white/80"
        >
            <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg} ${text} shadow-inner`}>
                    <Icon size={18} />
                </div>
                <div className="text-left">
                    <div className="text-[13px] font-bold text-primary-dark tracking-tight">{title}</div>
                    <div className="text-[11px] text-text-secondary font-medium">{subtitle}</div>
                </div>
            </div>
            <div className="text-right">
                <div className={`text-[10px] font-black tracking-widest ${text}`}>{statusText}</div>
                {extraText && <div className="text-[10px] text-text-tertiary font-bold">{extraText}</div>}
            </div>
        </motion.div>
    );
};

const Hero = () => {
    // Parallax values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const moveX = (clientX - window.innerWidth / 2) / 25;
        const moveY = (clientY - window.innerHeight / 2) / 25;
        mouseX.set(moveX);
        mouseY.set(moveY);
    };

    // Parallax layers
    const layer1X = useTransform(springX, (val) => val * 0.5);
    const layer1Y = useTransform(springY, (val) => val * 0.5);
    const layer2X = useTransform(springX, (val) => val * 1.2);
    const layer2Y = useTransform(springY, (val) => val * 1.2);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <section 
            className="relative min-h-[60vh] flex items-center overflow-hidden bg-[#f8fafc]"
            onMouseMove={handleMouseMove}
        >
            {/* --- Elite Background Layers --- */}
            
            {/* 1. Animated Mesh Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.4, 0.3],
                        x: [0, 30, 0],
                        y: [0, -20, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full blur-[100px] bg-gradient-to-br from-primary/30 to-accent/20"
                />
                <motion.div 
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2],
                        x: [0, -40, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full blur-[80px] bg-gradient-to-tr from-primary-light/40 to-transparent"
                />
            </div>

            {/* 2. SVG Grid Pattern */}
            <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ 
                    backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
                }}
            />

            {/* 3. Parallax Floating Elements */}
            <motion.div style={{ x: layer1X, y: layer1Y }} className="absolute top-[10%] left-[5%] text-primary opacity-15 pointer-events-none">
                <DroneIcon size={90} className="rotate-12" />
            </motion.div>
            <motion.div style={{ x: layer2X, y: layer2Y }} className="absolute bottom-[10%] right-[5%] text-accent opacity-10 pointer-events-none">
                <ShieldIcon size={120} className="-rotate-12" />
            </motion.div>

            {/* --- Content Logic --- */}
            <motion.div
                className="relative z-20 grid items-center w-full max-w-7xl gap-10 px-6 mx-auto py-12 lg:grid-cols-[1.1fr_1fr]"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Left side: Typography */}
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                    <motion.div 
                        variants={itemVariants} 
                        className="inline-flex items-center gap-2 px-3 py-1 mb-5 text-[9px] font-black tracking-widest uppercase bg-white/80 backdrop-blur-md border border-primary/10 rounded-full shadow-sm text-primary cursor-default"
                    >
                        <span className="relative flex w-1.5 h-1.5">
                          <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary"></span>
                          <span className="relative inline-flex w-1.2 h-1.2 rounded-full bg-primary"></span>
                        </span>
                        Version 4.0 Live
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="mb-4 font-black leading-[1.1] tracking-tighter text-slate-900 lg:max-w-[15ch] text-[clamp(2.2rem,4.5vw,2.8rem)]"
                    >
                        AI-Enabled <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-dark to-primary">Safety Audits</span> & Inventory.
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="mb-6 text-sm lg:text-base font-medium leading-relaxed text-slate-500 max-w-[440px]"
                    >
                        Orchestrate complex operations with integrated Drone Maps and AI-assisted inventory comparison. Ensure asset accountability at scale.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col items-center flex-wrap gap-4 w-full sm:flex-row lg:justify-start">
                        <motion.button
                            whileHover={{ scale: 1.03, boxShadow: "0 15px 30px -8px rgba(var(--color-primary-rgb), 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-8 py-3.5 text-sm font-bold text-white bg-primary rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 sm:w-auto overflow-hidden group relative"
                        >
                            <span className="relative z-10 uppercase tracking-widest">Start Audit</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,1)' }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-8 py-3.5 text-sm font-bold bg-white/50 backdrop-blur-md border border-slate-200 text-slate-900 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-3 sm:w-auto"
                        >
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                            <span className="uppercase tracking-widest font-extrabold">Demo</span>
                        </motion.button>
                    </motion.div>
                </div>

                {/* Right side: Interactive Card */}
                <motion.div
                    variants={itemVariants}
                    style={{ x: layer1X, y: layer1Y }}
                    className="relative perspective-lg lg:ml-auto w-full max-w-[500px]"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/15 to-accent/15 rounded-[28px] blur-xl opacity-40" />
                    
                    <Card
                        padding="30px"
                        borderRadius="28px"
                        className="relative w-full bg-white/80 backdrop-blur-2xl border-white/50 shadow-xl overflow-hidden"
                        hoverEffect={false}
                    >
                        {/* Glow reflection effect */}
                        <motion.div 
                            style={{ x: layer2X, y: layer2Y }}
                            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/30 to-transparent blur-3xl pointer-events-none rotate-45" 
                        />

                        {/* Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                            <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                <div className="p-1.5 rounded-md bg-slate-50 border border-slate-100">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="14" width="7" height="7"></rect>
                                        <rect x="3" y="14" width="7" height="7"></rect>
                                    </svg>
                                </div>
                                MONITOR
                            </div>
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-black tracking-widest text-success rounded-lg bg-success-bg/40 border border-success/10 shadow-sm backdrop-blur-md uppercase"
                            >
                                <span className="relative flex w-1 h-1">
                                    <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-success"></span>
                                    <span className="relative inline-flex w-1 h-1 rounded-full bg-success"></span>
                                </span>
                                Stream
                            </motion.div>
                        </div>

                        {/* List Items */}
                        <div className="flex flex-col gap-3 mb-6">
                            <LocalStatusRow
                                title="SafeZone 01"
                                subtitle="AFSS: ACTIVE"
                                icon={CheckIcon}
                                status="success"
                                statusText="OK"
                            />
                            <LocalStatusRow
                                title="Stockage 04"
                                subtitle="Access Alert"
                                icon={AlertIcon}
                                status="alert"
                                statusText="WARN"
                                extraText="Verifying..."
                            />
                        </div>

                        {/* Modern Map Visualization */}
                        <div className="relative w-full h-[180px] rounded-xl overflow-hidden group cursor-crosshair">
                            {/* Base Map Style */}
                            <div className="absolute inset-0 bg-[#0f172a]" />
                            
                            {/* Animated Grid on Map */}
                            <div className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
                            
                            {/* Scanning Line */}
                            <motion.div 
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent z-10"
                            />

                            {/* Map Points */}
                            <div className="absolute inset-0">
                                <motion.div
                                    animate={{ scale: [1, 2, 1], opacity: [0.5, 0.2, 0.5] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute top-[35%] left-[25%] w-8 h-8 -m-4 rounded-full bg-success/20"
                                />
                                <div className="absolute top-[35%] left-[25%] w-2 h-2 -m-[4px] rounded-full bg-success shadow-[0_0_10px_var(--color-success)]" />
                                
                                <motion.div
                                    animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0.3, 0.6] }}
                                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                                    className="absolute top-[65%] left-[60%] w-10 h-10 -m-5 rounded-full bg-danger/20"
                                />
                                <div className="absolute top-[65%] left-[60%] w-2.5 h-2.5 -m-[5px] rounded-full bg-danger shadow-[0_0_15px_var(--color-danger)]" />
                            </div>

                            {/* Map Info Overlay */}
                            <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/5 text-[8px] font-bold text-white tracking-widest uppercase">
                                28.61° N | 77.20° E
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;


