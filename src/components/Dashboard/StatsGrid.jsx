import React from "react";
import { StatsRow } from "./StatsCard";
import { StatsGridSkeleton } from "./StatsCardSkeleton";

/**
 * StatGrid — Dashboard overview grid using unified StatsCard.
 */
export const StatGrid = ({ data, isLoading, isError }) => {
    if (isLoading) return <StatsGridSkeleton count={4} />;
    if (isError) return null;

    return (
        <StatsRow items={data || []} columns={4} />
    );
};

export default StatGrid;
