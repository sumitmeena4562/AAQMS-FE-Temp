import React, { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/nav/Footer';

// Lazy load sections
const Hero = lazy(() => import('./Hero'));
const RoleFeatures = lazy(() => import('./RoleFeatures'));
const Capabilities = lazy(() => import('./Capabilities'));
const FieldApp = lazy(() => import('./FieldApp'));
const Workflow = lazy(() => import('./Workflow'));
const Analytics = lazy(() => import('./Analytics'));
const SitePlanning = lazy(() => import('./SitePlanning'));

// Simple Section Loader
const SectionLoader = () => (
    <div style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--color-text-muted)', opacity: 0.5 }}>
        <div className="animate-pulse">Loading section...</div>
    </div>
);

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)', overflowX: 'clip' }}>
            {/* Navbar */}
            <Navbar
                navLinks={[
                    { label: 'Roles', onClick: () => document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' }) },
                    { label: 'Capabilities', onClick: () => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' }) },
                    { label: 'Planning', onClick: () => document.getElementById('planning')?.scrollIntoView({ behavior: 'smooth' }) },
                    { label: 'Workflow', onClick: () => document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' }) },
                    { label: 'Mobile', onClick: () => document.getElementById('mobile')?.scrollIntoView({ behavior: 'smooth' }) },
                    { label: 'Reporting', onClick: () => document.getElementById('analytics')?.scrollIntoView({ behavior: 'smooth' }) },
                ]}
                buttons={[
                    { label: 'Login', variant: 'filled', onClick: () => navigate('/login') },
                    // { label: 'Registration', onClick: () => navigate('/registration') }
                ]}
            />

            <Suspense fallback={<SectionLoader />}>
                {/* Hero Section - Visible on Load */}
                <Hero />

                {/* Role Features Section */}
                <div id="roles">
                    <RoleFeatures />
                </div>

                {/* Core Capabilities Section */}
                <div id="capabilities">
                    <Capabilities />
                </div>

                {/* Site Planning Section */}
                <div id="planning">
                    <SitePlanning />
                </div>

                {/* Workflow Section */}
                <div id="workflow">
                    <Workflow />
                </div>

                {/* Field App Section */}
                <div id="mobile">
                    <FieldApp />
                </div>

                {/* Analytics Section */}
                <div id="analytics">
                    <Analytics />
                </div>
            </Suspense>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
