import React, { createContext, useState, useCallback } from 'react';

/**
 * Breadcrumb Context — Dynamic Breadcrumbs
 *
 * Auto-generates breadcrumb from sidebar navItems based on current route.
 * Pages can also append extra items using appendBreadcrumbs().
 *
 * Usage:
 *   // Auto breadcrumb from sidebar already works!
 *
 *   // To add extra items (e.g., specific entity names):
 *   const { appendBreadcrumbs } = useBreadcrumb();
 *   useEffect(() => {
 *       appendBreadcrumbs([
 *           { label: 'Acme Logistics Hub', path: '/admin/organizations/1' },
 *           { label: 'North Warehouse' }
 *       ]);
 *   }, []);
 */

const BreadcrumbContext = createContext({
    breadcrumbs: [],
    setBreadcrumbs: () => { },
    appendBreadcrumbs: () => { }
});

// Provider
export const BreadcrumbProvider = ({ children }) => {
    const [breadcrumbs, setBreadcrumbsState] = useState([]);
    const [extraItems, setExtraItems] = useState([]);

    const setBreadcrumbs = useCallback((items) => {
        setBreadcrumbsState(items);
        setExtraItems([]); // reset extras when base changes
    }, []);

    const appendBreadcrumbs = useCallback((items) => {
        setExtraItems(items);
    }, []);

    // Combine base + extra
    const allBreadcrumbs = [...breadcrumbs, ...extraItems];

    return (
        <BreadcrumbContext.Provider value={{
            breadcrumbs: allBreadcrumbs,
            setBreadcrumbs,
            appendBreadcrumbs
        }}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

export default BreadcrumbContext;
