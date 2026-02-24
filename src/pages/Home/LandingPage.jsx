import React from 'react';
import Navbar from '../../components/nav/Navbar';

const LandingPage = () => {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
            {/* Navbar */}
            <Navbar
                navLinks={[
                    { label: 'Workflow', href: '#workflow' },
                    { label: 'Capabilities', href: '#capabilities' },
                    { label: 'Mobile App', href: '#mobile-app' },
                    { label: 'Contact', href: '#contact' },
                ]}
                buttons={[
                    { label: 'Login', variant: 'filled' },
                ]}
            />

            {/* Hero Section — yahan aage content aayega */}

        </div>
    );
};

export default LandingPage;
