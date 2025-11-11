"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useWindowSize, useClientOnly } from "../../../hooks/useClientOnly";
import { CommanAudienceCardContainer } from "@/components/ui/CommanAudienceCard";

const targetAudienceData = [
    {
        id: 1,
        icon: "/icons/MarketAss1.png",
        title: "Make Informed Strategic Decisions",
        description: "Use accurate market data to guide expansion, diversification, and resource allocation.",
    },
    {
        id: 2,
        icon: "/icons/MarketAssess2.png",
        title: "Reduce Market Entry Risks",
        description: "Avoid mistakes by validating demand, sizing opportunities, and identifying local challenges early.",
    },
    {
        id: 3,
        icon: "/icons/MarketAssess3.png",
        title: "Prioritise High-Opportunity Segments",
        description: "Focus on markets, customer types, and regions with the greatest growth potential.",
    },
    {
        id: 4,
        icon: "/icons/MarketAssess4.png",
        title: "Improve Investment Planning",
        description: "Back business cases and capital decisions with credible forecasting and opportunity mapping.",
    },
    {
        id: 5,
        icon: "/icons/MarketAssess5.png",
        title: "Gain a Competitive Edge",
        description: "Understand where your competitors are heading—and how to outmanoeuvre them with smarter moves.",
    },
];

const MarketAssessmentPageEnterpriseSolutions = () => {
    return (
        <CommanAudienceCardContainer
            data={targetAudienceData}
            title={"How Your Business Benefits"}
            subTitle={
                "Market Assessment delivers clarity and confidence by validating opportunities, reducing uncertainty, and guiding strategic moves with data-backed insights across markets, customers, and competition."
            }
        />
    );
};

export default MarketAssessmentPageEnterpriseSolutions;
