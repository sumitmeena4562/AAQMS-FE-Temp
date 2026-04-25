import React from 'react';
import { motion } from 'framer-motion';

import Badge from '../../UI/Badge';
import AssetIcon from './AssetIcon'; 

const AssetCard = ({ asset, onClick }) => {

    const statusColor = asset.status === 'Verified' ? 'success' : asset.status === 'Mismatch' ? 'danger' : 'warning';
    const thumbnail = asset.media?.[0]?.media_url;
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onClick(asset)}
            className="group relative elite-card elite-card-hover p-6 cursor-pointer overflow-hidden flex flex-col min-h-[220px]"
        >
            {/* Subtle Gradient Accent */}
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full opacity-[0.06] group-hover:opacity-[0.1] transition-all group-hover:scale-150 ${
                asset.status === 'Mismatch' ? 'bg-rose-500' : asset.status === 'Pending' ? 'bg-amber-500' : 'bg-emerald-500'
            }`} />

            <div className="flex justify-between items-start mb-5 relative z-10">
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-card border border-border-main shadow-sm overflow-hidden group-hover:border-primary/40 transition-all duration-300">
                    {thumbnail ? (
                        <img 
                            src={thumbnail} 
                            alt={asset.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                    ) : (
                        <AssetIcon type={asset.category || asset.icon} className="w-6 h-6 text-title/70 group-hover:text-primary transition-colors" />
                    )}
                </div>
                <Badge
                    variant="light"
                    color={statusColor}
                    className="text-[10px] px-2.5 py-1.5 rounded-full font-black uppercase tracking-widest border border-border-main/50 flex items-center gap-1.5"
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                        asset.status === 'Verified' ? 'bg-emerald-500' : asset.status === 'Mismatch' ? 'bg-rose-500' : 'bg-amber-500'
                    }`} />
                    {asset.status || 'Pending'}
                </Badge>
            </div>

            <div className="space-y-1.5 mb-6 relative z-10">
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-gray/40 tracking-[0.15em] font-mono uppercase">
                        #{asset.unique_id || 'NO-ID'}
                    </span>
                </div>
                <h3 className="text-[15px] font-black text-title leading-tight truncate group-hover:text-primary transition-colors">
                    {asset.name || asset.asset_name}
                </h3>
                <p className="text-[11px] font-bold text-gray/60 truncate uppercase tracking-tighter">
                    {asset.category || asset.model_name || 'Standard'} <span className="mx-1 opacity-20">•</span> {asset.organisation_name || 'Enterprise'}
                </p>
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-border-main/40 relative z-10">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-gray/40 uppercase tracking-widest mb-0.5">Asset Type</span>
                    <span className="text-[11px] font-extrabold text-title truncate">{asset.category || 'Asset'}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-gray/40 uppercase tracking-widest mb-0.5">Location</span>
                    <span className="text-[10px] font-bold text-gray/60 truncate">{asset.site_name || 'N/A'}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default AssetCard;
