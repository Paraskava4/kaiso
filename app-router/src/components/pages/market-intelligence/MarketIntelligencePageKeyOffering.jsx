"use client";
import * as React from "react";
import Image from "next/image";

export default function MarketIntelligencePageKeyOffering() {
    const keyOfferings = [
        {
            id: 1,
            backgroundImage: "/images/MarketIntelligence11.webp",
            title: "Feasibility Study",
            description: "Every move counts—especially the first one.",
            iconImage: "/icons/Key-offering.webp",
            details: {
                intro: "Feasibility Study",
                subDescription: "Every move counts—especially the first one.",
                bulletPoints: [
                    "Evaluate market readiness, size, and maturity",
                    "Assess cost structures, ROI models, and risk factors",
                    "Analyse consumer behaviour and buying intent",
                    "Review partner ecosystem and supply dynamics",
                    "Support go/no-go decisions with objective data",
                ],
            },
        },
        {
            id: 2,
            backgroundImage: "/images/MarketIntelligence12.webp",
            title: "Market Entry Strategy",
            description: "Entering a new market is more than geography—it's precision.",
            iconImage: "/icons/Key-offering.webp",
            details: {
                intro: "Market Entry Strategy",
                subDescription: "Entering a new market is more than geography—it's precision.",
                bulletPoints: [
                    "Decode local buyer behaviour and preferences",
                    "Evaluate competitor density and white space",
                    "Address cultural, regulatory, and compliance factors",
                    "Develop localised GTM and channel strategy",
                    "Minimise friction and maximise first-mover impact",
                ],
            },
        },
        {
            id: 3,
            backgroundImage: "/images/MarketIntelligence13.webp",
            title: "Market Expansion Strategy",
            description: "Scale with confidence. Expand with logic.",
            iconImage: "/icons/Key-offering.webp",
            details: {
                intro: "Market Expansion Strategy",
                subDescription: "Scale with confidence. Expand with logic.",
                bulletPoints: [
                    "Identify and tap into adjacent categories, new geographies, and unmet customer segments",
                    "Discover global and regional expansion zones",
                    "Prioritise growth segments by revenue potential",
                    "Build tailored playbooks by market maturity",
                    "Support multi-region planning and rollouts",
                ],
            },
        },
        {
            id: 4,
            backgroundImage: "/images/MarketIntelligece14.webp",
            title: "Risk Assessment",
            description: "Foresee volatility before it affects performance.",
            iconImage: "/icons/Key-offering.webp",
            details: {
                intro: "Risk Assessment",
                subDescription: "Foresee volatility before it affects performance.",
                bulletPoints: [
                    "Track policy, economic, and regulatory shifts",
                    "Identify supply chain and operational risks",
                    "Monitor competitor threats and demand volatility",
                    "Build predictive risk models and mitigation plans",
                    "Guide leadership with early warning signals",
                ],
            },
        },
        {
            id: 5,
            backgroundImage: "/images/MarketIntelligence15.webp",
            title: "Sales Intelligence",
            description: "Turn your data into a sharper revenue engine.",
            iconImage: "/icons/Key-offering.webp",
            details: {
                intro: "Sales Intelligence",
                subDescription: "Turn your data into a sharper revenue engine.",
                bulletPoints: [
                    "Decode pricing sensitivity and purchase patterns",
                    "Track buyer intent and conversion trends",
                    "Identify high-performing sales channels",
                    "Align messaging with real customer needs",
                    "Drive revenue growth with faster, smarter, and more targeted selling",
                ],
            },
        },
        {
            id: 6,
            backgroundImage: "/images/MarketIntelligence16.webp",
            title: "Demand Mapping",
            description: "See where demand is rising—and why",
            iconImage: "/icons/Key-offering.webp",
            details: {
                intro: "Demand Mapping",
                subDescription: "See where demand is rising—and why",
                bulletPoints: [
                    "Identify demand pockets and fast-growing regions",
                    "Monitor funnel performance and intent signals",
                    "Highlight high-value clusters and underserved geographies",
                    "Align distribution with opportunity hotspots",
                    "Align supply chain and marketing efforts to high-return areas",
                ],
            },
        },
    ];

    return (
        <section className="flex flex-col px-4 py-14 md:px-12 xl:px-28 bg-white">
            <header className="flex flex-col items-center w-full text-center">
                <div className="flex flex-col items-center max-w-5xl w-full">
                    <h2 className="mt-2 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] font-semibold leading-snug text-zinc-900">
                        Our Strategic Focus Areas
                    </h2>
                    <p className="mt-2 text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px] text-black">
                        Strategic areas of Market Intelligence uncover actionable insights that reduce risk, fuel growth, and enable smarter decisions.
                    </p>
                </div>
            </header>

            <div className="mt-12 w-full max-w-5xl mx-auto max-md:mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {keyOfferings.map((item) => (
                        <FocusAreaCard
                            key={item.id}
                            backgroundImage={item.backgroundImage}
                            title={item.title}
                            description={item.description}
                            iconImage={item.iconImage}
                            details={item.details}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FocusAreaCard({ backgroundImage, title, description, iconImage, details }) {
    const truncateText = (text, limit = 40) => {
        return text.length > limit ? text.slice(0, limit) + "..." : text;
    };

    return (
        <article className="group relative grow shrink min-w-[240px] w-full">
            <div className="flex relative z-10 flex-col px-1 pt-52 pb-1 w-full rounded-2xl min-h-[280px] overflow-hidden">
                {/* Background image */}
                <div className="absolute inset-0">
                    <Image
                        src={backgroundImage}
                        alt={`Background for ${title}`}
                        width={360}
                        height={260}
                        quality={90}
                        className="rounded-2xl object-cover w-full h-full"
                    />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-[4px] bg-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 z-20 flex flex-col justify-start gap-2.5">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-zinc-900">{details.intro}</h3>
                        <Image
                            src={iconImage}
                            alt="Icon"
                            width={80}
                            height={80}
                            quality={90}
                            className="w-5 h-5 object-contain"
                        />
                    </div>
                    <p className="italic text-xs">{details.subDescription}</p>
                    <hr className="text-gray-300" />
                    <ul className="list-disc list-inside text-[11px] text-zinc-700 space-y-1 mt-1">
                        {details.bulletPoints.map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </div>

                {/* Base Card Content */}
                <div className="flex relative gap-2 items-center px-3 py-2 mt-auto bg-white rounded-xl z-10">
                    <div className="flex flex-1 shrink gap-3 justify-between items-center w-full">
                        <div className="w-full">
                            <h3 className="text-sm leading-tight text-zinc-900">{title}</h3>
                            <p className="mt-1 text-xs italic leading-snug text-zinc-600">{truncateText(description)}</p>
                        </div>
                        <Image
                            src={iconImage}
                            alt="Icon"
                            width={80}
                            height={80}
                            quality={90}
                            className="object-contain shrink-0 w-5 h-5"
                            aria-hidden="true"
                        />
                    </div>
                </div>
            </div>
        </article>
    );
}