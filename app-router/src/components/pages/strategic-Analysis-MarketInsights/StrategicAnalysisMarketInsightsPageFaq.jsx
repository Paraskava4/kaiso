"use client";
import * as React from "react";
import { ResponsiveMarginContainer } from "../../ui";
import Image from "next/image";

const StrategicAnalysisMarketInsightsPageFaq = () => {
    const iconPath = "/icons/Black-Checked.webp";


    return (
        <ResponsiveMarginContainer>
            <section className="rounded-[30px] p-4 sm:p-6 lg:p-8" aria-labelledby="strategic-analysis-heading">
                <div className="w-full max-w-[92%] mx-auto">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center">
                        {/* Text Content */}
                        <div className="w-full lg:w-1/2 order-2 lg:order-1 text-center lg:text-left">
                            <h1 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-semibold leading-tight text-zinc-900 mb-3 sm:mb-4">
                                Why Strategic Analysis Matters
                            </h1>
                            <p className="text-sm sm:text-base lg:text-md text-zinc-900 font-medium mb-3 sm:mb-4">Markets evolve. So should your strategy.</p>
                            <p className="text-sm text-black leading-relaxed">
                                Sound strategy requires more than instinct—it demands a structured, evidence-based evaluation of markets, opportunities, and
                                risks. Strategic Analysis helps organizations prioritise initiatives, assess market viability, and align decisions with
                                long-term goals. It transforms complex data into clear direction, enabling leaders to act confidently, optimise resource
                                allocation, and ensure every strategic move delivers measurable value.
                            </p>
                        </div>

                        {/* Image Content */}
                        <div className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center">
                            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-full">
                                <Image
                                    src="/images/Strategic1.webp"
                                    alt="Strategic analysis visualization showing data charts and business insights"
                                    className="object-contain w-full h-auto rounded-2xl lg:rounded-3xl mx-auto"
                                    width={600}
                                    height={476}
                                    quality={100}
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </ResponsiveMarginContainer>
    );
};

export default StrategicAnalysisMarketInsightsPageFaq;
