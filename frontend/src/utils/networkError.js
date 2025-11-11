import { toast } from "react-hot-toast";

/**
 * Detects if an error is a network connectivity issue
 * @param {Error} error - The error object to check
 * @returns {boolean} - True if it's a network error
 */
export const isNetworkError = (error) => {
    // Check for common network error indicators
    if (!error) return false;
    
    const errorMessage = error.message?.toLowerCase() || '';
    const errorCode = error.code?.toLowerCase() || '';
    
    // Common network error patterns
    const networkErrorPatterns = [
        'network error',
        'network request failed',
        'fetch error',
        'failed to fetch',
        'connection refused',
        'connection timeout',
        'connection reset',
        'no internet',
        'offline',
        'unreachable',
        'connection failed',
        'network timeout',
        'request timeout',
        'connection aborted',
        'network unreachable'
    ];
    
    // Check error message
    const hasNetworkMessage = networkErrorPatterns.some(pattern => 
        errorMessage.includes(pattern)
    );
    
    // Check error codes
    const networkErrorCodes = [
        'network_error',
        'fetch_error',
        'connection_error',
        'timeout_error',
        'enotfound',
        'econnrefused',
        'econnreset',
        'etimedout',
        'enetunreach'
    ];
    
    const hasNetworkCode = networkErrorCodes.some(code => 
        errorCode.includes(code)
    );
    
    // Check if it's a TypeError with fetch-related message (common in fetch API)
    const isFetchTypeError = error instanceof TypeError && 
        (errorMessage.includes('fetch') || errorMessage.includes('network'));
    
    // Check for specific HTTP status codes that might indicate network issues
    const networkStatusCodes = [0, 408, 502, 503, 504, 522, 523, 524];
    const hasNetworkStatus = error.status && networkStatusCodes.includes(error.status);
    
    return hasNetworkMessage || hasNetworkCode || isFetchTypeError || hasNetworkStatus;
};

/**
 * Shows a consistent network error toast message
 * @param {string} customMessage - Optional custom message to show instead of default
 */
export const showNetworkErrorToast = (customMessage = null) => {
    const defaultMessage = "Network not connected. Please check your connection and refresh the page.";
    const message = customMessage || defaultMessage;

    toast.error(message, {
        duration: 6000,
        style: {
            background: '#ef4444',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '8px'
        }
    });
};

/**
 * Shows a consistent HTTP error toast message for non-network errors
 * @param {number} status - HTTP status code
 * @param {string} customMessage - Optional custom message to show instead of default
 */
export const showHttpErrorToast = (status, customMessage = null) => {
    let defaultMessage;

    switch (status) {
        case 404:
            defaultMessage = customMessage || "The requested resource was not found.";
            break;
        case 401:
            defaultMessage = customMessage || "You are not authorized to access this resource.";
            break;
        case 403:
            defaultMessage = customMessage || "Access to this resource is forbidden.";
            break;
        case 500:
            defaultMessage = customMessage || "Internal server error. Please try again later.";
            break;
        default:
            defaultMessage = customMessage || `An error occurred (${status}). Please try again.`;
    }

    toast.error(defaultMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
            background: '#dc2626',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '8px'
        }
    });
};

/**
 * Handles API errors consistently - shows appropriate toast notifications and logs errors
 * @param {Error} error - The error to handle
 * @param {string} context - Context description for logging (e.g., "fetching hero data")
 * @param {object} options - Options for error handling
 * @param {string} options.customNetworkMessage - Optional custom network error message
 * @param {string} options.customHttpMessage - Optional custom HTTP error message
 * @param {boolean} options.showHttpToast - Whether to show toast for HTTP errors (default: true)
 * @param {boolean} options.showNetworkToast - Whether to show toast for network errors (default: true)
 */
export const handleApiError = (error, context = "API call", options = {}) => {
    const {
        customNetworkMessage = null,
        customHttpMessage = null,
        showHttpToast = true,
        showNetworkToast = true
    } = options;

    console.error(`Error ${context}:`, error);

    if (isNetworkError(error)) {
        if (showNetworkToast) {
            showNetworkErrorToast(customNetworkMessage);
        }
    } else if (error.status) {
        // Handle HTTP status errors (404, 500, etc.)
        console.warn(`HTTP ${error.status} error during ${context}:`, error.message || error);

        // Show toast notification for HTTP errors
        if (showHttpToast) {
            showHttpErrorToast(error.status, customHttpMessage);
        }
    } else {
        // For other non-network errors, just log to console
        console.warn(`Non-network error during ${context}:`, error.message || error);

        // Show a generic error toast for unknown errors
        if (showHttpToast) {
            toast.error("An unexpected error occurred. Please try again.", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: {
                    background: '#dc2626',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderRadius: '8px'
                }
            });
        }
    }
};

/**
 * Wraps fetch calls with consistent error handling
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {string} context - Context for error handling
 * @param {object} errorOptions - Options for error handling (passed to handleApiError)
 * @returns {Promise} - Promise that resolves with response or handles errors gracefully
 */
