"use client";
import { CommanBenefitCardContainer } from "@/components/ui/CommanBenefitCard";

const ConsultingServicesBenefit = () => {
    const benefitData = [
        {
            iconSrc: "/icons/Consultings1.png",
            iconAlt: "Market entry icon",
            title: "CXOs and Strategy Leaders",
            hoverDetails: "Get clarity on market share, positioning, and white spaces to capture.",
        },
        {
            iconSrc: "/icons/Consultings3.png",
            iconAlt: "Startup validation icon",
            title: "Business Development & Sales Heads",
            hoverDetails: "Validate your business model and refine your strategy with data-driven insights and expert consultation.",
        },
        {
            iconSrc: "/icons/ConsultingService3.png",
            iconAlt: "Partnership and M&A icon",
            title: "Product and Innovation Teams",
            hoverDetails: "Identify strategic opportunities and evaluate potential partnerships with thorough due diligence support.",
        },
        {
            iconSrc: "/icons/ConsultingService4.png",
            iconAlt: "Private Equity & Investment Firms",
            title: "Private Equity & Investment Firms",
            hoverDetails: "Develop robust go-to-market strategies that resonate with your target audience and drive growth.",
        },
        {
            iconSrc: "/icons/Consultings2.png",
            iconAlt: "Customer engagement icon",
            title: "Transformation & Operations Leaders",
            hoverDetails: "Transform your customer relationships with innovative engagement strategies and experience optimization.",
        },
    ];

    return (
        <CommanBenefitCardContainer
            data={benefitData}
            title={"Who Can Benefit?"}
            subTitle={
                "Kaiso’s consulting services are designed to support leadership teams and organizations navigating growth, transformation, or complex strategic decisions."
            }
        />
    );
};

export default ConsultingServicesBenefit;
