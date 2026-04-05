import React from "react";
import StatsCard, { StatsRow } from "./StatsCard";
import { FiBox } from "react-icons/fi";
import { useDashboardStats } from "../../hooks/useDashboardQueries";

/**
 * StatGrid ΓÇö Dashboard overview grid using unified StatsCard.
 * Uses the big card design with divider + change indicator.
 */
export const StatGrid = () => {
    const { data: stats, isLoading, isError } = useDashboardStats();

    if (isError) return null;

    return (
        <StatsRow items={stats || []} columns={4} />
    );
};

export default StatGrid;
