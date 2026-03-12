import React, { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../../components/Navbar/LandingNavbar';
import Footer from '../../components/Navbar/Footer';
import { t } from '../../theme/theme';

// Lazy load sections
const Hero = lazy(() => import('./Hero'));
const RoleFeatures = lazy(() => import('./RoleFeatures'));
const Capabilities = lazy(() => import('./Capabilities'));
const FieldApp = lazy(() => import('./FieldApp'));
const Workflow = lazy(() => import('./Workflow'));
const Analytics = lazy(() => import('./Analytics'));
const SitePlanning = lazy(() => import('./SitePlanning'));
const CTA = lazy(() => import('./CTA'));

// Simple Section Loader
const SectionLoader = () => (
    <div style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--color-text-muted)', opacity: 0.5 }}>
        <div className="animate-pulse">Loading section...</div>
    </div>
);

const LandingPage = () => {
    const navigate = useNavigate();

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // navbar height
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
        <div style={{ minHeight: '100vh', background: t.color.bg, overflowX: 'clip' }}>
            {/* Navbar */}
            <LandingNavbar
                navLinks={navLinks}
                buttons={[
                    { label: 'Login', variant: 'filled', onClick: () => navigate('/login') }
                ]}
            />

            <Suspense fallback={<SectionLoader />}>
                {/* Hero Section */}
                <div id="home">
                    <Hero />
                </div>

                {/* Role Features Section */}
                <div id="roles" style={{ scrollMarginTop: t.layout.navbarHeight }}>
                    <RoleFeatures />
                </div>

                {/* Core Capabilities Section */}
                <div id="capabilities" style={{ scrollMarginTop: t.layout.navbarHeight }}>
                    <Capabilities />
                </div>

                {/* Site Planning Section */}
                <div id="planning" style={{ scrollMarginTop: t.layout.navbarHeight }}>
                    <SitePlanning />
                </div>

                {/* Workflow Section */}
                <div id="workflow" style={{ scrollMarginTop: t.layout.navbarHeight }}>
                    <Workflow />
                </div>

                {/* Field App Section */}
                <div id="mobile" style={{ scrollMarginTop: t.layout.navbarHeight }}>
                    <FieldApp />
                </div>

                {/* Analytics Section */}
                <div id="analytics" style={{ scrollMarginTop: t.layout.navbarHeight, marginBottom: '60px' }}>
                    <Analytics />
                </div>

                {/* CTA Section */}
                <CTA />
            </Suspense>


            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
