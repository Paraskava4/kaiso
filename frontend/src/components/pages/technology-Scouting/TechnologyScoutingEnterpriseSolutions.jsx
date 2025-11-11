import { CommanAudienceCardContainer } from "@/components/ui/CommanAudienceCard";

const enterpriseSolutionsData = [
    {
        id: 1,
        icon: "/icons/Enterprise-Solutions.webp",
        title: "Stay Ahead of Disruption",
        description:
            "Continuously monitor emerging technologies to anticipate market shifts early, enabling your organisation to act proactively, minimise risks, and lead with innovation rather than react to change.",
    },
    {
        id: 2,
        icon: "/icons/Enterprise-Solutions.webp",
        title: "Reduce R&D Uncertainty",
        description:
            "Evaluate and prioritise ideas with structured, data-backed analysis to avoid resource waste. Ensure technology investments are aligned with market demand, strategic fit, and long-term business potential.",
    },
    {
        id: 3,
        icon: "/icons/Enterprise-Solutions.webp",
        title: "Accelerate Innovation Pipeline",
        description:
            "Streamline decision-making by filtering high-impact concepts through a structured funnel. Focus time and investment on innovations with the strongest feasibility, alignment, and commercial value.",
    },
    {
        id: 4,
        icon: "/icons/Enterprise-Solutions.webp",
        title: "Improve Technology ROI",
        description:
            "Avoid misaligned technology choices through comparative benchmarking and readiness assessment. Maximise returns by selecting solutions with clear strategic fit and faster paths to adoption.",
    },
    {
        id: 5,
        icon: "/icons/Enterprise-Solutions.webp",
        title: "Enhance Competitive Advantage",
        description:
            "Track competitor innovation activity to uncover gaps, anticipate moves, and align your roadmap for differentiation. Make confident decisions that position your business ahead of rivals.",
    },
];

const TechnologyScoutingEnterpriseSolutions = () => {
    return (
        <CommanAudienceCardContainer
            data={enterpriseSolutionsData}
            title={"Strategic Value for Your Organisation"}
            subTitle={
                " Our scouting services enable faster, low-risk innovation choices by identifying high-potential technologies and aligning R&D efforts with future-ready, market-relevant opportunities."
            }
        />
    );
};

export default TechnologyScoutingEnterpriseSolutions;
