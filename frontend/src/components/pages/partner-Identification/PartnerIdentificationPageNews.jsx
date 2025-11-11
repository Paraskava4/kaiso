"use client";
import { useRef, useState } from "react";
import NewsHeader from "../home/NewsHeader";
import NewsCard from "../home/NewsCard";

const PartnerIdentificationPageNews = () => {
  const scrollRef = useRef(null);
  const [drag, setDrag] = useState({ active: false, startX: 0, scrollLeft: 0 });

  const newsHeader = {
    title: "Latest Articles of Partner Identification",
    subtitle:
      "Stay updated with insights on finding strategic partners, collaboration models, and innovation ecosystems",
  };

  const newsData = [
    {
      image: "/images/PartnerIdentificationNews1.webp",
      date: "Apr 10, 2025",
      title: "Strategic Partner Identification in Emerging Markets",
      alt: "Partner Identification News 1",
    },
    {
      image: "/images/PartnerIdentificationNews2.webp",
      date: "Apr 06, 2025",
      title: "Frameworks for Evaluating Potential Partnerships",
      alt: "Partner Identification News 2",
    },
    {
      image: "/images/PartnerIdentificationNews3.webp",
      date: "Apr 01, 2025",
      title: "Aligning Business Goals with Strategic Alliances",
      alt: "Partner Identification News 3",
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
          <NewsCard
            key={i}
            image={item.image}
            date={item.date}
            title={item.title}
            alt={item.alt}
          />
        ))}
      </div>
    </section>
  );
};

export default PartnerIdentificationPageNews;
