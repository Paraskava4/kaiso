"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import clsx from "clsx";
import "react-alice-carousel/lib/alice-carousel.css";
import { useGetLandingPageDataQuery } from "@/api/home";
import { isStatusInclude } from "@/utils/axiosInstance";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isValidArray } from "@/utils/validation/array";
import Image from "next/image";
import Link from "next/link";

const styles = `
.hero-bg {
    transform: scale(1); /* Default state */
    animation: none; /* No animation by default */
}

.hero-slide.active .hero-bg {
    animation: zoom 10s ease-in forwards; /* Animation only for active slide */
}

@keyframes zoom {
    0% {
        transform: scale(1);
    }
    100% {
        transform: scale(1.2);
    }
}
`;

function HeroSlideItem({ slide, isActive, isPriority = false }) {
    const bgRef = useRef(null);

    useEffect(() => {
        if (bgRef.current) {
            const el = bgRef.current;
            if (isActive) {
                // Reset and start animation for active slide
                el.style.animation = "none";
                el.style.transform = "scale(1)"; // Explicitly reset transform
                void el.offsetWidth; // Trigger reflow to restart animation
                el.style.animation = "zoom 10s ease-in forwards";
            } else {
                // Reset transform and remove animation for non-active slides
                el.style.animation = "none";
                el.style.transform = "scale(1)"; // Ensure reset to initial scale
            }
        }
    }, [isActive]);

    const [loaded, setLoaded] = useState(false);

    return (
        <div
            className={clsx("hero-slide relative overflow-hidden w-full h-[calc(100vh-100px)]", {
                active: isActive,
            })}
            style={{ backgroundColor: "#fff" }}
        >
            <style>{styles}</style>
            <Image
                ref={bgRef}
                src={slide.image}
                alt={slide?.title || "Hero image"}
                fill
                sizes="100vw"
                priority={isPriority}
                fetchPriority={isPriority ? "high" : "auto"}
                loading={isPriority ? "eager" : "lazy"}
                className="hero-bg absolute inset-0 w-full h-full"
                style={{
                    objectFit: "cover",
                    backgroundColor: "#fff",
                }}
                onLoadingComplete={() => setLoaded(true)}
            />
            <div
                className="hero-overlay absolute inset-0 w-full h-full"
                style={{
                    background: slide.image && loaded ? "rgba(0, 0, 0, 0.5)" : "#fff",
                }}
            />
            {loaded && (
                <div className="absolute z-20 w-full flex items-center h-[calc(100%-115px)]">
                    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[84%]">
                        <div className="hero-content max-w-4xl">
                            {slide.title && (
                                <>
                                    <div className="flex items-center gap-3 mb-2 sm:mb-6">
                                        <div style={{ width: "56px", height: "56px" }}>
                                            <Image src={slide?.icon} width={56} height={56} alt="icon" />
                                        </div>
                                        <div className="hero-pill inline-block text-white rounded-xl text-sm sm:text-base font-medium line-clamp-2">
                                            {slide.title}
                                        </div>
                                    </div>
                                </>
                            )}
                            <p
                                style={{ lineHeight: "120%" }}
                                className="hero-title text-white font-bold leading-tight mb-4 sm:mb-6 text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl mb-2 sm:mb-6 line-clamp-2"
                            >
                                {slide.tag}
                            </p>
                            <p className="hero-desc text-white text-xs sm:text-sm md:text-sm lg:text-md xl:text-md mb-6 sm:mb-8 md:mb-10 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl leading-relaxed opacity-90 mb-4 sm:mb-6 line-clamp-2">
                                {slide.description}
                            </p>
                            <div className="hero-ctas flex flex-col sm:flex-row gap-3 sm:gap-4">
                                {slide.ctas?.map((c) => (
                                    <Link
                                        key={`${slide.id}-${c.label}`}
                                        href={c.href}
                                        target="_blank"
                                        tabIndex={0}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log(`Button clicked: ${c.label}, href: ${c.href}`);
                                        }}
                                        className={clsx(
                                            "btn inline-flex items-center justify-center px-4 py-1 sm:px-6 sm:py-3 md:px-8 md:py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
                                            c.variant === "secondary"
                                                ? "bg-white text-black"
                                                : c.variant === "primary"
                                                    ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                                                    : "bg-transparent border-2 border-white text-white hover:bg-white hover:text-black focus:ring-white"
                                        )}
                                        style={{
                                            textDecoration: "none",
                                        }}
                                    >
                                        {c.label}
                                        {c.variant === "primary" && (
                                            <svg className="ml-2 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function HeroCarousel({ heroData: propHeroData, isLoading }) {
    const carouselRef = useRef();
    const [activeIndex, setActiveIndex] = useState(0);
    const [tabActiveIndex, setTabActiveIndex] = useState(0);
    const [heroData, setHeroData] = useState();
    const [isDesktop, setIsDesktop] = useState(false);

    const activeIndexRef = useRef(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        const checkWidth = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        checkWidth();
        window.addEventListener("resize", checkWidth);

        return () => {
            window.removeEventListener("resize", checkWidth);
        };
    }, []);

    useEffect(() => {
        if (!propHeroData || propHeroData.length === 0) return;

        const apiSlides = propHeroData.map((h, idx) => {
            return {
                id: h._id ?? `hero-${idx}`,
                tag: h.tag ?? h.headline ?? h.title ?? "",
                title: h.title ?? h.headline ?? "",
                description: h.description ?? h.subtitle ?? "",
                image: h.bigImage ?? h.image ?? "/images/placeholder.jpg",
                icon: h?.icon,
                ctas: [
                    ...(h.CTAButtonOneName && h.CTAButtonOneLink
                        ? [
                            {
                                label: h.CTAButtonOneName,
                                href: h.CTAButtonOneLink,
                                variant: h.CTAButtonOneType ?? "primary",
                            },
                        ]
                        : []),
                    ...(h.CTAButtonTwoName && h.CTAButtonTwoLink
                        ? [
                            {
                                label: h.CTAButtonTwoName,
                                href: h.CTAButtonTwoLink,
                                variant: h.CTAButtonTwoType ?? "secondary",
                            },
                        ]
                        : []),
                ],
            };
        });

        if (apiSlides.length > 0) {
            setHeroData(apiSlides);
            setActiveIndex(0);
            setTabActiveIndex(0);
        }
    }, [propHeroData]);

    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    const displaySlides = heroData && heroData.length > 0 && heroData;

    const slides = useMemo(
        () =>
            isValidArray(displaySlides) &&
            displaySlides.map((s, idx) => (
                <HeroSlideItem key={s.id} slide={s} isActive={idx === activeIndex} isPriority={idx === 0} />
            )),
        [displaySlides, activeIndex]
    );

    const stopAutoPlay = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const startAutoPlay = useCallback(() => {
        stopAutoPlay();
        if (!displaySlides || displaySlides.length <= 1) return;
        intervalRef.current = setInterval(() => {
            const currentIndex = activeIndexRef.current;
            const newIndex = (currentIndex + 1) % displaySlides.length;
            setActiveIndex(newIndex);
            setTabActiveIndex(newIndex);
            if (carouselRef.current) {
                carouselRef.current.slideTo(newIndex);
            }
        }, 8000);
    }, [displaySlides, stopAutoPlay]);

    useEffect(() => {
        if (displaySlides && displaySlides.length > 1) {
            startAutoPlay();
        } else {
            stopAutoPlay();
        }
        return () => stopAutoPlay();
    }, [displaySlides, startAutoPlay, stopAutoPlay]);

    const handleTabClick = (idx) => {
        setActiveIndex(idx);
        setTabActiveIndex(idx);
        if (carouselRef.current) {
            carouselRef.current.slideTo(idx);
        }
        startAutoPlay();
    };

    const handlePrevClick = () => {
        if (carouselRef.current) {
            const newIndex = (tabActiveIndex - 1 + displaySlides.length) % displaySlides.length;
            setActiveIndex(newIndex);
            setTabActiveIndex(newIndex); // update tabs immediately
            carouselRef.current.slideTo(newIndex);
        }
        startAutoPlay();
    };

    const handleNextClick = () => {
        if (carouselRef.current) {
            const newIndex = (tabActiveIndex + 1) % displaySlides.length;
            setActiveIndex(newIndex);
            setTabActiveIndex(newIndex); // update tabs immediately
            carouselRef.current.slideTo(newIndex);
        }
        startAutoPlay();
    };


    // Show a priority placeholder hero to improve LCP while data loads
    if (isLoading || !heroData || heroData.length === 0) {
        return (
            <section className="hero-wrapper relative w-full h-[calc(100vh-100px)]" style={{ backgroundColor: "#fff" }}>
                <div className="relative w-full h-full">
                    <Image
                        src="/placeholder.jpg"
                        alt="Hero"
                        fill
                        sizes="100vw"
                        priority
                        fetchPriority="high"
                        loading="eager"
                        className="absolute inset-0 w-full h-full"
                        style={{ objectFit: "cover", backgroundColor: "#fff" }}
                    />
                </div>
            </section>
        );
    }

    return (
        <section className="hero-wrapper relative w-full h-[calc(100vh-100px)] " style={{ backgroundColor: "#fff" }}>
            <AliceCarousel
                ref={carouselRef}
                mouseTracking={false}
                autoPlayStrategy="none"
                disableAutoPlayOnAction={true}
                items={slides}
                disableButtonsControls
                disableDotsControls
                controlsStrategy="default"
                animationType="fadeout"
                autoPlay={false}
                animationDuration={1000}
                infinite
                keyboardNavigation
                touchTracking={false}
                activeIndex={activeIndex}
                onSlideChanged={(data) => {
                    setActiveIndex(data?.slide);
                }}
            />
            <button
                onClick={handlePrevClick}
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "8px",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    color: "white",
                    width: "40px",
                    height: "40px",
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={handleNextClick}
                style={{
                    position: "absolute",
                    top: "50%",
                    right: "8px",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    color: "white",
                    width: "40px",
                    height: "40px",
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <ChevronRight size={24} />
            </button>
            <div style={{ display: isDesktop ? "block" : "none" }}>
                <div className="hero-tabs absolute bottom-4 sm:bottom-8 md:bottom-12 lg:bottom-16 left-0 right-0 z-10">
                    <div className="container mx-auto max-w-[76.5%]">
                        <div className="flex gap-2 flex-nowrap justify-between overflow-x-auto whitespace-nowrap">
                            {isValidArray(displaySlides) &&
                                displaySlides.map((s, idx) => {
                                    return (
                                        <button
                                            key={s.id}
                                            className={clsx(
                                                "hero-tab px-1 py-1 sm:px-2 sm:py-1 md:px-3 md:py-2 cursor-pointer flex-shrink-0 text-xs sm:text-xs md:text-sm lg:text-sm font-medium transition-all duration-300 hover:text-white",
                                                idx === tabActiveIndex ? "text-white" : "text-gray-400 hover:text-gray-300"
                                            )}
                                            style={{
                                                borderBottom: idx === tabActiveIndex ? "2px solid rgb(255, 0, 0)" : "2px solid transparent",
                                                paddingBottom: idx === tabActiveIndex ? "8px" : "8px",
                                            }}
                                            onClick={() => handleTabClick(idx)}
                                        >
                                            {s.title}
                                        </button>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroCarousel;
