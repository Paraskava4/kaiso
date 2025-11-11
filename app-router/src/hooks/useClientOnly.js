import { useState, useEffect } from 'react';

/**
 * Custom hook to ensure code only runs on the client side
 * Prevents hydration mismatches by returning false during SSR
 */
export const useClientOnly = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

/**
 * Custom hook for media queries that prevents hydration mismatches
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  const isClient = useClientOnly();

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (e) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query, isClient]);

  // Return false during SSR to ensure consistent initial render
  return isClient ? matches : false;
};

/**
 * Custom hook for window dimensions that prevents hydration mismatches
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  const isClient = useClientOnly();

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient]);

  // Return consistent values during SSR
  return isClient ? windowSize : { width: 0, height: 0 };
};

/**
 * Custom hook for scroll position that prevents hydration mismatches
 */
export const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0);
  const isClient = useClientOnly();

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Set initial scroll position
    setScrollY(window.scrollY);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  // Return 0 during SSR to ensure consistent initial render
  return isClient ? scrollY : 0;
};
