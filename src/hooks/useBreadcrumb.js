import { useContext } from 'react';
import BreadcrumbContext from '../context/BreadcrumbContext';

/**
 * Hook to use Breadcrumb Context
 */
export const useBreadcrumb = () => {
    const context = useContext(BreadcrumbContext);
    if (!context) {
        throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
    }
    return context;
};

export default useBreadcrumb;
