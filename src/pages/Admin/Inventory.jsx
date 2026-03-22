import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';
import { StatsRow } from '../../components/Dashboard/StatsCard';
import DataTable from '../../components/UI/DataTable';
import Badge from '../../components/UI/Badge';
import { 
    FiHome, FiBriefcase, FiBox, FiCheckCircle, 
    FiAlertCircle, FiClock, FiExternalLink, FiGrid,
    FiMonitor, FiPrinter, FiShield, FiCpu, FiLayout
} from 'react-icons/fi';
import { generateInventoryForZone } from '../../utils/mockSiteData';
import Button from '../../components/UI/Button';

const AssetIcon = ({ type, className = "" }) => {
    switch (type?.toLowerCase()) {
        case 'chair':
        case 'furniture':
            return <FiGrid className={className} />;
        case 'monitor':
        case 'peripheral':
            return <FiMonitor className={className} />;
        case 'network':
        case 'router':
            return <FiCpu className={className} />;
        case 'printer':
            return <FiPrinter className={className} />;
        case 'safety':
            return <FiShield className={className} />;
        default:
            return <FiBox className={className} />;
    }
};

const Inventory = () => {
    const location = useLocation();
    const inventory = useMemo(() => generateInventoryForZone('104'), []);

    // Stats Calculation
    const stats = useMemo(() => {
        const total = inventory.length;
        const verified = inventory.filter(i => i.status === 'Verified').length;
        const mismatches = inventory.filter(i => i.status === 'Mismatch').length;
        const pending = inventory.filter(i => i.status === 'Pending').length;

        return [
            { label: "Total Assets", value: total, icon: FiBox, iconBgClass: "bg-blue-50", iconColorClass: "text-blue-500" },
            { label: "Verified", value: verified, icon: FiCheckCircle, iconBgClass: "bg-emerald-50", iconColorClass: "text-emerald-500" },
            { label: "Mismatches", value: mismatches, icon: FiAlertCircle, iconBgClass: "bg-rose-50", iconColorClass: "text-rose-500" },
            { label: "Pending Review", value: pending, icon: FiClock, iconBgClass: "bg-amber-50", iconColorClass: "text-amber-500" }
        ];
    }, [inventory]);

    const columns = useMemo(() => [
        {
            header: 'Asset Name',
            accessor: 'name',
            width: '28%',
            render: (name, row) => (
                <div className="flex items-center gap-3.5 py-1.5 px-0.5">
                    <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-base text-primary shrink-0 border border-border-main/50">
                        <AssetIcon type={row.icon} className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-black text-title leading-tight truncate">{name}</span>
                        <span className="text-[10px] font-medium text-gray mt-0.5 truncate">{row.model}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Unique ID',
            accessor: 'uniqueId',
            width: '15%',
            render: (id) => (
                <span className="px-2 py-1 bg-base border border-border-main/50 rounded-md text-[10px] font-bold text-gray tracking-tight font-mono">
                    {id}
                </span>
            )
        },
        {
            header: 'QR Code',
            accessor: 'qr',
            width: '10%',
            align: 'center',
            render: () => (
                <FiLayout className="text-gray/40 hover:text-gray transition-colors cursor-pointer" size={18} />
            )
        },
        {
            header: 'AI Status',
            accessor: 'status',
            width: '15%',
            align: 'center',
            render: (status) => {
                const color = status === 'Verified' ? 'success' : status === 'Mismatch' ? 'danger' : 'warning';
                return (
                    <div className="flex justify-center">
                        <Badge 
                            variant="light" 
                            color={color} 
                            className="!text-[9px] !px-2.5 !py-0.5 !rounded-full !font-black !uppercase !tracking-widest flex items-center gap-1"
                        >
                            <span className={`w-1 h-1 rounded-full ${status === 'Verified' ? 'bg-emerald-500' : status === 'Mismatch' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                            {status}
                        </Badge>
                    </div>
                );
            }
        },
        {
            header: 'Last Audit',
            accessor: 'lastAudit',
            width: '20%',
            render: (date, row) => (
                <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-bold text-body truncate tracking-tight">{date}</span>
                    <span className="text-[10px] font-medium text-gray mt-0.5 truncate italic">By {row.auditor}</span>
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: 'id',
            width: '12%',
            align: 'right',
            render: () => (
                <div className="flex justify-end pr-1">
                    <Button 
                        variant="ghost" 
                        icon={FiExternalLink} 
                        className="!h-8 !px-3 !text-[11px] !font-black !uppercase !tracking-wider !text-rose-500 hover:!bg-rose-50/50 !border !border-rose-100/50"
                    >
                        View
                    </Button>
                </div>
            )
        }
    ], []);

    const displayedInventory = inventory.slice(0, 5);

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-16">
            <PageHeader 
                title="Zone 104 Inventory" 
                subtitle="Conference Room • North HQ • Floor 1"
                hideAddButton={true}
                breadcrumbs={[
                    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome size={14} /> },
                    { label: "Organizations", path: "/admin/organizations", icon: <FiBriefcase size={14} /> },
                    { label: "North HQ", path: "#" },
                    { label: "Zone 104", path: "#", isActive: true }
                ]}
            />

            <StatsRow items={stats} columns={4} />

            <div className="flex flex-col w-full gap-4 mt-2">
                <DataTable 
                    columns={columns}
                    data={displayedInventory}
                    footer={
                        <div className="flex items-center justify-between w-full px-1">
                            <span className="text-[11px] font-bold text-gray tracking-tight">
                                Showing <span className="text-body font-black">1 to 5</span> of <span className="text-body font-black">{inventory.length}</span> results
                            </span>
                            <div className="flex items-center gap-1.5">
                                <Button variant="outline" className="!h-8 !px-3 !text-[10px] !font-black !uppercase !tracking-widest opacity-50 cursor-not-allowed">Previous</Button>
                                <Button variant="outline" className="!h-8 !px-4 !text-[10px] !font-black !uppercase !tracking-widest">Next</Button>
                            </div>
                        </div>
                    }
                />
            </div>

            {/* Global Disclaimer Footer */}
            <div className="flex items-center justify-center gap-2 py-4">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray/60 tracking-tight">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    AI assists detection. Final approval is human-controlled.
                </div>
            </div>
        </div>
    );
};

export default Inventory;
