import React, { useEffect, useRef } from 'react';
import SectionLoader from './SectionLoader';

/**
 * Enhanced Section Loader that integrates with react-top-loading-bar
 * This component triggers the top loading bar when it mounts and completes it when unmounting
 */
const EnhancedSectionLoader = ({ 
    showTopLoader = true, 
    children,
    onLoadingStart,
    onLoadingComplete 
}) => {
    const hasTriggeredStart = useRef(false);

    useEffect(() => {
        if (showTopLoader && !hasTriggeredStart.current) {
            hasTriggeredStart.current = true;
            
            // Trigger the top loading bar
            if (typeof window !== 'undefined' && window.topLoadingBarRef?.current) {
                window.topLoadingBarRef.current.continuousStart();
            }
            
            // Call custom start handler if provided
            if (onLoadingStart) {
                onLoadingStart();
            }
        }

        return () => {
            if (showTopLoader && hasTriggeredStart.current) {
                // Complete the top loading bar when component unmounts
                if (typeof window !== 'undefined' && window.topLoadingBarRef?.current) {
                    window.topLoadingBarRef.current.complete();
                }
                
                // Call custom complete handler if provided
                if (onLoadingComplete) {
                    onLoadingComplete();
                }
            }
        };
    }, [showTopLoader, onLoadingStart, onLoadingComplete]);

    return children || <SectionLoader />
};

export default EnhancedSectionLoader;
