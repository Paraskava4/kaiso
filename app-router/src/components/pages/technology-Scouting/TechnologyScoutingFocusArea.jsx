import React, { useState } from "react";
import { ResponsiveMarginContainer } from "../../ui";
import Image from "next/image";

const TechnologyScoutingFocusArea = () => {
    const focusAreas = [
        {
            title: "Technology Intelligence",
            subtitle: "Power your strategy with clear tech foresight.",
            bulletPoints: [
                "Monitor global R&D activity, patents, and emerging players",
                "Identify innovation hotspots across industries",
                "Analyse competitor technology roadmaps",
                "Map strategic technology alliances and partnerships",
                "Gain continuous visibility into innovations, competitive movements, and IP trends shaping your industry’s future.",
            ],
        },
        {
            title: "Idea Funnel Management",
            subtitle: "From idea to impact, optimise your innovation pipeline.",
            bulletPoints: [
                "Build a staged evaluation process for new ideas",
                "Score innovations based on impact, feasibility, and alignment",
                "Prioritise investment across early-stage concepts and high-impact opportunities for development",
                "Reduce resource wastage through early disqualification filters",
                "Ensure only the most relevant and viable technology ideas move forward with structured validation",
                "Improve time-to-market by accelerating concept-to-commercialization",
            ],
        },
        {
            title: "Technology Landscape Benchmarking",
            subtitle: "Compare smarter. Choose what moves you forward.",
            bulletPoints: [
                "Benchmark across functionality, lifecycle, and adoption trends",
                "Assess maturity, integration complexity, and cost",
                "Identify gaps and opportunities for differentiation",
                "Evaluate best-in-class vs emerging technology trade-offs",
                "Compare available technologies to find the most suitable, scalable, and strategically aligned options.",
                "Make better investment and roadmap decisions by knowing your place in the innovation race.",
            ],
        },
        {
            title: "Emerging Technology Monitoring",
            subtitle: "Stay ahead by tracking what’s next, not just what’s now.",
            bulletPoints: [
                "Monitor academic, startup, and early-stage innovation ecosystems",
                "Detect shifts in technology funding and policy environments",
                "Identify technologies entering commercial viability stages",
                "Alert leadership on high-impact, under-the-radar developments",
                "Track signals of disruptive change before they affect your market or strategy",
                "Stay future-ready by identifying what’s next before it’s everywhere",
            ],
        },
        {
            title: "New Product Research",
            subtitle: "Validate innovation before committing to build",
            bulletPoints: [
                "Identify unmet needs and whitespace in existing markets",
                "Analyse competitor product evolution and user feedback",
                "Validate acceptance potential before product development",
                "Align product development with future-focused demand signals",
                "Validate innovation efforts by understanding evolving customer needs and competitive product dynamics.",
                "Deliver products that are needed, wanted, and ready to scale.",
            ],
        },
    ];

    // ✅ Updated: no card open by default
    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleToggle = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index); // Toggle or close if already open
    };

    return (
        <ResponsiveMarginContainer>
            <header className="flex flex-col items-center w-full text-center max-w-7xl mx-auto leading-relaxed px-4 sm:px-6 lg:px-8">
                {/* <p className="text-base font-medium text-red-600">
            Our Key Pillars
          </p> */}
                <h2 className=" text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-semibold leading-tight text-zinc-900">
                    Our Key Pillars
                </h2>
                <p className="mt-2 text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] text-zinc-700">
                    Each pillar of our Technology Scouting & Monitoring framework is designed to deliver clarity, speed, and strategic precision.
                </p>
            </header>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start mt-8 sm:mt-10 lg:mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                    {focusAreas.map(({ title, subtitle, bulletPoints }, index) => (
                        <article
                            key={index}
                            className="flex flex-col justify-center p-5 w-full bg-orange-50 rounded-2xl border border-[color:var(--Steel-Gray-Scale-Black-400,#5A5D63)] cursor-pointer"
                            onClick={() => handleToggle(index)}
                            onMouseEnter={() => setExpandedIndex(index)} // expand on hover
                            onMouseLeave={() => setExpandedIndex(null)} // ✅ collapse back to none
                        >
                            <h2 className="text-md sm:text-md md:text-md lg:text-md font-semibold text-zinc-900">{title}</h2>
                            {subtitle && <h3 className="mt-2 sm:mt-3 text-sm italic font-medium text-zinc-800">{subtitle}</h3>}

                            <div
                                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                                    expandedIndex === index ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
                                }`}
                            >
                                {bulletPoints && (
                                    <ul className="mt-3 list-disc list-inside space-y-1">
                                        {bulletPoints.map((point, i) => (
                                            <li key={i} className="text-sm">
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </article>
                    ))}
                </div>

                <aside className="w-full lg:w-1/2">
                    <Image
                        src="/images/technoscouting.webp"
                        alt="Technology scouting focus area"
                        className="object-contain rounded-2xl w-full h-auto"
                        width={650}
                        height={448}
                        quality={100}
                    />
                </aside>
            </div>
        </ResponsiveMarginContainer>
    );
};

export default TechnologyScoutingFocusArea;
