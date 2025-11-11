"use client";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const CaseStudiesHeader = () => {
    return (
        <header className="flex flex-col max-w-full leading-relaxed text-center w-7xl">
            <h2 className="mt-2 text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-semibold leading-tight text-zinc-900 max-md:max-w-full">
                Our Strategic Focus Areas
            </h2>
            <p className="self-center mt-2 text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] text-zinc-800 max-md:max-w-full">
                Identifying the right partners demands more than name recognition or geographic reach. Kaiso applies a rigorous, intelligence-driven methodology
                to evaluate, select, and support high-value strategic alliances.
            </p>
        </header>
    );
};

export const CaseStudyCard = ({ imageUrl, title, subTitle, subTitle2, altText, description, cntactButton = false, cardHeight = "450px" }) => {
    const router = useRouter();
    const { redirect } = useRouteRedirect();

    return (
        <div className="relative group w-full cursor-pointer overflow-y-hidden">
            {/* Top Progress Line */}
            <div className="absolute top-0 left-0 w-full h-1 overflow-hidden z-20">
                <div className="h-full w-full bg-[#163272] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100"></div>
            </div>

            {/* Card */}
            <div className={`overflow-hidden shadow-md w-full h-[450px] bg-transparent transition-transform duration-400 hover:shadow-xl`}>
                {/* Top Half: Title and Description */}
                <div className="flex flex-col items-start px-6 py-8 bg-white h-[190px] z-10">
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2 leading-tight max-h-16 overflow-hidden transition-all duration-400 group-hover:max-h-0 group-hover:opacity-0 line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-sm font-normal text-zinc-800 max-h-20 overflow-hidden transition-all duration-400 group-hover:max-h-0 group-hover:opacity-0 line-clamp-3">
                        {subTitle}
                    </p>
                </div>

                {/* Bottom Half: Image */}
                <div className="relative h-1/1 transition-all duration-300 group-hover:translate-y-full group-hover:opacity-0">
                    <Image src={imageUrl} alt={altText} fill quality={100} className="object-cover w-full h-full" />
                </div>

                {/* Hover background (covers full card) */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-20"></div>

                {/* Hover content (covers full card) */}
                <div className="absolute inset-0 flex flex-col items-center text-left opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-y-4 group-hover:translate-y-0 z-30 px-6 py-8">
                    <div className="flex flex-col items-start z-10">
                        <h3 className="text-lg font-semibold text-zinc-900 mb-2 leading-tight max-h-16 line-clamp-2">{title}</h3>
                        <p className="text-sm font-normal text-zinc-800 mb-2  max-h-20 line-clamp-3">{subTitle}</p>
                    </div>
                    <p className="text-xs font-normal text-zinc-600 italic text-center mb-4 line-clamp-3">{subTitle2}</p>
                    <ul className="text-sm text-zinc-700 leading-relaxed text-left space-y-2 max-w-sm mx-auto overflow-y-auto">
                        {description?.map((point, index) => (
                            <li key={index} className="relative pl-4">
                                <span className="absolute left-0 top-2 h-1 w-1 rounded-full bg-zinc-700" />
                                <span className="line-clamp-2">{point}</span>
                            </li>
                        ))}
                    </ul>
                    {cntactButton && (
                        <button
                            onClick={() => redirect("contactus")}
                            className="flex items-center gap-2 px-5 py-2 my-5 bg-transparent border border-zinc-900 rounded-lg text-xs sm:text-sm md:text-md text-zinc-900 font-medium hover:bg-[#153272] hover:text-white focus:text-white transition-colors duration-300"
                        >
                            <span>Contact us</span>
                            {/* <Image
                                src="/icons/Right-ArrowBlack.webp"
                                width={16}
                                height={16}
                                alt="Arrow"
                                className="w-3 sm:w-3.5 md:w-4 lg:w-5 hover:text-white h-3 sm:h-3.5 md:h-4 lg:h-5"
                                aria-hidden="true"
                            /> */}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const PartnerIdentificationPageCaseStudies = () => {
    const caseStudies = [
        {
            id: 1,
            imageUrl: "/images/PartnerIdentificationCaseStudy1.webp",
            title: "M&A Due Diligence",
            subTitle: "Every successful acquisition begins with certainty.",
            subTitle2: "Our in-depth due diligence provides the clarity needed to confirm strategic, financial, and operational alignment before acquisition.",
            description: [
                "Identify legal liabilities and compliance risks",
                "Analyse financial performance and revenue sustainability",
                "Assess cultural and organizational alignment",
                "Validate operational integration feasibility",
                "Evaluate synergy potential and value drivers",
            ],
            altText: "Market expansion strategy",
        },
        {
            id: 2,
            imageUrl: "/images/PartnerIdentificationCaseStudy2.webp",
            title: "M&A Scanning & Targeting",
            subTitle: "Find the right targets before your competitors do",
            subTitle2: "We identify and rank high-potential M&A or JV targets using tailored scanning models aligned with strategic goals.",
            description: [
                "Filter targets by sector, scale, strategic fit, geography and scalability",
                "Evaluate competitive positioning and market relevance",
                "Prioritise based on innovation or geographic reach",
                "Assess ownership structure and acquisition readiness",
                "Create ranked target lists for decision-makers",
            ],
            altText: "Analyzing revenue potential",
        },
        {
            id: 3,
            imageUrl: "/images/PartnerIdentificationCaseStudy3.webp",
            title: "M&A Support",
            subTitle: "From strategy to signing—seamless M&A support at every step",
            subTitle2: "We provide end-to-end M&A support, guiding decisions from deal planning to post-transaction integration with strategic clarity.",
            description: [
                "Assist with valuation modelling and negotiation strategy",
                "Align cross-functional stakeholders and advisors",
                "Support regulatory and legal documentation",
                "Enable smooth pre- and post-merger transitions",
                "Manage integration risks and continuity challenges",
            ],
            altText: "Successful GTM strategy",
        },
    ];

    return (
        <section className="flex flex-col items-center px-[9.4%] py-32 bg-gray-100 max-md:px-5 max-md:py-24" aria-labelledby="case-studies-heading">
            <CaseStudiesHeader />
            <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-x-auto h-auto gap-6 mt-16 max-w-full w-full max-md:mt-10"
                role="region"
                aria-label="Case study examples"
            >
                {caseStudies.map((study) => (
                    <CaseStudyCard
                        key={study.id}
                        imageUrl={study.imageUrl}
                        title={study.title}
                        subTitle={study.subTitle}
                        subTitle2={study.subTitle2}
                        description={study.description}
                        altText={study.altText}
                    />
                ))}
            </div>
        </section>
    );
};

export default PartnerIdentificationPageCaseStudies;
