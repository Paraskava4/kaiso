"use client";
import { useRef, useState } from "react";
import NewsHeader from "../home/NewsHeader";
import NewsCard from "../home/NewsCard";

const TechnologyScoutingNews = () => {
    const scrollRef = useRef(null);
    const [drag, setDrag] = useState({ active: false, startX: 0, scrollLeft: 0 });

    const newsHeader = {
        title: "Latest Articles of Technology Scouting",
        subtitle: "Explore the newest innovations, emerging technologies, and industry breakthroughs that shape the future",
    };

    const newsData = [
        {
            image: "/images/TechnologyScoutingNews1.webp",
            date: "Mar 12, 2025",
            title: "Identifying Disruptive Technologies for Competitive Advantage",
            alt: "Technology Scouting News 1",
        },
        {
            image: "/images/TechnologyScoutingNews2.webp",
            date: "Mar 08, 2025",
            title: "Tech Scouting Strategies: From Discovery to Deployment",
            alt: "Technology Scouting News 2",
        },
        {
            image: "/images/TechnologyScoutingNews3.webp",
            date: "Mar 04, 2025",
            title: "Harnessing Innovation Networks for Scalable Growth",
            alt: "Technology Scouting News 3",
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
        <section className="news-section">
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

export default TechnologyScoutingNews;
