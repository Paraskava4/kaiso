import { CommanAudienceCardContainer } from "@/components/ui/CommanAudienceCard";

const enterpriseSolutionsData = [
    {
        id: 1,
        title: "Evidence-Led Strategy Development",
        description:
            "Strategic recommendations are grounded in rigorous data, industry insights, and scenario analysis, ensuring every recommendation is defensible, timely, and actionable.",
        icon: "/icons/StrategicAnalysisMarketInsights1.png",
        hoverIcon: "/icons/strategy-hover.webp",
    },
    {
        id: 2,
        title: "Cross-Functional Strategic Alignment",
        description:
            "We integrate perspectives across product, finance, marketing, and operations—so strategy isn’t siloed, but aligned with the realities of execution.",
        icon: "/icons/StrategicAnalysisMarketInsights2.png",
        hoverIcon: "/icons/alignment-hover.webp",
    },
    {
        id: 3,
        title: "Sector-Specific Expertise",
        description:
            "With deep experience across 14 industries, we tailor each analysis to the specific dynamics of your market, enabling sharper insights and more relevant strategy design.",
        icon: "/icons/StrategicAnalysisMarketInsights3.png",
        hoverIcon: "/icons/sector-hover.webp",
    },
    {
        id: 4,
        title: "Forward-Looking Strategic Modelling",
        description:
            "Our frameworks include market foresight, risk variables, and opportunity mapping—equipping decision-makers to plan for what’s next, not just what’s now.",
        icon: "/icons/StrategicAnalysisMarketInsights4.png",
        hoverIcon: "/icons/modelling-hover.webp",
    },
    {
        id: 5,
        title: "Practical, Outcome-Driven Delivery",
        description:
            "Every output is designed for clarity and implementation, avoiding abstract recommendations and focusing instead on real-world business value and measurable impact.",
        icon: "/icons/StrategicAnalysisMarketInsights5.png",
        hoverIcon: "/icons/delivery-hover.webp",
    },
];

const StrategicAnalysisMarketInsightsPageEnterpriseSolutions = () => {
    return (
        <CommanAudienceCardContainer
            data={enterpriseSolutionsData}
            title={"What Sets Kaiso Apart in Strategic Analysis"}
            subTitle={
                " Effective strategy demands more than insight; it requires precision, alignment, and foresight, which Kaiso delivers through deep domain expertise and structured, evidence-based thinking for measurable business outcomes."
            }
        />
    );
};

export default StrategicAnalysisMarketInsightsPageEnterpriseSolutions;
