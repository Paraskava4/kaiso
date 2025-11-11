"use client";
import { useRef, useState } from "react";
import NewsHeader from "../home/NewsHeader";
import NewsCard from "../home/NewsCard";

const StrategicAnalysisMarketInsightsPageNews = () => {
    const scrollRef = useRef(null);
    const [drag, setDrag] = useState({ active: false, startX: 0, scrollLeft: 0 });

    const newsHeader = {
        title: "Latest Articles on Market Insights",
        subtitle: "Explore expert perspectives on market dynamics, competitive intelligence, and strategic foresight.",
    };

    const newsData = [
        {
            image: "/images/StrategicAnalysisMarketInsightsNews1.webp",
            date: "May 12, 2025",
            title: "Decoding Competitive Intelligence for Growth",
            alt: "Market Insights News 1",
        },
        {
            image: "/images/StrategicAnalysisMarketInsightsNews2.webp",
            date: "May 08, 2025",
            title: "Future-Proofing Strategies through Market Foresight",
            alt: "Market Insights News 2",
        },
        {
            image: "/images/StrategicAnalysisMarketInsightsNews3.webp",
            date: "May 03, 2025",
            title: "Adapting to Evolving Market Dynamics",
            alt: "Market Insights News 3",
        },
    ];

    const startDrag = (e, isTouch = false) => {
        const pageX = isTouch ? e.touches[0].pageX : e.pageX;
        setDrag({
            active: true,
            startX: pageX - scrollRef.current.offsetLeft,
            scrollLeft: scrollRef.current.scrollLeft,
        });
    };

    const endDrag = () => setDrag((d) => ({ ...d, active: false }));

    const onMove = (e, isTouch = false) => {
        if (!drag.active) return;
        const pageX = isTouch ? e.touches[0].pageX : e.pageX;
        const x = pageX - scrollRef.current.offsetLeft;
        const walk = (x - drag.startX) * 2;
        scrollRef.current.scrollLeft = drag.scrollLeft - walk;
    };

    return (
        <section className="news-section bg-[#FAF5EF]">
            <NewsHeader title={newsHeader.title} subtitle={newsHeader.subtitle} />
            <div
                ref={scrollRef}
                className="news-list-container news-scroll-container"
                onMouseDown={(e) => startDrag(e)}
                onMouseUp={endDrag}
                onMouseLeave={endDrag}
                onMouseMove={(e) => onMove(e)}
                onTouchStart={(e) => startDrag(e, true)}
                onTouchEnd={endDrag}
                onTouchMove={(e) => onMove(e, true)}
            >
                {newsData.map((item, i) => (
                    <NewsCard key={i} image={item.image} date={item.date} title={item.title} alt={item.alt} />
                ))}
            </div>
        </section>
    );
};

export default StrategicAnalysisMarketInsightsPageNews;
