"use client";
import React, { useState } from "react";
import Image from "next/image";

const CustomReportsPageHero = ({ onFormRequest }) => {
    const [showFullText, setShowFullText] = useState(false);

    const handleToggleReadMore = () => {
        setShowFullText((prev) => !prev);
    };

    const handleRequestReport = () => {
        if (onFormRequest) {
            onFormRequest();
        }
    };

    const shortText = `When off-the-shelf data falls short, Kaiso’s Custom Report Solutions provide precise, business-aligned intelligence designed around your objectives. From go-to-market assessments and competitive benchmarking to niche opportunity analysis and investment feasibility, `;
    const fullText = ` each engagement is built to answer your most critical questions. We combine domain expertise, flexible scopes, and analyst interaction to ensure you receive targeted, decision-ready insights that support strategic action and measurable impact.`;

    return (
        <section
            className="relative w-full min-h-[calc(100dvh-300px)] sm:min-h-[calc(100dvh-100px)] overflow-visible"
            role="banner"
            aria-label="Custom Reports Hero Section"
        >
            <div className="w-full  bg-[#FAF5F0] grid grid-cols-1 md:grid-cols-2 gap-8 items-center  ">

                {/* Left Content */}
                <div className="flex flex-col ms-[19%] gap-6">
                    <h1
                        className="font-bold text-zinc-900
                        sm:leading-snug
                        lg:leading-tight
                        xl:leading-[1.2]
                        text-[25px] sm:text-[30px] md:text-[32px] lg:text-[34px] xl:text-[36px]"
                    >
                        Custom Market Intelligence, Built Around Your Goals
                    </h1>

                    <p
                        className="text-black
                        sm:leading-relaxed
                        md:max-w-[90%]
                        lg:leading-8
                        text-sm sm:text-sm md:text-[12px] lg:text-[13px] xl:text-[14px]"
                    >
                        {shortText}
                        {showFullText && fullText}
                        {!showFullText && (
                            <span
                                onClick={handleToggleReadMore}
                                className="text-[#17306E] cursor-pointer font-medium hover:underline"
                            >
                                Read More
                            </span>
                        )}
                        {showFullText && (
                            <span
                                onClick={handleToggleReadMore}
                                className="text-[#17306E] cursor-pointer font-medium hover:underline"
                            >
                                Read Less
                            </span>
                        )}
                    </p>

                    <div className="mt-4 w-full max-w-xs">
                        <button
                            onClick={handleRequestReport}
                            className="w-full py-2 text-sm bg-[#17306E] rounded-lg text-white font-medium
                            hover:bg-sky-800 transition-colors
                            focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50
                            sm:text-base sm:py-2
                            md:text-md md:py-2"
                            aria-label="Request a custom business report"
                        >
                            Request a Custom Report
                        </button>
                    </div>
                </div>

                {/* Right Image */}
                <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] xl:h-[600px]">
                    <Image
                        src="/images/customReport1.webp"
                        alt="Abstract data visualization background"
                        fill
                        className="object-contain md:object-cover"
                        quality={100}
                        priority
                    />
                </div>
            </div>
        </section>
    );
};

export default CustomReportsPageHero;
