import { BASE_URL } from "../../config";

/**
 * Enhanced getStaticProps wrapper with robust error handling and caching
 */
export const getStaticPropsWithFallback = async (apiEndpoint, fallbackData, options = {}) => {
    try {
        // Check if BASE_URL is available
        if (!BASE_URL) {
            throw new Error('BASE_URL not configured');
        }
        
        const res = await fetch(`${BASE_URL}${apiEndpoint}`, {
            headers: {
                'Cache-Control': 'public, max-age=300', // 5 minutes cache
                ...options.headers,
            },
            ...options,
        });
        
        // Check if response is ok and content type is JSON
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
            throw new Error('Invalid response from API');
        }
        
        const data = await res.json();
        
        return {
            props: {
                ...data,
                ...fallbackData,
            },
            // Removed revalidate for static export compatibility
        };
    } catch (error) {
        console.warn(`Failed to fetch data from ${apiEndpoint}:`, error.message);
        
        // Return fallback data if API fails
        return {
            props: {
                ...fallbackData,
            },
        };
    }
};

/**
 * Get SEO data with fallback for pages
 */
export const getSEODataWithFallback = async (pageName, fallbackSEO = {}) => {
    const defaultSEO = {
        seoTitle: `${pageName} - Kaiso Research`,
        metaDescription: `Professional ${pageName.toLowerCase()} services from Kaiso Research.`,
        ogTitle: `${pageName} - Kaiso Research`,
        ogDescription: `Professional ${pageName.toLowerCase()} services from Kaiso Research.`,
        ...fallbackSEO,
    };
    
    return getStaticPropsWithFallback('/web/getNavbar', { seoData: defaultSEO });
};

