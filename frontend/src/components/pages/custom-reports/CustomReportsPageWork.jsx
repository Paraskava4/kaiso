"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

/* ───────────────────────── STEP COMPONENT ───────────────────────── */
const ProcessStep = React.forwardRef(
    (
        { imageSrc, stepNumber, title, description, buttonText = "Get Started", buttonIconSrc = "/icons/Right-ArrowBlack.png", onButtonClick = () => {} },
        ref
    ) => (
        <article className="sticky top-0 h-screen flex items-center justify-center px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <div
                ref={ref}
                className="flex flex-col gap-4 justify-between items-center w-full
        max-w-7xl bg-white rounded-xl p-4
        xs:rounded-2xl
        sm:flex-row sm:gap-6 sm:p-6
        md:gap-8 md:p-8
        lg:gap-10 lg:p-10
        xl:gap-12 xl:p-12"
            >
                {/* Image Container */}
                <div
                    className="flex-shrink-0 w-full flex justify-center
          xs:w-auto
          sm:w-1/2 sm:max-w-none
          md:w-auto
          lg:flex-1 lg:max-w-lg"
                >
                    <Image
                        src={imageSrc}
                        alt={`${title} illustration`}
                        className="object-contain w-full h-auto
              max-w-[300px] max-h-[300px]
              xs:max-w-[340px] xs:max-h-[340px]
              sm:max-w-[380px] sm:max-h-[380px]
              md:max-w-[420px] md:max-h-[420px]
            "
                        width={420}
                        height={420}
                        quality={100}
                        priority
                    />
                </div>

                {/* Text Content */}
                <div
                    className="flex flex-col items-center text-center w-full
          xs:items-center xs:text-center
          sm:items-start sm:text-left sm:w-1/2
          md:w-auto md:flex-1
          lg:max-w-lg"
                >
                    {/* Step Number */}
                    <div
                        className="relative flex justify-center items-center
            w-8 h-8 text-sm font-medium bg-gray-100 border border-[#1C1D21] rounded-full text-zinc-900
            xs:w-10 xs:h-10 xs:text-base
            sm:w-12 sm:h-12 sm:text-lg
            md:text-xl
            lg:text-2xl
            xl:w-16 xl:h-16"
                    >
                        {stepNumber}
                    </div>

                    {/* Titles & Description */}
                    <div className="flex flex-col w-full mt-3 xs:mt-4 sm:mt-5 md:mt-6">
                        <h3
                            className=" font-semibold leading-tight text-zinc-900
                             sm:leading-snug
                             md:leading-snug md:text-left
                             lg:leading-tight
                             xl:leading-[1.2]
                             text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px]
                            "
                        >
                            {title}
                        </h3>
                        <p
                            className="mt-2 text-xs leading-4 text-black
                             sm:leading-relaxed
                             md:text-left  md:max-w-[90%]
                             lg:leading-8
                             text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px]
                            "
                        >
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </article>
    )
);

/* ───────────────────────── MAIN COMPONENT ───────────────────────── */
const CustomReportsPageWork = () => {
    const innersRef = useRef([]);

    useEffect(() => {
        (async () => {
            const gsapModule = await import("gsap");
            const ScrollTriggerModule = await import("gsap/ScrollTrigger");

            const gsap = gsapModule.gsap || gsapModule.default;
            const ScrollTrigger = ScrollTriggerModule.ScrollTrigger || ScrollTriggerModule.default;
            gsap.registerPlugin(ScrollTrigger);

            innersRef.current.forEach((box, idx) => {
                const isLast = idx === innersRef.current.length - 1;
                gsap.to(box, {
                    scale: 1,
                    backgroundColor: "#ffffff",
                    ease: "none",
                    scrollTrigger: {
                        trigger: box,
                        start: "top center",
                        end: "+=100%",
                        scrub: true,
                        invalidateOnRefresh: true,
                    },
                    ...(isLast && { yPercent: 0 }),
                });
            });

            return () => ScrollTrigger.getAll().forEach((st) => st.kill());
        })();
    }, []);

    const processSteps = [
        {
            imageSrc: "/images/c3.webp",
            stepNumber: "1",
            title: "Define Scope",
            description:
                "Collaborate with our research experts to outline your objectives, target markets, key business questions, and preferred deliverables.",
        },
        {
            imageSrc: "/images/c4.webp",
            stepNumber: "2",
            title: "Design and Methodology",
            description:
                "We craft a tailored research framework, selecting the most effective tools, methodologies, and sampling techniques to align with your specific business context.",
        },
        {
            imageSrc: "/images/c5.webp",
            stepNumber: "3",
            title: "Data Collection and Validation",
            description:
                "High-quality data is gathered via expert interviews, targeted surveys, and reliable secondary sources ensuring rigour, relevance, and trustworthiness.",
        },
        {
            imageSrc: "/images/c1.webp",
            stepNumber: "4",
            title: "Analysis and Insight Generation",
            description:
                "Senior analysts translate raw data into strategic insights, identifying patterns, risks, and opportunities aligned with your business objectives.",
        },
        {
            imageSrc: "/images/c2.webp",
            stepNumber: "5",
            title: "Delivery and Presentation",
            description:
                "Receive your report in a format tailored to your team, complete with executive summaries, interactive dashboards, and decision-ready recommendations.",
        },
    ];

    const handleStepButtonClick = (n) => console.log(`Step ${n} clicked`);

    return (
        <section className="flex flex-col bg-gray-100 min-h-screen px-4 sm:px-6 lg:px-8 xl:px-16">
            {/* HEADER */}
            <header className="flex flex-col items-center text-center py-8 sm:py-12 lg:py-16">
                {/* <p className="text-xs font-medium text-red-600 sm:text-sm">
                    Our Custom Research Process
                </p> */}
                <h2
                    className="mt-2 font-semibold text-zinc-900 sm:leading-snug
                             md:leading-snug 
                             lg:leading-tight
                             xl:leading-[1.2]
                             text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px]
                            "
                >
                    Our Custom Research Process
                </h2>
                <p
                    className="mt-3 leading-5 text-black max-w-md sm:leading-relaxed
                              md:max-w-[90%] lg:leading-8 text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px]"
                >
                    From discovery to delivery, our custom research process is structured for accuracy, speed, and strategic impact.
                </p>
            </header>

            {/* MAIN STEPS */}
            <main className="space-y-0 mt-[-10%] mb-[-5%]">
                {processSteps.map((step, i) => (
                    <ProcessStep
                        key={step.stepNumber}
                        ref={(el) => (innersRef.current[i] = el)}
                        {...step}
                        onButtonClick={() => handleStepButtonClick(step.stepNumber)}
                    />
                ))}
            </main>
        </section>
    );
};

export default CustomReportsPageWork;
