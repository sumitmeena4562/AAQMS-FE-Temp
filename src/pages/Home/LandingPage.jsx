import React from 'react';
import Navbar from '../../components/nav/Navbar';
import Hero from './Hero';
import RoleFeatures from './RoleFeatures';
import Capabilities from './Capabilities';
import FieldApp from './FieldApp';
import Workflow from './Workflow';
import Analytics from './Analytics';
import SitePlanning from './SitePlanning';
import Footer from '../../components/nav/Footer';

const LandingPage = () => {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)', overflowX: 'hidden' }}>
            {/* Navbar */}
            <Navbar
                navLinks={[
                    { label: 'Roles', href: '#roles' },
                    { label: 'Capabilities', href: '#capabilities' },
                    { label: 'Planning', href: '#planning' },
                    { label: 'Workflow', href: '#workflow' },
                    { label: 'Mobile', href: '#mobile' },
                    { label: 'Reporting', href: '#analytics' },
                ]}
                buttons={[
                    { label: 'Login', variant: 'filled' },
                ]}
            />

            {/* Hero Section */}
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

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
