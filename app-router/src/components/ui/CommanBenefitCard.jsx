"use client";
import { useClientOnly, useWindowSize } from "@/hooks/useClientOnly";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export const CommanBenefitCard = ({ iconSrc, iconAlt, title, hoverDetails }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);

    return (
        <article
            className={`relative snap-center flex-shrink-0 ${
                isMobileView ? "w-[240px] max-w-[300px]" : "w-full"
            } h-[260px] bg-white rounded-xl p-8 max-md:px-5 border shadow-md transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-lg border-zinc-200 overflow-hidden`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            tabIndex={0}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            onDragStart={(e) => e.preventDefault()}
        >
            {/* Icon */}
            <div className="flex justify-center">
                <div
                    className={`flex justify-center items-center bg-[#F4F5F7] h-[76px] w-[76px] rounded-full mb-4 transform transition-all duration-300 ${
                        isHovered ? "opacity-0 scale-75 -translate-y-5" : "opacity-100 scale-100 translate-y-0"
                    }`}
                >
                    <Image src={iconSrc} alt={iconAlt} className="object-contain w-10 h-10" width={100} height={100} quality={100} />
                </div>
            </div>

            {/* Title */}
            <div
                className={`font-semibold text-[14px] mt-10 text-zinc-900 text-center transition-all duration-300 break-words max-w-full px-1 ${
                    isHovered ? "-translate-y-24" : "translate-y-0"
                }`}
            >
                {title}
            </div>

            {/* Hover details */}
            <p
                className={`absolute break-words text-xs text-zinc-600 leading-relaxed transition-all duration-300 px-1 text-center top-[120px] right-2 ${
                    isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
                }`}
            >
                {hoverDetails}
            </p>
        </article>
    );
};

