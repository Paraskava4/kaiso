import React from "react";
import { ResponsiveMarginContainer } from "../../ui";

// Internal FeatureItem component
const FeatureItem = ({ number, title }) => {
    return (
        <article className="flex gap-3 items-center p-3 px-4 w-full bg-gray-100 rounded-xl border border-solid border-zinc-600 max-sm:p-4">
            {/* <div className="text-xl italic leading-8 min-w-[30px] text-zinc-900 max-sm:p-4 max-sm:text-lg">
        {number}
      </div> */}
            <h3 className="text-sm leading-8 text-zinc-900 max-sm:text-lg">{title}</h3>
        </article>
    );
};

const FullTimeEngagementPageResearchProcess = () => {
    const features = [
        {
            number: "01",
            title: "Strategic Continuity with Long-Term Alignment",
        },
        {
            number: "02",
            title: "Faster Turnarounds with Dedicated Research Teams",
        },
        {
            number: "03",
            title: " Embedded Expertise Aligned to Your Business Goals",
        },
        {
            number: "04",
            title: "Zero Recruitment or Training Overheads",
        },
        {
            number: "05",
            title: " Scalable, Cost-Efficient Alternative to In-House Teams",
        },
    ];

    return (
        <ResponsiveMarginContainer>
            <section className="flex gap-10 justify-between items-center px-5 py-0  my-0 w-full max-w-[1320px] max-md:flex-col max-md:gap-8 max-md:items-start max-md:px-5 max-md:py-8 max-sm:gap-6 max-sm:px-4 max-sm:py-5">
                <header className="flex flex-col flex-1 gap-5 items-start max-w-[580px] max-md:max-w-full">
                    {/* <div className="text-base font-medium leading-6 text-red-600">Our Custom Research Process</div> */}
                    <h2 className="ext-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-bold leading-10 text-zinc-900 max-md:text-3xl max-sm:text-2xl max-sm:leading-8">
                        Why Full-Time Engagement
                    </h2>
                    <p className="text-sm leading-8 text-zinc-900">
                        When strategic goals evolve rapidly, project-based support may not provide the continuity or speed required for decision-making.
                        Full-Time Engagement (FTE) models ensure dedicated research capacity that’s fully aligned with your business roadmap. With seamless
                        collaboration, faster turnaround, and deep institutional familiarity, FTE support delivers consistent, scalable, and on-demand
                        intelligence that keeps your teams ahead of change. It’s a long-term partnership model designed to maximise efficiency, adaptability,
                        and strategic alignment across all initiatives.
                    </p>
                </header>

                <div className="flex flex-col flex-1 gap-3 items-start max-w-[600px] max-md:max-w-full">
                    {features.map((feature, index) => (
                        <FeatureItem
                            key={index}
                            // number={feature.number}
                            title={feature.title}
                        />
                    ))}
                </div>
            </section>
        </ResponsiveMarginContainer>
    );
};

export default FullTimeEngagementPageResearchProcess;
