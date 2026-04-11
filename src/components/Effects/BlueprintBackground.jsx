import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * ── BLUEPRINT BACKGROUND ──
 * A highly interactive background component providing a 'Blueprint' aesthetic.
 * This version is FIXED and listens to GLOBAL mouse events for parallax tracking
 * even when placed behind other content layers.
 */
const BlueprintBackground = ({ 
    showScanner = true, 
    gridOpacity = 0.1,
    arcOpacity = 0.6,
    glowIntensity = 0.2
}) => {
    // --- Global Parallax Logic ---
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
    const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

    const moveX = useTransform(springX, [-1000, 1000], [25, -25]);
    const moveY = useTransform(springY, [-1000, 1000], [25, -25]);

    React.useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            // Track mouse relative to viewport center
            const x = e.clientX - window.innerWidth / 2;
            const y = e.clientY - window.innerHeight / 2;
            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div 
            className="fixed inset-0 pointer-events-none select-none overflow-hidden z-[-1] bg-background" 
            aria-hidden="true"
        >
            {/* 1. Global Blueprint Dot Grid */}
            <div 
                className="absolute inset-0 transition-opacity duration-1000" 
                style={{ 
                    backgroundImage: `radial-gradient(var(--color-primary) 0.5px, transparent 0.5px)`, 
                    backgroundSize: '24px 24px',
                    opacity: gridOpacity,
                    maskImage: 'radial-gradient(circle at center, black 30%, transparent 95%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 95%)'
                }} 
            />

            {/* 2. Parallax Wrapper for Arcs */}
            <motion.div 
                style={{ x: moveX, y: moveY }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
                {/* Central Soft Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-[0.03]" />

                {/* Refined Aura Light */}
                <div className="absolute w-[95%] max-w-[850px] aspect-square rounded-full bg-[radial-gradient(circle_at_center,_#3b82f6_0%,_transparent_65%)] opacity-[0.03] blur-[100px]" />

                {/* Outer Dashed arc with Scanning Spark */}
                <div className="absolute w-[95%] max-w-[850px] aspect-square rounded-full">
                    <motion.div
                        animate={{ 
                            opacity: [0.4, arcOpacity, 0.4],
                            scale: [1, 1.02, 1],
                            filter: [
                                `drop-shadow(0 0 2px rgba(59, 130, 246, 0.4))`,
                                `drop-shadow(0 0 15px rgba(59, 130, 246, 0.7))`
                            ]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full border-2 border-primary/60 border-dashed animate-[spin_60s_linear_infinite_reverse]" 
                    />
                    
                    {/* THE SCANNING SPARK (Comet Effect) */}
                    {showScanner && (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full z-10"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_10px_#3b82f6,0_0_20px_rgba(59,130,246,0.4)]">
                                <div className="absolute inset-0 rounded-full animate-ping bg-secondary opacity-40" />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Inner Solid arc (Subtle Pulse) */}
                <motion.div
                    animate={{ 
                        opacity: [0.15, 0.4, 0.15],
                        scale: [1, 1.03, 1]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute w-[75%] max-w-[650px] aspect-square rounded-full border border-primary/40 shadow-[0_0_80px_rgba(59,130,246,${glowIntensity})]`}
                />
            </motion.div>
        </div>
    );
};

export default BlueprintBackground;
