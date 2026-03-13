import React from 'react';
import Card from '../../components/UI/Card';
import { motion } from 'framer-motion';
import {
    MdOutlineTrendingUp,
    MdOutlineAssignmentLate,
    MdOutlineAutoGraph
} from 'react-icons/md';

const StatCard = ({ label, value, trend, icon: Icon, color, index }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
        className="flex-1 min-w-[140px]"
    >
        <Card
            className="flex flex-col gap-4 h-full bg-white/80 backdrop-blur-md border border-white/50 group"
            hoverEffect={true}
        >
            <div className="flex justify-between items-center">
                <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3"
                    style={{ 
                        background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                        color: color,
                        boxShadow: `inset 0 0 0 1px ${color}10`
                    }}
                >
                    <Icon className="text-[22px]" />
                </div>
                {trend && (
                    <div className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-tighter">
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <div className="text-[11px] font-black text-slate-400 mb-1 uppercase tracking-widest leading-none">
                    {label}
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
                    {value}
                </div>
            </div>
        </Card>
    </motion.div>
);

const Analytics = () => {
    return (
        <section id="analytics" className="py-16 px-6 bg-gradient-to-b from-white to-slate-50 border-t border-slate-100 relative overflow-hidden">
            {/* Background Decorative Blob */}
            <div className="absolute top-[10%] -right-[5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center relative z-10">
                
                {/* Left Side: Content */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.21, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-4 text-[10px] font-black text-primary tracking-widest uppercase mb-4">
                        <div className="w-10 h-px bg-primary/30"></div>
                        Reporting & Compliance
                    </div>

                    <h2 className="text-[clamp(1.75rem,4vw,2.4rem)] font-black text-slate-900 mb-6 tracking-tighter leading-[1.05]">
                        Real-Time Insights for Absolute <span className="text-primary">Accountability.</span>
                    </h2>

                    <p className="text-base text-slate-500 leading-relaxed mb-8 max-w-xl font-medium">
                        Transform raw field data into actionable audit trails. Automatically generate daily, weekly, or monthly compliance reports with AI-verified precision.
                    </p>

                    <div className="flex flex-col gap-5">
                        {[
                            "Automated AI-Risk identification & flagship alerts.",
                            "Tamper-proof audit trails for regulatory submission.",
                            "Historical data comparison for maintenance trends."
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 + (idx * 0.1) }}
                                className="flex items-start gap-4 text-base text-slate-700 font-bold"
                            >
                                <div className="min-w-[22px] h-5.5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                {item}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: Visual Dashboard Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.21, 1, 0.36, 1] }}
                    className="relative"
                >
                    <Card
                        padding="32px"
                        borderRadius="28px"
                        className="bg-white/90 backdrop-blur-2xl border-white/50 shadow-2xl flex flex-col gap-8 ring-1 ring-slate-100"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-black text-slate-900 tracking-tight">Compliance Overview</h4>
                            <div className="flex gap-2">
                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_8px_var(--color-success)]" />
                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="w-2.5 h-2.5 rounded-full bg-warning" />
                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-col sm:flex-row gap-5">
                            <StatCard
                                label="Audit Score"
                                value="98.2%"
                                trend="+2.4%"
                                icon={MdOutlineTrendingUp}
                                color="#10b981"
                                index={0}
                            />
                            <StatCard
                                label="Risk Flags"
                                value="03"
                                icon={MdOutlineAssignmentLate}
                                color="#ef4444"
                                index={1}
                            />
                        </div>

                        {/* Fancy Chart Area */}
                        <div className="h-44 bg-slate-50 rounded-2xl border border-slate-100 flex items-end p-5 gap-3 relative overflow-hidden group shadow-inner">
                            {/* Scanning line for dashboard aesthetic */}
                            <motion.div 
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-x-0 h-px bg-primary/20 pointer-events-none z-10"
                            />
                            
                            {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${h}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: 0.6 + (i * 0.05), ease: "easeOut" }}
                                    className={`
                                        flex-1 rounded-t-lg transition-all duration-300
                                        ${i === 7 ? 'bg-primary' : 'bg-primary/20 group-hover:bg-primary/30'}
                                    `}
                                />
                            ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-end gap-3 flex-wrap">
                            <motion.button 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }} 
                                className="px-5 py-2.5 text-[12px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 border border-slate-200 rounded-xl transition-colors hover:bg-slate-100"
                            >
                                History
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px -5px rgba(var(--color-primary-rgb), 0.3)" }} 
                                whileTap={{ scale: 0.95 }} 
                                className="px-5 py-2.5 text-[12px] font-black uppercase tracking-widest text-white bg-primary rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 group transition-all"
                            >
                                <MdOutlineAutoGraph className="text-base group-hover:rotate-12 transition-transform" /> 
                                Generate Report
                            </motion.button>
                        </div>
                    </Card>

                    {/* Decorative Floating Label */}
                    <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="absolute -bottom-5 -left-5 bg-white p-3.5 px-6 rounded-2xl shadow-xl z-20 flex items-center gap-3 border border-slate-100 ring-2 ring-white"
                    >
                        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_12px_var(--color-success)]" />
                        <span className="text-sm font-black text-slate-900 tracking-tight">Live Sync Active</span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Analytics;
