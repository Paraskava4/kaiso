"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const StatCard = ({ value, description }) => {
    const numericValue = parseInt(value.replace(/[,+]/g, ""), 10); // e.g., "25,000+" -> 25000
    const suffix = value.includes("+") ? "+" : ""; // Preserve "+" if present
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false); // Track visibility for animation

    useEffect(() => {
        const element = ref.current;
        if (!element || isNaN(numericValue)) {
            console.error("StatCard: Invalid element or numericValue", { element, numericValue, value });
            return;
        }

        // IntersectionObserver to trigger animation when visible
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Stop observing after first visibility
                }
            },
            { threshold: 0.1 } // Trigger when 10% of the element is visible
        );

        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) observer.disconnect();
        };
    }, [numericValue]);

    useEffect(() => {
        if (!isVisible) return;

        const element = ref.current;
        if (!element) return;

        const duration = 1000; // 1-second animation
        const start = 0;
        const end = numericValue;
        const range = end - start;
        const steps = 50; // Number of animation steps for smoothness
        const stepTime = duration / steps; // Time per step
        const increment = range / steps; // Value increment per step
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end; // Prevent overshoot
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString() + suffix;
        }, stepTime);

        return () => clearInterval(timer); // Cleanup on unmount
    }, [isVisible, numericValue, suffix]);

    return (
        <article className="flex flex-col justify-center items-center px-4 py-4 sm:px-5 sm:py-6 rounded-2xl border border-white/20 backdrop-blur-md bg-white/5 w-full max-w-[300px] text-center h-[170px] sm:h-[160px]">
            <div ref={ref} className="text-3xl py-3 sm:text-4xl md:text-4xl font-semibold text-white">
                {isNaN(numericValue) ? value : numericValue.toLocaleString() + suffix} {/* Fallback initial value */}
            </div>
            <p className="mt-3 text-xs sm:text-xs text-white/90 leading-snug" style={{ fontSize: "12px" }}>
                {description}
            </p>
        </article>
    );
};

const ImpactHeader = () => {
    return (
        <header className="max-w-full w-full sm:w-[596px]">
            {/* <div className="text-base sm:text-md font-medium leading-tight text-gray-100 max-w-full">
                IMPACT
            </div> */}
            <h1 className="mt-3 sm:mt-5 text-xl sm:text-xl md:text-xl font-semibold leading-8 sm:leading-9 md:leading-10 text-white max-w-full">
                Strategic Impact
            </h1>
        </header>
    );
};

const ConsultingServicesImpact = () => {
    const statistics = [
        {
            value: "25,000+",
            description: "Data Points Analysed and Synthesised",
        },
        {
            value: "2,000+",
            description: "High-Growth Opportunities Identified",
        },
        {
            value: "400+",
            description: "CXOs, Analysts, and Channel Experts Interviewed",
        },
        {
            value: "60+",
            description: "Countries Analysed",
        },
        {
            value: "14+",
            description: "Industries Covered",
        },
    ];

    return (
        <section className="relative w-full  py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden min-h-[400px] flex items-center justify-center">
            <Image
                src="/images/SyndicateReportsPage-component.webp"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover z-0"
                fill
                priority
            />
            <div className="relative z-10 w-full max-w-[78%] mx-auto px-4 sm:px-6 md:px-0" style={{ marginTop: "-5%" }}>
                <ImpactHeader />
                <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 place-items-center">
                    {statistics.map((stat, index) => (
                        <StatCard key={index} value={stat.value} description={stat.description} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ConsultingServicesImpact;
