import { useClientOnly, useWindowSize } from "@/hooks/useClientOnly";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export const FeatureCard = ({ title = "Default Title", description = "Default description" }) => {
    return (
        <article
            className="min-w-[185px] px-4 py-6 bg-white border border-gray-600 rounded-3xl snap-start  transition-all duration-300 ease-in-out
    hover:-translate-y-2 hover:shadow-lg hover:z-10"
        >
            <h3
                className="text-black font-semibold mb-2 text-xs 
                           sm:text-[0.65rem] 
                           md:text-left md:text-sm md:max-w-[90%]
                           lg:text-sm
                           xl:text-sm"
            >
                {title}
            </h3>
            <p
                className="text-black leading-6 text-xs 
                           sm:text-[0.65rem]
                           md:text-left md:text-sm md:max-w-[90%]
                           lg:text-xs
                           xl:text-xs"
            >
                {description}
            </p>
        </article>
    );
};

export const CommanFeatureCardContainer = ({ data, title }) => {
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

    // Scroll to the current index when it changes
    useEffect(() => {
        if (isMobileView && scrollContainerRef.current) {
            const cardWidth = 250 + 16; // Updated card width (250px) + gap (16px)
            scrollContainerRef.current.scrollTo({
                left: currentIndex * cardWidth,
                behavior: "smooth",
            });
        }
    }, [currentIndex, isMobileView]);

    // Global mouse event handlers for drag functionality
    useEffect(() => {
        if (!isClient) return;

        const handleGlobalMouseMove = (e) => {
            if (isDragging && scrollContainerRef.current) {
                e.preventDefault();
                const x = e.pageX - scrollContainerRef.current.offsetLeft;
                const walk = (x - startX) * 1.5;
                scrollContainerRef.current.scrollLeft = scrollLeft - walk;
            }
        };

        const handleGlobalMouseUp = () => {
            if (isDragging && scrollContainerRef.current) {
                setIsDragging(false);
                scrollContainerRef.current.style.cursor = "grab";
                // Snap to the nearest card
                const cardWidth = 250 + 16; // Updated card width + gap
                const scrollPosition = scrollContainerRef.current.scrollLeft;
                const newIndex = Math.round(scrollPosition / cardWidth);
                setCurrentIndex(newIndex);
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
        const walk = (x - startX) * 1.5;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        if (!scrollContainerRef.current) return;
        setIsDragging(false);
        scrollContainerRef.current.style.cursor = "grab";
        // Snap to the nearest card
        const cardWidth = 250 + 16; // Updated card width + gap
        const scrollPosition = scrollContainerRef.current.scrollLeft;
        const newIndex = Math.round(scrollPosition / cardWidth);
        setCurrentIndex(newIndex);
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
        const walk = (x - startX) * 1.5;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        if (!scrollContainerRef.current) return;
        setIsDragging(false);
        // Snap to the nearest card
        const cardWidth = 250 + 16; // Updated card width + gap
        const scrollPosition = scrollContainerRef.current.scrollLeft;
        const newIndex = Math.round(scrollPosition / cardWidth);
        setCurrentIndex(newIndex);
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(data.length - cardsPerView, prev + 1));
    };

    // Get current cards to display
    const currentCards = data.slice(currentIndex, currentIndex + cardsPerView);

    // Server-side fallback
    if (!isClient) {
        return (
            <div className="w-full py-12 px-4 text-center">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Ideal Use Cases</h2>
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
                    </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-5">
                    <button
                        onClick={handlePrevious}
                        className="flex bg-white p-2 sm:p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50"
                        aria-label="Previous card"
                        disabled={currentIndex === 0}
                    >
                        <Image src="/icons/Left-Swipe-Black.webp" alt="Previous" width={16} height={16} className="sm:w-6 sm:h-6" />
                    </button>
                    <div
                        className={`${
                            isMobileView
                                ? "flex overflow-x-auto gap-4 snap-x snap-mandatory scroll-smooth no-scrollbar"
                                : "grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 w-full"
                        }`}
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
                        {(isMobileView ? data : currentCards).map((feature, index) => (
                            <FeatureCard key={index + 1} title={feature.title} description={feature.description} />
                        ))}
                    </div>
                    <button
                        onClick={handleNext}
                        className="flex bg-white p-2 sm:p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50"
                        aria-label="Next card"
                        disabled={currentIndex >= data.length - cardsPerView}
                    >
                        <Image src="/icons/Right-Swipe-Black.webp" alt="Next" width={16} height={16} className="sm:w-6 sm:h-6" />
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
