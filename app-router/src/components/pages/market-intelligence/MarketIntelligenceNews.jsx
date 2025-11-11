"use client";
import { useRef, useState } from "react";
import NewsHeader from "../home/NewsHeader";
import NewsCard from "../home/NewsCard";

const MarketIntelligenceNews = () => {
    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const marketIntelligenceNewsHeader = {
        title: "Latest Articles of Market Intelligence",
        subtitle: "Stay informed with cutting-edge market intelligence insights, strategic analysis, and data-driven research methodologies",
    };

    const marketIntelligenceNewsData = [
        {
            image: "/images/MarketIntelligenceNews1.webp",
            date: "Mar 05, 2025",
            title: "Advanced Market Intelligence: Leveraging Data for Strategic Decisions",
            alt: "Market Intelligence News 1",
        },
        {
            image: "/images/MarketIntelligenceNews2.webp",
            date: "Mar 02, 2025",
            title: "Competitive Intelligence and Market Positioning Strategies",
            alt: "Market Intelligence News 2",
        },
        {
            image: "/images/MarketIntelligenceNews3.webp",
            date: "Feb 28, 2025",
            title: "Market Intelligence Tools: Technology-Driven Research Solutions",
            alt: "Market Intelligence News 3",
        },
    ];

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

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

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    return (
        <section className="news-section">
            <NewsHeader title={marketIntelligenceNewsHeader.title} subtitle={marketIntelligenceNewsHeader.subtitle} />
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
                {marketIntelligenceNewsData.map((news, index) => (
                    <NewsCard key={index} image={news.image} date={news.date} title={news.title} alt={news.alt} />
                ))}
            </div>
        </section>
    );
};

export default MarketIntelligenceNews;
