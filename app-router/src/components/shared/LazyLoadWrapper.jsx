import React, { Suspense } from 'react';
import EnhancedSectionLoader from './EnhancedSectionLoader';

/**
 * Higher-order component that wraps lazy-loaded components with enhanced loading
 * This provides a consistent loading experience across all lazy-loaded components
 */
const LazyLoadWrapper = ({ 
    children, 
    fallback,
    showTopLoader = true,
    className = "",
    onLoadingStart,
    onLoadingComplete 
}) => {
    const defaultFallback = (
        <EnhancedSectionLoader 
            showTopLoader={showTopLoader}
            onLoadingStart={onLoadingStart}
            onLoadingComplete={onLoadingComplete}
        />
    );

    return (
        <div className={className}>
            <Suspense fallback={fallback || defaultFallback}>
                {children}
            </Suspense>
        </div>
    );
};

/**
 * Convenience function to create lazy-loaded components with top loading bar integration
 */
export const createLazyComponent = (importFunction, options = {}) => {
    const LazyComponent = React.lazy(importFunction);
    
    return (props) => (
        <LazyLoadWrapper {...options}>
            <LazyComponent {...props} />
        </LazyLoadWrapper>
    );
};

export default LazyLoadWrapper;
