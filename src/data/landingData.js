import { 
    MdOutlineShield, 
    MdOutlineMap, 
    MdQrCodeScanner,
    MdOutlineBusiness,
    MdOutlineAirplanemodeActive,
    MdOutlinePushPin,
    MdOutlineQrCodeScanner as MdQr,
    MdOutlineAssignmentLate,
    MdOutlineVerified,
    MdOutlineAssignmentInd,
    MdOutlinePhotoCamera,
    MdOutlineWifiOff,
    MdOutlineTrendingUp,
    MdOutlineAutoGraph,
    MdOutlineFileUpload,
    MdOutlineQrCode2,
    MdOutlineMobileFriendly,
    MdOutlinePsychology,
    MdOutlineFactCheck,
    MdOutlineLayers,
    MdOutlineLibraryAddCheck
} from 'react-icons/md';
import { MapPin, ClipboardCheck, BrainCircuit, ShieldAlert } from 'lucide-react';
import React from 'react';

export const HERO_DATA = {
    badge: "Asset Intelligence System",
    title: {
        main: "Intelligent Asset Audits.",
        highlight: "Simplified."
    },
    description: "Deploy professional-grade safety audits across multiple sites with real-time AI tracking and digital twin integration.",
    ctaText: "Start Auditing",
    stats: {
        value: "10",
        label: "years of exceptional reliability"
    },
    capabilities: [
        { label: "Site Planning", icon: MapPin },
        { label: "Asset Audits", icon: ClipboardCheck },
        { label: "AI Comparison", icon: BrainCircuit },
        { label: "Risk Reports", icon: ShieldAlert }
    ]
};

export const ROLE_FEATURES = {
    badge: "Operational Roles",
    title: "Tailored Interfaces for Every Stakeholder",
    description: "Smart coordination between the boardroom, the planning room, and the field.",
    features: [
        {
            title: "Administrator",
            description: "Govern enterprise-wide safety protocols, manage user permissions, and access high-level compliance analytics.",
            icon: MdOutlineShield
        },
        {
            title: "Coordinator",
            description: "Orchestrate audit tasks, define precise geofences, and monitor site-wide progress from a central command hub.",
            icon: MdOutlineMap
        },
        {
            title: "Field Officer",
            description: "Execute on-site audits with precision QR scanning, AI-assisted evidence capture, and instant cloud sync.",
            icon: MdQrCodeScanner
        }
    ]
};

export const CAPABILITIES_DATA = {
    badge: "Platform Capabilities",
    title: "The Backend of Modern Compliance",
    description: "Enterprise-grade tools built for rigorous inventory and safety standards, delivering precision at every touchpoint.",
    list: [
        {
            title: "Multi-Site Governance",
            description: "Centralize safety operations across global facilities with a unified administrative dashboard.",
            icon: MdOutlineBusiness
        },
        {
            title: "Digital Twin Mapping",
            description: "Convert blueprints and spatial captures into interactive twins for immersive site monitoring.",
            icon: MdOutlineAirplanemodeActive
        },
        {
            title: "Precision Geofencing",
            description: "Deploy high-precision audit zones to automate compliance checks for regional assets.",
            icon: MdOutlinePushPin
        },
        {
            title: "Secure Asset Tracking",
            description: "Verify the physical status of assets instantly with secure, end-to-end QR encryption.",
            icon: MdQr
        },
        {
            title: "AI Risk Intelligence",
            description: "Automated detection engine that flags audit anomalies and safety breaches in real-time.",
            icon: MdOutlineAssignmentLate
        },
        {
            title: "Enterprise Reporting",
            description: "Generate immutable, data-rich audit trails for seamless regulatory and board submission.",
            icon: MdOutlineVerified
        }
    ]
};

export const FIELD_APP_DATA = {
    badge: "Field Operations",
    title: "Simple Mobile Audits for Field Teams",
    description: "Our easy-to-use mobile tool helps your field team sync audit data instantly from any location.",
    features: [
        { icon: MdOutlineAssignmentInd, title: "Officer Login", description: "Secure login for every staff member for clear audit trails." },
        { icon: MdQr, title: "Quick QR Scan", description: "Easily scan any asset to verify its location and details instantly." },
        { icon: MdOutlinePhotoCamera, title: "Photo Evidence", description: "Attach mandatory photos to your audits for 100% proof." },
        { icon: MdOutlineWifiOff, title: "Works Offline", description: "Audit items even without internet; data syncs when you're back online." }
    ]
};

export const ANALYTICS_DATA = {
    badge: "Reporting",
    title: "Real-Time Insights & Simple Control",
    description: "Turn your site data into clear reports and audit history with one click.",
    features: [
        { title: "Spot Risks", desc: "Instantly find and fix missing items or safety issues." },
        { title: "Secure History", desc: "Get a clear, unchangeable record of every audit performed." },
        { title: "Audit Trends", desc: "Easily track how your site's safety improves over time." }
    ],
    stats: [
        { label: "Audit Score", value: "98.4%", trend: "+1.2%", icon: MdOutlineTrendingUp, color: "var(--color-primary)" },
        { label: "Open Risks", value: "02", icon: MdOutlineAssignmentLate, color: "var(--color-danger)" }
    ]
};

export const WORKFLOW_DATA = {
    badge: "Operations",
    title: "The Continuity Pipeline",
    description: "Standardized protocol ensures data integrity across your entire site operations.",
    steps: [
        { number: 1, title: "Site Mapping", description: "Upload your site maps and mark all safety zones.", icon: MdOutlineFileUpload },
        { number: 2, title: "Smart Tagging", description: "Put secure QR codes on your items for easy tracking.", icon: MdOutlineQrCode2 },
        { number: 3, title: "Digital Audit", description: "Scan items on-site and sync data to the cloud instantly.", icon: MdOutlineMobileFriendly },
        { number: 4, title: "Instant Alerts", description: "Get notified immediately about missing items or safety issues.", icon: MdOutlinePsychology },
        { number: 5, title: "Smart Reports", description: "Generate clear audit reports and history in just one click.", icon: MdOutlineFactCheck }
    ]
};

export const SITE_PLANNING_DATA = {
    badge: "Digital Twin",
    title: "Mapping & Precision at Scale",
    description: "Digitize your entire site layout with interactive geofenced zones and geographical asset context.",
    features: [
        { 
            icon: MdOutlineLayers, 
            title: "Spatial Layering", 
            desc: "Toggle between structure plans, hazard heatmaps, and live asset coordinate layers." 
        },
        { 
            icon: MdOutlineLibraryAddCheck, 
            title: "Smart Geofencing", 
            desc: "Set safety protocols and audit rules for specific zones with instant breach alerts." 
        }
    ]
};

export const CTA_DATA = {
    badge: "Enterprise Security",
    title: {
        main: "Ready to unify your",
        highlight: "safety operations?"
    },
    description: "Join the elite organizations using AAQMS to automate compliance, reduce risk, and maintain 100% audit integrity.",
    ctaButton: "Get Started for Free"
};
