// "use client";

// import React, { useState } from "react";
// import Image from "next/image";

// const KeyFeatures = () => {
//     const [readMoreStates, setReadMoreStates] = useState({});

//     const toggleReadMore = (id) => {
//         setReadMoreStates((prev) => ({
//             ...prev,
//             [id]: !prev[id],
//         }));
//     };

// const features = [
//     {
//         id: 1,
//         title: "Analyst-Curated Content",
//         description:
//             "Each report is crafted and validated by experienced industry analysts, delivering insights that are accurate, relevant, and strategically actionable. We go beyond data to decode trends, highlight growth drivers, and provide strategic context you can trust.",
//         iconBg: "bg-gray-100",
//         icon: "/icons/FeatureCard1.webp",
//     },
//     {
//         id: 2,
//         title: "Accurate Predictions ",
//         description:
//             "Our market projections are based on the latest primary interviews and reliable secondary data sources. We continuously track industry shifts and refresh our forecasts to reflect real-time dynamics, helping you stay ahead of market changes.",
//         iconBg: "bg-red-100",
//         icon: "/icons/FeatureCard2.webp",
//     },
//     {
//         id: 3,
//         title: "Cross-Industry Expertise",
//         description:
//             "From technology and healthcare to energy, chemicals, and consumer goods, our broad coverage supports both mainstream and niche market requirements with credible, industry-specific intelligence.",
//         iconBg: "bg-blue-50",
//         icon: "/icons/FeatureCard3.webp",
//     },
//     {
//         id: 4,
//         title: "Ready for Action",
//         description:
//             "Designed with business application in mind, our reports support strategic planning, product development, market entry, and competitive benchmarking. Insights are presented in a clear, decision-ready format for faster execution.",
//         iconBg: "bg-gray-100",
//         icon: "/icons/FeatureCard4.webp",
//     },
//     {
//         id: 5,
//         title: "Customizable Data",
//         description:
//             "Need deeper granularity? Refine your report by geography, customer segment, or competitive profile. Our flexible customisation approach helps you meet specific objectives without starting from scratch.",
//         iconBg: "bg-red-100",
//         icon: "/icons/FeatureCard5.webp",
//     },
// ];

//     return (
//         <div className="w-full bg-gray-100 px-4 sm:px-8 md:px-16 lg:px-28 xl:px-37   py-12 text-start text-base text-red-600 font-inter">
//             <div className="max-w-[800px] mx-auto flex flex-col items-center gap-2">
//                 <h2 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-semibold font-inter-display text-gray-900 leading-[120%]">
//                     What Makes Our Syndicated Reports Different?
//                 </h2>
//             </div>

//             {/* Horizontal Scroll */}
//             <div className="w-full mt-12 overflow-x-auto scrollbar-hide">
//                 <div className="flex gap-4 flex-nowrap">
//                     {features.map((feature) => {
//                         const isExpanded = readMoreStates[feature.id];
//                         const showReadMore = feature.description.length > 110;
//                         const displayedText = isExpanded
//                             ? feature.description
//                             : feature.description.slice(0, 110) +
//                             (showReadMore ? "..." : "");

//                         return (
//                             <div
//                                 key={feature.id}
//                                 className="min-w-[280px] max-w-[300px] flex-shrink-0 bg-white shadow-[0_10px_20px_rgba(0,0,0,0.05)] rounded-2xl p-6 flex flex-col justify-between min-h-[250px]"
//                             >
//                                 <div className="flex flex-col gap-5 h-full">
//                                     {/* Icon */}
//                                     <div className={`rounded-xl ${feature.iconBg} p-3 w-fit`}>
//                                         <Image
//                                             src={feature.icon}
//                                             alt={feature.title}
//                                             width={32}
//                                             height={32}
//                                         />
//                                     </div>

//                                     {/* Content */}
//                                     <div className="flex flex-col gap-2 flex-grow">
//                                         <h3 className="text-md font-medium leading-[140%] text-gray-900">
//                                             {feature.title}
//                                         </h3>
//                                         <p className="text-sm leading-[160%] text-gray-900 font-inter">
//                                             {displayedText}
//                                             {showReadMore && (
//                                                 <button
//                                                     onClick={() => toggleReadMore(feature.id)}
//                                                     className="text-[#D5003C] text-sm font-medium ml-1"
//                                                 >
//                                                     {isExpanded ? "Show Less" : "Read More"}
//                                                 </button>
//                                             )}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default KeyFeatures;

import { CommanAudienceCardContainer } from "@/components/ui/CommanAudienceCard";

const features = [
    {
        id: 1,
        title: "Analyst-Curated Content",
        description:
            "Each report is crafted and validated by experienced industry analysts, delivering insights that are accurate, relevant, and strategically actionable. We go beyond data to decode trends, highlight growth drivers, and provide strategic context you can trust.",
        iconBg: "bg-gray-100",
        icon: "/icons/FeatureCard1.webp",
    },
    {
        id: 2,
        title: "Accurate Predictions ",
        description:
            "Our market projections are based on the latest primary interviews and reliable secondary data sources. We continuously track industry shifts and refresh our forecasts to reflect real-time dynamics, helping you stay ahead of market changes.",
        iconBg: "bg-red-100",
        icon: "/icons/FeatureCard2.webp",
    },
    {
        id: 3,
        title: "Cross-Industry Expertise",
        description:
            "From technology and healthcare to energy, chemicals, and consumer goods, our broad coverage supports both mainstream and niche market requirements with credible, industry-specific intelligence.",
        iconBg: "bg-blue-50",
        icon: "/icons/FeatureCard3.webp",
    },
    {
        id: 4,
        title: "Ready for Action",
        description:
            "Designed with business application in mind, our reports support strategic planning, product development, market entry, and competitive benchmarking. Insights are presented in a clear, decision-ready format for faster execution.",
        iconBg: "bg-gray-100",
        icon: "/icons/FeatureCard4.webp",
    },
    {
        id: 5,
        title: "Customizable Data",
        description:
            "Need deeper granularity? Refine your report by geography, customer segment, or competitive profile. Our flexible customisation approach helps you meet specific objectives without starting from scratch.",
        iconBg: "bg-red-100",
        icon: "/icons/FeatureCard5.webp",
    },
];
const KeyFeatures = () => {
    return (
        <CommanAudienceCardContainer
            data={features}
            title={"What Makes Our Syndicated Reports Different?"}
            // subTitle={
            //     " Market Assessment empowers your organisation with clarity, confidence, and direction. By understanding market size, trends, competitive dynamics, and regional nuances, you can reduce uncertainty, validate opportunities, and make better strategic choices. Whether you're entering new markets, launching products, or prioritising investments, our research helps you act faster and smarter, backed by insights, not assumptions."
            // }
        />
    );
};

export default KeyFeatures;
