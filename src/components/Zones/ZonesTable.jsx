import React, { useState } from 'react';
import { QrCode, List } from 'lucide-react';
import { ZONES_DATA } from '../../data/zones';

const ZonesTable = ({ showQRCode = false }) => {
    const [activeView, setActiveView] = useState('list');

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
                {/* View Toggles */}
                <div className="flex items-center bg-base p-1 rounded-lg border border-border-main/60">
                    <button 
                        onClick={() => setActiveView('list')}
                        className={`flex items-center justify-center gap-2 h-[38px] px-5 rounded-md text-sm font-semibold transition-all shadow-sm outline-none cursor-pointer ${
                            activeView === 'list' 
                            ? 'bg-card text-title shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] border border-border-main ring-1 ring-black/5' 
                            : 'bg-transparent text-gray hover:text-title border-transparent shadow-none'
                        }`}
                    >
                        <List size={16} className={activeView === 'list' ? "text-title" : "text-gray"} />
                        <span>List</span>
                    </button>
                    <button 
                        onClick={() => setActiveView('drawing')}
                        className={`flex items-center justify-center gap-2 h-[38px] px-5 rounded-md text-sm font-semibold transition-all shadow-sm outline-none cursor-pointer ${
                            activeView === 'drawing' 
                            ? 'bg-card text-title shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] border border-border-main ring-1 ring-black/5' 
                            : 'bg-transparent text-gray hover:text-title border-transparent shadow-none'
                        }`}
                    >
                        <svg className={`w-4 h-4 ${activeView === 'drawing' ? "text-title" : "text-gray"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span>Drawing</span>
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="w-full overflow-x-auto pb-2 px-6 shadow-2xl">
                <table className="w-full text-left border-collapse min-w-max ">
                    <thead>
                        <tr className="border-b-[1.5px] border-gray-100 bg-gray-50">
                            <th className="py-4 pr-6 text-[11px] font-bold text-[#7B8393] uppercase tracking-[0.8px] whitespace-nowrap align-middle">ZONE ID</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-[#7B8393] uppercase tracking-[0.8px] whitespace-nowrap align-middle">ZONE NAME</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-[#7B8393] uppercase tracking-[0.8px] whitespace-nowrap align-middle">ZONE TYPE</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-[#7B8393] uppercase tracking-[0.8px] whitespace-nowrap align-middle">INVENTORY COUNT</th>
                            {showQRCode && <th className="py-4 px-6 text-[11px] font-bold text-[#7B8393] uppercase tracking-[0.8px] whitespace-nowrap align-middle">QR CODE</th>}
                            <th className="py-4 pl-6 text-[11px] font-bold text-[#7B8393] uppercase tracking-[0.8px] whitespace-nowrap align-middle">ACTIONS</th>
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
                                        <span className="text-sm text-body whitespace-nowrap">
                                            {zone.count}
                                        </span>
                                    </td>
                                    {showQRCode && (
                                        <td className="py-4 px-6 align-middle">
                                            <button className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors outline-none bg-transparent border-none p-0">
                                                <QrCode size={20} />
                                            </button>
                                        </td>
                                    )}
                                    <td className="py-4 pl-6 align-middle">
                                        <button className="flex items-center justify-center h-[32px] px-4 bg-card border border-border-main rounded-md shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-red-300  transition-colors cursor-pointer outline-none">
                                            <span className="text-xs font-semibold text-body whitespace-nowrap">
                                                View media
                                            </span>
                                        </button>
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
