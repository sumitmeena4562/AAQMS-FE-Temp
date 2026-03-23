import { useState, useEffect } from "react";
import PageHeader from "../../components/UI/PageHeader";
import StatGrid from "../../components/Dashboard/StatsGrid";
import { MatricCardRow } from "../../components/Dashboard/MatricCard";
import RecentActivityTable from "../../components/Dashboard/RecentactivityTable";
import { FiHome, FiBox } from "react-icons/fi";
import { useDashboardMetrics, useDashboardStats, useRecentActivity } from "../../hooks/useDashboardQueries";

// Helper outside component to format elapsed time elegantly
const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Fetching...';
    const diffInSeconds = Math.floor((Date.now() - timestamp) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Dashboard = () => {
    const { data: metricCards, isLoading, isError, dataUpdatedAt: metricTime } = useDashboardMetrics();
    
    // Call the hooks just to access their update timestamps. 
    // React Query is smart enough to NOT make duplicate network requests!
    const { dataUpdatedAt: statsTime } = useDashboardStats();
    const { dataUpdatedAt: activityTime } = useRecentActivity();

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
        <div className="flex flex-col gap-6">
            <PageHeader
                title="System Overview"
                subtitle="Monitoring real-time operational metrics and AI risk triggers"
                breadcrumbs={[
                    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} />, isActive: true }
                ]}
                rightContent={
                    <div className="px-3 py-1.5 bg-base/50 border border-border-main/50 rounded-lg shadow-inner">
                        <span className="text-[10px] font-black text-gray uppercase tracking-widest">
                            Last Sync: <span className="text-primary italic transition-all duration-300">{syncText}</span>
                        </span>
                    </div>
                }
            />
            <StatGrid />

            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-sm border border-gray-100 group transition-all duration-300 hover:shadow-md cursor-wait">
                    <FiBox className="text-primary animate-pulse mb-3 group-hover:scale-110 transition-transform duration-300" size={40} />
                    <span className="text-sm font-semibold text-gray-500 group-hover:text-primary transition-colors">Loading Metrics...</span>
                </div>
            ) : !isError && (
                <MatricCardRow items={metricCards} />
            )}

            <RecentActivityTable />

        </div>
    );
};

export default Dashboard;
