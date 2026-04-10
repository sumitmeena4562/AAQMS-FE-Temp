import React from 'react';
import { motion } from 'framer-motion';
import { Heading, Text } from '../../components/ui/Typography';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

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
        <section className="relative min-h-[90vh] flex flex-col items-center justify-between pt-32 sm:pt-40 pb-16 overflow-hidden bg-background">
            {/* --- Enhanced Alchemy Background (High-Octane Glow) --- */}
            <div className="absolute inset-0 pointer-events-none select-none">
                {/* Core Radial Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-60" />
                
                {/* Main Glowing Arcs */}
                <div className="absolute top-[15%] sm:top-[20%] left-1/2 -translate-x-1/2 w-[160%] sm:w-[130%] max-w-[1400px] aspect-square rounded-full border-[1.5px] border-primary/20 blur-[1px] animate-[spin_60s_linear_infinite]" />
                <div className="absolute top-[20%] sm:top-[25%] left-1/2 -translate-x-1/2 w-[140%] sm:w-[110%] max-w-[1200px] aspect-square rounded-full border-[40px] sm:border-[100px] border-primary/[0.04] blur-3xl saturate-200" />
                <div className="absolute top-[25%] sm:top-[30%] left-1/2 -translate-x-1/2 w-[120%] sm:w-[90%] max-w-[1000px] aspect-square rounded-full border-[30px] sm:border-[60px] border-primary/[0.08] blur-2xl saturate-150" />
                
                {/* High Contrast Accents */}
                <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[100%] sm:w-[70%] max-w-[800px] aspect-square border-t-[2px] border-primary/30 rounded-full blur-sm" />
                <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[100%] sm:w-[70%] max-w-[800px] aspect-square rounded-full bg-gradient-to-b from-primary/10 to-transparent blur-3xl opacity-40 translate-y-[-10%]" />

                {/* Pulsing Nodes */}
                <motion.div 
                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }} 
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[35%] left-[30%] w-2 h-2 rounded-full bg-primary/40 shadow-[0_0_15px_rgba(7,34,103,0.5)]" 
                />
                <motion.div 
                    animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.3, 1] }} 
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-[40%] right-[25%] w-3 h-3 rounded-full bg-primary/20 shadow-[0_0_20px_rgba(7,34,103,0.3)]" 
                />
            </div>

            {/* --- Main Content --- */}
            <motion.div
                className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Mini Badge */}
                <motion.div 
                    variants={itemVariants} 
                    className="inline-flex items-center gap-2 px-3 py-1 mb-10 text-[10px] font-black tracking-[0.25em] text-primary/80 bg-white shadow-soft border border-border/50 rounded-full uppercase"
                >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Asset Intelligence System
                </motion.div>

                <motion.div variants={itemVariants} className="w-full max-w-3xl">
                    <Heading className="mb-8 drop-shadow-sm">
                        Intelligent Asset Audits. <br />
                        <span className="text-primary italic">Simplified.</span>
                    </Heading>
                </motion.div>

                <motion.div variants={itemVariants} className="w-full max-w-2xl">
                    <Text className="mb-12 text-muted/90 md:text-lg">
                        Deploy professional-grade safety audits across multiple sites <br className="hidden md:block" />
                        with real-time AI tracking and digital twin integration.
                    </Text>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                    <Link to="/login">
                        <Button 
                            variant="primary" 
                            size="lg" 
                            className="w-full sm:w-auto px-12 group"
                        >
                            Start Auditing
                            <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14m-7-7 7 7-7 7" />
                            </svg>
                        </Button>
                    </Link>
                    
                    <div className="flex items-center gap-4 sm:border-l sm:border-border sm:pl-8">
                        <span className="text-4xl font-black text-text tracking-tighter">10</span>
                        <div className="text-[10px] font-bold text-muted/60 leading-tight text-left uppercase tracking-tighter">
                            years of <br /> reliability
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* --- Static Capability Bar --- */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="relative w-full max-w-6xl px-12 z-30 mt-12 sm:mt-20"
            >
                <div className="grid grid-cols-2 lg:flex lg:flex-wrap items-center justify-between gap-8 pt-12 border-t border-border/40">
                    {capabilities.map((cap, i) => (
                        <div key={i} className="flex items-center gap-4 group cursor-pointer transition-all hover:translate-y-[-2px]">
                            <div className="text-2xl filter grayscale-[0.5] group-hover:grayscale-0 transition-all group-hover:drop-shadow-lg scale-100 group-hover:scale-110">{cap.icon}</div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-text tracking-tight mb-0.5">{cap.label}</span>
                                <span className="text-[9px] font-bold text-muted uppercase tracking-widest opacity-60">Management</span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;





