import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';
import { MdOutlineShield, MdOutlineMap, MdQrCodeScanner } from 'react-icons/md';

const FeatureCard = ({ title, description, icon: Icon, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 1, 0.36, 1] }}
            className="group relative"
        >
            <div className="h-full relative z-10 p-6 sm:p-7 rounded-[20px] bg-white border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.18)] transition-all duration-500 hover:shadow-[0_30px_70px_rgba(124,58,237,0.20)] hover:border-primary/40 hover:-translate-y-2 flex flex-col gap-5 overflow-hidden">
                {/* Icon Box */}
                <div className="w-14 h-14 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                    <Icon className="text-2xl" />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-[14px] leading-relaxed text-slate-500 font-bold">
                        {description}
                    </p>
                </div>
                
                {/* Subtle highlight line */}
                <div className="mt-auto pt-4 flex items-center gap-2">
                    <div className="w-8 h-1 bg-slate-100 rounded-full group-hover:w-full group-hover:bg-primary/20 transition-all duration-700" />
                </div>

                {/* Glow Effect on Hover */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
        </motion.div>
    );
};

const RoleFeatures = () => {
    const features = [
        {
            title: "Administrator",
            description: "Total control over safety protocols, user access, and org-wide performance reporting.",
            icon: MdOutlineShield
        },
        {
            title: "Coordinator",
            description: "Map zones, assign critical inventory tasks, and track real-time drone visuals.",
            icon: MdOutlineMap
        },
        {
            title: "Field Officer",
            description: "The mobile app for seamless QR scanning, photo evidence, and instant audit sync.",
            icon: MdQrCodeScanner
        }
    ];

    return (
        <section id="roles" className="relative py-24 px-6 overflow-hidden bg-slate-50/50 border-y border-slate-100">
            {/* Clean minimalist background - No distracting arcs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center text-center mb-16"
                >
                    {/* Mini Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 text-[10px] font-black tracking-[0.2em] text-primary/60 bg-white border border-slate-100 rounded-full shadow-sm uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Operational Roles
                    </div>

                    <h2 className="text-[clamp(1.6rem,4vw,2.4rem)] font-black text-slate-900 mb-5 tracking-tighter leading-[1.1]">
                        Tailored Interfaces for <br />
                        Every <span className="text-primary">Responsibility</span>
                    </h2>
                    <p className="text-[15px] text-slate-500 max-w-lg mx-auto leading-relaxed font-bold">
                        Smart coordination between the boardroom, the planning room, and the field.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RoleFeatures;
