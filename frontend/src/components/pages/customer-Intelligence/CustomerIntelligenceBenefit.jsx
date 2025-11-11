"use client";
import { CommanBenefitCardContainer } from "@/components/ui/CommanBenefitCard";

const CustomerIntelligenceBenefit = () => {
    const benefitData = [
        {
            iconSrc: "/icons/CustomerIntelligence1.png",
            iconAlt: "Customer engagement icon",
            title: "Marketing & Brand Teams",
            hoverDetails: "Gain actionable insights into customer needs, behaviors, and satisfaction to inform smarter business decisions.",
        },
        {
            iconSrc: "/icons/CustomerIntelligence11.png",
            iconAlt: "Data-driven decision icon",
            title: "Product & Innovation Teams",
            hoverDetails: "Utilize customer intelligence to shape marketing, product development, and customer service strategies effectively.",
        },
        {
            iconSrc: "/icons/CustomerIntelligence14.png",
            iconAlt: "Personalization icon",
            title: "Customer Experience (CX) Teams",
            hoverDetails: "Leverage data to tailor offerings and communications, enhancing customer engagement and loyalty.",
        },
        {
            iconSrc: "/icons/CustomerIntelligence12.png",
            iconAlt: "Retention icon",
            title: "Sales & Business Development Units",
            hoverDetails: "Identify churn risks and design retention initiatives through continuous customer feedback and sentiment analysis.",
        },
        {
            iconSrc: "/icons/CustomerIntelligence15.png",
            iconAlt: "Customer research icon",
            title: "Strategy & Leadership Teams",
            hoverDetails: "Access structured feedback from customers to support qualitative and quantitative research efforts.",
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

export default CustomerIntelligenceBenefit;