export const CommanBenefitCardContainer = ({ data, title, subTitle }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const isClient = useClientOnly();
    const { width } = useWindowSize();
    const [cardsPerView, setCardsPerView] = useState(4);
    const [isMobileView, setIsMobileView] = useState(false);
    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Update cards per view based on screen size
    useEffect(() => {
        if (!isClient) return;

        if (width <= 767) {
            setCardsPerView(1);
            setIsMobileView(true);
        } else if (width <= 1199) {
            setCardsPerView(2);
            setIsMobileView(false);
        } else {
            setCardsPerView(4);
            setIsMobileView(false);
        }
    }, [isClient, width]);

    // Global mouse event handlers for drag functionality
    useEffect(() => {
        if (!isClient) return;

        const handleGlobalMouseMove = (e) => {
            if (isDragging && scrollContainerRef.current) {
                e.preventDefault();
                const x = e.pageX - scrollContainerRef.current.offsetLeft;
                const walk = (x - startX) * 2;
                scrollContainerRef.current.scrollLeft = scrollLeft - walk;
            }
        };

        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.style.cursor = "grab";
                }
            }
        };

        if (isDragging) {
            document.addEventListener("mousemove", handleGlobalMouseMove);
            document.addEventListener("mouseup", handleGlobalMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleGlobalMouseMove);
            document.removeEventListener("mouseup", handleGlobalMouseUp);
        };
    }, [isClient, isDragging, startX, scrollLeft]);

    // Drag functionality handlers
    const handleMouseDown = (e) => {
        if (!isMobileView || !scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
        scrollContainerRef.current.style.cursor = "grabbing";
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        if (!scrollContainerRef.current) return;
        setIsDragging(false);
        scrollContainerRef.current.style.cursor = "grab";
    };

    const handleMouseLeave = () => {
        if (!scrollContainerRef.current) return;
        setIsDragging(false);
        scrollContainerRef.current.style.cursor = "grab";
    };

    // Touch handlers for mobile
    const handleTouchStart = (e) => {
        if (!isMobileView || !scrollContainerRef.current) return;
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

    // Navigation handlers
    const handlePrevious = () => {
        if (isMobileView && scrollContainerRef.current) {
            const cardWidth = 240 + 16; // Card width (240px) + gap (16px from gap-4)
            const newScrollLeft = scrollContainerRef.current.scrollLeft - cardWidth;
            scrollContainerRef.current.scrollTo({
                left: newScrollLeft >= 0 ? newScrollLeft : 0,
                behavior: "smooth",
            });
            setCurrentIndex((prev) => Math.max(0, prev - 1));
        } else {
            setCurrentIndex((prev) => Math.max(0, prev - 1));
        }
    };

    const handleNext = () => {
        if (isMobileView && scrollContainerRef.current) {
            const cardWidth = 240 + 16; // Card width (240px) + gap (16px from gap-4)
            const maxScrollLeft = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
            const newScrollLeft = scrollContainerRef.current.scrollLeft + cardWidth;
            scrollContainerRef.current.scrollTo({
                left: newScrollLeft <= maxScrollLeft ? newScrollLeft : maxScrollLeft,
                behavior: "smooth",
            });
            setCurrentIndex((prev) => Math.min(data.length - cardsPerView, prev + 1));
        } else {
            setCurrentIndex((prev) => Math.min(data.length - cardsPerView, prev + 1));
        }
    };

    // Get current cards to display
    const currentCards = data.slice(currentIndex, currentIndex + cardsPerView);

    // Server-side fallback
    if (!isClient) {
        return (
            <div className="w-full py-12 px-4 text-center">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Who Can Drive Impact</h2>
                <p className="text-sm text-gray-500">Loading content...</p>
            </div>
        );
    }

    return (
        <section className="w-full max-w-full mx-auto px-4 md:px-6 lg:px-8 py-12 bg-[#F4F5F7]">
            <div className="px-[7.9%]">
                <div className="flex justify-center items-center mb-6 md:mb-8 lg:mb-8">
                    <div className="text-center mb-4 md:mb-0 lg:mb-0">
                        <h2 className="text-xl md:text-2xl lg:text-[26px] font-semibold text-zinc-900">{title}</h2>
                        <p className="mt-3 text-sm md:text-base lg:text-base text-zinc-700 max-w-md md:max-w-lg lg:max-w-[900px]">{subTitle}</p>
                    </div>
                </div>
                <div className="relative flex items-center gap-5">
                    <button
                        onClick={handlePrevious}
                        className={`flex bg-white p-2 lg:p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            isMobileView ? "absolute left-0 -ml-4 z-10 bg-opacity-90" : ""
                        }`}
                        aria-label="Previous card"
                        aria-disabled={currentIndex === 0}
                        disabled={currentIndex === 0}
                    >
                        <Image src="/icons/Left-Swipe-Black.webp" alt="Previous" width={20} height={20} className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>
                    <div
                        className={`${
                            isMobileView
                                ? "flex overflow-x-auto gap-4 snap-x scroll-smooth no-scrollbar"
                                : "grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 w-full"
                        } flex-1`}
                        ref={isMobileView ? scrollContainerRef : null}
                        onMouseDown={isMobileView ? handleMouseDown : undefined}
                        onMouseMove={isMobileView ? handleMouseMove : undefined}
                        onMouseUp={isMobileView ? handleMouseUp : undefined}
                        onMouseLeave={isMobileView ? handleMouseLeave : undefined}
                        onTouchStart={isMobileView ? handleTouchStart : undefined}
                        onTouchMove={isMobileView ? handleTouchMove : undefined}
                        onTouchEnd={isMobileView ? handleTouchEnd : undefined}
                        style={{ cursor: isMobileView ? (isDragging ? "grabbing" : "grab") : "default" }}
                    >
                        {(isMobileView ? data : currentCards).map((item, index) => (
                            <CommanBenefitCard
                                key={index + 1}
                                iconSrc={item.iconSrc}
                                iconAlt={item.iconAlt}
                                title={item.title}
                                hoverDetails={item.hoverDetails}
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleNext}
                        className={`flex bg-white p-2 lg:p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            isMobileView ? "absolute right-0 -mr-4 z-10 bg-opacity-90" : ""
                        }`}
                        aria-label="Next card"
                        aria-disabled={currentIndex >= data.length - cardsPerView}
                        disabled={currentIndex >= data.length - cardsPerView}
                    >
                        <Image src="/icons/Right-Swipe-Black.webp" alt="Next" width={20} height={20} className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>
                </div>
            </div>
            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
};
