"use client";
import { CommanBenefitCardContainer } from "@/components/ui/CommanBenefitCard";

const MarketAssessmentPageBenefit = () => {
    const benefitData = [
        {
            id: 1,
            iconSrc: "/icons/PartnerIdentification11.png",
            iconAlt: "Market sizing icon",
            title: "Corporate Strategy & Planning Teams",
            hoverDetails: "Get accurate market sizing, competitive analysis, and entry strategy recommendations for successful market penetration.",
        },
        {
            id: 2,
            iconSrc: "/icons/CompetitivePosition1.png",
            iconAlt: "Investment analysis icon",
            title: "Product & Innovation Teams",
            hoverDetails: "Access comprehensive market intelligence and growth potential analysis to make informed investment decisions.",
        },
        {
            id: 3,
            iconSrc: "/icons/CustomerIntelligence12.png",
            iconAlt: "Product positioning icon",
            title: "Sales & Business Development Units",
            hoverDetails: "Understand customer needs, market gaps, and competitive positioning to enhance product-market fit.",
        },
        {
            id: 4,
            iconSrc: "/icons/PartnerIdentification4.png",
            iconAlt: "Strategic planning icon",
            title: "Private Equity & Investment Analysts",
            hoverDetails: "Leverage market trends, demand forecasting, and strategic insights to build robust growth strategies.",
        },
        {
            id: 5,
            iconSrc: "/icons/MarketAssess11.png",
            iconAlt: "Market research icon",
            title: "Export & International Expansion Teams",
            hoverDetails: "Obtain detailed market research, customer insights, and industry analysis for strategic decision-making.",
        },
    ];

    return (
        <CommanBenefitCardContainer
            data={benefitData}
            title={"Who Can Drive Impact"}
            subTitle={
                "From evaluating market potential to identifying high-growth opportunities, teams across the organization can act with greater confidence and clarity."
            }
        />
    );
};

export default MarketAssessmentPageBenefit;
