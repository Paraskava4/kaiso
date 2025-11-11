"use client";
import * as React from "react";
import Image from "next/image";

const CompetitivePositioningAnalysisHero = () => {
    return (
        <section className="relative flex flex-col justify-center items-center w-full px-4 sm:px-8 md:px-16 py-16 md:py-20 min-h-[650px] sm:min-h-[650px] md:h-[calc(100dvh-100px)] lg:h-[calc(100dvh-100px)]">
            {/* Background Image */}
            <Image
                src="/images/ConsultingServicesHero-BG.webp"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                role="presentation"
                width={100}
                height={100}
                quality={100}
            />

            {/* Content Container */}
            <div className="relative w-full max-w-[87%] max-md:max-w-full">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Text Column */}
                    <div className="w-full lg:w-6/12 my-auto">
                        <section
                            className="
            "
                        >
                            <header className="text-base md:text-lg leading-relaxed text-gray-100">Competitive Positioning Analysis</header>

                            <div className="mt-4 sm:mt-6 max-w-full w-full md:w-[700px]">
                                <h1 className="text-[25px] sm:text-[30px] md:text-[32px] lg:text-[34px] xl:text-[36px] font-bold text-white leading-tight md:leading-[40px]">
                                    Competitive Positioning Analysis to Strengthen Your Market Strategy
                                </h1>

                                <p className="mt-4 text-xs sm:text-xs sm:text-[10px] md:text-[12px] 2xl:text-[14px]  leading-6 text-gray-100">
                                    Gain clarity on where you stand in the market with precise, competitor-driven insights. Our Competitive Positioning Analysis
                                    helps you benchmark effectively, identify growth opportunities, and understand rival strategies—enabling smarter moves
                                    whether you're entering new markets, defending share, or repositioning for long-term advantage.
                                </p>
                            </div>

                            {/* CTA Button (kept as-is but commented out) */}
                            {/* 
              <button className="overflow-hidden gap-2.5 px-5 py-3 text-lg font-medium leading-none text-center rounded-lg transition-colors duration-200 text-white bg-red-600 hover:bg-red-700 focus:bg-red-700 min-w-[220px] self-start mt-6">
                Get Start
              </button> 
              */}
                        </section>
                    </div>

                    {/* Image Column */}
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end order-1 lg:order-2">
                        <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
                            <div className="relative">
                                <Image
                                    src="/images/Competitive Positioning-Analysis-Hero-Integrated.webp"
                                    alt="Competitive positioning analysis visualization showing market strategy charts and business analytics"
                                    className="w-[480px] h-auto object-contain drop-shadow-2xl mx-auto"
                                    width={600}
                                    height={520}
                                    quality={85}
                                    priority
                                />

                                {/* Floating Elements for Visual Enhancement */}
                                <div className="absolute -top-4 -right-4 w-8 h-8 sm:w-12 sm:h-12 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                                <div className="absolute -bottom-6 -left-6 w-6 h-6 sm:w-10 sm:h-10 bg-purple-500/20 rounded-full blur-lg animate-pulse delay-1000"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CompetitivePositioningAnalysisHero;
