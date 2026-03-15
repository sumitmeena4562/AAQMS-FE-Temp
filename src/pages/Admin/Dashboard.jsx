
import PageHeader from "../../components/dashboard/pageHeader";
import { StatGrid } from "../../components/Dashboard/StatsGrid"

const Dashboard = () => {
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
        </div>
    );
};

export default Dashboard;