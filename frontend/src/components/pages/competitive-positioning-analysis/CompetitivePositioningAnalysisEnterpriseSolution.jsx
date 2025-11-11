import { CommanAudienceCardContainer } from "@/components/ui/CommanAudienceCard";

const targetAudienceData = [
    {
        id: 1,
        icon: "/icons/CompetitivePositioningAnalysis1.png",
        title: "Outperform Your Competitors",
        description:
            "Benchmark your position and close performance gaps using clear, data-driven insights that reveal where your rivals are ahead—and how to beat them.",
    },
    {
        id: 2,
        icon: "/icons/CompetitivePositioningAnalysis2.png",
        title: "Uncover Growth Opportunities",
        description: "Identify untapped market segments, product gaps, and white space areas to expand smartly and stay ahead of shifting customer demands.",
    },
    {
        id: 3,
        icon: "/icons/CompetitivePositioningAnalysis6.png",
        title: "Refine Product & GTM Strategy",
        description:
            "Use competitor intelligence to fine-tune your product features, pricing, and go-to-market plans, ensuring better alignment with market realities.",
    },
    {
        id: 4,
        icon: "/icons/CompetitivePositioningAnalysis4.png",
        title: "Prioritise Innovation with Confidence",
        description: "Track innovation pipelines, patents, and R&D focus areas to guide your tech investments and stay ahead of future disruptions.",
    },
    {
        id: 5,
        icon: "/icons/CompetitivePositioningAnalysis5.png",
        title: "Strengthen Regional Expansion Plans",
        description:
            "Understand where competitors are scaling geographically so you can optimise entry, growth, and distribution strategies in high-potential regions.",
    },
];

const CompetitivePositioningAnalysisEnterpriseSolution = () => {
    return (
        <CommanAudienceCardContainer
            data={targetAudienceData}
            title={"How Your Business Benefits"}
            subTitle={
                " Make faster, smarter decisions with competitor-driven insights that reduce risk, sharpen strategy, and unlock growth across products,markets, and customer segments."
            }
        />
    );
};

export default CompetitivePositioningAnalysisEnterpriseSolution;
