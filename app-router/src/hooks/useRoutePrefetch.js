import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * Custom hook for route prefetching
 * Prefetches routes when user hovers over navigation items
 */
export const useRoutePrefetch = () => {
    const router = useRouter();

    const prefetchRoute = useCallback(
        (href) => {
            if (typeof href === "string" && href.startsWith("/")) {
                // Prefetch the route
                router.prefetch(href);
            }
        },
        [router]
    );

    const prefetchOnHover = useCallback(
        (href) => {
            return {
                onMouseEnter: () => prefetchRoute(href),
                onFocus: () => prefetchRoute(href),
            };
        },
        [prefetchRoute]
    );

    return {
        prefetchRoute,
        prefetchOnHover,
    };
};

/**
 * Hook for prefetching multiple routes at once
 * Useful for prefetching related pages
 */
export const useBatchPrefetch = () => {
    const router = useRouter();

    const prefetchRoutes = useCallback(
        (routes) => {
            if (Array.isArray(routes)) {
                routes.forEach((route) => {
                    if (typeof route === "string" && route.startsWith("/")) {
                        router.prefetch(route);
                    }
                });
            }
        },
        [router]
    );

    return { prefetchRoutes };
};
