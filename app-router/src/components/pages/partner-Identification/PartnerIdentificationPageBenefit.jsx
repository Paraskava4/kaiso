
"use client";
import { CommanBenefitCardContainer } from "@/components/ui/CommanBenefitCard";

const PartnerIdentificationPageBenefit = () => {
    const benefitData = [
        {
            iconSrc: "/icons/PartnerIdentification11.png",
            iconAlt: "Partnership identification icon",
            title: "Corporate Strategy & Development Teams",
            hoverDetails: "Find ideal partners that align with your strategic objectives and maximize your market reach.",
        },
        {
            iconSrc: "/icons/PartnerIdentification12.png",
            iconAlt: "Growth planning icon",
            title: "M&A and Investment Analysts",
            hoverDetails: "Uncover growth opportunities through partnerships that complement your strengths and capabilities.",
        },
        {
            iconSrc: "/icons/PartnerIdentification2.png",
            iconAlt: "Innovation support icon",
            title: "Founders Exploring Inorganic Growth",
            hoverDetails: "Identify partners with innovative solutions that can enhance your offerings or speed up development.",
        },
        {
            iconSrc: "/icons/PartnerIdentification13.png",
            iconAlt: "Market entry support icon",
            title: "Business Heads Targeting Joint Ventures",
            hoverDetails: "Leverage local partnerships to facilitate smoother and faster entry into unfamiliar markets.",
        },
        {
            iconSrc: "/icons/PartnerIdentification4.png",
            iconAlt: "Supply chain icon",
            title: "Private Equity & Venture Capital Firms",
            hoverDetails: "Discover reliable and strategic suppliers and distributors to strengthen your value chain.",
        },
    ];

    return (
        <CommanBenefitCardContainer
            data={benefitData}
            title={"Who Can Drive Impact"}
            subTitle={
                "  Designed for leadership teams seeking to build strategic alliances that accelerate growth, de-risk expansion, or unlock operational efficiencies."}
        />
    );
};

export default PartnerIdentificationPageBenefit;
