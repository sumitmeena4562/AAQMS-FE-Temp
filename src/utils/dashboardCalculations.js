import React from 'react';
import { OrgIcon, CoordIcon, OfficerIcon, ZoneIcon } from '../data/dashboardData';
import { FiBox, FiClock, FiAlertTriangle, FiUserPlus, FiPackage, FiCheckCircle, FiSettings, FiActivity } from 'react-icons/fi';

/**
 * Calculates percentage growth from a previous value to a current value.
 * @param {number} current - The current total count.
 * @param {number} previous - The previous total count (e.g., last month).
 * @returns {object} { changeText: string, changeType: 'positive'|'negative'|'neutral', trend: number }
 */
export const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) {
        return { changeText: "+0%", changeType: "neutral", trend: 0 };
    }
    
    const diff = current - previous;
    const percentage = Math.round((diff / previous) * 100);
    const changeType = percentage > 0 ? 'positive' : (percentage < 0 ? 'negative' : 'neutral');
    
    return {
        changeText: `${percentage > 0 ? '+' : ''}${percentage}%`,
        changeType,
        trend: percentage
    };
};

/**
 * Calculates the active percentage (e.g., how many users are currently online).
 * @param {number} active - Count of active/online entities.
 * @param {number} total - Total count of entities.
 * @returns {object} { changeText: string, changeType: 'positive'|'negative'|'warning' }
 */
export const calculateActivePercentage = (active, total) => {
    if (!total || total === 0) {
        return { changeText: "0% Active", changeType: "neutral" };
    }
    
    const percentage = Math.round((active / total) * 100);
    let changeType = "neutral";
    if (percentage < 50) changeType = "negative";
    else if (percentage < 80) changeType = "warning";
    
    return {
        changeText: `${percentage}% Active`,
        changeType
    };
};

/**
 * Determines the status of zones/systems based on operational count versus total.
 * @param {number} operational - How many zones are functioning without issues.
 * @param {number} total - Total number of zones.
 * @returns {object} { changeText: string, changeType: 'positive'|'warning'|'negative' }
 */
export const determineZoneStatus = (operational, total) => {
    if (operational === total && total > 0) {
        return { changeText: "All Operational", changeType: "warning" }; 
    }
    
    const issues = total - operational;
    return {
        changeText: `${issues} Issue${issues > 1 ? 's' : ''}`,
        changeType: "negative"
    };
};

/**
 * Maps raw backend summary data into the format expected by StatsGrid.
 * @param {object} rawData - Raw metric counts from backend.
 * @returns {Array} Array of stats card objects.
 */
export const mapToStatsGrid = (rawData) => {
    if (!rawData) return [];

    // Provide default fallback values for simulation if backend doesn't send them yet
    const orgs = rawData.organisations || { total: 0, previousMonth: 0 };
    const coords = rawData.coordinators || { total: 0, previousWeek: 0 };
    const officers = rawData.fieldOfficers || { total: 0, active: 0 };
    const zones = rawData.safetyZones || { total: 0, operational: 0 };

    const orgGrowth = calculateGrowth(orgs.total, orgs.previousMonth);
    const coordGrowth = calculateGrowth(coords.total, coords.previousWeek);
    const officerActive = calculateActivePercentage(officers.active, officers.total);
    const zoneStatus = determineZoneStatus(zones.operational, zones.total);

    return [
        {
            title: "Organisations",
            value: orgs.total.toLocaleString(),
            trend: orgGrowth.trend, 
            changeType: orgGrowth.changeType,
            description: "vs last month",
            icon: React.createElement(OrgIcon),
            iconBgClass: "bg-blue-50",
            iconColorClass: "text-blue-600",
        },
        {
            title: "Coordinators",
            value: coords.total.toLocaleString(),
            trend: coordGrowth.trend,
            changeType: coordGrowth.changeType,
            description: "new this week",
            icon: React.createElement(CoordIcon),
            iconBgClass: "bg-purple-50",
            iconColorClass: "text-purple-600",
        },
        {
            title: "Field Officers",
            value: officers.total.toLocaleString(),
            change: officerActive.changeText,
            changeType: officerActive.changeType,
            description: "currently online",
            icon: React.createElement(OfficerIcon),
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
        },
        {
            title: "Safety Zones",
            value: zones.total.toLocaleString(),
            change: zoneStatus.changeText,
            changeType: zoneStatus.changeType, 
            description: "updated just now",
            icon: React.createElement(ZoneIcon),
            iconBgClass: "bg-orange-50",
            iconColorClass: "text-orange-600",
        },
    ];
};

