"use client";
import { CommanFeatureCardContainer } from "@/components/ui/CommanFeatureCard";
const CustomReportsPageFeatures = () => {
    const features = [
        {
            id: 1,
            title: "Expanding into a new market or region.",
            description:
                "Gain a 360° understanding of customer behaviour, regulatory frameworks, and competitive dynamics before entering a new geography. Make informed decisions and mitigate risks from day one.",
        },
        {
            id: 2,
            title: "Launching a niche product or service",
            description:
                "Validate demand, identify target buyer segments, and position your offering effectively in specialised markets. Maximise the success of your go-to-market strategy with data-backed precision.",
        },
        {
            id: 3,
            title: "Analysing Unmet Demand",
            description:
                "Identify market gaps, underserved customer needs, or innovation opportunities that can drive first-mover advantage. Act on insights that reveal where competition is minimal and growth potential is high.",
        },
        {
            id: 4,
            title: "Benchmarking competitors in a specific vertical",
            description:
                "Evaluate your competitive position through side-by-side analysis of key players, pricing, positioning, and strategy. Identify performance gaps and areas for differentiation within your industry.",
        },
        {
            id: 5,
            title: "Supporting investor pitches or internal strategy sessions",
            description:
                "Present compelling, validated market insights to strengthen fundraising efforts or strategic decision-making. Equip leadership and stakeholders with data that builds confidence and supports long-term planning.",
        },
    ];

    return <CommanFeatureCardContainer data={features} title="Ideal Use Cases" />
};

export default CustomReportsPageFeatures;
