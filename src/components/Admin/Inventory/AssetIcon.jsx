import React from 'react';
import {
    FiBox, FiGrid, FiMonitor, FiLayout, FiPrinter,
    FiCpu, FiHardDrive, FiSmartphone, FiTablet,
    FiZap, FiMousePointer
} from 'react-icons/fi';

export const AssetIcon = ({ type, className = "" }) => {
    const ASSET_ICONS = {
        chair: FiGrid, furniture: FiGrid, monitor: FiMonitor, display: FiMonitor,
        screen: FiMonitor, peripheral: FiCpu, network: FiLayout, router: FiLayout,
        switch: FiLayout, printer: FiPrinter, scanner: FiPrinter, copier: FiPrinter,
        safety: FiBox, server: FiHardDrive, storage: FiHardDrive, mobile: FiSmartphone,
        phone: FiSmartphone, tablet: FiTablet, laptop: FiMonitor, cpu: FiCpu,
        ups: FiZap, system: FiCpu, keyboard: FiMousePointer, mouse: FiMousePointer, box: FiBox
    };
    const Icon = ASSET_ICONS[type?.toLowerCase()] || ASSET_ICONS.box;
    return <Icon className={className} />;
};

export default AssetIcon;