export const fetchWithErrorHandling = (url, options = {}, context = "API call", errorOptions = {}) => {
    return new Promise((resolve) => {
        // Wrap the entire operation in a try-catch to prevent any unhandled errors
        try {
            fetch(url, options)
                .then(response => {
                    if (!response.ok) {
                        // DO NOT create or throw an Error instance!
                        // Instead, just resolve with a plain error object
                        const error = {
                            message: `HTTP error! status: ${response.status}`,
                            status: response.status,
                            response,
                            handled: true,
                            suppressNextJsPanel: true,
                            isApiError: true
                        };
                        handleApiError(error, context, errorOptions);
                        setTimeout(() => {
                            resolve({ error, status: response.status });
                        }, 0);
                        return;
                    }
                    resolve(response);
                })
                .catch(error => {
                    // Mark error as handled to prevent Next.js error panel
                    const errObj = {
                        ...error,
                        handled: true,
                        suppressNextJsPanel: true,
                        isApiError: true
                    };
                    if (!errObj.status) {
                        handleApiError(errObj, context, errorOptions);
                    }
                    setTimeout(() => {
                        resolve({ error: errObj });
                    }, 0);
                });
        } catch (syncError) {
            // Handle any synchronous errors
            const errObj = {
                ...syncError,
                handled: true,
                suppressNextJsPanel: true,
                isApiError: true
            };
            handleApiError(errObj, context, errorOptions);
            setTimeout(() => {
                resolve({ error: errObj });
            }, 0);
        }
    });
};

/**
 * Utility to safely parse JSON response with error handling
 * @param {Response} response - Fetch response object
 * @param {string} context - Context for error handling
 * @returns {Promise} - Promise that resolves with parsed JSON or handles errors
 */
export const parseJsonWithErrorHandling = (response, context = "parsing response") => {
    return new Promise((resolve) => {
        response.json()
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                error.handled = true;
                // JSON parsing errors are usually not network issues - just log and return null
                console.error(`Error ${context}:`, error);
                resolve(null);
            });
    });
};

/**
 * Sets up global unhandled promise rejection handler to prevent Next.js error panels
 * Call this in your main app component or _app.js
 */
export const setupGlobalErrorHandling = () => {
    if (typeof window !== 'undefined') {
        const handleUnhandledRejection = (event) => {
            const error = event.reason;

            // More comprehensive error detection for API-related errors
            const isApiError = error?.handled ||
                error?.suppressNextJsPanel ||
                error?.isApiError ||
                error?.status ||
                error?.response?.status ||
                error?.code === 'NETWORK_ERROR' ||
                error?.message?.includes('Network Error') ||
                error?.message?.includes('Failed to fetch') ||
                error?.message?.includes('HTTP error!') ||
                error?.message?.includes('fetch') ||
                error?.message?.includes('NetworkError') ||
                error?.message?.includes('TypeError') ||
                error?.name === 'TypeError' ||
                error?.name === 'NetworkError' ||
                error?.name === 'AbortError' ||
                (error?.constructor?.name === 'Error' && error?.message?.includes('HTTP')) ||
                (typeof error === 'object' && error !== null &&
                 (error.toString().includes('HTTP') || error.toString().includes('fetch')));

            if (isApiError) {
                // Prevent Next.js error panel for all API-related errors
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                // Suppress console logging for handled errors
                if (!error?.handled) {
                    console.warn('Prevented unhandled promise rejection (API error):', error?.message || error);
                }
                return false;
            }

            // Let other unhandled rejections bubble up normally
            console.error('Unhandled promise rejection (non-API):', error);
        };

        // Also handle regular errors
        const handleError = (event) => {
            const error = event.error;

            const isApiError = error?.handled ||
                error?.suppressNextJsPanel ||
                error?.isApiError ||
                error?.status ||
                error?.response?.status ||
                error?.message?.includes('HTTP error!') ||
                error?.message?.includes('Failed to fetch') ||
                error?.message?.includes('NetworkError') ||
                error?.message?.includes('fetch');

            if (isApiError) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                if (!error?.handled) {
                    console.warn('Prevented error event (API error):', error?.message || error);
                }
                return false;
            }
        };

        // Remove existing listeners if any
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        window.removeEventListener('error', handleError);

        // Add new listeners with capture phase
        window.addEventListener('unhandledrejection', handleUnhandledRejection, true);
        window.addEventListener('error', handleError, true);

        // Also add a global catch-all for any remaining errors
        const originalOnError = window.onerror;
        window.onerror = (message, source, lineno, colno, error) => {
            if (typeof message === 'string' &&
                (message.includes('HTTP error!') ||
                 message.includes('Failed to fetch') ||
                 message.includes('NetworkError'))) {
                console.warn('Caught global error (API-related):', message);
                return true; // Prevent default error handling
            }

            // Call original handler for non-API errors
            if (originalOnError) {
                return originalOnError(message, source, lineno, colno, error);
            }
            return false;
        };

        return () => {
            window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
            window.removeEventListener('error', handleError, true);
            window.onerror = originalOnError;
        };
    }

    return () => {}; // No-op for SSR
};

