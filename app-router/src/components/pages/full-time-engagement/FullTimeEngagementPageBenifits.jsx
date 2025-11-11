"use client";
import Image from "next/image";
import * as React from "react";

const BenefitItem = ({ title, description, isExpanded = false, className = "", titleClassName = "", onToggle }) => {
    const handleClick = () => {
        if (onToggle) onToggle();
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleClick();
        }
    };

    return (
        <article className={`flex flex-col justify-center px-4 py-3 w-full border-b border-gray-300 ${className}`}>
            <button
                className="flex flex-row gap-4 justify-between items-center w-full text-left focus:outline-none focus-visible:ring-0 rounded"
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                aria-expanded={isExpanded}
                aria-controls={`benefit-description-${title.replace(/\s+/g, "-").toLowerCase()}`}
            >
                <h3 className={`text-zinc-900 !text-[17px] ${titleClassName}`}>{title}</h3>
                <Image
                    src={isExpanded ? "/icons/Minus.webp" : "/icons/Plus.webp"}
                    width={24}
                    height={24}
                    alt={isExpanded ? "Collapse section" : "Expand section"}
                    className="object-contain shrink-0 w-6 h-6"
                />
            </button>
            <div
                id={`benefit-description-${title.replace(/\s+/g, "-").toLowerCase()}`}
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                    }`}
                role="region"
                aria-labelledby={`benefit-title-${title.replace(/\s+/g, "-").toLowerCase()}`}
            >
                <p className="text-sm leading-6 text-zinc-700">{description}</p>
            </div>
        </article>
    );
};

const BenefitsList = () => {
    // 👇 Default open = first item (index 0)
    const [activeIndex, setActiveIndex] = React.useState(0);

    const benefits = [
        {
            title: "Startups Scaling Without In-House Research",
            description:
                "Stay agile with on-demand research that validates new markets, informs product decisions, and strengthens investor communications during critical growth phases.",
            titleClassName: "text-xl font-medium leading-7 sm:text-2xl sm:leading-8 max-w-[90%]",
        },
        {
            title: "Private Equity and Venture Capital Firms",
            description:
                "Make high-confidence investment decisions with access to deep market scans, competitor benchmarking, and sector-specific opportunity assessments tailored to fund strategies.",
            titleClassName: "text-base leading-6 sm:text-lg sm:leading-7 max-w-[90%]",
        },
        {
            title: "Consulting Firms Navigating Variable Workloads",
            description:
                "Quickly scale research bandwidth to meet client demands. Support complex strategic analysis and deliver high-impact insights with consistent turnaround and quality.",
            titleClassName: "text-base leading-6 sm:text-lg sm:leading-7 max-w-[90%]",
        },
        {
            title: "Enterprises with Long-Term Strategic Focus",
            description:
                "Empower planning, innovation, and market expansion efforts through dedicated analyst teams that deliver ongoing intelligence, trend monitoring, and competitive analysis.",
            titleClassName: "text-base leading-6 sm:text-lg sm:leading-7 max-w-[90%]",
        },
        {
            title: "Government and Policy Think Tanks",
            description:
                "Leverage sustained, high-quality research for public policy formulation, economic modelling, and evidence-backed decision-making across key socio-economic sectors.",
            titleClassName: "text-base leading-6 sm:text-lg sm:leading-7 max-w-[90%]",
        },
    ];

    const toggleItem = (index) => {
        setActiveIndex((prev) => (prev === index ? null : index));
    };

    // Auto cycle benefits
    React.useEffect(() => {
        let intervalId;
        const startAutoPlay = () => {
            let i = 0; // already open 0
            intervalId = setInterval(() => {
                i = (i + 1) % benefits.length;
                setActiveIndex(i);
            }, 8000); // switch every 2 sec
        };

        const timeoutId = setTimeout(startAutoPlay, 8000); // start after 8 sec

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, [benefits.length]);

    return (
        <section className="w-full max-w-[600px] mt-2" aria-label="Benefits list">
            {benefits.map((benefit, index) => (
                <BenefitItem
                    key={index}
                    title={benefit.title}
                    description={benefit.description}
                    isExpanded={activeIndex === index}
                    titleClassName={benefit.titleClassName}
                    className="flex items-center"
                    onToggle={() => toggleItem(index)}
                />
            ))}
        </section>
    );
};

const SectionHeader = ({
    subtitle = "Who Benefits Most",
    title = "Who Gains the Most",
    description = "Our full-time engagement models are designed for businesses that need ongoing, high-impact research support. Ideal for startups, consulting firms, enterprises, investors, and policy groups seeking data-driven decision-making at scale.",
}) => {
    return (
        <header className="flex flex-col items-center w-full leading-relaxed text-center">
            <div className="flex flex-col items-center max-w-[800px] px-4">
                {/* <p className="text-sm font-medium text-red-600 sm:text-base">{subtitle}</p> */}
                <h2 className="mt-2 :text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-semibold leading-tight text-zinc-900 ">{title}</h2>
                <p className="mt-2 text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] text-zinc-700">{description}</p>
            </div>
        </header>
    );
};

const FullTimeEngagementPageBenifits = () => {
    return (
        <section className="px-4 py-16 bg-white  sm:px-8 sm:py-20 lg:px-16 lg:py-24">
            <SectionHeader />
            <div className="flex  max-w-[88.5%] flex-col lg:flex-row gap-6 items-start justify-center mt-8 w-full mx-auto sm:mt-10 lg:mt-12">
                <Image
                    src="/images/fulltimebenifit.webp"
                    alt="Visual representation of who benefits most from our services"
                    width={650}
                    height={400}
                    className="object-contain rounded-xl w-full max-w-[650px] lg:w-1/2"
                    priority
                />
                <BenefitsList />
            </div>
        </section>
    );
};

export default FullTimeEngagementPageBenifits;
