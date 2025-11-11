import { CommanAudienceCardContainer } from "@/components/ui/CommanAudienceCard";

const targetAudienceData = [
    {
        id: 1,
        icon: "/icons/MarketIntelligenceEnterpriseSolutions1.png",
        title: "Industry-Specific Expertise",
        description:
            "Hands-on experience across 14 key verticals ensures research reflects real-world market dynamics. Every engagement is tailored to the nuances of the client’s industry, delivering relevant and actionable insights. The result is sharper intelligence with immediate strategic value.",
    },
    {
        id: 2,
        icon: "/icons/MarketIntelligenceEnterpriseSolutions2.png",
        title: "Decision-Focused Intelligence",
        description:
            "Insights go beyond data presentation and focus on real business impact. Market intelligence is structured to guide decisions across entry, growth, and competitive strategy. This enables faster, more confident responses to changing conditions.",
    },
    {
        id: 3,
        icon: "/icons/MarketIntelligenceEnterpriseSolutions3.png",
        title: "Cross-Functional Integration",
        description:
            "Intelligence supports unified decision-making across strategy, product, sales, and finance. Consistent, insight-led alignment ensures that all teams operate from a shared foundation. The outcome is more efficient collaboration and better execution.",
    },
    {
        id: 4,
        icon: "/icons/MarketIntelligenceEnterpriseSolutions4.png",
        title: "Scenario-Based Frameworks",
        description:
            "Research includes structured analysis of best-case, base-case, and risk-based market scenarios. This forward-looking approach reduces uncertainty in volatile environments. Organisations can plan, pivot, or scale with greater confidence.",
    },
    {
        id: 5,
        icon: "/icons/MarketIntelligenceEnterpriseSolutions5.png",
        title: "Global Insight with Regional Precision",
        description:
            "Market analysis is effective only when global intelligence is balanced with regional realities. Whether planning expansion, launching products, or refining territory-level strategies, businesses gain a competitive edge through context-rich, region-specific insights that enhance relevance, timing, and impact.",
    },
];
const MarketIntelligenceEnterpriseSolutions = () => {
    return (
        <CommanAudienceCardContainer
            data={targetAudienceData}
            title={"Why Choose Kaiso for Market Intelligence"}
            subTitle={
                " With a focus on decision-ready insights, scenario-based planning, and global-local relevance, Kaiso helps organizations navigate change,identify growth, and act confidently in fast-moving markets."
            }
        />
    );
};

export default MarketIntelligenceEnterpriseSolutions;
