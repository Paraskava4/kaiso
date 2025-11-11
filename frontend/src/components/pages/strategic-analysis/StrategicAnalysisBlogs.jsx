"use client";
import React from "react";
import Image from "next/image";
import { CaseStudyCard } from "../partner-Identification/PartnerIdentificationPageCaseStudies";

const ReadMoreButton = () => {
    return (
        <div className="flex gap-2 items-center self-start mb-6 text-base font-semibold leading-relaxed text-slate-200 hover:text-white transition-colors">
            <span className="self-stretch my-auto">Read more</span>
            <Image
                src="/icons/Righte-Arrow.svg"
                alt="Arrow icon"
                className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
                width={24}
                height={24}
                quality={100}
            />
        </div>
    );
};

const ServiceCard = ({ backgroundImage, title, description }) => {
    return (
        <article className="overflow-hidden rounded-3xl w-full sm:w-[48%] md:w-[32%] lg:w-[30%] xl:w-[28%] flex-shrink-0">
            <div className="flex relative flex-col w-full h-[400px]">
                <Image
                    src={backgroundImage}
                    alt={`Background for ${title}`}
                    className="object-cover absolute inset-0 size-full"
                    fill
                    quality={100}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 48vw, (max-width: 1024px) 32vw, 28vw"
                />
                <div className="flex relative flex-col justify-between p-4 sm:p-5 md:p-6 lg:p-8 w-full min-h-[360px] sm:min-h-[400px] md:min-h-[440px] lg:min-h-[480px] bg-gradient-to-t from-black/70 to-transparent">
                    <div className="w-full">
                        <h3 className="text-xl font-medium leading-7 text-stone-100">{title}</h3>
                        <p className="mt-2 text-base leading-6 text-white line-clamp-3">{description}</p>
                    </div>
                    <ReadMoreButton />
                </div>
            </div>
        </article>
    );
};

const SectionHeader = ({ subtitle, title }) => {
    return (
        <header className="flex flex-col justify-center max-w-full w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl text-center px-4 sm:px-0">
            <p className="text-md font-medium leading-relaxed text-red-600">{subtitle}</p>
            <h2 className="mt-1 text-[26px] font-semibold leading-snug text-zinc-900">{title}</h2>
        </header>
    );
};

const StrategicAnalysisPage = () => {
    const services = [
        {
            id: 1,
            backgroundImage: "/images/TAM1.webp",
            title: "TAM Expansion Analysis",
            description:
                "Our TAM sizing approach integrates segment-level demand analysis, regional dynamics, and buyer behaviour to provide a comprehensive market view.",
        },
        {
            id: 2,
            backgroundImage: "/images/TAM2.webp",
            title: "Go-To-Market (GTM) Strategy",
            description: "We build robust go-to-market frameworks that align product positioning, buyer personas, channel strategies, and competitive context.",
        },
        {
            id: 3,
            backgroundImage: "/images/TAM3.webp",
            title: "Competitive Growth and Benchmarking",
            description: "Gain a 360° view of your competitive landscape, key players, market shares, growth strategies, and whitespace opportunities.",
        },
    ];

    return (
        <section className="flex flex-col justify-center items-center py-10 sm:py-12 md:py-16 lg:py-20 bg-gray-100 px-[4.9%]">
            <SectionHeader title="Strategic Growth Pillars" />
            <p className="text-[#1C1D21] mt-2 text-base font-normal leading-[160%] text-center max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
                Our Strategic Growth Solutions are built to guide high-stakes decisions and accelerate sustainable growth.
            </p>

            {/* Mobile/Tablet stacked layout (below 1024px) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mt-8 sm:mt-10 md:mt-12 w-full max-w-[90%]">
                {services.map((service) => (
                    <CaseStudyCard
                        key={service.id}
                        imageUrl={service.backgroundImage}
                        title={service.title}
                        subTitle={service.description}
                        // description={service.description}
                        altText={service.title}
                    />
                    // <ServiceCard key={service.id} backgroundImage={} title={service.title} description={service.description} />
                ))}
            </div>

            {/* Desktop horizontal scroll (1024px and up) */}
            {/* <div className="hidden md:flex w-full max-w-[90%] mt-10 md:mt-12 lg:mt-14 overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex justify-center gap-4 sm:gap-5 md:gap-6 lg:gap-8 w-max px-2">
                    {services.map((service) => (
                        <ServiceCard key={service.id} backgroundImage={service.backgroundImage} title={service.title} description={service.description} />
                    ))}
                </div>
            </div> */}
        </section>
    );
};

export default StrategicAnalysisPage;
