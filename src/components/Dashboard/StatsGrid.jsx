import React from "react";
import StatsCard, { StatsRow } from "./StatsCard";

// ── Icons ──
const OrgIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" /></svg>
);
const CoordIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const OfficerIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
const ZoneIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
);
const TrendUpIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
);

/**
 * StatGrid — Dashboard overview grid using unified StatsCard.
 * Uses the big card design with divider + change indicator.
 */
export const StatGrid = () => {
    const cards = [
        {
            title: "Organisations",
            value: "124",
            change: <><TrendUpIcon /> +12%</>,
            changeType: "positive",
            description: "vs last month",
            icon: <OrgIcon />,
            iconBgClass: "bg-blue-50",
            iconColorClass: "text-blue-600",
        },
        {
            title: "Coordinators",
            value: "482",
            change: <><TrendUpIcon /> +5%</>,
            changeType: "positive",
            description: "new this week",
            icon: <CoordIcon />,
            iconBgClass: "bg-purple-50",
            iconColorClass: "text-purple-600",
        },
        {
            title: "Field Officers",
            value: "1,093",
            change: "98% Active",
            changeType: "neutral",
            description: "currently online",
            icon: <OfficerIcon />,
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
        },
        {
            title: "Safety Zones",
            value: "3,540",
            change: "All Operational",
            changeType: "warning",
            description: "updated 2m ago",
            icon: <ZoneIcon />,
            iconBgClass: "bg-orange-50",
            iconColorClass: "text-orange-600",
        },
    ];

    return (
        <StatsRow items={cards} columns={4} />
    );
};

export default StatGrid;
