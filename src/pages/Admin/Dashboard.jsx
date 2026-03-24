import PageHeader from "../../components/UI/PageHeader";
import StatGrid from "../../components/Dashboard/StatsGrid";
import { MatricCardRow } from "../../components/Dashboard/MatricCard";
import RecentActivityTable from "../../components/Dashboard/RecentactivityTable";
import { FiHome } from "react-icons/fi";
import { DUMMY_METRIC_CARDS } from "../../data/dashboardData";

const Dashboard = () => {
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
                            Last Sync: <span className="text-primary italic">Just now</span>
                        </span>
                    </div>
                }
            />
            <StatGrid />

            <MatricCardRow items={DUMMY_METRIC_CARDS} />
            <RecentActivityTable />

        </div>
    );
};

export default Dashboard;
