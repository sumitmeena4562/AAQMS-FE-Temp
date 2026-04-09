import { useState, useEffect } from "react";
import PageHeader from "../../components/UI/PageHeader";
import StatGrid from "../../components/Dashboard/StatsGrid";
import { MatricCardRow } from "../../components/Dashboard/MatricCard";
import RecentActivityTable from "../../components/Dashboard/RecentactivityTable";
import { MatricCardSkeleton, StatsGridSkeleton } from "../../components/Dashboard/StatsCardSkeleton";
import { FiHome, FiBox } from "react-icons/fi";
import { useDashboardMetrics, useDashboardStats, useRecentActivity } from "../../hooks/useDashboardQueries";

import { motion } from "framer-motion";

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
    const { data: metricCards, isLoading: isMetricsLoading, isError: isMetricsError, dataUpdatedAt: metricTime } = useDashboardMetrics();
    const { data: stats, isLoading: isStatsLoading, isError: isStatsError, dataUpdatedAt: statsTime } = useDashboardStats();
    const { data: activity, isLoading: isActivityLoading, isError: isActivityError, dataUpdatedAt: activityTime } = useRecentActivity();

    // Unified loading state for the entire core dashboard area
    const isDashboardLoading = isMetricsLoading || isStatsLoading;
    const isDashboardError = isMetricsError || isStatsError;

    // PRO LEVEL: We mathematically find the single most recent timestamp out of all 3 APIs
    const latestTimestamp = Math.max(metricTime || 0, statsTime || 0, activityTime || 0);

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
                <StatGrid data={stats} isLoading={isStatsLoading} />
            </motion.div>

            <motion.div variants={itemVariants}>
                {isMetricsLoading ? (
                    <MatricCardSkeleton count={3} />
                ) : !isMetricsError ? (
                    <MatricCardRow items={metricCards || []} />
                ) : null}
            </motion.div>

            <motion.div variants={itemVariants}>
                <RecentActivityTable data={activity} isLoading={isActivityLoading} />
            </motion.div>

        </motion.div>
    );
};

export default Dashboard;
