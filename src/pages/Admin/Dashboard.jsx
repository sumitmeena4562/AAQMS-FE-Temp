
import PageHeader from "../../components/Dashboard/pageHeader";
import { StatGrid } from "../../components/Dashboard/StatsGrid";
import { MatricCardRow } from "../../components/Dashboard/MatricCard";
import RecentActivityTable from "../../components/Dashboard/RecentactivityTable";
import { FiBox, FiClock, FiAlertTriangle } from "react-icons/fi";

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
        <div className="!space-y-6">
            <PageHeader
                title="System Overview"
                subtitle={
                    <>
                        Real-time metrics for{' '}
                        <span className="font-semibold text-gray-700">February 26, 2026</span>
                    </>
                }
                rightContent={
                    <span className="inline-flex items-center !px-3 !py-1.5 text-xs text-gray-500 bg-white border border-gray-200 rounded-md shadow-sm whitespace-nowrap">
                        Last updated: Just now
                    </span>
                }
            />
            <StatGrid />

            <MatricCardRow items={metricCards} />
            <RecentActivityTable />

        </div>
    );
};

export default Dashboard;
