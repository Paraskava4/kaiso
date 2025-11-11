import { CommanAudienceCardContainer } from "@/components/ui/CommanAudienceCard";

const enterpriseSolutionsData = [
    {
        id: 1,
        title: "Improve Decision-Making",
        description: "Make confident, faster decisions with data—not assumptions—across product, marketing, and CX strategies.",
        icon: "/icons/CustomerIntelligenceEnterprise1.png",
        hoverIcon: "/icons/decision-hover.webp",
    },
    {
        id: 2,
        title: "Boost Customer Retention",
        description: "Identify dissatisfaction early and take proactive steps to strengthen relationships and reduce drop-offs.",
        icon: "/icons/CustomerIntelligenceEnterprise2.png",
        hoverIcon: "/icons/retention-hover.webp",
    },
    {
        id: 3,
        title: "Refine Product & Service Offerings",
        description: "Align features, pricing, and positioning with what your customers truly want and value.",
        icon: "/icons/CustomerIntelligenceEnterprise3.png",
        hoverIcon: "/icons/product-hover.webp",
    },
    {
        id: 4,
        title: "Personalise Experiences at Scale",
        description: "Tailor your communication, campaigns, and journeys using accurate behavioural insights.",
        icon: "/icons/CustomerIntelligenceEnterprise4.png",
        hoverIcon: "/icons/personalise-hover.webp",
    },
    {
        id: 5,
        title: "Gain a Competitive Edge",
        description: "Stay ahead by anticipating customer needs and responding faster than your competitors.",
        icon: "/icons/CustomerIntelligenceEnterprise5.png",
        hoverIcon: "/icons/competitive-hover.webp",
    },
];

const CustomerIntelligenceEnterpriseSolutions = () => {
    return (
        <CommanAudienceCardContainer
            data={enterpriseSolutionsData}
            title={"How Your Business Benefits"}
            subTitle={"Analysing your customers isn't just good practice, it’s a competitive edge."}
        />
    );
};

export default CustomerIntelligenceEnterpriseSolutions;
