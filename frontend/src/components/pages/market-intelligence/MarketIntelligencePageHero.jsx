"use client";
import React from "react";
import Image from "next/image";

export default function MarketIntelligencePageHero() {
    return (
        <section className="relative flex items-center justify-center w-full h-[calc(100dvh-100px)] px-4 sm:px-6 lg:px-10 overflow-hidden">
            {/* Background Image */}
            <Image
                src="/images/SyndicateReportsPage-component.webp"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                role="presentation"
                width={1920}
                height={1080}
                quality={100}
            />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-[86%] mx-auto h-full lg:h-[calc(100%-115px)] flex items-center">
                <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-8">
                    {/* Left Content */}
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-col justify-center w-full">
                            <p className="text-gray-100 text-xs sm:text-xs sm:text-[14px] md:text-[16px] 2xl:text-[18px]">Market Intelligence</p>

                            <header className="mt-4 w-full">
                                <h1 className="text-[25px] sm:text-[30px] md:text-[32px] lg:text-[34px] xl:text-[36px] font-bold text-white leading-tight">
                                    From Insight to Advantage: Power Your Decisions with Market Intelligence
                                </h1>
                                <p className="mt-4 text-gray-100 leading-relaxed text-xs sm:text-xs sm:text-[10px] md:text-[12px] 2xl:text-[14px]">
                                    In dynamic industries, timely intelligence is critical. Our Market Intelligence transforms fragmented data into strategic
                                    clarity, enabling you to assess risks, track trends, and uncover growth opportunities with precision and confidence.
                                </p>
                            </header>

                            {/* Optional CTA Button */}
                            {/* <button className="mt-6 px-5 py-3 bg-red-600 text-white rounded-lg text-base sm:text-lg hover:bg-red-700 transition">
                                Get Started
                            </button> */}
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="w-[90%] sm:w-[44%]">
                        <Image
                            src="/images/MarketIntelligence.webp"
                            alt="Market Intelligence Visual"
                            className="w-full max-w-full object-contain rounded-3xl"
                            width={800}
                            height={600}
                            quality={100}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
