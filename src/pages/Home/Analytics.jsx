import React from 'react';
import Card from '../../components/UI/Card';
import Section from '../../components/UI/Section';
import SectionHeader from '../../components/UI/SectionHeader';
import { motion } from 'framer-motion';
import {
    MdOutlineTrendingUp,
    MdOutlineAssignmentLate,
    MdOutlineAutoGraph
} from 'react-icons/md';

const StatCard = ({ label, value, trend, icon: Icon, color, index }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
        className="flex-1"
    >
        <Card
            className="flex flex-col gap-1.5 h-full bg-white border border-slate-100 shadow-sm p-3 sm:p-4 hover:border-primary/20 transition-all"
        >
            <div className="flex justify-between items-center mb-1">
                <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${color}10`, color: color }}
                >
                    <Icon className="text-[14px]" />
                </div>
                {trend && (
                    <div className="text-[7px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-tighter">
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <div className="text-[7px] font-black text-slate-400 mb-0.5 uppercase tracking-widest leading-none">
                    {label}
                </div>
                <div className="text-sm font-black text-slate-900 leading-none">
                    {value}
                </div>
            </div>
        </Card>
    </motion.div>
);

const Analytics = () => {
    return (
        <section 
            id="analytics" 
            className="relative py-16 sm:py-24 px-6 overflow-hidden bg-[#f8faff]"
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
                    badge="Reporting"
                    title={<>Real-Time Insights <br className="hidden sm:block" /> & Simple Control</>}
                    description="Turn your site data into clear reports and audit history with one click."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center max-w-5xl mx-auto mt-12">
                    {/* Left Side: Features */}
                    <div className="flex flex-col gap-8 w-full order-2 md:order-1">
                        {[
                            { title: "Spot Risks", desc: "Instantly find and fix missing items or safety issues." },
                            { title: "Secure History", desc: "Get a clear, unchangeable record of every audit performed." },
                            { title: "Audit Trends", desc: "Easily track how your site's safety improves over time." }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-5 w-full group">
                                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary mt-1 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div className="flex flex-col gap-1.5 flex-1 pt-0.5">
                                    <h4 className="text-[18px] sm:text-[20px] font-black text-slate-800 leading-tight group-hover:text-primary transition-colors">{item.title}</h4>
                                    <p className="text-[14px] sm:text-[15px] text-slate-500 font-medium opacity-90 leading-relaxed w-full">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Side: Virtualized Dashboard - 2x More Compact */}
                    <div className="order-1 md:order-2 flex justify-center md:justify-end">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative w-full max-w-[340px]"
                        >
                            <Card
                                className="bg-white border-slate-200/60 shadow-2xl flex flex-col overflow-hidden p-0"
                            >
                                {/* Header bar */}
                                <div className="h-8 px-4 flex justify-between items-center border-b border-slate-100 bg-slate-50">
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Analytics Dashboard</span>
                                    <div className="flex gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col gap-5">
                                    {/* Stats Grid */}
                                    <div className="flex gap-3">
                                        <StatCard
                                            label="Audit Score"
                                            value="98.4%"
                                            trend="+1.2%"
                                            icon={MdOutlineTrendingUp}
                                            color="#072267"
                                            index={0}
                                        />
                                        <StatCard
                                            label="Open Risks"
                                            value="02"
                                            icon={MdOutlineAssignmentLate}
                                            color="#ef4444"
                                            index={1}
                                        />
                                    </div>

                                    {/* Mini Graph Area */}
                                    <div className="h-28 bg-slate-50/50 rounded-xl border border-slate-100 flex items-end p-3 gap-1.5 relative overflow-hidden group">
                                        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:15px_15px]" />
                                        
                                        {[40, 70, 50, 80, 60, 90, 65, 85].map((h, i) => (
                                            <motion.div 
                                                key={i} 
                                                initial={{ height: 0 }}
                                                whileInView={{ height: `${h}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.8, delay: 0.4 + (i * 0.05) }}
                                                className={`flex-1 rounded-t-sm ${i === 5 ? 'bg-primary' : 'bg-primary/10'}`}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[8px] font-bold text-slate-400">Live Updates Enabled</span>
                                        <button className="px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-white bg-primary rounded-lg flex items-center gap-1.5 shadow-lg shadow-primary/20">
                                            <MdOutlineAutoGraph className="text-xs" /> Report
                                        </button>
                                    </div>
                                </div>
                            </Card>

                            {/* Status Badge */}
                            <motion.div 
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -bottom-4 -right-4 bg-white p-2 px-4 rounded-full shadow-xl z-20 flex items-center gap-2 border border-slate-100"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black text-slate-900 tracking-tight whitespace-nowrap uppercase">Audit Live</span>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Analytics;
