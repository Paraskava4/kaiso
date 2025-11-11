"use client";
import { CommanBenefitCardContainer } from "@/components/ui/CommanBenefitCard";

const CompetitivePositioningAnalysisBenefit = () => {
    const benefitData = [
        {
            iconSrc: "/icons/PartnerIdentification11.png",
            iconAlt: "Market positioning icon",
            title: "Strategy & Corporate Planning Teams",
            hoverDetails: "Understand your market position and identify opportunities to outperform competitors with strategic insights.",
        },
        {
            iconSrc: "/icons/StrategicAnalysiss2.png",
            iconAlt: "Strategic planning icon",
            title: "Product, Marketing & GTM Leaders",
            hoverDetails: "Develop data-driven market entry strategies with comprehensive competitive landscape analysis.",
        },
        {
            iconSrc: "/icons/CustomerIntelligence12.png",
            iconAlt: "Product positioning icon",
            title: "Sales & Business Development Units",
            hoverDetails: "Refine your product positioning and messaging to stand out in competitive markets.",
        },
        {
            iconSrc: "/icons/CompetitivePosition1.png",
            iconAlt: "Investment analysis icon",
            title: "R&D and Innovation Teams",
            hoverDetails: "Make informed investment decisions with thorough competitive analysis and market intelligence.",
        },
        {
            iconSrc: "/icons/PartnerIdentification4.png",
            iconAlt: "Business development icon",
            title: "Private Equity & Investment Firms",
            hoverDetails: "Identify strategic partnership opportunities and evaluate competitive threats in your ecosystem.",
        },
    ];

    return (
        <CommanBenefitCardContainer
            data={benefitData}
            title={"Who Can Drive Impact"}
            subTitle={"Our Competitive Positioning Analysis is designed for decision-makers who need to act fast and plan smart in a dynamic market."}
        />
    );
};

export default CompetitivePositioningAnalysisBenefit;
