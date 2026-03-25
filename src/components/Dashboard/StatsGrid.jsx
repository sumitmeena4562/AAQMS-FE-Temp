import React from "react";
import StatsCard, { StatsRow } from "./StatsCard";
import { FiBox } from "react-icons/fi";
import { useDashboardStats } from "../../hooks/useDashboardQueries";

/**
 * StatGrid — Dashboard overview grid using unified StatsCard.
 * Uses the big card design with divider + change indicator.
 */
export const StatGrid = () => {
    const { data: stats, isLoading, isError } = useDashboardStats();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100 group transition-all duration-300 hover:shadow-md cursor-wait">
                <FiBox className="text-primary animate-pulse mb-3 group-hover:scale-110 transition-transform duration-300" size={40} />
                <span className="text-sm font-semibold text-gray-500 group-hover:text-primary transition-colors">Loading Statistics...</span>
            </div>
        );
    }

    if (isError) return null;

    return (
        <StatsRow items={stats} columns={4} />
    );
};

export default StatGrid;
