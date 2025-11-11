"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import SyndicateReportsFaq from "./SyndicateReportsFaq";

// ReportTypeHeader Component
const ReportTypeHeader = ({
    category = "Our Report Types",
    title = "Explore Our Report Portfolio",
    description = "Comprehensive coverage tailored to the scale of your strategy, whether global, regional, or country-specific.",
}) => (
    <header className="flex flex-col items-center w-full leading-relaxed text-center max-w-full">
        <div className="flex flex-col items-center w-full max-w-4xl">
            <h2 className="mt-2 text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-semibold text-zinc-800">{title}</h2>
            <p className="mt-2 text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] text-zinc-900">{description}</p>
        </div>
    </header>
);

// ReportCard Component
const ReportCard = React.forwardRef(
    ({ imageSrc, title, description, isHighlighted = false, hasButton = false, buttonText = "Explore Reports", onButtonClick }, forwardedRef) => {
        const cardRef = useRef(null);
        const actualCardRef = isHighlighted ? forwardedRef : cardRef;

        useEffect(() => {
            const card = actualCardRef?.current || cardRef.current;
            if (!card) return;

            const handleMouseEnter = () => {
                gsap.to(card, {
                    duration: 0.4,
                    y: -5,
                    boxShadow: isHighlighted ? "0 20px 25px -5px rgba(0, 0, 0, 0.15)" : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    ease: "power2.out",
                });
            };

            const handleMouseLeave = () => {
                gsap.to(card, {
                    duration: 0.4,
                    y: 0,
                    boxShadow: isHighlighted ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)" : "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    ease: "power2.out",
                });
            };

            card.addEventListener("mouseenter", handleMouseEnter);
            card.addEventListener("mouseleave", handleMouseLeave);

            return () => {
                card.removeEventListener("mouseenter", handleMouseEnter);
                card.removeEventListener("mouseleave", handleMouseLeave);
            };
        }, [isHighlighted]);

        return (
            <article
                ref={actualCardRef}
                className={`flex flex-col h-full p-6 sm:p-8 text-center bg-white rounded-3xl border-[0.5px] ${isHighlighted ? "border-gray-400/30 shadow-lg" : "border-gray-300 shadow-sm"
                    }`}
            >
                <Image
                    src={imageSrc}
                    alt={`${title} illustration`}
                    className="w-full "
                    style={{ aspectRatio: "1.67" }}
                    width={100}
                    height={100}
                    quality={100}
                />
                <div className="mt-6 flex-1 flex flex-col justify-between">
                    <div>
                        <h2 className="text-md font-medium text-zinc-800">{title}</h2>
                        <p className="mt-3 text-xs sm:text-sm md:text-[13px] text-zinc-900">{description}</p>
                    </div>
                    <button
                        onClick={() => (window.location.href = "/report-store")}
                        className="self-center text-sm px-5 py-1.5 mt-6 text-white bg-sky-900 rounded-lg border-[0.5px] border-gray-400/30 transition-all duration-200 hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                    >
                        {hasButton ? buttonText : "Explore Reports"}
                    </button>
                </div>
            </article>
        );
    }
);

ReportCard.displayName = "ReportCard";

// PaginationDots Component
const PaginationDots = ({ totalDots = 3, activeDot = 1, onDotClick }) => (
    <nav className="flex gap-2 mt-10 self-center" aria-label="pagination">
        {Array.from({ length: totalDots }, (_, index) => {
            const isActive = index === activeDot;
            return (
                <button
                    key={index}
                    onClick={() => onDotClick(index)}
                    className={`h-2 rounded-xl transition-all duration-300 ${isActive ? "w-7 bg-sky-900" : "w-2 bg-slate-300"}`}
                    aria-current={isActive ? "true" : "false"}
                />
            );
        })}
    </nav>
);

// Main Component
const SyndicateReportsType = () => {
    const [currentSlide, setCurrentSlide] = useState(1);
    const [showPaginationDots, setShowPaginationDots] = useState(true);
    const middleCardRef = useRef(null);

    const reportData = [
        {
            id: 1,
            imageSrc: "/images/syndicate2.webp",
            title: "Global Reports",
            description:
                "Broad-based market intelligence across international geographies. Ideal for strategic planning, competitive benchmarking, and identifying cross-border growth opportunities.",
            isHighlighted: false,
            hasButton: false,
        },
        {
            id: 2,
            imageSrc: "/images/syndicate3.webp",
            title: "Regional Reports",
            description:
                "Targeted analysis for North America, Europe, Asia-Pacific, Latin America, and the Middle East and Africa. Built to support region-specific strategies and investments.",
            isHighlighted: true,
            hasButton: true,
            buttonText: "Explore Reports",
        },
        {
            id: 3,
            imageSrc: "/images/syndicate4.webp",
            title: "Country-Specific Reports",
            description:
                "Deep-dive, country-specific reports offering detailed insights into consumer behaviour, regulatory landscapes, competitive dynamics, and forward-looking market forecasts.",
            isHighlighted: false,
            hasButton: false,
        },
    ];

    const handleDotClick = (index) => setCurrentSlide(index);

    useEffect(() => {
        const handleResize = () => {
            setShowPaginationDots(window.innerWidth < 1024); // show dots only on mobile/tablet
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <section
            className="flex flex-col w-full mx-auto max-w-[90%] lg:max-w-[80%]"
            style={{
                marginTop: "clamp(40px, 8vw, 120px)",
                marginBottom: "clamp(40px, 8vw, 120px)",
            }}
        >
            <ReportTypeHeader />

            {/* Responsive Layout */}
            <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 overflow-x-auto lg:overflow-visible horizontal-scroll-container"
                style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
            >
                {reportData.map((report) => (
                    <div key={report.id} className="flex-none sm:flex-auto max-w-[365px] lg:max-w-full">
                        <ReportCard ref={report.isHighlighted ? middleCardRef : null} {...report} />
                    </div>
                ))}
            </div>

            {/* {showPaginationDots && (
                <PaginationDots totalDots={3} activeDot={currentSlide} onDotClick={handleDotClick} />
            )} */}
        </section>
    );
};

export default SyndicateReportsType;
