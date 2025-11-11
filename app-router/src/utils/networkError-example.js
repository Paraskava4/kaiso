/**
 * Example usage of the updated networkError.js utilities
 * This file demonstrates how to use the improved error handling functions
 */

import { 
    fetchWithErrorHandling, 
    parseJsonWithErrorHandling,
    safeFetch,
    safeParseJson,
    handleApiError,
    showNetworkErrorToast,
    showHttpErrorToast,
    setupGlobalErrorHandling
} from './networkError';

// Example 1: Basic usage with fetchWithErrorHandling (shows toasts by default)
export const fetchDataWithToasts = async (url) => {
    const response = await fetchWithErrorHandling(url, {}, "fetching example data");
    if (response?.error) return null;
    const data = await parseJsonWithErrorHandling(response, "parsing example data");
    if (!data) return null;
    return data;
};

// Example 2: Fetch without showing HTTP error toasts (only network errors)
export const fetchDataSilently = async (url) => {
    const response = await fetchWithErrorHandling(
        url, 
        {}, 
        "fetching data silently",
        { showHttpToast: false } // Only show network error toasts
    );
    if (response?.error) return null;
    const data = await parseJsonWithErrorHandling(response, "parsing data silently");
    if (!data) return null;
    return data;
};

// Example 3: Using safeFetch for completely silent error handling
export const fetchDataCompleteSilent = async (url) => {
    const response = await safeFetch(url, {}, "fetching data completely silent");
    if (!response) {
        // Error already handled, just return null
        return null;
    }
    
    const data = await safeParseJson(response, "parsing data completely silent");
    return data; // Will be null if parsing failed
};

// Example 4: Custom error handling with specific messages
export const fetchDataWithCustomMessages = async (url) => {
    const response = await fetchWithErrorHandling(
        url, 
        {}, 
        "fetching custom data",
        { 
            customNetworkMessage: "Unable to connect to our servers. Please check your internet connection.",
            customHttpMessage: "The data you requested is currently unavailable. Please try again later."
        }
    );
    if (response?.error) return null;
    const data = await parseJsonWithErrorHandling(response, "parsing custom data");
    if (!data) return null;
    return data;
};

// Example 5: Manual error handling
export const manualErrorHandling = async (url) => {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            const error = new Error(`HTTP error! status: ${response.status}`);
            error.status = response.status;
            
            // Manually handle the error with custom options
            handleApiError(error, "manual fetch operation", {
                customHttpMessage: "Failed to load data from server",
                showNetworkErrorToast: true,
                showHttpErrorToast: true
            });
            
            return null;
        }
        
        return await response.json();
    } catch (error) {
        // Handle network errors manually
        handleApiError(error, "manual fetch operation", {
            customNetworkMessage: "Connection failed. Please try again."
        });
        return null;
    }
};

// Example 6: Show specific error toasts manually
export const showSpecificErrors = () => {
    // Show network error toast
    showNetworkErrorToast("Custom network error message");
    
    // Show HTTP error toasts for different status codes
    showHttpErrorToast(404, "The page you're looking for doesn't exist");
    showHttpErrorToast(500, "Server is experiencing issues");
    showHttpErrorToast(401, "Please log in to access this content");
};

// Example 7: Component-level error handling setup
export const setupComponentErrorHandling = () => {
    // This would typically be called in a useEffect in your main component
    const cleanup = setupGlobalErrorHandling();
    
    // Return cleanup function to be called in useEffect cleanup
    return cleanup;
};

// Example 8: React component usage pattern
/*
import React, { useEffect, useState } from 'react';
import { fetchDataWithToasts } from './networkError-example';

const ExampleComponent = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const result = await fetchDataWithToasts('/api/example');
            setData(result);
            setLoading(false);
        };

        loadData();
    }, []);

    if (loading) return <div>Loading...</div>
    if (!data) return <div>No data available</div>

    return <div>{JSON.stringify(data)}</div>
};
*/

// Example 9: Error handling in form submissions
export const submitFormWithErrorHandling = async (formData, url) => {
    const response = await fetchWithErrorHandling(
        url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        },
        "submitting form",
        {
            customNetworkMessage: "Unable to submit form. Please check your connection and try again.",
            customHttpMessage: "Form submission failed. Please check your data and try again."
        }
    );
    if (response?.error) return null;
    const result = await parseJsonWithErrorHandling(response, "parsing form submission response");
    if (!result) return null;
    return result;
};

// Example 10: Batch API calls with error handling
export const fetchMultipleEndpoints = async (urls) => {
    const results = await Promise.allSettled(
        urls.map(url => fetchDataSilently(url))
    );

    const successfulResults = results
        .filter(result => result.status === 'fulfilled' && result.value !== null)
        .map(result => result.value);

    const failedCount = results.length - successfulResults.length;
    
    if (failedCount > 0) {
        console.warn(`${failedCount} out of ${urls.length} API calls failed`);
    }

    return successfulResults;
};
