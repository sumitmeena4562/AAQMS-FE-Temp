import React from 'react';
import { motion } from 'framer-motion';
import Section from '../../components/UI/Section';
import SectionHeader from '../../components/UI/SectionHeader';
import Card from '../../components/UI/Card';
import {
    MdOutlineLayers,
    MdOutlineLibraryAddCheck,
    MdOutlineFilterCenterFocus
} from 'react-icons/md';

const SitePlanning = () => {
    return (
        <Section id="planning" background="white" withGlow={true}>
            {/* Unified Section Header */}
            <SectionHeader
                badge="Digital Twin"
                title={<>Mapping & Precision <br className="hidden sm:block" /> at Scale</>}
                description="Digitize your entire site layout with interactive geofenced zones and geographical asset context."
            />

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.1fr] gap-12 lg:gap-20 items-center">
                {/* Left Side: Floor Plan Visual */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                >
                    <div className="absolute -top-16 -left-16 w-[300px] h-[300px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none z-0" />

                    <Card 
                        padding="8px" 
                        borderRadius="24px"
                        className="bg-white border-slate-200/50 shadow-2xl relative z-10 overflow-hidden ring-1 ring-slate-100/50"
                    >
                        {/* Floor Plan Mockup - Compact Height */}
                        <div className="w-full h-[320px] sm:h-[360px] bg-slate-50 rounded-[18px] relative border border-slate-200/50 overflow-hidden shadow-inner group">
                            {/* Grid Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                                 style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)', backgroundSize: '18px 18px' }} 
                            />

                            {/* Zones with micro-interactions */}
                            <motion.div 
                                whileHover={{ scale: 1.005, backgroundColor: "rgba(7, 34, 103, 0.05)" }}
                                className="absolute top-[12%] left-[10%] w-[35%] h-[35%] bg-primary/[0.03] border border-primary/20 rounded-[20px] flex flex-col items-center justify-center cursor-help transition-all group/z1 shadow-sm"
                            >
                                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-primary/10 px-1.5 py-0.5 rounded-full border border-primary/10">
                                    <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[6.5px] font-black text-primary uppercase tracking-tighter">Live</span>
                                </div>
                                <span className="text-[9px] font-black text-primary/80 tracking-[0.2em] uppercase group-hover/z1:text-primary transition-colors">Zone 101</span>
                            </motion.div>
                            
                            <motion.div 
                                whileHover={{ scale: 1.005, backgroundColor: "rgba(16, 185, 129, 0.05)" }}
                                className="absolute top-[55%] left-[8%] w-[45%] h-[30%] bg-emerald-500/[0.03] border border-emerald-500/20 rounded-[20px] flex items-center justify-center cursor-help transition-all group/z2 shadow-sm"
                            >
                                <span className="text-[9px] font-black text-emerald-600/80 tracking-[0.2em] uppercase group-hover/z2:text-emerald-600 transition-colors">Zone 102</span>
                            </motion.div>

                            <motion.div 
                                animate={{ opacity: [0.6, 0.8, 0.6] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute top-[15%] left-[58%] w-[35%] h-[70%] bg-rose-500/[0.01] border border-dashed border-rose-500/20 rounded-[20px] flex items-center justify-center overflow-hidden"
                            >
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                                     style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f43f5e, #f43f5e 1px, transparent 1px, transparent 15px)' }}
                                />
                                <span className="text-[8px] font-black text-rose-500/50 tracking-[0.25em] uppercase text-center px-6 leading-relaxed relative z-10">Restricted Area</span>
                            </motion.div>

                            {/* Sensor Nodes (Upgraded from simple dots) */}
                            <motion.div 
                                animate={{ opacity: [1, 0.7, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute top-[32%] left-[28%] flex items-center justify-center z-30"
                            >
                                <div className="w-4 h-4 rounded-full bg-primary/10 absolute animate-ping" />
                                <div className="w-1.5 h-1.5 bg-primary rounded-full border-2 border-white shadow-lg relative z-10" />
                            </motion.div>
                            
                            <motion.div 
                                animate={{ opacity: [1, 0.7, 1] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                className="absolute top-[72%] left-[42%] flex items-center justify-center z-30"
                            >
                                <div className="w-4 h-4 rounded-full bg-emerald-500/10 absolute animate-ping" />
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full border-2 border-white shadow-lg relative z-10" />
                            </motion.div>

                            {/* Scanning pulse effect */}
                            <motion.div 
                                animate={{ opacity: [0, 0.15, 0], y: [0, 360] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-x-0 h-10 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none z-20"
                                style={{ top: '-10%' }}
                            />
                        </div>

                        {/* Premium Glass Toolbar - Compact */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-white/80 backdrop-blur-md rounded-xl border border-slate-100 shadow-2xl z-40 ring-1 ring-slate-900/5">
                            {[
                                { icon: MdOutlineLayers, label: "Layers" },
                                { icon: MdOutlineFilterCenterFocus, label: "Focus" }
                            ].map((tool, i) => (
                                <motion.div 
                                    key={i}
                                    whileHover={{ backgroundColor: "rgba(7, 34, 103, 0.05)", scale: 1.02 }} 
                                    whileTap={{ scale: 0.98 }} 
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-primary cursor-pointer transition-colors"
                                >
                                    <tool.icon className="text-base" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">{tool.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </motion.div>

                {/* Right Side: Features List */}
                <div className="flex flex-col gap-8">
                    {[
                        { 
                            icon: MdOutlineLayers, 
                            title: "Spatial Layering", 
                            desc: "Toggle between structure plans, hazard heatmaps, and live asset coordinate layers." 
                        },
                        { 
                            icon: MdOutlineLibraryAddCheck, 
                            title: "Smart Geofencing", 
                            desc: "Set safety protocols and audit rules for specific zones with instant breach alerts." 
                        }
                    ].map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + (idx * 0.1), duration: 0.8 }}
                            className="flex gap-5 group"
                        >
                            <div className="min-w-[48px] h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 flex-shrink-0 shadow-sm">
                                <item.icon className="text-[22px]" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <h5 className="text-[17px] sm:text-[18px] font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors leading-tight">
                                    {item.title}
                                </h5>
                                <p className="text-[13.5px] sm:text-[14px] text-slate-500 leading-relaxed font-medium opacity-80">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
};

export default SitePlanning;
