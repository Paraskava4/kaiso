"use client";
import React, { useEffect, useRef, useState } from "react";

const StatCard = ({ value, description, trigger }) => {
    const [count, setCount] = useState(0);
    const targetNumber = parseInt(value.replace(/[^\d]/g, ""), 10);
    const suffix = value.replace(/[\d,]/g, "");

    useEffect(() => {
        if (!trigger || isNaN(targetNumber)) return;

        let start = 0;
        const duration = 1200;
        const startTime = performance.now();

        const animate = (time) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const currentCount = Math.floor(progress * targetNumber);
            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(targetNumber);
            }
        };

        requestAnimationFrame(animate);
    }, [trigger, targetNumber]);

    return (
        <article className="flex flex-col justify-center items-center px-4 py-4 sm:px-5 sm:py-6 rounded-2xl border border-black/20 backdrop-blur-md bg-white/5 w-full max-w-[300px] text-center h-[170px] sm:h-[160px]">
            <div className="text-3xl py-3 sm:text-4xl md:text-4xl font-semibold text-black">
                {isNaN(targetNumber) ? value : `${count.toLocaleString()}${suffix}`}
            </div>
            <p className="mt-3 text-[13px] text-black/90 ">{description}</p>
        </article>
    );
};

const ImpactHeader = () => {
    return (
        <header className="max-w-full text-center flex justify-center w-full ">
            <div className="text-[20px] font-[600] leading-tight text-black max-w-full">Our Impact in Numbers</div>
        </header>
    );
};

const AboutUsPages = () => {
    const statistics = [
        { value: "5,000+", description: "Off-the-Shelf Research Reports" },
        { value: "2,000+", description: "High-Growth Opportunities Identified" },
        { value: "300+", description: "Technology Trends Tracked Annually" },
        { value: "14+", description: "Industries Covered" },
        { value: "95%", description: "Client Retention Rate" },
    ];

    const sectionRef = useRef(null);
    const [startCount, setStartCount] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStartCount(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="relative bg-white w-full py-0 overflow-hidden min-h-[320px] flex  justify-center">
            {/* <Image
                src="/images/SyndicateReportsPage-component.webp"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover z-0"
                fill
                priority
            /> */}

            <div className="relative z-10 w-full max-w-[77%] mx-auto px-4 sm:px-6 md:px-0 py-[4%]">
                <ImpactHeader />
                <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 place-items-center">
                    {statistics.map((stat, index) => (
                        <StatCard key={index} value={stat.value} description={stat.description} trigger={startCount} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutUsPages;
