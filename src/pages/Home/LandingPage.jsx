import React, { lazy, Suspense } from 'react';
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

const LandingPage = () => {
    const navigate = useNavigate();

    // Enhanced scroll function with better easing and timing
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // Standard Navbar height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const navLinks = [
        { label: 'Home', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { label: 'Roles', onClick: () => scrollToSection('roles') },
        { label: 'Capabilities', onClick: () => scrollToSection('capabilities') },
        { label: 'Planning', onClick: () => scrollToSection('planning') },
        { label: 'Workflow', onClick: () => scrollToSection('workflow') },
        { label: 'Mobile App', onClick: () => scrollToSection('mobile') },
        { label: 'Analytics', onClick: () => scrollToSection('analytics') },
    ];

    return (
        <div className="min-h-screen bg-white overflow-x-hidden selection:bg-primary/20 selection:text-primary-dark">
            {/* Elite Navbar */}
            <LandingNavbar
                navLinks={navLinks}
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
