import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiLayout } from 'react-icons/fi';
import Badge from '../../UI/Badge';
import Button from '../../UI/Button';
import { AssetIcon } from '../../../pages/Admin/Inventory'; // We'll export AssetIcon in Inventory.jsx

const AssetCard = ({ asset, onClick }) => {
    const statusColor = asset.status === 'Verified' ? 'success' : asset.status === 'Mismatch' ? 'danger' : 'warning';
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => onClick(asset)}
            className="group relative bg-card border border-border-main rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer overflow-hidden"
        >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-[0.03] transition-transform group-hover:scale-110 ${
                asset.status === 'Mismatch' ? 'bg-danger' : asset.status === 'Pending' ? 'bg-warning' : 'bg-success'
            }`} />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-base border border-border-main shadow-sm group-hover:border-primary/20 transition-colors">
                    <AssetIcon type={asset.icon} className="w-6 h-6 text-title/80 group-hover:text-primary transition-colors" />
                </div>
                <Badge
                    variant="light"
                    color={statusColor}
                    className="text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider shadow-sm"
                >
                    {asset.status}
                </Badge>
            </div>

            <div className="space-y-1 mb-5 relative z-10">
                <h3 className="text-[15px] font-black text-title leading-tight truncate group-hover:text-primary transition-colors">
                    {asset.name}
                </h3>
                <p className="text-[11px] font-medium text-gray truncate uppercase tracking-tighter opacity-70">
                    {asset.model} • {asset.org}
                </p>
                <div className="pt-2">
                    <span className="px-2 py-0.5 bg-base border border-border-main/60 rounded-md text-[10px] font-black text-gray/80 tracking-wide font-mono uppercase">
                        {asset.uniqueId}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border-main/50 relative z-10">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray uppercase opacity-50 leading-none mb-1">Last Audit</span>
                    <span className="text-[11px] font-black text-title truncate">{asset.lastAudit}</span>
                </div>
                <Button
                    variant="ghost"
                    icon={FiExternalLink}
                    className="!h-8 !w-8 !p-0 text-gray/40 group-hover:text-primary transition-colors"
                />
            </div>
        </motion.div>
    );
};

export default AssetCard;
