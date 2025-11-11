"use client";
import React from "react";
import Image from "next/image";

export default function CustomerIntelligenceHero() {
    return (
        <section
            className="relative flex flex-col items-center justify-center w-full
            px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16
            py-16 sm:py-20 md:py-24 lg:py-32
            min-h-[calc(100dvh-80px)]"
        >
            {/* Background image */}
            <Image
                src="/images/SyndicateReportsPage-component.webp"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                role="presentation"
                fill
                sizes="100vw"
                quality={100}
            />

            {/* Content wrapper */}
            <div className="relative z-10 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] xl:max-w-[75%] mx-auto flex items-center">
                <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
                    {/* Left Text Block */}
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-col justify-center text-center lg:text-left">
                            <p className="text-sm sm:text-base md:text-lg text-gray-100 font-medium">Customer Intelligence</p>
                            <h1 className="mt-3 sm:mt-4 text-[25px] sm:text-[30px] md:text-[32px] lg:text-[34px] xl:text-[36px] font-bold text-white leading-tight sm:leading-snug">
                                Know What Your Customers Want Before They Ask
                            </h1>
                            <p className="mt-3 sm:mt-4 text-xs sm:text-xs sm:text-[10px] md:text-[12px] 2xl:text-[14px] text-gray-100 leading-relaxed">
                                Gain a deeper understanding of customer behaviour, satisfaction, and preferences across every stage, enabling smarter decisions,
                                stronger loyalty, and improved business performance from product launch to post-purchase.
                            </p>
                        </div>
                    </div>

                    {/* Right Image Block */}
                    <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mt-6 lg:mt-0">
                        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
                            <Image
                                src="/images/CustomerIntelligenceHero.webp"
                                alt="Customer Intelligence Visual"
                                className="w-full h-auto object-contain rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl"
                                width={800}
                                height={600}
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 75vw, (max-width: 1024px) 66vw, 50vw"
                                quality={100}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
