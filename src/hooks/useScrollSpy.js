import { useState, useEffect, useRef } from 'react';

/**
 * useScrollSpy
 * High-performance hook to track the active section in view using IntersectionObserver.
 * @param {Array} sectionIds - List of element IDs to track.
 * @param {Object} options - IntersectionObserver options (rootMargin, threshold).
 * @returns {string} activeId - The ID of the currently active section.
 */
export const useScrollSpy = (sectionIds, options = { rootMargin: '-20% 0px -70% 0px', threshold: 0 }) => {
  const [activeId, setActiveId] = useState('');
  const observer = useRef(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      // Find the first intersecting entry (topmost in document order)
      const visibleEntry = entries.find(entry => entry.isIntersecting);
      if (visibleEntry) {
        setActiveId(visibleEntry.target.id);
      }
    }, options);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.current.observe(element);
    });

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [sectionIds, options]);

  return activeId;
};
