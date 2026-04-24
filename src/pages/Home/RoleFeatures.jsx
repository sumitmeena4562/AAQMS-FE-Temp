import React from 'react';
import SectionHeader from '../../components/UI/SectionHeader';
import FeatureCard from '../../components/UI/FeatureCard';
import { ROLE_FEATURES } from '../../data/landingData';
import SectionWrapper from '../../components/Layout/SectionWrapper';

const RoleFeatures = () => {
    const { badge, title, description, features } = ROLE_FEATURES;

    return (
        <SectionWrapper 
            className="border-b border-border/50"
        >
            <div className="container mx-auto px-6 relative z-10">
                <SectionHeader
                    badge={badge}
                    title={title}
                    description={description}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 mt-12 sm:mt-16">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} index={index} />
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
};

export default RoleFeatures;
