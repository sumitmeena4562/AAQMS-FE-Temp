import React from 'react';
import FeatureCard from '../../components/ui/FeatureCard';
import { MdOutlineShield, MdOutlineMap, MdQrCodeScanner } from 'react-icons/md';

const RoleFeatures = () => {
    return (
        <section className="py-16 md:py-24 px-6 md:px-12 bg-white font-body border-t border-[var(--color-border-light)]">
            <div className="max-w-[1400px] mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold mb-4 tracking-tight text-[var(--color-primary-dark)]">
                        Orchestrated Safety Operations
                    </h2>
                    <p className="text-[15px] sm:text-[17px] max-w-2xl mx-auto leading-relaxed font-medium text-[var(--color-text-secondary)]">
                        Seamless coordination between administration, planning, and field execution.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <FeatureCard
                        title="Admin"
                        description="Centralized control to define safety standards, manage user roles, and oversee organizational compliance metrics."
                        icon={MdOutlineShield}
                        colorTheme="primary"
                    />

                    <FeatureCard
                        title="Coordinator"
                        description="Strategic planning tools to map zones, assign inventory audits, and monitor real-time drone feeds."
                        icon={MdOutlineMap}
                        colorTheme="secondary"
                    />

                    <FeatureCard
                        title="Field Officer"
                        description="Mobile-first interface for rapid QR scanning, evidence capture, and instant verification reporting."
                        icon={MdQrCodeScanner}
                        colorTheme="success"
                    />
                </div>
            </div>
        </section>
    );
};

export default RoleFeatures;
