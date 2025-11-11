"use client";

import { CommanFeatureCardContainer } from "@/components/ui/CommanFeatureCard";

const MarketIntelligenceFaq = () => {
    const faqData = [
        {
            title: "Make Informed, Real-Time Decisions",
            description:
                "Timely intelligence enables you to respond to shifting market dynamics, customer behaviour, and competitive activity with confidence, ensuring your decisions are fast, accurate, and well-grounded.",
        },
        {
            title: "Minimise Strategic Risk",
            description:
                "Identify emerging risks across markets, supply chains, and policy environments—so you can avoid disruption, adapt early, and build strategies that are both resilient and future-ready.",
        },
        {
            title: "Identify Growth Opportunities",
            description:
                "Reveal underserved regions, untapped customer segments, and unmet needs. Market Intelligence helps you prioritise expansion where demand is rising and ROI potential is strongest.",
        },
        {
            title: "Strengthen Competitive Positioning",
            description:
                "Track how your competitors move—what they offer, where they win, and how they grow—so you can adjust your strategies and stay ahead of the curve",
        },
        {
            title: "Validate Feasibility Before You Invest",
            description:
                "Ensure new ideas, products, or markets are backed by real-world data, so you can proceed with clarity, reduce risk, and avoid investing in uncertain opportunities.",
        },
        {
            title: "Expand Where Returns Are Sustainable",
            description:
                "Identify markets and segments with long-term demand potential, strong infrastructure, and buyer readiness, ensuring your expansion delivers lasting impact and profitable growth.",
        },
    ];

    return <CommanFeatureCardContainer data={faqData} title="Why Market Intelligence" />
};

export default MarketIntelligenceFaq;
