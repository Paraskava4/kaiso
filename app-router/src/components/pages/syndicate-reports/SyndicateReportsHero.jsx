"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const SyndicateReportsHero = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [showFullText, setShowFullText] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 488);
        };

        const debouncedResize = debounce(handleResize, 250);

        handleResize(); // Initial check
        window.addEventListener("resize", debouncedResize);
        return () => {
            window.removeEventListener("resize", debouncedResize);
        };
    }, []);

    const fullText =
        "Kaiso’s Syndicated Reports provide high-precision market intelligence across emerging industries, enabling faster, insight-driven decision-making. Each report delivers a 360° view of the market, covering historical trends, current dynamics, growth drivers, segment forecasts, and competitor analysis supported by analyst-curated insights and strategic modelling. Designed for rapid accessibility and broad usability, these reports empower planning, benchmarking, investment evaluation, and market entry with confidence.";

    const shortText =
        "Kaiso’s Syndicated Reports provide high-precision market intelligence across emerging industries, enabling faster, insight-driven decision-making...";

    return (
        <section className="relative w-full max-w-[1920px] h-[calc(100dvh-100px)] mx-auto py-20 flex items-center justify-center overflow-hidden">
            {/* Background image using Next.js Image */}
            <div className="absolute inset-0">
                <Image
                    src="/images/syndicate.webp"
                    alt="Syndicate Reports Hero Background"
                    width={1920}
                    height={1080}
                    quality={85}
                    priority
                    onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg';
                    }}
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
            </div>

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Content container */}
            <div
                className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-5xl mx-auto w-full
                      2xl:gap-8 2xl:px-6
                      xl:gap-7 xl:px-6
                      lg:gap-6 lg:px-8
                      md:gap-5 md:px-6
                      sm:gap-4 sm:px-5
                      xs:gap-3 xs:px-4"
            >
                {/* Text content */}
                <div
                    className="flex flex-col items-center gap-4 text-center w-full
                        2xl:gap-4
                        xl:gap-4
                        lg:gap-4
                        md:gap-3
                        sm:gap-3
                        xs:gap-2"
                >
                    {/* Main heading */}
                    <h1
                        className="text-white text-center font-bold leading-[120%] w-full
                         text-[25px] sm:text-[30px] md:text-[32px] lg:text-[34px] xl:text-[36px]"
                    >
                        Accelerate Strategic Decisions with Ready-to-Use Market Intelligence
                    </h1>

                    {/* Description with inline Read More */}
                    <p
                        className="text-[#F3F4F6] text-center leading-[160%] max-w-4xl w-full
                        text-xs sm:text-xs sm:text-[10px] md:text-[12px] 2xl:text-[14px]"
                    >
                        {isMobile && !showFullText ? shortText : fullText}
                        {isMobile && (
                            <>
                                {" "}
                                <button onClick={() => setShowFullText(!showFullText)} className="text-[#D62035] underline font-medium text-sm inline">
                                    {showFullText ? "Read Less" : "Read More"}
                                </button>
                            </>
                        )}
                    </p>
                </div>

                {/* Buttons container (unchanged, kept as-is per your request) */}
                <div
                    className="flex items-center gap-6 w-full justify-center
                        2xl:gap-6 2xl:flex-row
                        xl:gap-5 xl:flex-row
                        lg:gap-5 lg:flex-row
                        md:gap-4 md:flex-row
                        sm:gap-4 sm:flex-col sm:items-stretch sm:max-w-[320px]
                        xs:gap-3 xs:flex-col xs:items-stretch xs:max-w-[280px]"
                >
                    {/* Primary and Secondary buttons are commented out */}
                </div>
            </div>
        </section>
    );
};

export default SyndicateReportsHero;
