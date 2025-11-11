"use client";
import { useClientOnly, useWindowSize } from "@/hooks/useClientOnly";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export const CommanAudienceCard = ({ icon, title, description, isMobile }) => {
    return (
        <article
            className={`group relative py-2 flex-shrink-0 ${
                isMobile ? "w-[300px]" : "w-full"
            } p-5 bg-white rounded-2xl shadow-md transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-lg h-[250px] overflow-hidden`}
        >
            <div className="flex justify-center items-center w-12 h-12 rounded-lg bg-white group-hover:bg-[#17306e] transition-all duration-300">
                <Image src={icon} alt="icon" width={23} height={23} className="transition-all duration-300 group-hover:invert group-hover:brightness-0" />
            </div>
            <h3 className="mt-4 text-md font-medium text-zinc-900">{title}</h3>
            <p className="mt-3 text-sm text-zinc-600 pr-2">{description}</p>
        </article>
    );
};

export const CommanAudienceCardContainer = ({ data, title, subTitle }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const isClient = useClientOnly();
    const { width } = useWindowSize();
    const [cardsPerView, setCardsPerView] = useState(3);
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
            setCardsPerView(3);
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
            const cardWidth = 300 + 16; // Card width (300px) + gap (16px from gap-4)
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
            const cardWidth = 300 + 16; // Card width (300px) + gap (16px from gap-4)
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
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">How Your Business Benefits</h2>
                <p className="text-sm text-gray-500">Loading content...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-full mx-auto px-4 md:px-6 lg:px-8 py-12 bg-[#F4F5F7]">
            <div className="px-[7.9%]">
                <div className="flex justify-center items-center mb-6 md:mb-8 lg:mb-8">
                    <div className="text-center mb-4 md:mb-0 lg:mb-0">
                        <h2 className="text-xl md:text-2xl lg:text-[26px] font-semibold text-zinc-900">{title}</h2>
                        <p className="mt-3 text-sm md:text-base lg:text-base text-zinc-700 max-w-md md:max-w-lg lg:max-w-[900px]">{subTitle}</p>
                    </div>
                </div>
                <div className="relative flex items-center gap-4">
                    {/* Previous Button */}
                    <button
                        onClick={handlePrevious}
                        className={`flex bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            isMobileView ? "absolute left-0 -ml-4 z-10 bg-opacity-90" : ""
                        }`}
                        aria-label="Previous card"
                        aria-disabled={currentIndex === 0}
                        disabled={currentIndex === 0}
                    >
                        <Image src="/icons/Left-Swipe-Black.webp" alt="Previous" width={20} height={20} className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <div
                        className={`${
                            isMobileView
                                ? "flex overflow-x-auto gap-4 snap-x scroll-smooth no-scrollbar"
                                : "grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 w-full"
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
                            <CommanAudienceCard key={index + 1} icon={item.icon} title={item.title} description={item.description} isMobile={isMobileView} />
                        ))}
                    </div>
                    {/* Next Button */}
                    <button
                        onClick={handleNext}
                        className={`flex bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            isMobileView ? "absolute right-0 -mr-4 z-10 bg-opacity-90" : ""
                        }`}
                        aria-label="Next card"
                        aria-disabled={currentIndex >= data.length - cardsPerView}
                        disabled={currentIndex >= data.length - cardsPerView}
                    >
                        <Image src="/icons/Right-Swipe-Black.webp" alt="Next" width={20} height={20} className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};
