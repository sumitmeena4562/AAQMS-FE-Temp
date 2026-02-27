import React from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)', overflowX: 'clip' }}>
            {/* Navbar */}
            <Navbar
                navLinks={[
                    { label: 'Roles', onClick: () => document.getElementById('roles').scrollIntoView({ behavior: 'smooth' }) },
                    { label: 'Capabilities', onClick: () => document.getElementById('capabilities').scrollIntoView({ behavior: 'smooth' }) },
                    { label: 'Planning', onClick: () => document.getElementById('planning').scrollIntoView({ behavior: 'smooth' }) },
                    { label: 'Workflow', onClick: () => document.getElementById('workflow').scrollIntoView({ behavior: 'smooth' }) },
                    { label: 'Mobile', onClick: () => document.getElementById('mobile').scrollIntoView({ behavior: 'smooth' }) },
                    { label: 'Reporting', onClick: () => document.getElementById('analytics').scrollIntoView({ behavior: 'smooth' }) },
                ]}
                buttons={[
                    { label: 'Login', variant: 'filled', onClick: () => navigate('/login') },
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
