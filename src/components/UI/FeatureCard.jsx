import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import { cn } from '../../utils/cn';

/**
 * --- FEATURE CARD (SIMPLE & CLEAN) ---
 * The original clean design preferred for its simplicity.
 */
const FeatureCard = ({ 
    title, 
    description, 
    icon: Icon, 
    index = 0,
    className,
    delay = 0
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
                duration: 0.5, 
                delay: delay || (index * 0.1)
            }}
            className={cn("h-full", className)}
        >
            <div className="h-full p-6 elite-card elite-card-hover group">
                {/* Icon Box */}
                <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    {Icon && <Icon className="text-2xl" aria-hidden="true" />}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-[19px] font-bold text-text-title tracking-tight group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-[14.5px] leading-relaxed text-text-muted opacity-90 transition-opacity">
                        {description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default FeatureCard;
