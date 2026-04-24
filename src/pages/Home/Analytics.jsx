import React from 'react';
import Card from '../../components/UI/Card';
import SectionHeader from '../../components/UI/SectionHeader';
import { motion } from 'framer-motion';
import { MdOutlineAutoGraph } from 'react-icons/md';
import { ANALYTICS_DATA } from '../../data/landingData';
import SectionWrapper from '../../components/Layout/SectionWrapper';
import { cn } from '../../utils/cn';

const StatCard = ({ label, value, trend, icon: Icon, color, index }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
        className="flex-1"
    >
        <Card
            className="flex flex-col gap-1.5 h-full bg-surface border border-border/60 shadow-soft hover:border-primary/20 transition-all p-3 sm:p-4"
        >
            <div className="flex justify-between items-center mb-1">
                <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${color}10`, color: color }}
                >
                    <Icon className="text-[14px]" aria-hidden="true" />
                </div>
                {trend && (
                    <div className="text-[7px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-tighter">
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <div className="text-[7px] font-black text-text-muted mb-0.5 uppercase tracking-widest leading-none">
                    {label}
                </div>
                <div className="text-sm font-black text-text-title leading-none">
                    {value}
                </div>
            </div>
        </Card>
    </motion.div>
);

const Analytics = () => {
    const { badge, title, description, features, stats } = ANALYTICS_DATA;

    return (
        <SectionWrapper>
            <div className="container mx-auto px-6 relative z-10">
                <SectionHeader
                    badge={badge}
                    title={title}
                    description={description}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center max-w-5xl mx-auto mt-12">
                    {/* Left Side: Features */}
                    <div className="flex flex-col gap-8 w-full order-2 md:order-1">
                        {features.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-5 w-full group">
                                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary mt-1 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div className="flex flex-col gap-1.5 flex-1 pt-0.5">
                                    <h4 className="text-[18px] sm:text-[20px] font-black text-text-title leading-tight group-hover:text-primary transition-colors">{item.title}</h4>
                                    <p className="text-[14px] sm:text-[15px] text-text-muted font-medium opacity-90 leading-relaxed w-full">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Side: Virtualized Dashboard */}
                    <div className="order-1 md:order-2 flex justify-center md:justify-end">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative w-full max-w-[340px]"
                        >
                            <Card
                                className="bg-surface border-border/60 shadow-premium flex flex-col overflow-hidden p-0 group/card"
                            >
                                {/* Header bar */}
                                <div className="h-8 px-4 flex justify-between items-center border-b border-border bg-background">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">Live Audit Feed</span>
                                    </div>
                                    <div className="flex gap-1.5" aria-hidden="true">
                                        <div className="w-1.5 h-1.5 rounded-full bg-border" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col gap-5">
                                    {/* Stats Grid */}
                                    <div className="flex gap-3">
                                        {stats.map((stat, i) => (
                                            <StatCard key={i} {...stat} index={i} />
                                        ))}
                                    </div>

                                    {/* Mini Graph Area */}
                                    <div className="h-28 bg-background/50 rounded-xl border border-border flex items-end p-3 gap-1.5 relative overflow-hidden group/graph">
                                        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:15px_15px]" aria-hidden="true" />
                                        
                                        {[40, 70, 50, 80, 60, 90, 65, 85].map((h, i) => (
                                            <motion.div 
                                                key={i} 
                                                initial={{ height: 0 }}
                                                whileInView={{ height: `${h}%` }}
                                                viewport={{ once: true }}
                                                transition={{ 
                                                    duration: 0.8, 
                                                    delay: 0.4 + (i * 0.05),
                                                    ease: [0.33, 1, 0.68, 1]
                                                }}
                                                className={cn(
                                                    "flex-1 rounded-t-sm transition-colors duration-500",
                                                    i === 5 ? "bg-primary shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.3)]" : "bg-primary/20 group-hover/graph:bg-primary/40"
                                                )}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[8px] font-bold text-text-muted opacity-60">System Synchronized</span>
                                        <button className="px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-white bg-primary rounded-lg flex items-center gap-1.5 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-95">
                                            <MdOutlineAutoGraph className="text-xs" aria-hidden="true" /> Full Report
                                        </button>
                                    </div>
                                </div>
                            </Card>

                            {/* Status Badge */}
                            <motion.div 
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -bottom-4 -right-4 bg-surface p-2 px-4 rounded-full shadow-xl z-20 flex items-center gap-2 border border-border"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black text-text-title tracking-tight whitespace-nowrap uppercase">Audit Live</span>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default Analytics;
