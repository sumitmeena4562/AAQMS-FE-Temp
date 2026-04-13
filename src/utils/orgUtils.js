/**
 * Helper for consistent status calculation
 * Used by both Table and Cards for identical behavior.
 */
export const getOrgStatus = (org) => {
    if (org.isBlocked) return 'BLOCKED';
    if ((org.stats?.coordinators || 0) === 0) return 'PENDING';
    return (org.status || 'ACTIVE').toUpperCase();
};
