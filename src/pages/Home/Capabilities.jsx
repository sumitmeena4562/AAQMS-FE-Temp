import React from 'react';
import { motion } from 'framer-motion';
import Section from '../../components/UI/Section';
import SectionHeader from '../../components/UI/SectionHeader';
import Card from '../../components/UI/Card';
import {
    MdOutlineBusiness,
    MdOutlineAirplanemodeActive,
    MdOutlinePushPin,
    MdOutlineQrCodeScanner,
    MdOutlineAssignmentLate,
    MdOutlineVerified,
} from 'react-icons/md';

const CapabilityCard = ({ title, description, icon: Icon, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
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
                
                {/* Standard Hover Indicator */}
                <div className="mt-auto pt-2">
                    <div className="w-8 h-0.5 bg-slate-100 rounded-full group-hover:w-16 group-hover:bg-primary transition-all duration-700" />
                </div>
            </div>
        </motion.div>
    );
};

const Capabilities = () => {
    const list = [
        {
            title: "Multi-Site Governance",
            description: "Centralize safety operations across global facilities with a unified administrative dashboard.",
            icon: MdOutlineBusiness
        },
        {
            title: "Digital Twin Mapping",
            description: "Convert blueprints and spatial captures into interactive twins for immersive site monitoring.",
            icon: MdOutlineAirplanemodeActive
        },
        {
            title: "Precision Geofencing",
            description: "Deploy high-precision audit zones to automate compliance checks for regional assets.",
            icon: MdOutlinePushPin
        },
        {
            title: "Secure Asset Tracking",
            description: "Verify the physical status of assets instantly with secure, end-to-end QR encryption.",
            icon: MdOutlineQrCodeScanner
        },
        {
            title: "AI Risk Intelligence",
            description: "Automated detection engine that flags audit anomalies and safety breaches in real-time.",
            icon: MdOutlineAssignmentLate
        },
        {
            title: "Enterprise Reporting",
            description: "Generate immutable, data-rich audit trails for seamless regulatory and board submission.",
            icon: MdOutlineVerified
        }
    ];

    return (
        <Section id="capabilities" background="white" withGlow={true}>
            {/* Unified Section Header */}
            <SectionHeader
                badge="Platform Capabilities"
                title={<>The Backend of <br className="hidden sm:block" /> Modern Compliance</>}
                description="Enterprise-grade tools built for rigorous inventory and safety standards, delivering precision at every touchpoint."
            />

            {/* Grid - Standard 3-column responsive layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {list.map((item, index) => (
                    <CapabilityCard key={index} {...item} index={index} />
                ))}
            </div>
        </Section>
    );
};

export default Capabilities;
