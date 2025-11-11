/**
 * Route Prefetching Utility
 * Intelligently prefetches common routes for better navigation performance
 */

import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';

// Common route patterns to prefetch
const COMMON_ROUTES = [
    '/report-store',
    '/blog',
    '/report-store/technology',
    '/report-store/healthcare',
    '/report-store/finance',
    '/blog/industry-insights',
    '/blog/market-analysis',
];

// Subcategory routes to prefetch
const SUBCATEGORY_ROUTES = [
    '/report-store/technology/ai-ml',
    '/report-store/technology/blockchain',
    '/report-store/healthcare/pharmaceuticals',
    '/report-store/healthcare/medical-devices',
    '/blog/industry-insights/trends',
    '/blog/market-analysis/forecasts',
];

/**
 * Hook for intelligent route prefetching
 * @param {Object} options - Configuration options
 * @param {boolean} options.enablePrefetching - Enable/disable prefetching
 * @param {number} options.delay - Delay before prefetching (ms)
 * @param {string[]} options.customRoutes - Custom routes to prefetch
 */
export const useRoutePrefetching = (options = {}) => {
    const router = useRouter();
    const {
        enablePrefetching = true,
        delay = 2000,
        customRoutes = []
    } = options;

    const prefetchRoute = useCallback((route) => {
        if (router && route) {
            router.prefetch(route);
        }
    }, [router]);

    const prefetchRoutes = useCallback((routes) => {
        if (!enablePrefetching || !router) return;
        
        routes.forEach((route, index) => {
            // Stagger prefetching to avoid overwhelming the server
            setTimeout(() => {
                prefetchRoute(route);
            }, index * 100);
        });
    }, [enablePrefetching, router, prefetchRoute]);

    useEffect(() => {
        if (!enablePrefetching || !router) return;

        const timer = setTimeout(() => {
            // Prefetch common routes
            prefetchRoutes(COMMON_ROUTES);
            
            // Prefetch custom routes if provided
            if (customRoutes.length > 0) {
                prefetchRoutes(customRoutes);
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [enablePrefetching, router, delay, customRoutes, prefetchRoutes]);

    return {
        prefetchRoute,
        prefetchRoutes,
        prefetchCommonRoutes: () => prefetchRoutes(COMMON_ROUTES),
        prefetchSubcategoryRoutes: () => prefetchRoutes(SUBCATEGORY_ROUTES),
    };
};

/**
 * Prefetch routes based on user behavior
 * @param {string} currentPath - Current page path
 * @param {Object} router - Next.js router instance
 */
export const prefetchRelatedRoutes = (currentPath, router) => {
    if (!router || !currentPath) return;

    const pathSegments = currentPath.split('/').filter(Boolean);
    
    // Prefetch parent routes
    if (pathSegments.length > 1) {
        const parentRoute = `/${pathSegments[0]}`;
        router.prefetch(parentRoute);
    }

    // Prefetch sibling routes for subcategories
    if (pathSegments.length === 3) {
        const baseRoute = `/${pathSegments[0]}/${pathSegments[1]}`;
        SUBCATEGORY_ROUTES
            .filter(route => route.startsWith(baseRoute))
            .forEach(route => {
                setTimeout(() => router.prefetch(route), Math.random() * 1000);
            });
    }
};

/**
 * Prefetch routes on hover for better UX
 * @param {string} href - Route to prefetch
 * @param {Object} router - Next.js router instance
 */
export const prefetchOnHover = (href, router) => {
    if (!router || !href) return;

    const prefetch = () => router.prefetch(href);
    
    return {
        onMouseEnter: prefetch,
        onFocus: prefetch,
    };
};

/**
 * Smart prefetching based on viewport intersection
 * @param {string} route - Route to prefetch
 * @param {Object} router - Next.js router instance
 * @param {Object} options - Intersection observer options
 */
export const useIntersectionPrefetching = (route, router, options = {}) => {
    const {
        threshold = 0.1,
        rootMargin = '50px'
    } = options;

    useEffect(() => {
        if (!router || !route) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        router.prefetch(route);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold, rootMargin }
        );

        // Observe the document body for intersection
        observer.observe(document.body);

        return () => observer.disconnect();
    }, [router, route, threshold, rootMargin]);
};

export default {
    useRoutePrefetching,
    prefetchRelatedRoutes,
    prefetchOnHover,
    useIntersectionPrefetching,
    COMMON_ROUTES,
    SUBCATEGORY_ROUTES,
};
