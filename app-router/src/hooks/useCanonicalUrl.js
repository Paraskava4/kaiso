import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hook to manage canonical URL tags dynamically
 * This ensures the canonical URL always matches what's shown in the address bar
 * Works the same way as meta URL tags for SEO consistency
 */
export const useCanonicalUrl = (customUrl = null) => {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const updateCanonicalLink = (url) => {
            if (!url) return;
            
            let canonical = document.querySelector('link[rel="canonical"]');
            if (!canonical) {
                canonical = document.createElement('link');
                canonical.setAttribute('rel', 'canonical');
                document.head.appendChild(canonical);
            }
            canonical.setAttribute('href', url);
        };

        // Use custom URL if provided, otherwise use current router URL
        const canonicalUrl = customUrl || (typeof window !== 'undefined' ? window.location.href : pathname || '/');
        
        // Update canonical link
        updateCanonicalLink(canonicalUrl);

        // Also update og:url and twitter:url for consistency
        const updateMetaTag = (property, content) => {
            if (!content) return;
            
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        const updateNameTag = (name, content) => {
            if (!content) return;
            
            let meta = document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        // Update URL-related meta tags
        updateMetaTag('og:url', canonicalUrl);
        updateNameTag('twitter:url', canonicalUrl);

    }, [customUrl, pathname]);
};

/**
 * Hook to get the current canonical URL
 * Useful for components that need to know the current canonical URL
 */
export const useCurrentCanonicalUrl = () => {
    const pathname = usePathname();
    if (typeof window === 'undefined') {
        return pathname || '/';
    }
    return window.location.href;
}; 