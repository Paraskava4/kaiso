import { useState, useEffect } from 'react';
import { BASE_URL } from '../../config';

/**
 * Custom hook to fetch and manage button names from API
 * @returns {Object} { buttonNames, loading, error }
 */
export const useButtonNames = () => {
    const [buttonNames, setButtonNames] = useState({
        buyButton: "Buy Now",
        requestButton: "Request a sample", 
        inquiryButton: "Inquiry before Buy"
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchButtonNames = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!BASE_URL) {
                    setError("BASE_URL is not configured");
                    setLoading(false);
                    return;
                }

                
                const response = await fetch(`${BASE_URL}/report/getButtonWithoutAuth`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    

                    // Handle different response structures
                    let buttonData = {};
                    if (data && typeof data === "object") {
                        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                            // API returns data as an array, get the first element
                            buttonData = data.data[0];
                        } else if (data.data && typeof data.data === "object") {
                            // If data.data is an object directly
                            buttonData = data.data;
                        } else if (data.buyButton || data.requestButton || data.inquiryButton) {
                            // If button data is at root level
                            buttonData = data;
                        }
                    }


                    // Update button names with API data, fallback to defaults
                    const newButtonNames = {
                        buyButton: buttonData.buyButton || "Buy Now",
                        requestButton: buttonData.requestButton || "Request a sample",
                        inquiryButton: buttonData.inquiryButton || "Inquiry before Buy"
                    };

                    setButtonNames(newButtonNames);
                } else {
                    setError("Failed to fetch button names");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchButtonNames();
    }, []);

    return { buttonNames, loading, error };
};

export default useButtonNames;
