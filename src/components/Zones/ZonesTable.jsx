import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode } from 'lucide-react';
import { ZONES_DATA } from '../../data/zones';

const ZonesTable = () => {
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
                {/* View Drawing Button */}
                <button className="flex items-center justify-center gap-2 w-[153px] h-[46px] bg-card border border-border-main rounded-lg text-sm font-semibold text-body hover:bg-base hover:text-blue-600 hover:border-blue-200 transition-all shadow-md outline-none cursor-pointer group">
                    <svg className="w-4 h-4 text-gray group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>View Drawing</span>
                </button>
            </div>

            {/* Table Section */}
            <div className="w-full overflow-x-auto pb-2 px-6 shadow-2xl">
                <table className="w-full text-left border-collapse min-w-max ">
                    <thead>
                        <tr className="border-b-[1.5px] border-border-main/60 bg-base">
                            <th className="py-4 pr-6 text-[11px] font-bold text-gray uppercase tracking-[0.8px] whitespace-nowrap align-middle">ZONE ID</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-gray uppercase tracking-[0.8px] whitespace-nowrap align-middle">ZONE NAME</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-gray uppercase tracking-[0.8px] whitespace-nowrap align-middle">ZONE TYPE</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-gray uppercase tracking-[0.8px] whitespace-nowrap align-middle">INVENTORY COUNT</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-gray uppercase tracking-[0.8px] whitespace-nowrap align-middle">QR CODE</th>
                            <th className="py-4 pl-6 text-[11px] font-bold text-gray uppercase tracking-[0.8px] whitespace-nowrap align-middle">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-main/60">
                        {ZONES_DATA.map((zone, index) => {
                            const Icon = zone.icon;
                            return (
                                <tr key={index} className="hover:bg-base/50 transition-colors group">
                                    <td className="py-4 pr-6 align-middle">
                                        <span className="text-xs font-semibold px-2.5 py-1 bg-base text-gray rounded-[4px] whitespace-nowrap">
                                            {zone.id}
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
                                            <select
                                                defaultValue={zone.type}
                                                className="block w-full appearance-none bg-card border border-border-main hover:border-border-hover text-body py-1.5 px-3 pr-8 rounded-md text-sm leading-tight focus:outline-none focus:border-border-hover focus:ring-0 cursor-pointer transition-colors"
                                            >
                                                <option value="Storage">Storage</option>
                                                <option value="Loading Bay">Loading Bay</option>
                                                <option value="Office">Office</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 align-middle">
                                        <button 
                                            onClick={() => navigate(`/admin/inventory?zone=${zone.id}`)}
                                            className="text-sm text-blue-600 font-bold hover:underline cursor-pointer bg-transparent border-none p-0"
                                        >
                                            {zone.count}
                                        </button>
                                    </td>
                                    <td className="py-4 px-6 align-middle">
                                        <button className="text-gray hover:text-body cursor-pointer transition-colors outline-none bg-transparent border-none p-0">
                                            <QrCode size={20} />
                                        </button>
                                    </td>
                                    <td className="py-4 pl-6 align-middle">
                                        <div className="flex items-center gap-2">
                                            <button className="flex items-center justify-center h-[32px] px-3 bg-card border border-border-main rounded-md shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-base transition-colors cursor-pointer outline-none">
                                                <span className="text-[11px] font-semibold text-body whitespace-nowrap">
                                                    View media
                                                </span>
                                            </button>
                                            <button 
                                                onClick={() => navigate(`/admin/inventory?zone=${zone.id}`)}
                                                className="flex items-center justify-center h-[32px] px-3 bg-primary text-white border-none rounded-md shadow-sm hover:bg-primary/90 transition-all cursor-pointer outline-none"
                                            >
                                                <span className="text-[11px] font-bold whitespace-nowrap">
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
