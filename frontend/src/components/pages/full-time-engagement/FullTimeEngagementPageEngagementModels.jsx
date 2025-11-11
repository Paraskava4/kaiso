"use client";
import Image from "next/image";
import React from "react";

function FullTimeEngagementPageEngagementModels({ onFormRequest }) {
    const engagementData = [
        {
            id: 1,
            title: "Ad-Hoc and On-Demand Engagement",
            subtitle: "For urgent, one-time or short-term needs",
            features: [
                "Flexible, pay-as-you-go model",
                "Rapid response for time-sensitive research",
                "Dedicated team assigned per project",
                "Pricing: Standard hourly rates (adjustable by scope)",
                "Minimum Guarantee: 160 hours",
            ],
            buttonText: "Start On-Demand Research",
            variant: "light",
            iconUrl: "/icons/FeatureList-Icons-1.webp",
            formConfig: {
                title: "Start On-Demand Research",
                buttonText: "Start On-Demand Research",
                successMessage: "Request submitted successfully!",
                pageName: "Full-Time Engagement(Start On-Demand Research)",
            },
        },
        {
            id: 2,
            title: "Full-Time Dedicated Engagement (FTDE)",
            subtitle: "For clients with continuous or recurring needs",
            features: [
                "Ongoing support from a dedicated team",
                "Consistency, expertise, and scalable capacity",
                "Handles both scheduled and urgent requests",
                "Discounted pricing for long-term commitment",
                "Minimum Guarantee: 400 hours",
            ],
            buttonText: "Book a Long-Term Engagement",
            variant: "dark",
            iconUrl: "/icons/FeatureList-Icons-2.webp",
            formConfig: {
                title: "Book a Long-Term Engagement",
                buttonText: "Book a Long-Term Engagement",
                successMessage: "Request submitted successfully!",
                pageName: "Full-Time Engagement(Book a Long-Term Engagement)",
            },
        },
        {
            id: 3,
            title: "Dedicated Analyst Engagement (DAE)",
            subtitle: "For companies that need an embedded research expert",
            features: [
                "Full-time analyst integrates into your team",
                "Enables cross-team collaboration and knowledge transfer",
                "Focused on strategic alignment and continuity",
                "Cost-effective alternative to full-time hiring",
                "Minimum Guarantee: 480+ hours (Full-Time)",
            ],
            buttonText: "Hire a Dedicated Analyst",
            variant: "light",
            iconUrl: "/icons/FeatureList-Icons-1.webp",
            formConfig: {
                title: "Hire a Dedicated Analyst",
                buttonText: "Hire a Dedicated Analyst",
                successMessage: "Request submitted successfully!",
                pageName: "Full-Time Engagement(Hire a Dedicated Analyst)",
            },
        },
    ];

    return (
        <section className="max-h-[1200px] mx-auto overflow-y-auto py-4 sm:py-12 md:py-16 lg:py-18 xl:py-18 bg-gray-50">
            <div className="container mx-auto w-[81%] h-full">
                <EngagementHeader />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-4 mt-4 sm:mt-4 md:mt-4 pb-4">
                    {engagementData.map((engagement) => (
                        <EngagementCard key={engagement.id} {...engagement} onFormRequest={onFormRequest} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function EngagementHeader() {
    return (
        <header className="text-center max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl mx-auto px-2 sm:px-4">
            <h2 className="text-[26px] font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4 leading-tight">
                Full-Time Engagement Solutions
            </h2>
            <p className="text-sm sm:text-base md:text-md text-gray-600 leading-relaxed">
                Flexible, scalable research support tailored to your priorities, designed for continuous insight generation and long-term strategic alignment.
            </p>
        </header>
    );
}

function EngagementCard({ title, subtitle, features, buttonText, variant = "light", iconUrl, formConfig, onFormRequest }) {
    const isDark = variant === "dark";

    const handleButtonClick = () => {
        if (onFormRequest && formConfig) {
            onFormRequest(formConfig);
        }
    };

    return (
        <div
            className={`group p-4 sm:p-6 md:p-8 rounded-xl border border-gray-200 h-full flex flex-col transition-all duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-xl
                ${isDark
                    ? "bg-blue-950 text-white hover:bg-white hover:text-gray-900"
                    : "bg-white text-gray-900 hover:bg-blue-950 hover:text-white"
                }`}
        >
            <header className="mb-3">
                <h2 className={`text-lg font-semibold leading-tight`}>
                    {title}
                </h2>
                <p className={`mt-1 sm:mt-2 text-sm transition-colors duration-500
                    ${isDark ? "text-gray-200 group-hover:text-gray-600" : "text-gray-600 group-hover:text-gray-200"}
                `}>
                    {subtitle}
                </p>
            </header>

            <FeatureList features={features} variant={variant} iconUrl={iconUrl} />

            <button
                onClick={handleButtonClick}
                className={`mt-auto w-full py-1 sm:py-2 px-4 sm:px-5 rounded-lg font-medium cursor-pointer text-sm transition-all duration-300
        ${isDark
                        ? "bg-white text-gray-700 border border-gray-300"
                        : "border border-gray-300 text-gray-700 group-hover:bg-white group-hover:text-blue-950"
                    }`}
            >
                {buttonText}
            </button>

        </div>
    );
}

function FeatureList({ features, variant = "light", iconUrl }) {
    const isDark = variant === "dark";

    return (
        <ul className="space-y-1 sm:space-y-1 mb-4 flex-grow">
            {features.map((feature, index) => (
                <li
                    key={index}
                    className="flex items-start gap-2 sm:gap-3 transition-colors duration-500"
                >
                    <Image
                        src={iconUrl}
                        alt=""
                        width={0}
                        height={0}
                        className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 sm:mt-1 flex-shrink-0 transition duration-500
                            ${isDark
                                ? "group-hover:invert group-hover:brightness-0" // white → black on hover
                                : "group-hover:invert" // black → white on hover
                            }
                        `}
                        aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed group-hover:text-inherit">
                        {feature}
                    </span>
                </li>
            ))}
        </ul>
    );
}


export default FullTimeEngagementPageEngagementModels;
