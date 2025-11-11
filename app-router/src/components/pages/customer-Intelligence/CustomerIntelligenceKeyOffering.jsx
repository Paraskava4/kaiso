"use client";
import * as React from "react";
import Image from "next/image";

export default function CustomerIntelligenceKeyOffering() {
    const keyOfferings = [
        {
            id: 1,
            backgroundImage: "/images/Customer1.webp",
            title: "Voice of Customers",
            description: "Uncover the truth behind what your customers think, feel, and want.",
            iconImage: "/icons/Key-offering.webp",
            listItems: [
                "Capture customer opinions in real time",
                "Discover expectations and unmet needs",
                "Understand key satisfaction and dissatisfaction drivers",
                "Shape messaging and offerings based on actual voice",
                "Capture emotional and behavioural customer triggers",
            ],
        },
        {
            id: 2,
            backgroundImage: "/images/Customer2.webp",
            title: "Customer Satisfaction and Loyalty Assessment",
            description: "Measure how satisfied your customers are and what keeps them coming back.",
            iconImage: "/icons/Key-offering.webp",
            listItems: [
                "Evaluate satisfaction at key touchpoints",
                "Identify factors behind churn or disengagement",
                "Improve loyalty through targeted interventions",
                "Compare customer experience across segments",
                "Reveal CX gaps and improvement areas",
            ],
        },
        {
            id: 3,
            backgroundImage: "/images/customer3.webp",
            title: "Product Launches and Success Assessment",
            description: "Collect actionable feedback to refine product launches and drive adoption.",
            iconImage: "/icons/Key-offering.webp",
            listItems: [
                "Understand product adoption and usability issues",
                "Identify mismatches in expectations vs experience",
                "Collect customer views during pilot or soft launch",
                "Test messaging, pricing, and positioning effectiveness",
                "Post-launch performance to optimise ROI",
            ],
        },
        {
            id: 4,
            backgroundImage: "/images/Customer4.webp",
            title: "Retailer Satisfaction and Effectiveness Index",
            description: "Strengthen distributor and channel relationships through focused insights.",
            iconImage: "/icons/Key-offering.webp",
            listItems: [
                "Assess engagement and satisfaction across retail partners",
                "Identify support gaps and channel concerns",
                "Measure retailer performance and sales impact",
                "Improve communication and engagement strategies",
                "Improve channel strategy and drive retail performance",
            ],
        },
        {
            id: 5,
            backgroundImage: "/images/Customer5.webp",
            title: "Product Testing",
            description: "Validate product concepts, usability, and appeal before going to market.",
            iconImage: "/icons/Key-offering.webp",
            listItems: [
                "Gather early feedback on features and design",
                "Test packaging, pricing, and positioning",
                "Evaluate usability and customer experience",
                "Compare alternate product versions or prototypes",
                "Minimise launch risks through real-world validation",
            ],
        },
        {
            id: 6,
            backgroundImage: "/images/Customer6.webp",
            title: "Consumer Behaviour Analysis",
            description: "Understand what drives customer decisions and how they interact with your brand.",
            iconImage: "/icons/Key-offering.webp",
            listItems: [
                "Analyse how customers discover, evaluate, and buy",
                "Segment behaviour by demographic and psychographic traits",
                "Track behaviour shifts across channels and platforms",
                "Identify decision-making patterns and key triggers",
                "Forecast future behaviour based on data trends",
            ],
        },
    ];

    return (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-12 bg-gray-100">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-12 lg:mb-16">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-semibold leading-tight text-zinc-900 mb-4">
                            Our Strategic Focus Areas
                        </h2>
                        <p className="text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] text-zinc-700 leading-relaxed">
                            Explore the core areas where our Customer Intelligence solutions deliver the most impact. Each offering is designed to uncover
                            valuable insights that drive smarter, customer-centric decisions.
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {keyOfferings.map((item) => (
                        <FocusAreaCard
                            key={item.id}
                            backgroundImage={item.backgroundImage}
                            title={item.title}
                            description={item.description}
                            iconImage={item.iconImage}
                            listItems={item.listItems}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FocusAreaCard({ backgroundImage, title, description, iconImage, listItems }) {
    return (
        <article className="group relative w-full h-full">
            <div
                className="flex relative z-10 flex-col w-full 
                h-[250px] sm:h-[280px] lg:h-[310px]  // 🔽 reduced card heights
                rounded-3xl overflow-hidden"
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={backgroundImage}
                        alt={`Background for ${title}`}
                        width={360} // 🔽 reduced width
                        height={280} // 🔽 reduced height
                        quality={100}
                        className="rounded-3xl object-cover w-full h-full"
                    />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-[5px] bg-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 sm:p-4 lg:p-5 z-20 flex flex-col justify-start gap-2 sm:gap-2 overflow-auto">
                    <div className="flex items-center justify-between gap-2 sm:gap-3">
                        <h3 className="text-sm sm:text-sm lg:text-sm font-semibold text-zinc-900 leading-tight">{title}</h3>
                        <Image
                            src={iconImage}
                            alt=""
                            className="w-4 h-4 sm:w-5 sm:h-5 object-contain flex-shrink-0" // 🔽 smaller icon
                            width={100}
                            height={100}
                            quality={100}
                        />
                    </div>
                    <p className="italic text-xs sm:text-xs lg:text-xs text-zinc-600 leading-relaxed">
                        {description.length > 60 ? `${description.slice(0, 60)}...` : description}
                    </p>
                    <div className="flex-grow">
                        <hr className="border-t border-zinc-300 mb-2" />
                        <ul className="list-disc list-inside text-xs sm:text-xs text-zinc-700 space-y-1 leading-relaxed">
                            {listItems.map((item, index) => (
                                <li key={index} className="break-words">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Base Card Content */}
                <div className="flex relative gap-2 sm:gap-3 items-center px-3 sm:px-4 py-2 sm:py-3 mt-auto bg-white rounded-2xl z-10 mx-1.5 mb-1.5">
                    <div className="flex flex-1 shrink gap-2 sm:gap-3 lg:gap-5 justify-between items-center w-full">
                        <div className="flex flex-col flex-grow min-w-0">
                            <h3 className="text-sm sm:text-sm font-semibold text-zinc-900 leading-tight truncate">{title}</h3>
                            <p className="mt-1 sm:mt-1.5 text-xs sm:text-xs italic leading-snug text-zinc-600 line-clamp-2">
                                {description.length > 32 ? `${description.slice(0, 32)}...` : description}
                            </p>
                        </div>

                        <Image
                            src={iconImage}
                            alt="Icon"
                            width={100}
                            height={100}
                            quality={100}
                            className="object-contain shrink-0 w-4 h-4 sm:w-5 sm:h-5 aspect-square" // 🔽 smaller icon
                            aria-hidden="true"
                        />
                    </div>
                </div>
            </div>
        </article>
    );
}
