import React from 'react';
import SectionHeader from '../../components/UI/SectionHeader';
import FeatureCard from '../../components/UI/FeatureCard';
import { CAPABILITIES_DATA } from '../../data/landingData';
import SectionWrapper from '../../components/Layout/SectionWrapper';

const Capabilities = () => {
    const { badge, title, description, list } = CAPABILITIES_DATA;

    return (
        <SectionWrapper>
            <div className="container mx-auto px-6 relative z-10">
                <SectionHeader
                    badge={badge}
                    title={title}
                    description={description}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto mt-12 sm:mt-16">
                    {list.map((item, index) => (
                        <FeatureCard 
                            key={index} 
                            {...item} 
                            index={index} 
                        />
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
};

export default Capabilities;
