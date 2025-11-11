import { useCanonicalUrl, useCurrentCanonicalUrl } from '@/hooks/useCanonicalUrl';

/**
 * CanonicalUrlManager Component
 * 
 * This component automatically manages canonical URLs for your pages.
 * It ensures that the canonical URL always matches what's shown in the address bar.
 * 
 * Usage:
 * 1. Import and use this component in any page
 * 2. Or use the useCanonicalUrl hook directly
 * 
 * Example:
 * <CanonicalUrlManager />
 * 
 * Or with custom URL:
 * <CanonicalUrlManager customUrl="https://example.com/custom-page" />
 */
const CanonicalUrlManager = ({ customUrl = null, children = null }) => {
    // Use the canonical URL hook to automatically update canonical links
    useCanonicalUrl(customUrl);
    
    // Get current canonical URL for debugging or display purposes
    const currentCanonicalUrl = useCurrentCanonicalUrl();
    
    // Log canonical URL updates in development
    if (process.env.NODE_ENV === 'development') {
        console.log('Canonical URL updated:', currentCanonicalUrl);
    }
    
    return children;
};

export default CanonicalUrlManager;

/**
 * Higher-Order Component for automatic canonical URL management
 * 
 * Usage:
 * export default withCanonicalUrl(YourPageComponent);
 */
export const withCanonicalUrl = (WrappedComponent, customUrl = null) => {
    return function WithCanonicalUrlComponent(props) {
        useCanonicalUrl(customUrl);
        return <WrappedComponent {...props} />
    };
};

/**
 * Hook for components that need to know the current canonical URL
 * 
 * Usage:
 * const canonicalUrl = useCurrentCanonicalUrl();
 */
export { useCurrentCanonicalUrl }; 