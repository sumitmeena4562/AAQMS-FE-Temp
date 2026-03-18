/**
 * Auto-generate breadcrumbs from navItems based on current pathname
 * @param {Array} navItems - Sidebar navigation configuration
 * @param {string} pathname - Current window location pathname
 * @returns {Array} - Array of breadcrumb items
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
