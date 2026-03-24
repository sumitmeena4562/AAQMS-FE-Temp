import React from "react";
import StatsCard, { StatsRow } from "./StatsCard";
import { DUMMY_STATS_GRID } from "../../data/dashboardData";

/**
 * StatGrid — Dashboard overview grid using unified StatsCard.
 * Uses the big card design with divider + change indicator.
 */
export const StatGrid = () => {
    return (
        <StatsRow items={DUMMY_STATS_GRID} columns={4} />
    );
};

export default StatGrid;
