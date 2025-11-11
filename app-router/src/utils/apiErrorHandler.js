import { toast } from "react-hot-toast";

/**
 * Handles API responses and prevents Next.js error panels
 * @param {Object} response - API response object
 * @param {string} successMessage - Message to show on success (optional)
 * @param {string} errorMessage - Custom error message (optional)
 * @returns {Object} - Processed response with success flag
 */
export const handleApiResponse = (response, successMessage = null, errorMessage = null) => {
    try {
        // Check if response indicates success
        if (response.success && !response.error) {
            if (successMessage) {
                toast.success(successMessage);
            }
            return {
                success: true,
                data: response.data
            };
        } else {
            // Handle error response
            const message = errorMessage || response.message || "An error occurred";
            toast.error(message);
            console.error('API Error:', response);
            return {
                success: false,
                error: true,
                message: message
            };
        }
    } catch (error) {
        // Handle unexpected errors
        const message = errorMessage || "An unexpected error occurred";
        toast.error(message);
        console.error('Unexpected error in handleApiResponse:', error);
        return {
            success: false,
            error: true,
            message: message
        };
    }
};

/**
 * Wraps async operations to prevent Next.js error panels
 * @param {Function} asyncOperation - The async function to execute
 * @param {string} errorMessage - Custom error message for failures
 * @returns {Promise} - Promise that resolves with handled response
 */
export const safeAsyncOperation = async (asyncOperation, errorMessage = "Operation failed") => {
    try {
        const result = await asyncOperation();
        return result;
    } catch (error) {
        console.error('Safe async operation error:', error);
        toast.error(errorMessage);
        return {
            success: false,
            error: true,
            message: errorMessage
        };
    }
};

/**
 * Global error handler setup for preventing Next.js error panels
 */
export const setupGlobalErrorHandling = () => {
    const handleUnhandledRejection = (event) => {
        // Prevent Next.js error panel for API-related errors
        if (event.reason?.response || 
            event.reason?.code === 'NETWORK_ERROR' ||
            event.reason?.message?.includes('Network Error') ||
            event.reason?.message?.includes('Failed to fetch') ||
            event.reason?.config?.url) {
            event.preventDefault();
            console.error('Global: Prevented unhandled promise rejection:', event.reason);
            
            // Show toast notification instead
            const message = event.reason?.response?.data?.message || 
                           event.reason?.message || 
                           'A network error occurred';
            toast.error(message);
        }
    };

    const handleError = (event) => {
        // Prevent Next.js error panel for runtime errors
        if (event.error?.message?.includes('Network Error') ||
            event.error?.message?.includes('Failed to fetch') ||
            event.error?.message?.includes('API')) {
            event.preventDefault();
            console.error('Global: Prevented runtime error:', event.error);
            toast.error(event.error?.message || 'An error occurred');
        }
    };

    // Remove existing listeners to avoid duplicates
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    window.removeEventListener('error', handleError);
    
    // Add new listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Return cleanup function
    return () => {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        window.removeEventListener('error', handleError);
    };
};
