import store from '../redux/store';
import { navbarApi } from '../api/navbar';
import { homeApi } from '../api/home';

/**
 * Cache Manager for preloading critical data
 */
export const preloadCriticalData = () => {
    if (typeof window === 'undefined') return;
    
    const { dispatch } = store;
    
    // Preload critical API data
    const preloadPromises = [
        // Preload navbar data (used across all pages)
        dispatch(navbarApi.util.prefetch('getNavbarData', undefined, { force: false })),
        
        // Preload home page data
        dispatch(homeApi.util.prefetch('getLandingPageData', undefined, { force: false })),
        
        // Preload categories data
        dispatch(homeApi.util.prefetch('getCategoryAndSubcategory', undefined, { force: false })),
    ];
    
    // Execute preloading in background
    Promise.allSettled(preloadPromises).then((results) => {
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        
        if (process.env.NODE_ENV === 'development') {
            console.log(`Cache preloading: ${successful} successful, ${failed} failed`);
        }
    });
};

/**
 * Clear all cached data
 */
export const clearAllCache = () => {
    if (typeof window === 'undefined') return;
    
    const { dispatch } = store;
    
    // Clear all RTK Query cache
    dispatch(navbarApi.util.resetApiState());
    dispatch(homeApi.util.resetApiState());
    
    // Clear localStorage cache
    localStorage.removeItem('rtk-query-cache');
    
    if (process.env.NODE_ENV === 'development') {
        console.log('All cache cleared');
    }
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
    if (typeof window === 'undefined') return null;
    
    const { getState } = store;
    const state = getState();
    
    const apiState = state.api;
    const cacheEntries = Object.keys(apiState).length;
    
    return {
        cacheEntries,
        timestamp: new Date().toISOString(),
    };
};
