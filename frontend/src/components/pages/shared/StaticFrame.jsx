"use client";

import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../../config.js";
import { fetchWithErrorHandling, parseJsonWithErrorHandling } from "../../../utils/networkError.js";

const NavigationFrame = ({ activeIndex = 0, onNavigate, totalItems }) => {
    const [frameItems, setFrameItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFrameData = async () => {
            try {
                // Use fetchWithErrorHandling for robust fetching
                const response = await fetchWithErrorHandling(`${BASE_URL}/web/landingPage`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                // Parse response using parseJsonWithErrorHandling
                const apiResponse = await parseJsonWithErrorHandling(response);

                if (apiResponse?.data?.heroSections && Array.isArray(apiResponse.data.heroSections)) {
                    // Extract subtitle from each hero section for navigation items
                    const navigationItems = apiResponse.data.heroSections.map((item) => item.title || "Untitled");
                    setFrameItems(navigationItems);
                } else {
                    console.warn("API response does not contain expected 'data.heroSections' array:", apiResponse);
                    // Fallback to static items if API fails
                    setFrameItems(["Therapeutics", "Healthcare", "Medical Devices and Supplies", "Pharmaceuticals"]);
                }
            } catch (error) {
                console.error("Error fetching navigation frame data:", error.message);
                // Fallback to static items if API fails
                setFrameItems(["Therapeutics", "Healthcare", "Medical Devices and Supplies", "Pharmaceuticals"]);
            } finally {
                setLoading(false);
            }
        };

        fetchFrameData();
    }, []);

    // Show loading state
    if (loading) {
        return (
            <div className="navigation-frame">
                <div className="navigation-item">
                    <span className="navigation-text">Loading...</span>
                </div>
            </div>
        );
    }

    // Use totalItems prop to limit displayed items if provided
    const displayItems = totalItems ? frameItems.slice(0, totalItems) : frameItems;

    return (
        <div className="navigation-frame">
            {displayItems.map((item, index) => {
                const isActive = activeIndex === index;
                return (
                    <div key={index} onClick={() => onNavigate && onNavigate(index)} className={`navigation-item ${isActive ? "active" : ""}`}>
                        <span className="navigation-text">{item}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default NavigationFrame;
