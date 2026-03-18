import React from 'react';
import { motion } from 'framer-motion';
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
            transition={{ duration: 0.7, delay: index * 0.1, ease: [0.21, 1, 0.36, 1] }}
            className="h-full"
        >
            <Card
                className="h-full flex flex-col gap-6 group hover:border-primary/30 transition-all duration-500"
                hoverEffect={true}
            >
                {/* Decorative Background Glow */}
                <div className="absolute -top-5 -right-5 w-20 h-20 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />

                {/* Icon Box */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary flex items-center justify-center shadow-inner border border-primary/10 relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <Icon className="text-[28px]" />
                </div>

                {/* Text Content */}
                <div className="flex flex-col gap-3 relative z-10">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-slate-500 font-medium">
                        {description}
                    </p>
                </div>

                {/* Hover indicator */}
                <motion.div 
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary/40">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                </motion.div>
            </Card>
        </motion.div>
    );
};

const Capabilities = () => {
    const list = [
        {
            title: "Multi-Site Management",
            description: "Unified dashboard for managing safety protocols across distributed facilities and subsidiaries.",
            icon: MdOutlineBusiness
        },
        {
            title: "Digital Mapping (Drone/2D)",
            description: "Integrate drone imagery and 2D floor plans to create accurate digital twins of your zones.",
            icon: MdOutlineAirplanemodeActive
        },
        {
            title: "Smart Zone Marking",
            description: "Geofence high-risk assets and assign specific inventory checklists to precise locations.",
            icon: MdOutlinePushPin
        },
        {
            title: "QR Inventory Tracking",
            description: "Generate and scan secure QR codes to instantly verify asset presence and condition.",
            icon: MdOutlineQrCodeScanner
        },
        {
            title: "AI Mismatch Detection",
            description: "Algorithms automatically flag discrepancies between recorded inventory and live audit data.",
            icon: MdOutlineAssignmentLate
        },
        {
            title: "Verified Reporting",
            description: "Generate tamper-proof audit trails and compliance reports for stakeholders.",
            icon: MdOutlineVerified
        }
    ];

    return (
        <section id="capabilities" className="py-16 px-6 bg-slate-50/50 border-t border-slate-100 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.21, 1, 0.36, 1] }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-4 text-[11px] font-black text-primary tracking-widest uppercase mb-4">
                        <div className="w-10 h-px bg-primary/30"></div>
                        Key Expertise
                    </div>
                    <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-black text-slate-900 mb-5 tracking-tight leading-none">
                        Core <span className="text-primary">Capabilities.</span>
                    </h2>
                    <p className="text-base text-slate-500 max-w-xl leading-relaxed font-medium">
                        Enterprise-grade tools built for rigorous inventory and safety standards, delivering precision at every touchpoint.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {list.map((item, index) => (
                        <CapabilityCard key={index} {...item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Capabilities;
