import React from "react";
import { FiBox, FiClock, FiAlertTriangle, FiUserPlus, FiPackage, FiCheckCircle, FiSettings } from "react-icons/fi";

// ── Icons for StatsGrid ──
const orgIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" /></svg>
);
const coordIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const officerIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
const zoneIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
);
const trendUpIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
);

// ── Dummy Data ──

export const DUMMY_METRIC_CARDS = [
    {
        title: "Inventory Items",
        value: "15,201",
        icon: <FiBox size={16} />,
        statusLabel: "42 missing assets detected",
        statusVariant: "warning",
    },
    {
        title: "Pending Approvals",
        value: "28",
        icon: <FiClock size={16} />,
        statusLabel: "Requires admin action",
        statusVariant: "info",
    },
    {
        title: "Critical AI Flags",
        value: "7",
        icon: <FiAlertTriangle size={16} />,
        statusLabel: "Immediate review needed",
        statusVariant: "danger",
    },
];

export const DUMMY_STATS_GRID = [
    {
        title: "Organisations",
        value: "124",
        change: <>{trendUpIcon()} +12%</>,
        changeType: "positive",
        description: "vs last month",
        icon: orgIcon(),
        iconBgClass: "bg-blue-50",
        iconColorClass: "text-blue-600",
    },
    {
        title: "Coordinators",
        value: "482",
        change: <>{trendUpIcon()} +5%</>,
        changeType: "positive",
        description: "new this week",
        icon: coordIcon(),
        iconBgClass: "bg-purple-50",
        iconColorClass: "text-purple-600",
    },
    {
        title: "Field Officers",
        value: "1,093",
        change: "98% Active",
        changeType: "neutral",
        description: "currently online",
        icon: officerIcon(),
        iconBgClass: "bg-emerald-50",
        iconColorClass: "text-emerald-600",
    },
    {
        title: "Safety Zones",
        value: "3,540",
        change: "All Operational",
        changeType: "warning",
        description: "updated 2m ago",
        icon: zoneIcon(),
        iconBgClass: "bg-orange-50",
        iconColorClass: "text-orange-600",
    },
];

export const DUMMY_RECENT_ACTIVITY = [
    {
        id: '1',
        type: 'Inventory Mismatch',
        icon: FiAlertTriangle,
        iconBgClass: 'bg-red-50',
        iconTextClass: 'text-red-600',
        user: 'System AI',
        entity: 'Zone B-12',
        details: 'Fire Extinguisher missing in Zone 15-12',
        time: '2 mins ago',
    },
    {
        id: '2',
        type: 'User Onboarding',
        icon: FiUserPlus,
        iconBgClass: 'bg-blue-50',
        iconTextClass: 'text-blue-600',
        user: 'Sarah Jenkins',
        entity: 'Acme Corp',
        details: 'Added 5 new field officers',
        time: '15 mins ago',
    },
    {
        id: '3',
        type: 'Inventory Update',
        icon: FiPackage,
        iconBgClass: 'bg-orange-50',
        iconTextClass: 'text-orange-600',
        user: 'Mike Ross',
        entity: 'Safety Gear Depot',
        details: 'Stock level adjustment (-50 units)',
        time: '1 hour ago',
    },
    {
        id: '4',
        type: 'Report Approval',
        icon: FiCheckCircle,
        iconBgClass: 'bg-purple-50',
        iconTextClass: 'text-purple-600',
        user: 'David Kim',
        entity: 'Monthly Compliance',
        details: 'Report #8821 approved',
        time: '2 hours ago',
    },
    {
        id: '5',
        type: 'System Config',
        icon: FiSettings,
        iconBgClass: 'bg-base',
        iconTextClass: 'text-gray',
        user: 'Admin User',
        entity: 'Global Settings',
        details: 'Updated API rate limits',
        time: '4 hours ago',
    },
];
