import React from 'react';
import { motion } from 'framer-motion';
import { Heading, Text } from '../../components/UI/Typography';
import Button from '../../components/UI/Button';
import { Link } from 'react-router-dom';
import { MapPin, ClipboardCheck, BrainCircuit, ShieldAlert } from 'lucide-react';

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
        { label: "Site Planning", icon: <MapPin className="text-primary w-6 h-6" /> },
        { label: "Asset Audits", icon: <ClipboardCheck className="text-primary w-6 h-6" /> },
        { label: "AI Comparison", icon: <BrainCircuit className="text-primary w-6 h-6" /> },
        { label: "Risk Reports", icon: <ShieldAlert className="text-primary w-6 h-6" /> }
    ];

    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-between pt-32 sm:pt-40 pb-16 overflow-hidden bg-background">
            {/* --- Structural Glow (Focus on Lines) --- */}
            <div className="absolute inset-0 pointer-events-none select-none">
                {/* Minimal Base Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-primary/[0.02] via-transparent to-transparent opacity-40" />

                {/* Glowing Structural Arcs (The "Lines") */}
                <motion.div
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[160%] max-w-[1400px] aspect-square rounded-full border-[1px] border-primary/10 shadow-[0_0_8px_rgba(7,34,103,0.1)] animate-[spin_180s_linear_infinite]"
                />

                <motion.div
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[140%] max-w-[1200px] aspect-square rounded-full border-[1px] border-primary/[0.05] border-dashed shadow-[0_0_5px_rgba(7,34,103,0.05)] animate-[spin_120s_linear_infinite_reverse]"
                />

                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[120%] max-w-[1000px] aspect-square rounded-full border-[1px] border-primary/10 shadow-[0_0_10px_rgba(7,34,103,0.08)]" />

                <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[100%] max-w-[800px] aspect-square rounded-full border-[1px] border-primary/10 border-dashed" />

                {/* Subtle Nodes with Glow */}
                <motion.div
                    animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-[35%] left-[30%] w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(7,34,103,0.8)]"
                />

                {/* Content Focus Halo */}
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[30%] h-[30%] bg-primary/[0.03] blur-3xl" />
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
                    className="inline-flex items-center gap-2 px-3 py-1 mb-6 sm:mb-10 text-[9px] sm:text-[10px] font-black tracking-[0.2em] sm:tracking-[0.25em] text-primary/80 bg-white shadow-soft border border-border/50 rounded-full uppercase"
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
                        <span className="text-gradient italic font-extrabold tracking-tight">Simplified.</span>
                    </Heading>
                </motion.div>

                <motion.div variants={itemVariants} className="w-full max-w-2xl px-4 sm:px-0">
                    <Text className="mb-12 text-muted/90 md:text-lg">
                        Deploy professional-grade safety audits across multiple sites <br className="hidden md:block" />
                        with real-time AI tracking and digital twin integration.
                    </Text>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 w-full sm:w-auto px-4 sm:px-0">
                    <Link to="/login" className="w-full sm:w-auto">
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full sm:w-auto h-[52px] px-8 group rounded-full text-sm sm:text-base border border-white/10"
                        >
                            Start Auditing
                            <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14m-7-7 7 7-7 7" />
                            </svg>
                        </Button>
                    </Link>

                    <div className="flex items-center gap-5 sm:border-l sm:border-slate-200 sm:pl-8 group cursor-default">
                        <motion.span
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            className="text-4xl sm:text-[42px] font-black text-primary tracking-tighter transition-colors"
                        >
                            10
                        </motion.span>
                        <div className="text-[10px] sm:text-[11px] font-bold text-muted/60 leading-tight text-left uppercase tracking-[0.05em]">
                            years of <br /> <span className="text-primary/70">exceptional</span> reliability
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* --- Sleek Capability Bar --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="relative w-full max-w-4xl px-4 sm:px-8 z-30 mt-10 sm:mt-12"
            >
                <div className="glass-panel rounded-3xl px-8 sm:px-12 py-4 sm:py-3.5 flex flex-col xs:grid xs:grid-cols-2 lg:flex lg:flex-row items-center justify-center gap-8 sm:gap-10 md:gap-12 lg:gap-14">
                    {capabilities.map((cap, i) => (
                        <div key={i} className="flex items-center gap-3 sm:gap-3 group cursor-pointer transition-all hover:translate-y-[-1px] w-full xs:w-auto justify-center">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm flex-shrink-0">
                                {React.cloneElement(cap.icon, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[12px] sm:text-[13px] font-black text-text tracking-tight leading-tight whitespace-nowrap">{cap.label}</span>
                                <span className="text-[9px] font-bold text-muted uppercase tracking-widest opacity-50">Management</span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;





