import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiBriefcase, FiUsers, FiShield, FiBox, FiActivity } from "react-icons/fi";
import PageHeader from "../../components/UI/PageHeader";
import StatGrid from "../../components/Dashboard/StatsGrid";
import { MatricCardRow } from "../../components/Dashboard/MatricCard";
import RecentActivityTable from "../../components/Dashboard/RecentactivityTable";
import { MatricCardSkeleton } from "../../components/Dashboard/StatsCardSkeleton";
import { useDashboardSummary } from "../../hooks/api/useDashboardQueries";
import { mapToActivityFeed } from "../../utils/dashboardCalculations";

// Helper outside component to format elapsed time elegantly
const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Fetching...';
    const diffInSeconds = Math.floor((Date.now() - timestamp) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { 
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const Dashboard = () => {
    // ── SINGLE unified call: 1 request replaces 3 ──
    const { data: summary, isLoading, isError, dataUpdatedAt } = useDashboardSummary();

    // ── Map unified summary → UI shapes ──
    // stats: flat keys from /dashboard/summary/ — build StatsGrid format directly
    const stats = summary?.stats ? [
        {
            title: "Organizations",
            value: (summary.stats.total_organisations || 0).toLocaleString(),
            trend: 0, changeType: "neutral",
            description: "Active enterprise hubs",
            secondaryLabel: `${summary.stats.total_sites || 0} sites total`,
            icon: React.createElement(FiBriefcase, { size: 18 }),
            iconBgClass: "bg-blue-50", iconColorClass: "text-blue-600",
        },
        {
            title: "Coordinators",
            value: (summary.stats.total_coordinators || 0).toLocaleString(),
            trend: 0, changeType: "neutral",
            description: "Verified supervisors",
            secondaryLabel: "System administrative layer",
            icon: React.createElement(FiUsers, { size: 18 }),
            iconBgClass: "bg-purple-50", iconColorClass: "text-purple-600",
        },
        {
            title: "Total Users",
            value: (summary.stats.total_users || 0).toLocaleString(),
            trend: 0, changeType: "neutral",
            description: "Registered identities",
            secondaryLabel: `${summary.stats.active_users || 0} active`,
            icon: React.createElement(FiShield, { size: 18 }),
            iconBgClass: "bg-emerald-50", iconColorClass: "text-emerald-600",
        },
        {
            title: "Total Assets",
            value: (summary.stats.total_assets || 0).toLocaleString(),
            trend: 0, changeType: "neutral",
            description: "Equipment tracked",
            secondaryLabel: `${summary.stats.risk_alerts || 0} risk alerts`,
            icon: React.createElement(FiBox, { size: 18 }),
            iconBgClass: "bg-orange-50", iconColorClass: "text-orange-600",
        },
    ] : null;

    // metricCards: use inline metrics array directly from API (already shaped correctly)
    const metricCards = summary?.metrics
        ? summary.metrics.map(m => ({
            title: m.label,
            value: m.unit ? `${m.value}${m.unit}` : String(m.value ?? 0),
            icon: React.createElement(FiActivity, { size: 16 }),
            statusLabel: m.change,
            statusVariant: m.trend === 'up' ? 'success' : m.trend === 'down' ? 'danger' : 'info',
            progress: 70,
            secondaryLabel: m.trend === 'up' ? 'Increasing' : 'Decreasing',
        }))
        : null;

    // activity: BE sends `action` field, mapToActivityFeed expects `type` — remap
    const rawActivity = (summary?.recent_activity || []).map(item => ({
        ...item,
        type: item.action || item.type || 'Event',
        user: item.user_name || item.user?.name || item.user || 'System',
        entity: item.entity_type || item.entity || '',
        time: item.created_at || item.time,
    }));
    const activity = mapToActivityFeed(rawActivity);

    const isDashboardLoading = isLoading;
    const isDashboardError   = isError;
    const latestTimestamp    = dataUpdatedAt || 0;


    // Local state to ticking exactly how long since the last background update
    const [syncText, setSyncText] = useState('Fetching...');

    useEffect(() => {
        if (latestTimestamp === 0) return;
        setSyncText(formatLastSync(latestTimestamp));

        // Gently tick the timer label every 10 seconds (so it fades from "Just now" to "1 min ago")
        const interval = setInterval(() => {
            setSyncText(formatLastSync(latestTimestamp));
        }, 10000);
        return () => clearInterval(interval);
    }, [latestTimestamp]);

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8 pb-10"
        >
            <PageHeader
                title="System Overview"
                subtitle="Monitoring real-time operational metrics and AI risk triggers"
                rightContent={
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-white border border-border-main rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-default">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-gray uppercase tracking-[0.15em] leading-none mb-0.5">
                                System Status
                            </span>
                            <span className="text-[11px] font-bold text-title whitespace-nowrap leading-none flex items-center gap-1.5">
                                <span className="text-gray/60 font-medium italic">Synced</span>
                                <span className="text-primary">{syncText}</span>
                            </span>
                        </div>
                    </div>
                }
            />

            <motion.div variants={itemVariants}>
                <StatGrid data={stats} isLoading={isDashboardLoading} />
            </motion.div>

            <motion.div variants={itemVariants}>
                {isDashboardLoading ? (
                    <MatricCardSkeleton count={3} />
                ) : !isDashboardError ? (
                    <MatricCardRow items={metricCards || []} />
                ) : null}
            </motion.div>

            <motion.div variants={itemVariants}>
                <RecentActivityTable data={activity} isLoading={isDashboardLoading} />
            </motion.div>


        </motion.div>
    );
};

export default Dashboard;
