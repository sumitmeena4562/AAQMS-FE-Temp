import React from "react";
import StatsCard, { StatsRow } from "./StatsCard";
import { StatsGridSkeleton } from "./StatsCardSkeleton";
import { useDashboardStats } from "../../hooks/useDashboardQueries";

/**
 * StatGrid — Dashboard overview grid using unified StatsCard.
 */
export const StatGrid = ({ data: externalData, isLoading: externalLoading }) => {
    const internal = useDashboardStats();
    
    const stats = externalData !== undefined ? externalData : internal.data;
    const isLoading = externalLoading !== undefined ? externalLoading : internal.isLoading;
    const isError = internal.isError;

    if (isLoading) return <StatsGridSkeleton count={4} />;
    if (isError) return null;

    return (
        <StatsRow items={stats || []} columns={4} />
    );
};

export default StatGrid;
