import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';
import { MdOutlineShield, MdOutlineMap, MdQrCodeScanner } from 'react-icons/md';

const FeatureCard = ({ title, description, icon: Icon, colorTheme, index }) => {
    const themes = {
        primary: { 
            bg: 'bg-primary/10', 
            color: 'text-primary', 
            border: 'hover:border-primary/40',
            shadow: 'shadow-primary/5'
        },
        secondary: { 
            bg: 'bg-sky-50', 
            color: 'text-sky-600', 
            border: 'hover:border-sky-400/40',
            shadow: 'shadow-sky-500/5'
        },
        success: { 
            bg: 'bg-emerald-50', 
            color: 'text-emerald-600', 
            border: 'hover:border-emerald-400/40',
            shadow: 'shadow-emerald-500/5'
        }
    };

    const theme = themes[colorTheme] || themes.primary;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.21, 1, 0.36, 1] }}
            className="h-full"
        >
            <Card
                className={`h-full flex flex-col gap-6 transition-all duration-500 border-slate-100 ${theme.border} group`}
                hoverEffect={true}
            >
                {/* Icon Box */}
                <div className={`w-14 h-14 rounded-2xl ${theme.bg} ${theme.color} flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                    <Icon className="text-[28px]" />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-slate-500 font-medium">
                        {description}
                    </p>
                </div>
                
                {/* Decorative background element */}
                <div className={`absolute -bottom-6 -right-6 w-20 h-20 ${theme.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
            </Card>
        </motion.div>
    );
};

const RoleFeatures = () => {
    const features = [
        {
            title: "Admin",
            description: "Centralized control to define safety standards, manage user roles, and oversee organizational compliance metrics.",
            icon: MdOutlineShield,
            colorTheme: "primary"
        },
        {
            title: "Coordinator",
            description: "Strategic planning tools to map zones, assign inventory audits, and monitor real-time drone feeds.",
            icon: MdOutlineMap,
            colorTheme: "secondary"
        },
        {
            title: "Field Officer",
            description: "Mobile-first interface for rapid QR scanning, evidence capture, and instant verification reporting.",
            icon: MdQrCodeScanner,
            colorTheme: "success"
        }
    ];

    return (
        <section id="roles" className="py-16 px-6 bg-white border-t border-slate-100 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.21, 1, 0.36, 1] }}
                    className="text-center mb-12"
                >
                    <h2 className="text-[clamp(1.7rem,4vw,2.4rem)] font-black text-slate-900 mb-5 tracking-tighter leading-none">
                        Orchestrated Safety <span className="text-primary">Operations</span>
                    </h2>
                    <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
                        Seamless coordination between administration, planning, and field execution.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RoleFeatures;
