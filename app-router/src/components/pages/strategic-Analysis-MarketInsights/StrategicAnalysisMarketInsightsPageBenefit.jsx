
"use client";
import { CommanBenefitCardContainer } from "@/components/ui/CommanBenefitCard";

const StrategicAnalysisMarketInsightsPageBenefit = () => {
    const benefitData = [
        {
            iconSrc: "/icons/StrategicAnalysis1.png",
            iconAlt: "Market insights icon",
            title: "C-Level Executives & Strategy Leaders",
            hoverDetails: "Gain valuable market insights that help you make informed strategic decisions with confidence.",
        },
        {
            iconSrc: "/icons/StrategicAnalysiss1.png",
            iconAlt: "Strategy icon",
            title: "Corporate Planning & Finance Teams",
            hoverDetails: "Understand market trends, competitive dynamics, and opportunities to shape effective strategies.",
        },
        {
            iconSrc: "/icons/StrategicAnalysiss2.png",
            iconAlt: "Innovation icon",
            title: "Product and Marketing Heads refining GTM strategy",
            hoverDetails: "Leverage insights to identify gaps, emerging needs, and areas for product or service innovation.",
        },
        {
            iconSrc: "/icons/CustomerIntelligence12.png",
            iconAlt: "Expansion support icon",
            title: "Business Development & M&A Teams",
            hoverDetails: "Assess target markets to plan effective entry or expansion strategies with minimal risk.",
        },
        {
            iconSrc: "/icons/StrategicAnalysiss3.png",
            iconAlt: "Risk mitigation icon",
            title: "Investment Committees & Board Advisors",
            hoverDetails: "Spot potential threats and prepare proactively through comprehensive market analysis.",
        },
    ];

    return (
        <CommanBenefitCardContainer
            data={benefitData}
            title={"Who Can Unlock Value"}
            subTitle={
                "Our Strategic Analysis services are designed for forward-thinking organizations looking to align priorities, reduce risk, and unlock sustainable growth."
            }
        />
    );
};

export default StrategicAnalysisMarketInsightsPageBenefit;
