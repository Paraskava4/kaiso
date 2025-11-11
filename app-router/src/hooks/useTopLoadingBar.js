import { useRef, useCallback } from 'react';

/**
 * Custom hook to control the top loading bar programmatically
 * This allows components to trigger the loading bar independently of route changes
 */
export const useTopLoadingBar = () => {
    const loadingBarRef = useRef(null);

    const startLoading = useCallback(() => {
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
    }, []);

    const completeLoading = useCallback(() => {
        if (loadingBarRef.current) {
            loadingBarRef.current.complete();
        }
    }, []);

    const setProgress = useCallback((progress) => {
        if (loadingBarRef.current) {
            loadingBarRef.current.staticStart();
            loadingBarRef.current.setProgress(progress);
        }
    }, []);

    return {
        loadingBarRef,
        startLoading,
        completeLoading,
        setProgress
    };
};
