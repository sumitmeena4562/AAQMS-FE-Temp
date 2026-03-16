import React from 'react';
import {
    FiAlertTriangle,
    FiUserPlus,
    FiPackage,
    FiCheckCircle,
    FiSettings,
    FiFilter,
    FiExternalLink,
} from 'react-icons/fi';

const ACTIVITY = [
    {
        type: 'Inventory Mismatch',
        icon: FiAlertTriangle,
        iconBgClass: 'bg-rose-50',
        iconTextClass: 'text-rose-600',
        user: 'System AI',
        entity: 'Zone B-12',
        details: 'Fire extinguisher missing in Zone 15-12',
        time: '2 mins ago',
    },
    {
        type: 'User Onboarding',
        icon: FiUserPlus,
        iconBgClass: 'bg-indigo-50',
        iconTextClass: 'text-indigo-600',
        user: 'Sarah Jenkins',
        entity: 'Acme Corp',
        details: 'Added 5 new field officers',
        time: '15 mins ago',
    },
    {
        type: 'Inventory Update',
        icon: FiPackage,
        iconBgClass: 'bg-amber-50',
        iconTextClass: 'text-amber-600',
        user: 'Mike Ross',
        entity: 'Safety Gear Depot',
        details: 'Stock level adjustment (-50 units)',
        time: '1 hour ago',
    },
    {
        type: 'Report Approval',
        icon: FiCheckCircle,
        iconBgClass: 'bg-emerald-50',
        iconTextClass: 'text-emerald-600',
        user: 'David Kim',
        entity: 'Monthly Compliance',
        details: 'Report #8821 approved',
        time: '2 hours ago',
    },
    {
        type: 'System Config',
        icon: FiSettings,
        iconBgClass: 'bg-gray-100',
        iconTextClass: 'text-gray-500',
        user: 'Admin User',
        entity: 'Global Settings',
        details: 'Updated API rate limits',
        time: '4 hours ago',
    },
];

const RecentActivityTable = () => {
    return (
        <div className=" px-6 py-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <h3 className="text-md  font-bold text-gray-900">Recent Activity</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-[3px] rounded-full">
                        Live Feed
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1.5 flex items-center gap-1">
                        <FiFilter size={12} />
                        Filter
                    </button>
                    <button className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5 flex items-center gap-1">
                        View All Logs
                        <FiExternalLink size={12} />
                    </button>
                </div>
            </div>

            <div className="w-full overflow-x-auto">
                <table className="min-w-[820px] w-full text-left">
                    <thead className="bg-gray-50">
                        <tr className="text-[10px] uppercase tracking-wider text-gray-400">
                            <th className="px-5 py-3 font-semibold">Event Type</th>
                            <th className="px-5 py-3 font-semibold">User / Source</th>
                            <th className="px-5 py-3 font-semibold">Entity</th>
                            <th className="px-5 py-3 font-semibold">Details</th>
                            <th className="px-5 py-3 font-semibold text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ACTIVITY.map((row, idx) => {
                            const Icon = row.icon;
                            return (
                                <tr key={idx} className="border-t border-gray-100">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${row.iconBgClass} ${row.iconTextClass}`}>
                                                <Icon size={16} />
                                            </span>
                                            <span className="text-sm font-semibold text-gray-800">
                                                {row.type}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-700">{row.user}</td>
                                    <td className="px-5 py-4 text-sm text-gray-700">{row.entity}</td>
                                    <td className="px-5 py-4 text-sm text-gray-500">{row.details}</td>
                                    <td className="px-5 py-4 text-sm text-gray-500 text-right">{row.time}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentActivityTable;
