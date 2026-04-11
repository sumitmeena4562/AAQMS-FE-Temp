import React from 'react';
import { motion } from 'framer-motion';
import Section from '../../components/UI/Section';
import SectionHeader from '../../components/UI/SectionHeader';
import { MdOutlineShield, MdOutlineMap, MdQrCodeScanner } from 'react-icons/md';

const FeatureCard = ({ title, description, icon: Icon, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group relative"
        >
            <div className="h-full relative z-10 p-5 sm:p-6 rounded-[24px] bg-white border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(7,34,103,0.08)] hover:border-primary/20 hover:-translate-y-1.5 flex flex-col gap-4 overflow-hidden">
                {/* Icon Box */}
                <div className="w-11 h-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm grow-0">
                    <Icon className="text-[20px]" />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-[13.5px] leading-relaxed text-slate-500 font-medium opacity-80">
                        {description}
                    </p>
                </div>
                
                {/* Subtle highlight line */}
                <div className="mt-auto pt-2">
                    <div className="w-8 h-0.5 bg-slate-100 rounded-full group-hover:w-16 group-hover:bg-primary transition-all duration-700" />
                </div>
            </div>
        </motion.div>
    );
};

const RoleFeatures = () => {
    const features = [
        {
            title: "Administrator",
            description: "Govern enterprise-wide safety protocols, manage user permissions, and access high-level compliance analytics.",
            icon: MdOutlineShield
        },
        {
            title: "Coordinator",
            description: "Orchestrate audit tasks, define precise geofences, and monitor site-wide progress from a central command hub.",
            icon: MdOutlineMap
        },
        {
            title: "Field Officer",
            description: "Execute on-site audits with precision QR scanning, AI-assisted evidence capture, and instant cloud sync.",
            icon: MdQrCodeScanner
        }
    ];

    return (
        <Section id="roles" background="white" withGlow={true} className="border-b border-slate-100/50">
            {/* Standard Section Header */}
            <SectionHeader
                badge="Operational Roles"
                title={<>Tailored Interfaces for <br/> Every Stakeholder</>}
                description="Smart coordination between the boardroom, the planning room, and the field."
            />

            {/* Features Grid - Standard 3-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} index={index} />
                ))}
            </div>
        </Section>
    );
};

export default RoleFeatures;
