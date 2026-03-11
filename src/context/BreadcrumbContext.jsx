import React, { createContext, useContext, useState, useCallback } from 'react';

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

/**
 * Auto-generate breadcrumbs from navItems based on current pathname
 * Call this in AdminLayout to auto-set breadcrumbs on route change
 */
export const generateBreadcrumbs = (navItems, pathname) => {
    const crumbs = [{ label: 'Dashboard', path: '/admin/dashboard' }];

    for (const item of navItems) {
        // Check if item has children
        if (item.children) {
            for (const child of item.children) {
                if (pathname === child.path || pathname.startsWith(child.path + '/')) {
                    // Add parent label
                    crumbs.push({ label: item.label });
                    // Add child label as current page
                    crumbs.push({ label: child.label, path: child.path });
                    return crumbs;
                }
            }
        } else if (item.path && item.path !== '/admin/dashboard') {
            if (pathname === item.path || pathname.startsWith(item.path + '/')) {
                crumbs.push({ label: item.label });
                return crumbs;
            }
        }
    }

    return crumbs;
};

// Hook
export const useBreadcrumb = () => useContext(BreadcrumbContext);

export default BreadcrumbContext;
