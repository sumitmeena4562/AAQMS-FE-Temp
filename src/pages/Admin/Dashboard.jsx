import PageHeader from "../../components/UI/PageHeader";
import StatGrid from "../../components/Dashboard/StatsGrid";
import { MatricCardRow } from "../../components/Dashboard/MatricCard";
import RecentActivityTable from "../../components/Dashboard/RecentactivityTable";
import { FiBox, FiClock, FiAlertTriangle, FiHome } from "react-icons/fi";

const Dashboard = () => {
    const metricCards = [
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

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="System Overview"
                subtitle="Monitoring real-time operational metrics and AI risk triggers"
                // breadcrumbs={[
                //     { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} />, isActive: true }
                // ]}
                rightContent={
                    <div className="px-3 py-1.5 bg-base/50 border border-border-main/50 rounded-lg shadow-inner">
                        <span className="text-[10px] font-black text-gray uppercase tracking-widest">
                            Last Sync: <span className="text-primary">Just now</span>
                        </span>
                    </div>
                }
            />
            <StatGrid />

            <MatricCardRow items={metricCards} />
            <RecentActivityTable />

        </div>
    );
};

export default Dashboard;
