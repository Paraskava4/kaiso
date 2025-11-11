import React, { useState } from "react";
import { useTopLoadingBar } from "@/hooks/useTopLoadingBar";

/**
 * Example component showing how to use the top loading bar with API calls
 * and manual loading states
 */
const LoadingBarExample = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { startLoading, completeLoading, setProgress } = useTopLoadingBar();

    // Example: Loading data with progress
    const fetchDataWithProgress = async () => {
        setLoading(true);
        startLoading();

        try {
            // Simulate API call with progress updates
            setProgress(25);
            await new Promise((resolve) => setTimeout(resolve, 500));

            setProgress(50);
            await new Promise((resolve) => setTimeout(resolve, 500));

            setProgress(75);
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Simulate successful data fetch
            setData({ message: "Data loaded successfully!" });
            setProgress(100);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
            completeLoading();
        }
    };

    // Example: Simple continuous loading
    const fetchDataContinuous = async () => {
        setLoading(true);
        startLoading();

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setData({ message: "Data loaded with continuous loading!" });
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
            completeLoading();
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Loading Bar Examples</h2>

            <div className="space-y-4">
                <button
                    onClick={fetchDataWithProgress}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Loading with Progress..." : "Load Data with Progress"}
                </button>

                <button
                    onClick={fetchDataContinuous}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? "Loading..." : "Load Data (Continuous)"}
                </button>

                {data && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-green-800">{data.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoadingBarExample;
