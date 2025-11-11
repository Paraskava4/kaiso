"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";

const benefits = [
    {
        title: "Precision-Driven Decisions",
        desc: "Avoid generic insights. Get data and analysis laser-focused on your industry, region, product type, and audience.",
        icon: "/icons/CustomReports1.png",
    },
    {
        title: "Flexible Formats for Every Need",
        desc: "Whether you need a deep-dive document, quick stats sheet, visual dashboard, or a live walkthrough we deliver in the format that best suits your workflow.",
        icon: "/icons/CustomReports2.png",
    },
    {
        title: "Faster Strategy Alignment",
        desc: "Receive insights aligned with your internal goals whether it’s for investor pitches, product roadmap planning, or market entry.",
        icon: "/icons/CustomReports3.png",
    },
    {
        title: "Better Stakeholder Buy-In",
        desc: "Support your internal discussions with credible, third-party intelligence. Custom reports are ideal for boardrooms, CXO reviews, and strategic planning.",
        icon: "/icons/CustomReports4.png",
    },
    {
        title: "Fill Critical Information Gaps",
        desc: "Answer the questions that syndicated reports can’t. Explore white spaces, emerging trends, and niche market opportunities.",
        icon: "/icons/CustomReports5.png",
    },
    {
        title: "Save Time and Resources",
        desc: "No need to spend weeks sifting through irrelevant data. Let our team handle the research so yours can focus on execution.",
        icon: "/icons/CustomReports6.png",
    },
];

export default function CustomReportsHelp({ onFormRequest }) {
    const [showMore1, setShowMore1] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const text1 =
        "Custom reports offer unmatched precision and relevance. Designed around your specific business challenges, they provide focused insights that support high-stakes decisions, whether you're entering new markets, launching niche offerings, or evaluating strategic partnerships. Every component, from research design to analysis, is tailored to reflect your goals, target segments, and competitive context. With a tailored research framework, primary data inputs, and analyst-led interpretation, custom reports deliver high-impact intelligence that is specific, actionable, and aligned with your internal goals. They help leaders reduce uncertainty, support cross-functional planning, and move with clarity in high-stakes environments.";

    const characterLimit = 402;
    const handleRequestReport = () => {
        if (onFormRequest) {
            onFormRequest();
        }
    };

    useEffect(() => {
        const initAnimations = async () => {
            const gsapModule = await import("gsap");
            const ScrollTriggerModule = await import("gsap/ScrollTrigger");

            const gsap = gsapModule.gsap || gsapModule.default;
            const ScrollTrigger = ScrollTriggerModule.ScrollTrigger || ScrollTriggerModule.default;

            gsap.registerPlugin(ScrollTrigger);

            const elements = document.querySelectorAll(".content--sticky");
            elements.forEach((el, i) => {
                gsap.to(el.querySelector(".benefit-card"), {
                    scale: 0.8,
                    backgroundColor: "rgb(207, 205, 205)",
                    ease: "none",
                    scrollTrigger: {
                        trigger: el,
                        start: "center center",
                        end: "+=100%",
                        scrub: true,
                        invalidateOnRefresh: true,
                    },
                });
            });
        };

        initAnimations();

        return () => {
            if (typeof window !== "undefined") {
                const ScrollTrigger = require("gsap/ScrollTrigger").ScrollTrigger;
                ScrollTrigger?.getAll().forEach((st) => st.kill());
            }
        };
    }, []);

    return (
        <>
            <section className="bg-[#FAF7F3] w-full px-4 md:px-8 lg:px-11 py-20">
                <div className="max-w-[86%] mx-auto flex flex-col lg:flex-row gap-10 lg:gap-20 items-start justify-between">
                    {/* Sticky Left Content */}
                    <div className="w-full max-w-xl lg:sticky lg:top-50 self-start">
                        {/* <p className="text-red-600 font-semibold text-sm mb-3">How it’s Help</p> */}
                        <h2 className="text-black font-bold text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] mb-4 leading-tight">
                            Why Choose a Custom Report
                            <br className="hidden sm:block" /> Over a Standard One
                        </h2>

                        {/* First Paragraph */}
                        <p className="text-black text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] leading-relaxed mb-6">
                            {text1.slice(0, characterLimit)}
                            {!showMore1 && (
                                <span
                                    style={{
                                        color: "#17306E",
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                        marginLeft: "5px",
                                    }}
                                    onClick={() => setShowMore1(true)}
                                >
                                    Read More
                                </span>
                            )}
                        </p>

                        {/* Second Paragraph (conditionally rendered) */}
                        {showMore1 && (
                            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
                                {text1.slice(characterLimit)}
                                <span
                                    style={{
                                        color: "#17306E",
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                        display: "inline-block",
                                        marginLeft: "5px",
                                    }}
                                    onClick={() => setShowMore1(false)}
                                >
                                    Read Less
                                </span>
                            </p>
                        )}

                        <button
                            className="bg-[#17306E] hover:bg-[#0b214f] text-white font-medium text-sm px-6 py-2 rounded-md transition"
                            onClick={handleRequestReport}
                        >
                            Request a Custom Report
                        </button>
                    </div>

                    {/* Right Sticky Cards */}
                    <div className="grid grid-cols-1 w-full md:max-w-xl lg:max-w-2xl xl:max-w-3xl md:mx-auto lg:mx-0">
                        {benefits.map((b, idx) => (
                            <div key={idx} className="content--sticky h-screen sticky top-0 flex items-center justify-center">
                                <div className="benefit-card border border-neutral-200 rounded-xl px-6 py-8 mb-50 bg-white shadow-sm transition-transform duration-300 w-full">
                                    <div className="mb-3">
                                        <Image src={b.icon} alt={`Icon for ${b.title}`} width={37} height={37} />
                                    </div>
                                    <h3 className="font-semibold text-base text-zinc-900 mb-2" style={{ fontSize: "1.3rem" }}>
                                        {b.title}
                                    </h3>
                                    <p className="text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] text-black leading-relaxed">{b.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
