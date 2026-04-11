import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../../components/Navbar/LandingNavbar';
import Footer from '../../components/Navbar/Footer';

// Lazy load sections for optimized performance
const Hero = lazy(() => import('./Hero'));
const RoleFeatures = lazy(() => import('./RoleFeatures'));
const Capabilities = lazy(() => import('./Capabilities'));
const FieldApp = lazy(() => import('./FieldApp'));
const Workflow = lazy(() => import('./Workflow'));
const Analytics = lazy(() => import('./Analytics'));
const SitePlanning = lazy(() => import('./SitePlanning'));
const CTA = lazy(() => import('./CTA'));

// Skeleton Loader for smooth transitions
const SectionLoader = () => (
    <div className="py-20 px-6 text-center text-slate-400 opacity-50">
        <div className="animate-pulse font-black uppercase tracking-[0.2em] text-xs">Loading segment...</div>
    </div>
);

import { useScrollSpy } from '../../hooks/useScrollSpy';

const LandingPage = () => {
    const navigate = useNavigate();
    const isScrollingRef = useRef(false);

    // Optimized Scroll Spy for Navigation Highlighting
    const activeSectionId = useScrollSpy([
        'home', 'roles', 'capabilities', 'planning', 'workflow', 'mobile', 'analytics'
    ], { rootMargin: '-10% 0px -80% 0px', threshold: 0 });

    const [activeLabel, setActiveLabel] = useState('Home');

    // Sync active label with active section ID
    useEffect(() => {
        if (isScrollingRef.current) return;
        
        const idToLabel = {
            'home': 'Home',
            'roles': 'Roles',
            'capabilities': 'Capabilities',
            'planning': 'Planning',
            'workflow': 'Workflow',
            'mobile': 'Mobile App',
            'analytics': 'Analytics'
        };

        if (activeSectionId && idToLabel[activeSectionId]) {
            setActiveLabel(idToLabel[activeSectionId]);
        }
    }, [activeSectionId]);

    // Enhanced scroll function with better easing and timing
    const scrollToSection = (id, label) => {
        const element = document.getElementById(id);
        if (element) {
            isScrollingRef.current = true;
            setActiveLabel(label);
            
            const offset = 80; // Standard Navbar height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Re-enable observer after scroll animation finishes
            setTimeout(() => {
                isScrollingRef.current = false;
            }, 1000);
        }
    };

    const navLinks = [
        { label: 'Home', onClick: () => {
            isScrollingRef.current = true;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveLabel('Home');
            setTimeout(() => isScrollingRef.current = false, 1000);
        }},
        { label: 'Roles', onClick: () => scrollToSection('roles', 'Roles') },
        { label: 'Capabilities', onClick: () => scrollToSection('capabilities', 'Capabilities') },
        { label: 'Planning', onClick: () => scrollToSection('planning', 'Planning') },
        { label: 'Workflow', onClick: () => scrollToSection('workflow', 'Workflow') },
        { label: 'Mobile App', onClick: () => scrollToSection('mobile', 'Mobile App') },
        { label: 'Analytics', onClick: () => scrollToSection('analytics', 'Analytics') },
    ];

    return (
        <div className="min-h-screen bg-white overflow-x-hidden selection:bg-primary/20 selection:text-primary-dark">
            {/* Elite Navbar */}
            <LandingNavbar
                navLinks={navLinks}
                activeLabel={activeLabel}
                onLinkClick={(label) => setActiveLabel(label)}
                buttons={[
                    { label: 'Login', variant: 'filled', href: '/login' }
                ]}
            />

            {/* Main Content Sections with Lazy Loading */}
            <Suspense fallback={<SectionLoader />}>
                <section id="home">
                    <Hero />
                </section>

                <div id="roles" className="scroll-mt-20">
                    <RoleFeatures />
                </div>

                <div id="capabilities" className="scroll-mt-20">
                    <Capabilities />
                </div>

                <div id="planning" className="scroll-mt-20">
                    <SitePlanning />
                </div>

                <div id="workflow" className="scroll-mt-20">
                    <Workflow />
                </div>

                <div id="mobile" className="scroll-mt-20">
                    <FieldApp />
                </div>

                <div id="analytics" className="scroll-mt-20">
                    <Analytics />
                </div>

                <section id="cta">
                    <CTA />
                </section>
            </Suspense>

            {/* Premium Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
