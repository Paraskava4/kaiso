/**
 * Test page to verify that the networkError.js utilities work correctly
 * and prevent Next.js error panels from appearing
 */

import React, { useState } from 'react';
import { 
    fetchWithErrorHandling, 
    parseJsonWithErrorHandling,
    safeFetch,
    safeParseJson,
    showNetworkErrorToast,
    showHttpErrorToast
} from '../utils/networkError';

const TestErrorHandling = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const addResult = (test, result, error = null) => {
        setResults(prev => [...prev, {
            test,
            result,
            error: error?.message || error,
            timestamp: new Date().toLocaleTimeString()
        }]);
    };

    // Test 1: 404 Error with toast
    const test404WithToast = async () => {
        setLoading(true);
        const response = await fetchWithErrorHandling(
            'https://jsonplaceholder.typicode.com/posts/999999',
            {},
            "testing 404 error with toast"
        );
        if (response?.error) {
            addResult("404 with toast", "Error caught (expected)", response.error);
            setLoading(false);
            return;
        }
        const data = await parseJsonWithErrorHandling(response, "parsing 404 response");
        if (!data) {
            addResult("404 with toast", "Error caught (expected)", "No data returned");
        } else {
            addResult("404 with toast", "Success (unexpected)", null);
        }
        setLoading(false);
    };

    // Test 2: 404 Error without toast
    const test404WithoutToast = async () => {
        setLoading(true);
        const response = await fetchWithErrorHandling(
            'https://jsonplaceholder.typicode.com/posts/999999',
            {},
            "testing 404 error without toast",
            { showHttpToast: false }
        );
        if (response?.error) {
            addResult("404 without toast", "Error caught (expected)", response.error);
            setLoading(false);
            return;
        }
        const data = await parseJsonWithErrorHandling(response, "parsing 404 response");
        if (!data) {
            addResult("404 without toast", "Error caught (expected)", "No data returned");
        } else {
            addResult("404 without toast", "Success (unexpected)", null);
        }
        setLoading(false);
    };

    // Test 3: Network error simulation
    const testNetworkError = async () => {
        setLoading(true);
        const response = await fetchWithErrorHandling(
            'https://nonexistent-domain-12345.com/api/test',
            {},
            "testing network error"
        );
        if (response?.error) {
            addResult("Network error", "Error caught (expected)", response.error);
            setLoading(false);
            return;
        }
        const data = await parseJsonWithErrorHandling(response, "parsing network error response");
        if (!data) {
            addResult("Network error", "Error caught (expected)", "No data returned");
        } else {
            addResult("Network error", "Success (unexpected)", null);
        }
        setLoading(false);
    };

    // Test 4: Successful request
    const testSuccessfulRequest = async () => {
        setLoading(true);
        const response = await fetchWithErrorHandling(
            'https://jsonplaceholder.typicode.com/posts/1',
            {},
            "testing successful request"
        );
        if (response?.error) {
            addResult("Successful request", "Error (unexpected)", response.error);
            setLoading(false);
            return;
        }
        const data = await parseJsonWithErrorHandling(response, "parsing successful response");
        if (!data) {
            addResult("Successful request", "Error (unexpected)", "No data returned");
        } else {
            addResult("Successful request", `Success: ${data.title}`, null);
        }
        setLoading(false);
    };

    // Test 5: Safe fetch with 404
    const testSafeFetch404 = async () => {
        setLoading(true);
        const response = await safeFetch(
            'https://jsonplaceholder.typicode.com/posts/999999',
            {},
            "testing safe fetch 404"
        );
        
        if (response?.error) {
            addResult("Safe fetch 404", "Error caught (expected)", response.error);
        } else if (!response) {
            addResult("Safe fetch 404", "Returned null (expected)", null);
        } else {
            const data = await safeParseJson(response, "parsing safe fetch response");
            if (!data) {
                addResult("Safe fetch 404", "Error caught (expected)", "No data returned");
            } else {
                addResult("Safe fetch 404", `Success (unexpected): ${data}`, null);
            }
        }
        setLoading(false);
    };

    // Test 6: Manual toast triggers
    const testManualToasts = () => {
        showNetworkErrorToast("This is a test network error message");
        setTimeout(() => {
            showHttpErrorToast(404, "This is a test 404 error message");
        }, 1000);
        setTimeout(() => {
            showHttpErrorToast(500, "This is a test 500 error message");
        }, 2000);
        addResult("Manual toasts", "Triggered network, 404, and 500 toasts", null);
    };

    const clearResults = () => {
        setResults([]);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Network Error Handling Test Page</h1>
            <p>This page tests the networkError.js utilities to ensure they work correctly and prevent Next.js error panels.</p>
            
            <div style={{ marginBottom: '20px' }}>
                <h2>Test Controls</h2>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <button onClick={test404WithToast} disabled={loading}>
                        Test 404 (with toast)
                    </button>
                    <button onClick={test404WithoutToast} disabled={loading}>
                        Test 404 (no toast)
                    </button>
                    <button onClick={testNetworkError} disabled={loading}>
                        Test Network Error
                    </button>
                    <button onClick={testSuccessfulRequest} disabled={loading}>
                        Test Success
                    </button>
                    <button onClick={testSafeFetch404} disabled={loading}>
                        Test Safe Fetch 404
                    </button>
                    <button onClick={testManualToasts} disabled={loading}>
                        Test Manual Toasts
                    </button>
                </div>
                <button onClick={clearResults} style={{ backgroundColor: '#dc2626', color: 'white' }}>
                    Clear Results
                </button>
            </div>

            {loading && <p>Loading...</p>}

            <div>
                <h2>Test Results</h2>
                {results.length === 0 ? (
                    <p>No tests run yet. Click the buttons above to test error handling.</p>
                ) : (
                    <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
                        {results.map((result, index) => (
                            <div key={index} style={{ 
                                marginBottom: '10px', 
                                padding: '10px', 
                                backgroundColor: result.error ? '#fee' : '#efe',
                                borderRadius: '4px'
                            }}>
                                <strong>{result.test}</strong> - {result.timestamp}<br/>
                                Result: {result.result}<br/>
                                {result.error && <span style={{ color: '#dc2626' }}>Error: {result.error}</span>}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '4px' }}>
                <h3>Expected Behavior:</h3>
                <ul>
                    <li><strong>404 with toast:</strong> Should show a toast notification and catch the error</li>
                    <li><strong>404 without toast:</strong> Should NOT show a toast but still catch the error</li>
                    <li><strong>Network error:</strong> Should show a network error toast and catch the error</li>
                    <li><strong>Success:</strong> Should complete successfully and show the post title</li>
                    <li><strong>Safe fetch 404:</strong> Should return null without throwing errors</li>
                    <li><strong>Manual toasts:</strong> Should show 3 different toast messages</li>
                </ul>
                <p><strong>Important:</strong> No Next.js error panels should appear during any of these tests!</p>
            </div>
        </div>
    );
};

export default TestErrorHandling;
