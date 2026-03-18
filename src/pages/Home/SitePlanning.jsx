import React from 'react';
import Card from '../../components/UI/Card';
import {
    MdOutlineLayers,
    MdOutlineLibraryAddCheck,
    MdOutlineFilterCenterFocus
} from 'react-icons/md';
import { motion } from 'framer-motion';

const SitePlanning = () => {
    return (
        <section id="planning" className="py-16 px-6 bg-white border-t border-slate-100 relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">

                {/* Left Side: Floor Plan Visual */}
                <motion.div 
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.21, 1, 0.36, 1] }}
                    className="relative"
                >
                    <div className="absolute -top-16 -left-16 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none z-0" />

                    <Card 
                        padding="12px" 
                        borderRadius="24px"
                        className="bg-white/90 backdrop-blur-2xl border-white/50 shadow-2xl relative z-10 overflow-hidden ring-1 ring-slate-100"
                    >
                        {/* Floor Plan Mockup */}
                        <div className="w-full h-[360px] bg-slate-50 rounded-[18px] relative border border-slate-200/50 overflow-hidden shadow-inner group">
                            {/* Grid Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                                 style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)', backgroundSize: '24px 24px' }} 
                            />

                            {/* Zones with micro-interactions */}
                            <motion.div 
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(var(--color-primary-rgb), 0.1)" }}
                                className="absolute top-[15%] left-[15%] w-[30%] h-[35%] bg-primary/5 border-2 border-primary/20 rounded-xl flex items-center justify-center cursor-help transition-colors group/z1"
                            >
                                <span className="text-[10px] font-black text-primary tracking-widest uppercase group-hover/z1:scale-110 transition-transform">Zone 101</span>
                            </motion.div>
                            
                            <motion.div 
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                                className="absolute top-[60%] left-[10%] w-[40%] h-[25%] bg-emerald-500/5 border-2 border-emerald-500/20 rounded-xl flex items-center justify-center cursor-help transition-colors group/z2"
                            >
                                <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase group-hover/z2:scale-110 transition-transform">Zone 102</span>
                            </motion.div>

                            <motion.div 
                                animate={{ opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute top-[20%] left-[55%] w-[35%] h-[60%] bg-rose-500/[0.02] border-2 border-dashed border-rose-500/20 rounded-xl flex items-center justify-center"
                            >
                                <span className="text-[10px] font-black text-rose-500/50 tracking-[0.2em] uppercase">Restricted</span>
                            </motion.div>

                            {/* Map Markers with pulsing animation */}
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute top-[25%] left-[25%] w-3 h-3 bg-primary rounded-full border-2 border-white shadow-lg shadow-primary/40"
                            />
                            
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                className="absolute top-[70%] left-[30%] w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-lg shadow-emerald-500/40"
                            />
                            
                            <motion.div 
                                animate={{ scale: [1, 1.4, 1], rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute top-[45%] left-[75%] w-4 h-4 bg-rose-500 rounded-full border-2 border-white shadow-xl shadow-rose-500/50"
                            />

                            {/* Scanning pulse effect */}
                            <motion.div 
                                animate={{ opacity: [0, 0.3, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-x-0 h-2 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none"
                                style={{ top: '30%' }}
                            />
                        </div>

                        {/* Control Overlay */}
                        <div className="absolute bottom-6 right-6 flex gap-2.5">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="bg-white p-2 rounded-xl shadow-lg border border-slate-100 text-primary cursor-pointer hover:bg-slate-50 transition-colors">
                                <MdOutlineLayers className="text-lg" />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="bg-white p-2 rounded-xl shadow-lg border border-slate-100 text-primary cursor-pointer hover:bg-slate-50 transition-colors">
                                <MdOutlineFilterCenterFocus className="text-lg" />
                            </motion.div>
                        </div>
                    </Card>
                </motion.div>

                {/* Right Side: Text */}
                <motion.div 
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.21, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-4 text-[10px] font-black text-primary tracking-widest uppercase mb-4">
                        <div className="w-10 h-px bg-primary/30"></div>
                        Site Digital Twin
                    </div>
                    <h2 className="text-[clamp(1.75rem,4vw,2.4rem)] font-black text-slate-900 mb-6 tracking-tighter leading-[1.05]">
                        Visual Foundation for <span className="text-primary">Precision Audits.</span>
                    </h2>
                    <p className="text-base text-slate-500 leading-relaxed mb-10 max-w-xl font-medium">
                        Upload architectural floor plans and layer them with interactive audit zones. Geofence high-risk assets and manage inventory with geographical context.
                    </p>

                    <div className="grid grid-cols-1 gap-8">
                        {[
                            { icon: MdOutlineLayers, title: "Multi-Layer Mapping", desc: "Toggle between structural plans, zone heatmaps, and live asset locations." },
                            { icon: MdOutlineLibraryAddCheck, title: "Zone-Specific Compliance", desc: "Assign unique safety regulations and scan intervals to specific site areas." }
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 + (idx * 0.2) }}
                                className="flex gap-5 group"
                            >
                                <div className="min-w-[48px] h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-inner border border-primary/10 group-hover:scale-110 transition-transform duration-500">
                                    <item.icon className="text-2xl" />
                                </div>
                                <div>
                                    <h5 className="text-lg font-black text-slate-900 mb-1.5 tracking-tight group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h5>
                                    <p className="text-[15px] text-slate-500 leading-relaxed font-medium">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SitePlanning;
