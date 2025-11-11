"use client";
import { CommanBenefitCardContainer } from "@/components/ui/CommanBenefitCard";

const MarketIntelligenceBenefit = () => {
    const benefitData = [
        {
            iconSrc: "/icons/MarketIntelligence1.png",
            iconAlt: "Strategic intelligence icon",
            title: "CXOs and Strategy Leaders",
            hoverDetails: "Access real-time market intelligence and competitive insights to drive informed strategic decisions and maintain market leadership.",
        },
        {
            iconSrc: "/icons/MarketIntell1.png",
            iconAlt: "Business intelligence icon",
            title: "Sales & Marketing Decision-Makers",
            hoverDetails: "Leverage comprehensive market data, trend analysis, and intelligence reports to support data-driven business recommendations.",
        },
        {
            iconSrc: "/icons/PartnerIdentification12.png",
            iconAlt: "Market monitoring icon",
            title: "Investment and M&A Analysts",
            hoverDetails:
                "Stay ahead with continuous market monitoring, competitor tracking, and emerging trend identification for proactive strategy adjustment.",
        },
        {
            iconSrc: "/icons/MarketIntelligence3.png",
            iconAlt: "Investment intelligence icon",
            title: "Market Entry & Expansion Teams",
            hoverDetails: "Gain deep market intelligence and sector analysis to identify investment opportunities and assess market potential accurately.",
        },
        {
            iconSrc: "/icons/CompetitivePosition1.png",
            iconAlt: "Innovation intelligence icon",
            title: "Founders and Innovation Teams",
            hoverDetails: "Understand market needs, technology trends, and innovation gaps to guide product development and research priorities.",
        },
    ];

    return (
        <CommanBenefitCardContainer
            data={benefitData}
            title={" Who Can Unlock Value"}
            subTitle={
                "From strategic planners to execution teams, Market Intelligence empowers professionals across functions. It ensures every decision is grounded in real-time insights, not assumptions."
            }
        />
    );
};

export default MarketIntelligenceBenefit;
