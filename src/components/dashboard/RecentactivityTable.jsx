import React from 'react';
import { Table, Button, ConfigProvider } from 'antd';
import {
    FiAlertTriangle,
    FiUserPlus,
    FiPackage,
    FiCheckCircle,
    FiSettings,
    FiFilter,
} from 'react-icons/fi';

const ACTIVITY = [
    {
        key: '1',
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
        key: '2',
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
        key: '3',
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
        key: '4',
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
        key: '5',
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

const columns = [
    {
        title: 'EVENT TYPE',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => {
            const Icon = record.icon;
            return (
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${record.iconBgClass} ${record.iconTextClass}`}>
                        <Icon size={16} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {text}
                    </span>
                </div>
            );
        },
    },
    {
        title: 'USER / SOURCE',
        dataIndex: 'user',
        key: 'user',
        render: (text, record) => (
            <div className="flex items-center gap-2">
                {record.userBadge && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${record.userBadge.bgClass} ${record.userBadge.textClass}`}>
                        {record.userBadge.text}
                    </span>
                )}
                <span className="text-sm text-gray-900 font-medium whitespace-nowrap">{text}</span>
            </div>
        ),
    },
    {
        title: 'ENTITY',
        dataIndex: 'entity',
        key: 'entity',
        render: (text, record) => (
            <div className="flex items-center gap-2">
                {record.entityBadge ? (
                    <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-[4px] whitespace-nowrap">
                        {text}
                    </span>
                ) : (
                    <span className="text-sm text-gray-700 whitespace-nowrap">{text}</span>
                )}
            </div>
        ),
    },
    {
        title: 'DETAILS',
        dataIndex: 'details',
        key: 'details',
        render: (text) => <span className="text-sm text-gray-500 min-w-[200px] block">{text}</span>,
    },
    {
        title: 'TIME',
        dataIndex: 'time',
        key: 'time',
        render: (text) => <span className="text-sm text-gray-500 whitespace-nowrap">{text}</span>,
    },
];

const RecentActivityTable = () => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'Inter, system-ui, sans-serif',
                    colorBorderSecondary: '#F3F4F6', // Lighter border color for table rows
                },
                components: {
                    Table: {
                        headerBg: '#F9FAFBCC',
                        headerColor: '#7B8393',
                        headerSplitColor: 'transparent',
                        cellPaddingBlock: 16,
                    },
                },
            }}
        >
            <div className="  bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] flex flex-col w-full ">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 !px-6 border-b border-gray-100 gap-4 !h-[71px] ">
                    {/* Left Container */}
                    <div className="flex items-center gap-3 h-7">
                        <h3 className="text-[18px] font-bold text-[#111827] leading-none m-0">
                            Recent Activity
                        </h3>
                        {/* Live Feed Container */}
                        <div className="flex items-center justify-center w-[77.22px] h-[22px] pt-[2px] pr-[10px] pb-[2px] pl-[10px] bg-gray-100 border border-gray-200 rounded-full">
                            {/* Live Feed Text */}
                            <span className="flex items-center justify-center w-[55.22px] h-[16px] text-xs font-medium text-gray-500 leading-none">
                                Live Feed
                            </span>
                        </div>
                    </div>
                    {/* Right Container */}
                    <div className="flex items-center gap-2 h-7.5">
                        {/* Filter Button */}
                        <button className="flex items-center justify-center w-[54.95px] h-[30px] pt-[6px] pr-[12px] pb-[6px] pl-[12px] bg-white border border-[#D1D5DB] rounded-[6px] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-gray-50 transition-colors cursor-pointer outline-none">
                            <span className="flex items-center justify-center w-[28.95px] h-[16px] font-['Inter'] font-medium text-[12px] leading-[16px] tracking-[0px] text-center align-middle text-[#374151]">
                                Filter
                            </span>
                        </button>
                        {/* View All Logs Button */}
                        <button className="flex items-center justify-center w-[103.22px] h-[30px] pt-[6px] pr-[12px] pb-[6px] pl-[12px] bg-[#EFF6FF] border border-[#BFDBFE] rounded-[6px] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-[#DBEAFE] transition-colors cursor-pointer outline-none">
                            <span className="flex items-center justify-center w-[77.22px] h-[16px] font-['Inter'] font-medium text-[12px] leading-[16px] tracking-[0px] text-center align-middle text-[#2563EB] whitespace-nowrap">
                                View All Logs
                            </span>
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="w-full px-[24px] pb-[8px]">
                    <Table
                        columns={columns}
                        dataSource={ACTIVITY}
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                        className="w-full [&_.ant-table-thead>tr>th]:!font-['Inter'] [&_.ant-table-thead>tr>th]:!font-bold [&_.ant-table-thead>tr>th]:!text-[12px] [&_.ant-table-thead>tr>th]:!leading-[16px] [&_.ant-table-thead>tr>th]:!tracking-[0.6px] [&_.ant-table-thead>tr>th]:!uppercase [&_.ant-table-thead>tr>th]:!align-middle [&_.ant-table-thead>tr>th]:!text-[#7B8393] [&_.ant-table-thead>tr>th:first-child]:pl-0 [&_.ant-table-tbody>tr>td:first-child]:pl-0 [&_.ant-table-thead>tr>th:last-child]:pr-0 [&_.ant-table-tbody>tr>td:last-child]:pr-0 [&_.ant-table-tbody>tr:last-child>td]:border-b-0"
                    />
                </div>
            </div>
        </ConfigProvider>
    );
};

export default RecentActivityTable;
