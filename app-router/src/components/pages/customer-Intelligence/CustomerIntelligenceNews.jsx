"use client";
import { useRef, useState } from "react";
import NewsHeader from "../home/NewsHeader";
import NewsCard from "../home/NewsCard";

const CustomerIntelligenceNews = () => {
    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const customerIntelligenceNewsHeader = {
        title: "Latest Articles on Customer Intelligence",
        subtitle: "Explore the latest updates, strategies, and success stories in customer insights, behavior analysis, and data-driven engagement.",
    };

    const customerIntelligenceNewsData = [
        {
            image: "/images/CustomerIntelligenceNews1.webp",
            date: "Mar 10, 2025",
            title: "Unveiling Customer Behavior through Advanced Analytics",
            alt: "Customer Intelligence News 1",
        },
        {
            image: "/images/CustomerIntelligenceNews2.webp",
            date: "Mar 05, 2025",
            title: "Driving Strategy with Real-Time Customer Intelligence",
            alt: "Customer Intelligence News 2",
        },
        {
            image: "/images/CustomerIntelligenceNews3.webp",
            date: "Mar 01, 2025",
            title: "Personalization at Scale: Leveraging Consumer Data",
            alt: "Customer Intelligence News 3",
        },
    ];

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => setIsDragging(false);

    return (
        <section className="news-section bg-[#F4F5F7]">
            <NewsHeader title={customerIntelligenceNewsHeader.title} subtitle={customerIntelligenceNewsHeader.subtitle} />
            <div
                ref={scrollContainerRef}
                className="news-list-container news-scroll-container"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {customerIntelligenceNewsData.map((news, index) => (
                    <NewsCard key={index} image={news.image} date={news.date} title={news.title} alt={news.alt} />
                ))}
            </div>
        </section>
    );
};

export default CustomerIntelligenceNews;
