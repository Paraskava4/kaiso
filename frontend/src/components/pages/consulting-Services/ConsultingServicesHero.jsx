"use client";
import React, { useRef } from "react";
import { Plus } from "lucide-react";
import Image from "next/image";

const heroImages = Array.from({ length: 11 }, (_, i) => `/images/Consulting-Services-Hero-${i + 1}.webp`);

const heroGrid = [
    "col-start-4 col-end-5 row-start-1 row-end-4",
    "col-start-4 col-end-5 row-start-4 row-end-7",
    "col-start-4 col-end-5 row-start-7 row-end-10",
    "col-start-3 col-end-4 row-start-9 row-end-12",
    "col-start-3 col-end-4 row-start-6 row-end-9",
    "col-start-3 col-end-4 row-start-3 row-end-6",
    "col-start-2 col-end-3 row-start-2 row-end-5",
    "col-start-2 col-end-3 row-start-5 row-end-8",
    "col-start-2 col-end-3 row-start-8 row-end-11",
    "col-start-1 col-end-2 row-start-4 row-end-7",
    "col-start-1 col-end-2 row-start-7 row-end-10",
];

const services = [
    {
        title: "Market Assessment",
        description: "",
        image: "/images/consulting1.webp",
    },
    {
        title: "Market Intelligence",
        description: "",
        image: "/images/consulting2.webp",
    },
    {
        title: "Competitive Positioning Analysis",
        description: "",
        image: "/images/consulting3.webp",
    },
    {
        title: "Partner Identification",
        description: "",
        image: "/images/consulting4.webp",
    },
    {
        title: "Technology Scouting & Monitoring",
        description: "",
        image: "/images/consulting5.webp",
    },
    {
        title: "Strategic Analysis ",
        description: "",
        image: "/images/consulting6.webp",
    },
    {
        title: "Customer Intelligence",
        description: "",
        image: "/images/ConsultingServices7.webp",
    },
];

export default function ConsultingServicesHero() {
    const scrollRef = useRef(null);
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
        isDown = true;
        scrollRef.current.classList.add("cursor-grabbing");
        startX = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft = scrollRef.current.scrollLeft;
    };

    const handleMouseLeave = () => {
        isDown = false;
        scrollRef.current.classList.remove("cursor-grabbing");
    };

    const handleMouseUp = () => {
        isDown = false;
        scrollRef.current.classList.remove("cursor-grabbing");
    };

    const handleMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // scroll speed
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <>
            {/* ─── Hero Section ─── */}
            <section
                className="w-full px-4 md:px-16 xl:px-[240px] py-[60px] flex flex-col-reverse lg:flex-row items-center justify-between gap-10 relative h-auto md:h-[calc(100dvh-100px) lg:h-[calc(100dvh-100px)]"
                style={{ margin: "0 auto" }}
            >
                {/* Background image using Next.js Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/ConsultingServicesHero-BG.webp"
                        alt="Consulting Services Background"
                        width={1920}
                        height={1080}
                        quality={100}
                        priority
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                </div>

                <div className="flex flex-col gap-6 w-full lg:max-w-[700px]  text-white relative z-10">
                    <h2 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-3xl 2xl:text-3xl font-bold leading-[120%]">
                        Consulting Solutions Built for Growth, Innovation, and Impact
                    </h2>

                    <p className="text-[#F3F4F6] text-base sm:text-lg md:text-[16px] 2xl:text-[15px] leading-[160%]">
                        From early-stage planning to financial, operational, and expansion strategies, Kaiso’s consulting services help organizations drive
                        growth, enhance resilience, and achieve measurable impact through evidence-led, precision-focused execution across critical business
                        priorities.
                    </p>
                </div>

                <div className="w-full sm:w-[500px] md:w-[600px] lg:w-[700px] h-[500px] md:h-[600px] xl:h-full relative z-10">
                    <div className="grid grid-cols-4 grid-rows-[repeat(11,minmax(0,1fr))] gap-[12px] w-full h-full">
                        {heroImages.map((src, index) => (
                            <div key={index} className={heroGrid[index]}>
                                <Image
                                    src={src}
                                    alt={`Grid ${index + 1}`}
                                    className="w-full h-full object-cover rounded-xl shadow-md"
                                    width={200}
                                    height={200}
                                    quality={100}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Scrollable Section ─── */}
            <section className="w-full bg-[#F1F2F4] py-10 " style={{ margin: "0 auto" }}>
                <div className="text-center mb-8">
                    <h2 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-bold text-gray-800 mt-1">
                        Core Consulting Pillars
                    </h2>
                    <p className="text-black-500 mb-10 mt-2 max-w-3xl mx-auto text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] leading-[160%]">
                        Our consulting services solve key challenges across markets, operations, and customers, delivering insights that drive growth, strategic
                        clarity, and competitive advantage where it matters most.
                    </p>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-scroll overflow-y-hidden cursor-grab select-none mx-auto max-w-[81%] "
                    style={{
                        scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none", // IE/Edge
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                >
                    {services.map((s, i) => (
                        <div
                            key={i}
                            className="w-[220px] sm:w-[280px] md:w-[320px] h-[300px] sm:h-[350px] bg-[#FEFEFE] shadow-sm p-6 relative group hover:shadow-md transition-all duration-300 snap-start flex-shrink-0"
                        >
                            <span
                                className="absolute top-4 right-4 text-[#16306C] transition-all duration-300 ease-in-out group-hover:text-[#D1003B] group-hover:rotate-90"
                                style={{ fontSize: "28px", display: "inline-block" }}
                            >
                                <Plus />
                            </span>

                            <h3 className="text-sm sm:text-sm text-gray-900 mb-4" style={{ fontWeight: "500" }}>
                                {s.title}
                            </h3>

                            <Image
                                src={s.image}
                                alt={s.title}
                                className="pointer-events-none  object-cover select-none w-full h-[200px] object-contain transform scale-110 filter grayscale group-hover:filter-none transition-all duration-500"
                                width={400}
                                height={300}
                                quality={100}
                            />

                            <p className="text-xs sm:text-xs h-8 text-gray-600 leading-relaxed mb-5">{s.description}</p>

                            <button className="text-xs sm:text-sm transition-all duration-300 group">
                                <span className="text-[#16306C] group-hover:text-[#D1003B] px-1" style={{ fontSize: "16px" }}>
                                    [
                                </span>
                                <span className="text-[#D1003B] group-hover:text-[#16306C]"> LEARN MORE </span>
                                <span className="text-[#16306C] group-hover:text-[#D1003B] px-1" style={{ fontSize: "16px" }}>
                                    ]
                                </span>
                            </button>
                        </div>
                    ))}

                    <style jsx>{`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                </div>
            </section>
        </>
    );
}
