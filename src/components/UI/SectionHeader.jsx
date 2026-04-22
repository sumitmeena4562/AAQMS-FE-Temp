import React from 'react';
import { motion } from 'framer-motion';
import { Heading, Text } from './Typography';
import { cn } from '../../utils/cn';

/**
 * --- SectionHeader ---
 * A premium, center-aligned header component inspired by elite SaaS platforms.
 * Consistently applies Hero-style typography across all sections.
 */
const SectionHeader = ({ 
    badge, 
    title, 
    description, 
    className,
    align = 'center' 
}) => {
    const isCenter = align === 'center';



    return (
        <div
            className={cn(
                "flex flex-col mb-10 sm:mb-16 max-w-4xl",
                isCenter ? "items-center text-center mx-auto" : "items-start text-left",
                className
            )}
        >
            {/* Badge */}
            {badge && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-[11px] font-black tracking-[0.2em] text-primary bg-primary/5 border border-primary/10 rounded-full uppercase"
                >
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                    </span>
                    {badge}
                </motion.div>
            )}

            {/* Title */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
            >
                <Heading 
                    as="h2" 
                    className={cn(
                        "text-[clamp(1.8rem,5vw,2.8rem)] mb-6 tracking-tighter leading-[1.15] drop-shadow-sm",
                        isCenter ? "mx-auto" : ""
                    )}
                >
                    {title}
                </Heading>
            </motion.div>

            {/* Description */}
            {description && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full"
                >
                    <Text 
                        size="lg" 
                        className={cn(
                            "text-body max-w-2xl leading-relaxed font-medium md:text-xl",
                            isCenter ? "mx-auto" : ""
                        )}
                    >
                        {description}
                    </Text>
                </motion.div>
            )}
        </div>
    );
};

export default SectionHeader;
