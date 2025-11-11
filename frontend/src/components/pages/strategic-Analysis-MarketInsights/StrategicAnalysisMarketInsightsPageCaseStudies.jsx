"use client";
import React from "react";
import { CaseStudyCard } from "../partner-Identification/PartnerIdentificationPageCaseStudies";

const CaseStudiesHeader = () => {
    return (
        <header className="flex flex-col max-w-full leading-relaxed text-left w-8xl" style={{ marginTop: "-6%" }}>
            <h2 className="ext-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-semibold leading-tight text-zinc-900 max-md:max-w-full">
                Our Strategic Focus Areas
            </h2>
            <p className="mt-2 text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] text-zinc-900 max-md:max-w-full">
                Strategic analysis delivers focused intelligence to uncover opportunities, assess risks, and guide decisions aligned with your business
                objectives.
            </p>
        </header>
    );
};

const StrategicAnalysisMarketInsightsPageCaseStudies = () => {
    const caseStudies = [
        {
            id: 1,
            imageUrl: "/images/OurFocus1.webp",
            title: "Go-To-Market Insights",
            frontDescription: "Ensure your strategy translates into effective market execution.",
            backDescription: "Evaluate readiness, timing, and market-fit to guide launch strategy.",
            bulletPoints: [
                "Assess industry trends and demand outlook",
                "Evaluate regulatory, economic, and entry factors",
                "Score opportunities based on risk–reward ratio",
                "Compare maturity, saturation, and scalability",
                "Focus resources on high-yield segments",
            ],
            altText: "Product strategy optimization",
        },
        {
            id: 2,
            imageUrl: "/images/OurFocus2.webp",
            title: "Identify Market Attractiveness",
            frontDescription: "Target the right markets with evidence-based confidence.",
            backDescription: "Use structured evaluation to prioritise markets with strong growth potential.",
            bulletPoints: [
                "Assess industry trends and demand outlook",
                "Evaluate regulatory, economic, and entry factors",
                "Score opportunities based on risk–reward ratio",
                "Compare maturity, saturation, and scalability",
                "Focus resources on high-yield segments",
            ],
            altText: "Emerging market discovery",
        },
        {
            id: 3,
            imageUrl: "/images/OurFocus3.webp",
            title: "Gain Competitive Edge",
            frontDescription: "Position your business where it matters most.",
            backDescription: "Identify what sets your business apart—and turn it into a strategic advantage.",
            bulletPoints: [
                "Map your positioning against key competitors",
                "Identify strengths, gaps, and whitespace opportunities",
                "Align internal capabilities with external market needs",
                "Shape messaging and offerings for maximum impact",
                "Reinforce differentiation through value-based strategy",
            ],
            altText: "Pricing strategy benchmarking",
        },
        {
            id: 4,
            imageUrl: "/images/OurFocus4.webp",
            title: "Channel Strategy & Optimisation",
            frontDescription: "Ensure your routes to market are aligned, efficient, and scalable.",
            backDescription: "Evaluate the performance and structure of your sales and distribution channels to unlock better coverage and results.",
            bulletPoints: [
                "Analyse reach, cost, and efficiency across channels",
                "Identify underperforming routes and high-impact gaps",
                "Define optimal balance across direct, indirect, and digital channels",
                "Support expansion with partner capability insights",
                "Align channel strategy with growth and GTM objectives",
            ],
            altText: "GTM planning with insights",
        },
    ];

    return (
        <section className="flex flex-col items-start px-[9.5%] py-32 bg-gray-100 max-md:px-5 max-md:py-24" aria-labelledby="case-studies-heading">
            <CaseStudiesHeader />

            <div
                className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 overflow-x-auto  gap-6  mt-16 max-w-full w-[1600px] max-md:mt-10"
                role="region"
                aria-label="Case study examples"
            >
                {caseStudies.map((study) => (
                    <CaseStudyCard
                        key={study.id}
                        imageUrl={study.imageUrl}
                        title={study.title}
                        subTitle={study.frontDescription}
                        subTitle2={study.backDescription}
                        description={study.bulletPoints}
                        altText={study.altText}
                    />
                ))}
            </div>
        </section>
    );
};

export default StrategicAnalysisMarketInsightsPageCaseStudies;
