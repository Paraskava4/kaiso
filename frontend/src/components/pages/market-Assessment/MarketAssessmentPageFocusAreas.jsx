"use client";
import React, { useState } from "react";
import { ResponsiveMarginContainer } from "../../ui";
import Image from "next/image";

const FocusAreaHeader = () => {
    return (
        <header className="flex flex-col items-center w-full text-center max-w-7xl mx-auto leading-relaxed px-4 sm:px-6 lg:px-8">
            <h2 className="mt-2 text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-semibold leading-tight text-zinc-900">
                Our Key Pillars
            </h2>
            <p className="mt-2 text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] text-zinc-700 max-w-2xl">
                Each focus area addresses a key aspect of market understanding, ranging from sizing and demand analysis to regulatory trends and competitive
                dynamics.
            </p>
        </header>
    );
};

const FocusAreaCard = ({ title, subtitle, description, bulletPoints, isExpanded, onToggle, onHover, onLeave }) => {
    return (
        <article
            className="flex flex-col justify-center p-4 w-full bg-orange-50 rounded-2xl border border-[color:var(--Steel-Gray-Scale-Black-400,#5A5D63)] max-md:px-5 cursor-pointer transition hover:shadow-md"
            onClick={onToggle}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
        >
            <h2 className="font-medium my-2 text-zinc-900 text-lg sm:text-xl md:text-md xl:text-md lg:text-lg leading-[140%]">
                {title}
            </h2>
            <p className="mb-4 text-base text-lg sm:text-xl md:text-md xl:text-sm lg:text-lg italic font-medium text-zinc-900">
                {subtitle}
            </p>
            {/* Smooth expand/collapse transition */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
                {subtitle && <p className="mb-4 text-base sm:text-xl md:text-md xl:text-sm lg:text-lg italic font-medium text-zinc-900">{subtitle}</p>}
                {description && <p className="font-medium">{description}</p>}
                {bulletPoints && (
                    <ul className="mt-3 list-disc list-inside space-y-1">
                        {bulletPoints.map((point, index) => (
                            <li key={index} className="ms-2 text-sm sm:text-sm  md:text-md lg:text-sm xl:text-sm ">
                                {point}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </article>
    );
};

const FocusAreaGrid = () => {
    // ✅ No card open by default
    const [expandedIndex, setExpandedIndex] = useState(null);

    const focusAreas = [
        {
            title: "Current Market Demand",
            subtitle: "Understand the current market potential and future growth outlook.",
            bulletPoints: [
                "Launch and grow with confidence by tapping into real-time demand intelligence.",
                "Analyse buyer interest, preferences, and purchase intent across regions",
                "Identify unmet needs and whitespace opportunities by segment",
                "Align sales and GTM strategies with current consumption behaviour",
                "Enable faster decision-making and optimized targeting",
                "Identify fast-growing applications or use cases",
            ],
        },
        {
            title: "Market Forecast",
            subtitle: "Anticipate future growth and plan for long-term success.",
            bulletPoints: [
                "Predict future growth with accuracy using advanced analytics.",
                "Identify growth drivers and limiting factors",
                "Strategic input for product pipeline, investment plans, and market entry",
                "Assess technology and innovation impact on demand",
                "Use predictive modelling for strategic planning",
                "Project market size across 5–10-year horizons",
            ],
        },
        {
            title: "Global & Regional Market Landscape",
            subtitle: "Understand where your biggest opportunities—and threats—exist.",
            bulletPoints: [
                "Localise your strategy with geo-specific market intelligence.",
                "Analyse regional and global demand variations and priorities",
                "Evaluate regulatory risks, economic conditions, and infrastructure readiness",
                "Support expansion, portfolio diversification, and localisation decisions",
                "Identify high-potential territories and underserved zones",
            ],
        },
        {
            title: "Market Impacting Factors",
            subtitle: "Identify the forces that shape your industry’s future.",
            bulletPoints: [
                "Track the macro and micro trends that influence your industry's trajectory.",
                "Analyse emerging technologies, policy changes, and industry regulations",
                "Monitor innovation cycles and competitor movements",
                "Evaluate socio-economic shifts, consumer sentiment, and trade impacts",
                "Stay agile by adapting your strategy to change catalysts early",
            ],
        },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start mt-8 sm:mt-10 lg:mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {/* Left: Cards */}
            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                {focusAreas.map((area, index) => (
                    <FocusAreaCard
                        key={index}
                        {...area}
                        isExpanded={expandedIndex === index}
                        onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        onHover={() => setExpandedIndex(index)}
                        onLeave={() => setExpandedIndex(null)} // ✅ collapse back to none
                    />
                ))}
            </div>

            {/* Right: Image */}
            <aside className="w-full lg:w-1/2 flex justify-center lg:justify-start">
                <Image
                    width={500}
                    height={600}
                    src="/images/MarketAssesmentFocus.webp"
                    alt="Strategic focus areas visualization"
                    className="object-contain rounded-2xl w-full max-w-[400px] sm:max-w-[500px] h-auto"
                />
            </aside>
        </div>
    );
};

const MarketAssessmentPageFocusAreas = () => {
    return (
        <ResponsiveMarginContainer>
            <FocusAreaHeader />
            <FocusAreaGrid />
        </ResponsiveMarginContainer>
    );
};

export default MarketAssessmentPageFocusAreas;