/**
 * Enhanced fetch wrapper that handles errors gracefully and prevents Next.js error panels
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {string} context - Context for error handling
 * @param {object} errorOptions - Options for error handling
 * @returns {Promise} - Promise that resolves with response or null on error
 */
export const safeFetch = async (url, options = {}, context = "API call", errorOptions = {}) => {
    return new Promise((resolve) => {
        // Always resolve, never reject to prevent unhandled promise rejections
        fetchWithErrorHandling(url, options, context, errorOptions)
            .then(response => {
                resolve(response);
            })
            .catch(() => {
                // Error is already handled by fetchWithErrorHandling and marked as handled
                // Always resolve with null instead of rejecting
                resolve(null);
            });
    });
};

/**
 * Wraps any async function to prevent errors from reaching Next.js error panel
 * @param {Function} asyncFn - The async function to wrap
 * @param {string} context - Context for error logging
 * @returns {Function} - Wrapped function that catches all errors
 */
export const withErrorSuppression = (asyncFn, context = "async operation") => {
    return async (...args) => {
        try {
            return await asyncFn(...args);
        } catch (error) {
            // Mark error as handled and log it
            error.handled = true;
            console.warn(`Error in ${context}:`, error?.message || error);
            return null;
        }
    };
};

/**
 * Enhanced JSON parsing wrapper that handles errors gracefully
 * @param {Response} response - Fetch response object
 * @param {string} context - Context for error handling
 * @returns {Promise} - Promise that resolves with parsed JSON or null on error
 */
export const safeParseJson = async (response, context = "parsing response") => {
    try {
        const data = await parseJsonWithErrorHandling(response, context);
        return data;
    } catch (error) {
        // Error is already logged by parseJsonWithErrorHandling
        // Mark as handled and return null to indicate failure without throwing
        error.handled = true;
        return null;
    }
};

/**
 * Completely silent fetch that never throws errors or shows toasts
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {string} context - Context for error handling
 * @returns {Promise} - Promise that resolves with data or null on any error
 */
export const silentFetch = async (url, options = {}, context = "silent fetch") => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            console.warn(`Silent fetch failed with status ${response.status} for ${context}`);
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.warn(`Silent fetch error for ${context}:`, error?.message || error);
        return null;
    }
};

/**
 * Wraps any promise-returning function to prevent Next.js error panels
 * @param {Function} promiseFunction - Function that returns a promise
 * @param {string} context - Context for error handling
 * @param {object} errorOptions - Options for error handling
 * @returns {Function} - Wrapped function that never throws unhandled errors
 */
export const wrapApiCall = (promiseFunction, context = "API call", errorOptions = {}) => {
    return async (...args) => {
        try {
            const result = await promiseFunction(...args);
            return result;
        } catch (error) {
            // Mark error as handled to prevent Next.js error panel
            error.handled = true;
            error.suppressNextJsPanel = true;
            error.isApiError = true;

            // Handle the error with toast notifications
            handleApiError(error, context, errorOptions);

            // Return null instead of throwing
            return null;
        }
    };
};

/**
 * Creates a safe version of fetch that never causes Next.js error panels
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {string} context - Context for error handling
 * @param {object} errorOptions - Options for error handling
 * @returns {Promise} - Promise that always resolves (never rejects)
 */
export const noErrorFetch = async (url, options = {}, context = "API call", errorOptions = {}) => {
    return new Promise((resolve) => {
        // Use native fetch but wrap it to never reject
        fetch(url, options)
            .then(async (response) => {
                if (!response.ok) {
                    // Create error but don't throw it
                    const error = new Error(`HTTP error! status: ${response.status}`);
                    error.status = response.status;
                    error.response = response;
                    error.handled = true;
                    error.suppressNextJsPanel = true;
                    error.isApiError = true;

                    // Handle the error with toast notifications
                    handleApiError(error, context, errorOptions);

                    // Resolve with error info instead of rejecting
                    resolve({
                        success: false,
                        error: error,
                        status: response.status,
                        response: null
                    });
                    return;
                }

                try {
                    const data = await response.json();
                    resolve({
                        success: true,
                        data: data,
                        status: response.status,
                        response: response
                    });
                } catch (parseError) {
                    parseError.handled = true;
                    parseError.suppressNextJsPanel = true;
                    parseError.isApiError = true;

                    resolve({
                        success: false,
                        error: parseError,
                        status: response.status,
                        response: response
                    });
                }
            })
            .catch((networkError) => {
                // Handle network errors
                networkError.handled = true;
                networkError.suppressNextJsPanel = true;
                networkError.isApiError = true;

                handleApiError(networkError, context, errorOptions);

                resolve({
                    success: false,
                    error: networkError,
                    status: null,
                    response: null
                });
            });
    });
};
