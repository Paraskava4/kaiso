
"use client";
import { CommanBenefitCardContainer } from "@/components/ui/CommanBenefitCard";

const TechnologyScoutingBenifits = () => {
    const benefitData = [
        {
            iconSrc: "/icons/TechnologyScouting1.png",
            iconAlt: "Innovation discovery icon",
            title: "Strategy & Innovation Heads",
            hoverDetails: "Identify emerging technologies, discover innovation opportunities, and accelerate product development through scouting insights.",
        },
        {
            iconSrc: "/icons/TechnologyScouting2.png",
            iconAlt: "Tech partners icon",
            title: "R&D and Product Development Teams",
            hoverDetails: "Align innovation initiatives with strategic goals by leveraging technology trends and scouting outcomes.",
        },
        {
            iconSrc: "/icons/TechnologyScouting3.png",
            iconAlt: "Startups and incubators icon",
            title: "Business Unit Leaders",
            hoverDetails: "Spot promising startups, breakthrough technologies, and disruptive innovations early to form strategic partnerships.",
        },
        {
            iconSrc: "/icons/StrategicAnalysi2.png",
            iconAlt: "IP intelligence icon",
            title: "Corporate Development Teams",
            hoverDetails: "Track technology patents, licensing opportunities, and R&D trends to support IP strategy and protect innovation.",
        },
        {
            iconSrc: "/icons/TechnologyScouting5.png",
            iconAlt: "VC icon",
            title: "Enterprises Expanding into Tech-Led Markets",
            hoverDetails: "Discover investment-worthy technologies and assess technical feasibility of startup solutions for strategic investment.",
        },
    ];

    return (
        <CommanBenefitCardContainer
            data={benefitData}
            title={"Who Can Benefit"}
            subTitle={
                "Whether you're navigating digital transformation or building next-generation solutions, this service supports leaders who need clarity before committing resources."}
        />
    );
};

export default TechnologyScoutingBenifits;
