import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useWindowSize, useClientOnly } from "../../../hooks/useClientOnly";
import { CommanAudienceCardContainer } from "@/components/ui/CommanAudienceCard";

const targetAudienceData = [
    {
        id: 1,
        icon: "/icons/Consultingg1.png",
        title: "Industry-Specific Expertise",
        description:
            "Each engagement is led by analysts with direct experience in your sector. This ensures your strategies are informed by nuanced market understanding, competitive realities, and real-world operating dynamics.",
    },
    {
        id: 2,
        icon: "/icons/Consultingg2.png",
        title: "Evidence-Led, Outcome-Focused Approach",
        description:
            "Our consulting model is built around measurable business impact. We combine robust primary research, secondary data, and strategic frameworks to help you act with confidence, not assumptions.",
    },
    {
        id: 3,
        icon: "/icons/Consultingg3.png",
        title: "Cross-Functional Alignment",
        description:
            "Our insights are designed to support decision-making across departments—from the C-suite to product, sales, and operations. This ensures clarity, coordination, and faster execution across the organization.",
    },
    {
        id: 4,
        icon: "/icons/Consultingg4.png",
        title: "Adaptive and Forward-Looking Strategies",
        description:
            "Markets shift quickly. Our methodology anticipates change and models multiple scenarios, so your business can pivot, scale, or enter new markets with foresight and agility.",
    },
    {
        id: 5,
        icon: "/icons/Consultingg5.png",
        title: "Strategic Foresight Backed by Global Insights",
        description:
            "Our work is shaped by global market forces, disruptive trends, and innovation signals across industries. This enables leadership teams to craft strategies that are future-ready, scalable, and aligned with evolving global dynamics.",
    },
];

const ConsultingServicesEnterpriseSolutions = () => {
    return (
        <CommanAudienceCardContainer
            data={targetAudienceData}
            title={"Why Choose Kaiso"}
            subTitle={
                "At Kaiso Research and Consulting, we go beyond surface-level analysis to provide decision-makers with actionable intelligence that fuels growth, innovation, and resilience."
            }
        />
    );
};

export default ConsultingServicesEnterpriseSolutions;
