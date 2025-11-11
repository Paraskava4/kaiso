import { useEffect } from 'react';

export const useDynamicMetaTags = (metaData) => {
    useEffect(() => {
        if (!metaData || typeof window === 'undefined') {
            return;
        }

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

        const updateItemProp = (itemprop, content) => {
            if (!content) return;
            
            let meta = document.querySelector(`meta[itemprop="${itemprop}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('itemprop', itemprop);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

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

        // Update canonical link tag - this will show the current URL in the address bar
        updateCanonicalLink(metaData.pageUrl);

        // Update Open Graph tags
        updateMetaTag('og:url', metaData.pageUrl);
        updateMetaTag('og:title', metaData.seoTitle);
        updateMetaTag('og:description', metaData.metaDescription);

        // Update Twitter tags
        updateNameTag('twitter:url', metaData.pageUrl);
        updateNameTag('twitter:title', metaData.seoTitle);
        updateNameTag('twitter:description', metaData.metaDescription);

        // Update itemProp tags
        updateItemProp('name', metaData.seoTitle);
        updateItemProp('description', metaData.metaDescription);

    }, [metaData]);
};