/**
 * Maps raw backend metric data into the format expected by MatricCardRow (Alert Cards).
 * @param {object} rawData - Raw metric counts from backend.
 * @returns {Array} Array of metric card objects.
 */
export const mapToMetricCards = (rawData) => {
    if (!rawData) return [];
    
    const inventory = rawData.inventory || { total: 0, missing: 0 };
    const approvals = rawData.approvals || { pending: 0 };
    const flags = rawData.aiFlags || { critical: 0 };

    return [
        {
            title: "Inventory Items",
            value: inventory.total.toLocaleString(),
            icon: React.createElement(FiBox, { size: 16 }),
            statusLabel: inventory.missing > 0 ? `${inventory.missing} missing assets detected` : "All assets accounted for",
            statusVariant: inventory.missing > 0 ? "warning" : "success",
        },
        {
            title: "Pending Approvals",
            value: approvals.pending.toLocaleString(),
            icon: React.createElement(FiClock, { size: 16 }),
            statusLabel: approvals.pending > 0 ? "Requires admin action" : "All caught up",
            statusVariant: approvals.pending > 0 ? "info" : "success",
        },
        {
            title: "Critical AI Flags",
            value: flags.critical.toLocaleString(),
            icon: React.createElement(FiAlertTriangle, { size: 16 }),
            statusLabel: flags.critical > 0 ? "Immediate review needed" : "No critical flags",
            statusVariant: flags.critical > 0 ? "danger" : "success",
        },
    ];
};

/**
 * Formats ISO timestamp to relative time (e.g., "5 mins ago")
 */
export const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const diffInSeconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

/**
 * Maps raw backend activity data into the format expected by RecentactivityTable.
 * Injects React Icons and dynamic CSS colors based on the activity literal string.
 * @param {Array} rawData - Array of activity logs from backend.
 * @returns {Array} Array of activity objects formatted for the UI.
 */
export const mapToActivityFeed = (rawData) => {
    if (!Array.isArray(rawData)) return [];
    
    return rawData.map(item => {
        // Default styling for generic activities
        let icon = FiActivity;
        let iconBgClass = 'bg-base';
        let iconTextClass = 'text-gray';
        
        // Dynamically assign aesthetics based on business logic
        const typeStr = (item.type || '').toLowerCase();
        const detailsStr = (item.details || '').toLowerCase();
        
        if (typeStr.includes('mismatch') || typeStr.includes('risk') || typeStr.includes('deleted') || detailsStr.includes('missing')) {
            icon = FiAlertTriangle;
            iconBgClass = 'bg-red-50';
            iconTextClass = 'text-red-600';
        } else if (typeStr.includes('user') || typeStr.includes('officer') || typeStr.includes('admin') || typeStr.includes('coordinator')) {
            icon = FiUserPlus;
            iconBgClass = 'bg-blue-50';
            iconTextClass = 'text-blue-600';
        } else if (typeStr.includes('inventory') || typeStr.includes('equipment') || typeStr.includes('zone')) {
            icon = FiPackage;
            iconBgClass = 'bg-orange-50';
            iconTextClass = 'text-orange-600';
        } else if (typeStr.includes('report') || typeStr.includes('approval') || typeStr.includes('resolved') || typeStr.includes('organisation')) {
            icon = FiCheckCircle;
            iconBgClass = 'bg-purple-50';
            iconTextClass = 'text-purple-600';
        } else if (typeStr.includes('config') || typeStr.includes('settings')) {
            icon = FiSettings;
            iconBgClass = 'bg-gray-100';
            iconTextClass = 'text-gray-600';
        }
        
        return {
            ...item,
            icon,
            iconBgClass,
            iconTextClass,
            time: formatRelativeTime(item.time)
        };
    });
};
