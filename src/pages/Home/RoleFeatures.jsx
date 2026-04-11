import React from 'react';
import { motion } from 'framer-motion';
import Section from '../../components/UI/Section';
import SectionHeader from '../../components/UI/SectionHeader';
import { ROLE_FEATURES } from '../../data/landingData';

const FeatureCard = ({ title, description, icon: Icon, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group relative"
        >
            <div className="h-full relative z-10 p-5 sm:p-6 rounded-[24px] bg-surface border border-border/60 shadow-soft transition-all duration-500 hover:shadow-premium hover:border-primary/20 hover:-translate-y-1.5 flex flex-col gap-4 overflow-hidden">
                {/* Icon Box */}
                <div className="w-11 h-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm grow-0">
                    <Icon className="text-[20px]" aria-hidden="true" />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-black text-text-title tracking-tight leading-tight group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-[13.5px] leading-relaxed text-text-muted font-medium opacity-80">
                        {description}
                    </p>
                </div>
                
                {/* Subtle highlight line */}
                <div className="mt-auto pt-2" aria-hidden="true">
                    <div className="w-8 h-0.5 bg-border rounded-full group-hover:w-16 group-hover:bg-primary transition-all duration-700" />
                </div>
            </div>
        </motion.div>
    );
};

const RoleFeatures = () => {
    const { badge, title, description, features } = ROLE_FEATURES;

    return (
        <Section id="roles" background="white" withGlow={true} className="border-b border-border/50">
            {/* Standard Section Header */}
            <SectionHeader
                badge={badge}
                title={title}
                description={description}
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
