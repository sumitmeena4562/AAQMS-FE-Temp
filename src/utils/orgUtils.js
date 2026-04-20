/**
 * Helper for consistent status calculation
 * Used by both Table and Cards for identical behavior.
 */
export const getOrgStatus = (org) => {
    if (org.isBlocked) return 'BLOCKED';
    if ((org.stats?.coordinators || 0) === 0) return 'PENDING';
    const status = (org.status || 'ACTIVE').toUpperCase();
    if (status === 'PENDING') return 'ACTIVE';
    return status;
};
