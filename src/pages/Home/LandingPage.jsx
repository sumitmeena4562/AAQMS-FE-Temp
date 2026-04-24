import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BRAND_FULL_NAME, BRAND_TAGLINE } from '../../components/Branding/BrandConfig';
import LandingNavbar from '../../components/Navbar/LandingNavbar';
import Footer from '../../components/Navbar/Footer';
import BlueprintBackground from '../../components/Effects/BlueprintBackground';

// Lazy load sections for optimized performance
import Hero from './Hero';
const RoleFeatures = lazy(() => import('./RoleFeatures'));
const Capabilities = lazy(() => import('./Capabilities'));
const FieldApp = lazy(() => import('./FieldApp'));
const Workflow = lazy(() => import('./Workflow'));
const Analytics = lazy(() => import('./Analytics'));
const SitePlanning = lazy(() => import('./SitePlanning'));
const CTA = lazy(() => import('./CTA'));

// Skeleton Loader for smooth transitions
const SectionLoader = ({ height = "400px" }) => (
    <div className="w-full px-6 flex flex-col items-center justify-center bg-slate-50/5" style={{ minHeight: height }}>
        <div className="w-24 h-1 bg-slate-200 rounded-full overflow-hidden mb-4">
            <div className="w-full h-full bg-primary/20 animate-loading-bar" />
        </div>
        <div className="animate-pulse font-black uppercase tracking-[0.2em] text-[10px] text-slate-400">Initializing Experience...</div>
    </div>
);

import { useScrollSpy } from '../../hooks/useScrollSpy';

const LandingPage = () => {
    const isScrollingRef = useRef(false);

    // Optimized Scroll Spy for Navigation Highlighting
    const activeSectionId = useScrollSpy([
        'home', 'roles', 'capabilities', 'planning', 'workflow', 'mobile', 'analytics'
    ], { rootMargin: '-100px 0px -70% 0px', threshold: 0 });

    // Mapping for section IDs to human-readable labels
    const idToLabel = {
        'home': 'Home',
        'roles': 'Roles',
        'capabilities': 'Capabilities',
        'planning': 'Planning',
        'workflow': 'Workflow',
        'mobile': 'Mobile App',
        'analytics': 'Analytics'
    };

    const [manualLabel, setManualLabel] = useState(null);

    // Sync current display label: Manual takes priority during scroll, then spy follows.
    const activeLabel = manualLabel || idToLabel[activeSectionId] || 'Home';

    // Clear manual label after a delay when scrolling finishes
    useEffect(() => {
        if (manualLabel) {
            const timer = setTimeout(() => setManualLabel(null), 1200);
            return () => clearTimeout(timer);
        }
    }, [manualLabel]);


    // Enhanced scroll function with better easing and timing
    const scrollToSection = (id, label) => {
        const element = document.getElementById(id);
        if (element) {
            isScrollingRef.current = true;
            setManualLabel(label);
            
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
            setManualLabel('Home');
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
        <div className="min-h-screen bg-transparent overflow-x-hidden selection:bg-primary/20 selection:text-primary-dark">
            <Helmet>
                <title>{`${BRAND_FULL_NAME} | ${BRAND_TAGLINE}`}</title>
                <meta name="description" content="Advanced Asset Quality Management System (AAQMS) provides elite safety audits, digital twin mapping, and real-time AI risk intelligence for enterprise asset management." />
                <meta name="keywords" content="AAQMS, Asset Management, Safety Audit, Digital Twin, AI Risk Intelligence, Compliance, Enterprise Safety" />
                <meta property="og:title" content={`${BRAND_FULL_NAME} - Safety Suite`} />
                <meta property="og:description" content="Deploy professional-grad safety audits across multiple sites with real-time AI tracking." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
            </Helmet>

            {/* Elite Navbar */}
            <LandingNavbar
                navLinks={navLinks}
                activeLabel={activeLabel}
                onLinkClick={(label) => setManualLabel(label)}
                buttons={[
                    { label: 'Login', variant: 'filled', href: '/login' }
                ]}
            />

            {/* Global Fixed Blueprint Background Layer */}
            <BlueprintBackground />

            {/* Main Content Sections */}
            <section id="home">
                <Hero />
            </section>

            <Suspense fallback={<SectionLoader height="600px" />}>
                <div id="roles" className="scroll-mt-20">
                    <RoleFeatures />
                </div>
            </Suspense>

            <Suspense fallback={<SectionLoader height="700px" />}>
                <div id="capabilities" className="scroll-mt-20">
                    <Capabilities />
                </div>
            </Suspense>

            <Suspense fallback={<SectionLoader height="800px" />}>
                <div id="planning" className="scroll-mt-20">
                    <SitePlanning />
                </div>
            </Suspense>

            <Suspense fallback={<SectionLoader height="600px" />}>
                <div id="workflow" className="scroll-mt-20">
                    <Workflow />
                </div>
            </Suspense>

            <Suspense fallback={<SectionLoader height="700px" />}>
                <div id="mobile" className="scroll-mt-20">
                    <FieldApp />
                </div>
            </Suspense>

            <Suspense fallback={<SectionLoader height="800px" />}>
                <div id="analytics" className="scroll-mt-20">
                    <Analytics />
                </div>
            </Suspense>

            <Suspense fallback={<SectionLoader height="400px" />}>
                <div id="contact" className="scroll-mt-20">
                    <CTA />
                </div>
            </Suspense>

            {/* Premium Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
