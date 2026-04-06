import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode } from 'lucide-react';

const ZonesTable = ({ data = [], showQRCode = false, selectionMode = false, onViewMedia }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-card border border-border-main rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] flex flex-col w-full overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-row items-center justify-between py-6 px-6 border-b border-border-main/60">
                <div className="flex flex-col gap-1">
                    <h3 className="text-[18px] font-bold text-title leading-tight m-0">
                        Defined Safety Zones
                    </h3>
                    <p className="text-sm text-gray m-0 leading-tight">
                        Manage zone details, types, and risk levels.
                    </p>
                </div>
                {/* View Toggles have been moved to Zones.jsx FilterBar */}
            </div>

            {/* Table Section */}
            <div className="w-full overflow-x-auto pb-2 px-6 shadow-2xl">
                <table className="w-full text-left border-collapse min-w-max ">
                    <thead>
                        <tr className="border-b-[1.5px] border-gray-100 bg-gray-50">
                            {selectionMode && <th className="py-4 pl-6 pr-2 text-[11px] font-bold text-[#7B8393] align-middle w-10"></th>}
                            <th className="py-4 pr-6 pl-6 text-[11px] font-bold text-[#7B8393] uppercase tracking-[0.8px] whitespace-nowrap align-middle">ZONE ID</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-[#7B8393] uppercase tracking-[0.8px] whitespace-nowrap align-middle">ZONE NAME</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-[#7B8393] uppercase tracking-[0.8px] whitespace-nowrap align-middle">ZONE TYPE</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-[#7B8393] uppercase tracking-[0.8px] whitespace-nowrap align-middle">INVENTORY COUNT</th>
                            {showQRCode && <th className="py-4 px-6 text-[11px] font-bold text-[#7B8393] uppercase tracking-[0.8px] whitespace-nowrap align-middle">QR CODE</th>}
                            <th className="py-4 pl-6 text-[11px] font-bold text-[#7B8393] uppercase tracking-[0.8px] whitespace-nowrap align-middle">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-main/60">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={showQRCode ? (selectionMode ? 7 : 6) : (selectionMode ? 6 : 5)} className="py-16 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray animate-in fade-in duration-500">
                                        <p className="text-sm font-semibold text-title mb-1">No zones found</p>
                                        <p className="text-xs">Try adjusting your active filters.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : data.map((zone, index) => {
                            const Icon = zone.icon;
                            return (
                                <tr key={index} className="hover:bg-base/50 transition-colors group">
                                    {selectionMode && (
                                        <td className="py-4 pl-6 pr-2 align-middle">
                                            <input type="checkbox" className="w-[15px] h-[15px] rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer shadow-sm" />
                                        </td>
                                    )}
                                    <td className="py-4 pr-6 pl-6 align-middle">
                                        <span className="text-xs font-semibold px-2.5 py-1 bg-base text-gray rounded-[4px] whitespace-nowrap">
                                            {zone.id.substring(0, 8)}...
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${zone.iconBgClass} ${zone.iconTextClass}`}>
                                                <Icon size={16} />
                                            </div>
                                            <span className="text-sm font-semibold text-title whitespace-nowrap">
                                                {zone.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 align-middle">
                                        <div className="relative inline-block w-[140px]">
                                            <span className="text-[11px] font-bold text-gray/80 px-2.5 py-1 bg-base border border-border-main/50 rounded-lg uppercase tracking-tight">
                                                {zone.type}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 align-middle">
                                        <button
                                            onClick={() => navigate(`/admin/inventory?zone_id=${zone.id}`)}
                                            className="text-sm text-blue-600 font-bold hover:underline cursor-pointer bg-transparent border-none p-0 flex items-center gap-1.5"
                                        >
                                            <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[11px]">{zone.count}</span>
                                            Assets
                                        </button>
                                    </td>
                                    {showQRCode && (
                                        <td className="py-4 px-6 align-middle">
                                            <button className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors outline-none bg-transparent border-none p-0">
                                                <QrCode size={20} />
                                            </button>
                                        </td>
                                    )}
                                    <td className="py-4 pl-6 align-middle">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => onViewMedia?.(zone)}
                                                className="flex items-center justify-center h-[32px] px-3 bg-card border border-border-main rounded-md shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-base transition-colors cursor-pointer outline-none group/media"
                                            >
                                                <span className="text-[11px] font-black text-primary/70 group-hover/media:text-primary uppercase tracking-widest whitespace-nowrap">
                                                    View media
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/inventory?zone_id=${zone.id}`)}
                                                className="flex items-center justify-center h-[32px] px-3 bg-primary text-white border-none rounded-md shadow-sm hover:translate-y-[-1px] active:translate-y-[0px] transition-all cursor-pointer outline-none"
                                            >
                                                <span className="text-[11px] font-bold whitespace-nowrap uppercase tracking-widest">
                                                    Manage
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ZonesTable;
