"use client";
import React, { useRef, useState, useEffect } from "react";
import StrategicAnalysisNewsCard from "./StrategicAnalysisNewsCard";

const StrategicAnalysisNewsList = () => {
    // Refs and state for horizontal scrolling
    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Strategic Analysis News data with content for each news card
    const strategicAnalysisNewsData = [
        {
            image: "/images/StrategicAnalysisNews1.webp",
            date: "Mar 01, 2025",
            title: "Beyond the blueprint crafting your unique success structure",
            alt: "Strategic Analysis 1",
        },
        {
            image: "/images/StrategicAnalysisNews2.webp",
            date: "Mar 01, 2025",
            title: "Beyond the blueprint crafting your unique success structure",
            alt: "Strategic Analysis 2",
        },
        {
            image: "/images/StrategicAnalysisNews3.webp",
            date: "Mar 01, 2025",
            title: "Beyond the blueprint crafting your unique success structure",
            alt: "Strategic Analysis 3",
        },
    ];

    // Mouse down event - start dragging
    const handleMouseDown = (e) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
        scrollContainerRef.current.style.cursor = "grabbing";
    };

    // Mouse leave event - stop dragging
    const handleMouseLeave = () => {
        setIsDragging(false);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.cursor = "grab";
        }
    };

    // Mouse up event - stop dragging
    const handleMouseUp = () => {
        setIsDragging(false);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.cursor = "grab";
        }
    };

    // Mouse move event - handle dragging
    const handleMouseMove = (e) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    // Touch events for mobile support
    const handleTouchStart = (e) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!isDragging || !scrollContainerRef.current) return;
        const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Set initial cursor style
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.cursor = "grab";
        }
    }, []);

    return (
        <div
            ref={scrollContainerRef}
            className="strategic-analysis-news-list-container strategic-analysis-news-scroll-container"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {strategicAnalysisNewsData.map((news, index) => (
                <StrategicAnalysisNewsCard key={index} image={news.image} date={news.date} title={news.title} alt={news.alt} />
            ))}
        </div>
    );
};

export default StrategicAnalysisNewsList;
