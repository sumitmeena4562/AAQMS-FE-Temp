import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdOutlineLanguage } from 'react-icons/md';
import { FaGithub } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import Logo from '../Branding/Logo';
import Button from '../UI/Button';

// Stable motion-wrapped Link
const MotionLink = motion.create(Link);

const LandingNavbar = ({
    navLinks = [],
    buttons = [],
    sticky = true,
    activeLabel = 'Home',
    onLinkClick = () => {},
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [hoveredIdx, setHoveredIdx] = useState(null);


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

    const renderButton = (btn, i, isMobile = false) => {
        const variant = btn.variant === 'filled' ? 'primary' : 'outline';
        
        return (
            <Link key={i} to={btn.href || '/login'} className={isMobile ? 'w-full' : ''}>
                <Button
                    variant={variant}
                    size={isMobile ? "lg" : "md"}
                    className={isMobile ? 'w-full shadow-none' : 'ml-3'}
                >
                    {btn.label}
                </Button>
            </Link>
        );
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
                        ? 'h-20 py-3 glass-panel shadow-sm border-b border-border/10' 
                        : 'h-24 py-4 bg-transparent border-b border-transparent'}
                `}
            >
                <nav className="flex items-center justify-between h-full max-w-7xl mx-auto">
                    {/* Left — Logo */}
                    <div className="flex-1 flex justify-start z-[60]">
                        <motion.div 
                            whileHover={{ scale: 1.02 }} 
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                onLinkClick('Home');
                            }}
                            className="cursor-pointer flex items-center"
                        >
                            <Logo size="lg" className="text-text" />
                        </motion.div>
                    </div>

                    {/* Center — Desktop Nav Links with Shared Sliding Pill */}
                    <div className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 flex-[2] relative h-full">
                        {navLinks.map((link, idx) => {
                            const isActive = activeLabel === link.label;
                            const isHovered = hoveredIdx === idx;
                            const shouldHighlight = isHovered || (hoveredIdx === null && isActive);

                            return (
                                <div
                                    key={link.label}
                                    className="relative flex items-center"
                                    onMouseEnter={() => setHoveredIdx(idx)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                >
                                    {shouldHighlight && (
                                        <motion.div
                                            layoutId="pill-bg"
                                            className="absolute inset-x-0 h-9 my-auto bg-primary/5 rounded-full -z-10 border border-primary/5 shadow-sm shadow-primary/5"
                                            transition={{ 
                                                type: "spring", 
                                                stiffness: 300, 
                                                damping: 35,
                                                mass: 1
                                            }}
                                        />
                                    )}

                                    {isActive && (
                                        <motion.div 
                                            layoutId="active-marker"
                                            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.4)] z-20"
                                            transition={{ 
                                                type: "spring", 
                                                stiffness: 300, 
                                                damping: 35,
                                                mass: 1
                                            }}
                                        />
                                    )}

                                    <motion.a
                                        href={link.href || '#'}
                                        onClick={(e) => {
                                            if (link.onClick) {
                                                e.preventDefault();
                                                link.onClick();
                                                onLinkClick(link.label);
                                            }
                                        }}
                                        className={`
                                            relative z-10 flex items-center justify-center px-5 h-9 text-[13px] xl:text-[14px] font-black tracking-tight transition-all duration-300 whitespace-nowrap cursor-pointer
                                            ${isActive ? 'text-primary' : (isHovered ? 'text-primary/80' : 'text-slate-500 hover:text-primary')}
                                        `}
                                    >
                                        <div className="flex items-center gap-1.5 h-full">
                                            {link.label}
                                            {link.hasDropdown && (
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="m6 9 6 6 6-6"/></svg>
                                            )}
                                        </div>
                                    </motion.a>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right — Desktop Buttons & Icons */}
                    <div className="hidden lg:flex items-center justify-end gap-4 xl:gap-6 flex-1">
                        <div className="flex items-center gap-4 text-muted/50">
                            <motion.button 
                                whileHover={{ scale: 1.1, color: 'var(--color-primary)' }} 
                                aria-label="Change Language"
                                className="transition-colors p-1"
                            >
                                <MdOutlineLanguage className="text-xl" />
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.1, color: 'var(--color-text)' }} 
                                aria-label="GitHub Repository"
                                className="transition-colors p-1 hidden xl:block"
                            >
                                <FaGithub className="text-lg" />
                            </motion.button>
                        </div>

                        {buttons.map((btn, i) => renderButton(btn, i))}
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle Menu"
                        className="lg:hidden relative z-[60] p-2.5 glass-panel !rounded-xl text-text shadow-sm"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <div className="w-6 h-5 flex flex-col items-center justify-center gap-1.5">
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

            </motion.header>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-0 z-[55] flex flex-col bg-background/98 backdrop-blur-3xl p-8 pt-28 gap-12 lg:hidden"
                    >
                        <div className="flex flex-col gap-8">
                            <div className="text-[11px] font-black tracking-[0.3em] text-muted/60 uppercase">Navigation</div>
                            <div className="flex flex-col gap-6">
                                {navLinks.map((link) => (
                                    <motion.a
                                        key={link.label}
                                        variants={itemVariants}
                                        href={link.href || '#'}
                                        onClick={(e) => {
                                            if (link.onClick) {
                                                e.preventDefault();
                                                link.onClick();
                                                onLinkClick(link.label);
                                            }
                                            setTimeout(() => setIsMenuOpen(false), 200);
                                        }}
                                        whileHover={{ x: 10 }}
                                        className={`
                                            text-3xl font-black flex items-center gap-4 transition-all group
                                            ${activeLabel === link.label ? 'text-primary' : 'text-text/80 hover:text-primary'}
                                        `}
                                    >
                                        <span className={`w-2 h-2 rounded-full bg-primary transition-all ${activeLabel === link.label ? 'opacity-100 scale-100' : 'opacity-0 scale-50 group-hover:opacity-60 group-hover:scale-100'}`} />
                                        {link.label}
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-border/40 w-full" />

                        <div className="flex flex-col gap-8">
                            <div className="text-[11px] font-black tracking-[0.3em] text-muted/60 uppercase font-sans">Account</div>
                            <div className="flex flex-col gap-5">
                                {buttons.map((btn, i) => renderButton(btn, i, true))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default LandingNavbar;
