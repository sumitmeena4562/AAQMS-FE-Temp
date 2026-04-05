import React from 'react';
import { FiHome } from 'react-icons/fi';

/**
 * Auto-generate breadcrumbs from navItems based on current pathname
 * @param {Array} navItems - Sidebar navigation configuration
 * @param {string} pathname - Current window location pathname
 * @returns {Array} - Array of breadcrumb items
 */
export const generateBreadcrumbs = (navItems, pathname) => {
    // Initial breadcrumb always starts with Dashboard
    const crumbs = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <FiHome size={14} /> }
    ];

    if (pathname === '/admin/dashboard') {
        crumbs[0].isActive = true;
        return crumbs;
    }

    for (const item of navItems) {
        // Check if item has children (Nested routes)
        if (item.children) {
            for (const child of item.children) {
                if (pathname === child.path || pathname.startsWith(child.path + '/')) {
                    // Logic fix: Parent should link to its default path OR its first child
                    // instead of the current active child.
                    const parentPath = item.path || (item.children.length > 0 ? item.children[0].path : child.path);

                    crumbs.push({ 
                        label: item.label, 
                        path: parentPath, 
                        icon: item.icon ? React.cloneElement(item.icon, { size: 14 }) : null 
                    });
                    
                    crumbs.push({ 
                        label: child.label, 
                        path: child.path, 
                        icon: child.icon ? React.cloneElement(child.icon, { size: 14 }) : null,
                        isActive: true 
                    });
                    return crumbs;
                }
            }
        } 
        // Semi-nested or Direct routes
        else if (item.path && item.path !== '/admin/dashboard') {
            if (pathname === item.path || pathname.startsWith(item.path + '/')) {
                crumbs.push({ 
                    label: item.label, 
                    path: item.path,
                    icon: item.icon ? React.cloneElement(item.icon, { size: 14 }) : null,
                    isActive: true 
                });
                return crumbs;
            }
        }
    }

    return crumbs;
};
