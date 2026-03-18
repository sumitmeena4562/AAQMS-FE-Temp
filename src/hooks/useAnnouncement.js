import { useCallback } from 'react';

/**
 * Screen Reader Announcement Hook
 * Injects messages into a hidden aria-live region.
 */
export const useAnnouncement = () => {
    const announce = useCallback((message) => {
        const announcer = document.querySelector('[role="status"]');
        if (announcer) {
            announcer.textContent = message;
            // Clear after a short delay to allow re-announcing same message
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
    }, []);

    return { announce };
};

export default useAnnouncement;
