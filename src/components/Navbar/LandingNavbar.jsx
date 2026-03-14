import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { MdSearch, MdOutlineLanguage } from 'react-icons/md';
import { FaXTwitter, FaGithub } from 'react-icons/fa6';
import Logo from '../Branding/Logo';

const LandingNavbar = ({
    navLinks = [],
    buttons = [],
    sticky = true,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [activeIdx, setActiveIdx] = useState(0);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Track scroll for background change
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    const menuVariants = {
        closed: { 
            opacity: 0,
            y: -20,
            transition: { type: 'spring', stiffness: 400, damping: 40 }
        },
        open: { 
            opacity: 1,
            y: 0,
            transition: { 
                type: 'spring', 
                stiffness: 400, 
                damping: 40,
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        closed: { opacity: 0, x: -20 },
        open: { opacity: 1, x: 0 }
    };

    return (
        <>
            <motion.header 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`
                    ${sticky ? 'fixed' : 'relative'} top-0 left-0 right-0 z-50 px-4 sm:px-8 transition-all duration-500
                    ${isScrolled 
                        ? 'h-16 py-2 bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.02)]' 
                        : 'h-24 py-4 bg-transparent border-b border-transparent'}
                `}
            >
                <nav className="flex items-center justify-between h-full max-w-7xl mx-auto">
                    {/* Left — Logo */}
                    <div className="flex-1 flex justify-start z-[60]">
                        <motion.div 
                            whileHover={{ scale: 1.02 }} 
                            whileTap={{ scale: 0.98 }}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="cursor-pointer flex items-center"
                        >
                            <Logo size="lg" className="text-slate-900" />
                        </motion.div>
                    </div>

                    {/* Center — Desktop Nav Links with Sliding Pill */}
                    <div className="hidden lg:flex items-center justify-center gap-2 xl:gap-4 flex-[2] relative">
                        {/* Sliding Pill Background */}
                        <AnimatePresence>
                            {hoveredIdx !== null && (
                                <motion.div
                                    layoutId="nav-pill"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="absolute bg-slate-100/80 rounded-full z-0 h-10"
                                    style={{
                                        width: 'var(--pill-width)',
                                        left: 'var(--pill-left)',
                                    }}
                                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                />
                            )}
                        </AnimatePresence>

                        {navLinks.map((link, idx) => (
                            <motion.a
                                key={link.label}
                                href={link.href || '#'}
                                onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
                                    e.currentTarget.parentElement.style.setProperty('--pill-width', `${rect.width + 24}px`);
                                    e.currentTarget.parentElement.style.setProperty('--pill-left', `${rect.left - parentRect.left - 12}px`);
                                    setHoveredIdx(idx);
                                }}
                                onMouseLeave={() => setHoveredIdx(null)}
                                onClick={(e) => {
                                    setActiveIdx(idx);
                                    if (link.onClick) {
                                        e.preventDefault();
                                        link.onClick();
                                    }
                                }}
                                className={`
                                    relative z-10 flex flex-col items-center gap-1.5 px-3 py-2 text-[12px] xl:text-[13px] font-bold tracking-tight transition-colors duration-300 whitespace-nowrap cursor-pointer
                                    ${activeIdx === idx ? 'text-primary' : 'text-slate-500 hover:text-slate-900'}
                                `}
                            >
                                <div className="flex items-center gap-1">
                                    {link.label}
                                    {(link.label === 'Trading' || link.label === 'Platforms' || link.label === 'Tools & Education' || link.label === 'About Us') && (
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="m6 9 6 6 6-6"/></svg>
                                    )}
                                </div>
                                
                                {/* Active Link Dot */}
                                {activeIdx === idx && (
                                    <motion.div 
                                        layoutId="active-dot"
                                        className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary"
                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    />
                                )}
                            </motion.a>
                        ))}
                    </div>

                    {/* Right — Desktop Buttons & Icons */}
                    <div className="hidden lg:flex items-center justify-end gap-3 xl:gap-5 flex-1">
                        {/* Global/Social Switcher */}
                        <div className="flex items-center gap-3 text-slate-400">
                            <motion.button whileHover={{ scale: 1.1, color: 'var(--color-primary)' }} className="transition-colors">
                                <MdOutlineLanguage className="text-xl" />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1, color: '#000' }} className="transition-colors hidden xl:block">
                                <FaGithub className="text-lg" />
                            </motion.button>
                        </div>

                        {buttons.map((btn, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={btn.onClick}
                                className={`
                                    px-4 xl:px-6 py-2 text-[11px] xl:text-[12px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ml-2
                                    ${btn.variant === 'filled' 
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark' 
                                        : 'text-slate-600 hover:text-primary'}
                                `}
                            >
                                {btn.label}
                            </motion.button>
                        ))}
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="lg:hidden relative z-[60] p-2 bg-white/50 backdrop-blur-md border border-slate-200 rounded-xl text-slate-900 shadow-sm"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <div className="w-6 h-6 flex flex-col items-center justify-center gap-1.5">
                            <motion.span 
                                animate={isMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                                className="w-full h-0.5 bg-current rounded-full" 
                            />
                            <motion.span 
                                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                className="w-full h-0.5 bg-current rounded-full" 
                            />
                            <motion.span 
                                animate={isMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                                className="w-full h-0.5 bg-current rounded-full" 
                            />
                        </div>
                    </motion.button>
                </nav>

                {/* Scroll Progress Bar */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary origin-left z-[100]"
                    style={{ scaleX }}
                />
            </motion.header>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-0 z-[55] flex flex-col bg-white/95 backdrop-blur-2xl p-8 pt-28 gap-12 lg:hidden"
                    >
                        <div className="flex flex-col gap-8">
                            <div className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Navigation</div>
                            <div className="flex flex-col gap-6">
                                {navLinks.map((link) => (
                                    <motion.a
                                        key={link.label}
                                        variants={itemVariants}
                                        href={link.href || '#'}
                                        onClick={(e) => {
                                            setIsMenuOpen(false);
                                            if (link.onClick) {
                                                e.preventDefault();
                                                link.onClick();
                                            }
                                        }}
                                        whileHover={{ x: 10 }}
                                        className="text-2xl font-black text-slate-900 flex items-center gap-4 transition-colors hover:text-primary group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.label}
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 w-full" />

                        <div className="flex flex-col gap-8">
                            <div className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase font-sans">Account</div>
                            <div className="flex flex-col gap-5">
                                {buttons.map((btn, i) => (
                                    <motion.button
                                        key={i}
                                        variants={itemVariants}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            if (btn.onClick) btn.onClick();
                                        }}
                                        className={`
                                            w-full py-4 text-[13px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all font-sans
                                            ${btn.variant === 'filled'
                                                ? 'bg-primary text-white shadow-xl shadow-primary/20'
                                                : 'text-slate-600 hover:text-primary text-left px-2'}
                                        `}
                                    >
                                        {btn.label}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default LandingNavbar;
