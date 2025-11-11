import { CommanAudienceCardContainer } from "@/components/ui/CommanAudienceCard";

const targetAudienceData = [
    {
        id: 1,
        icon: "/icons/competitive-positioning.png",
        title: "Strategic Objective Mapping",
        description:
            "We begin by aligning with your business vision—defining key goals, success metrics, timelines, and constraints to ensure every insight directly supports your strategic priorities.",
    },
    {
        id: 2,
        icon: "/icons/Strategic2.png",
        title: "Market Intelligence Gathering",
        description:
            "We combine in-depth primary interviews with curated secondary research, competitor tracking, and market signals to build a solid, evidence-backed foundation for your decision-making.",
    },
    {
        id: 3,
        icon: "/icons/Strategic3.png",
        title: "Framework Design",
        description:
            "Our team creates customized models—TAM sizing, GTM pathways, and competitive benchmarking—structured specifically for your industry, target segments, and geographic focus.",
    },
    {
        id: 4,
        icon: "/icons/Strategic4.png",
        title: "Insights & Recommendations",
        description:
            "We deliver clear, actionable strategies supported by data analysis, forecasting, and market dynamics—designed to guide growth, de-risk investments, and drive confident decisions.",
    },
    {
        id: 5,
        icon: "/icons/Strategic4.webp",
        title: "Presentation & Implementation Support",
        description:
            "Beyond delivering the report, we provide workshops, implementation guidance, and strategic reviews to ensure alignment, adoption, and success of your roadmap.",
    },
];
const StrategicAnalysisShowCase = () => {
    return (
        <CommanAudienceCardContainer
            data={targetAudienceData}
            title={"How Your Business Benefits"}
            subTitle={
                " Market Assessment empowers your organisation with clarity, confidence, and direction. By understanding market size, trends, competitive dynamics, and regional nuances, you can reduce uncertainty, validate opportunities, and make better strategic choices. Whether you're entering new markets, launching products, or prioritising investments, our research helps you act faster and smarter, backed by insights, not assumptions."
            }
        />
    );
};

export default StrategicAnalysisShowCase;
