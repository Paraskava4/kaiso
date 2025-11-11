"use client";
import React from "react";
import Image from "next/image";

const AboutUsHero = () => {
    return (
        <>
            {/* ───── First Section (already in your code) ───── */}
            <section className="w-full flex justify-center py-12 md:py-20 px-4 bg-white">
                <div className="w-full max-w-[82%] grid grid-cols-1 md:grid-cols-2 items-center">
                    {/* Left Content */}
                    <div className="text-center md:text-left">
                        <h1 className="text-[25px] sm:text-[30px] md:text-[32px] lg:text-[34px] xl:text-[30px] font-bold mb-4 text-text-primary leading-tight">
                            Where Insight Meets Strategy, and Strategy Drives Growth
                        </h1>
                        <div className="mt-4 text-sm md:text-[14px] text-black-600 space-y-4 leading-relaxed">
                            <p>
                                At Kaiso Research and Consulting LLP, we transform complex market data into research-driven strategies that empower
                                organisations to identify opportunities, anticipate challenges, and make smarter decisions for confident growth in dynamic
                                global markets.
                            </p>
                            <p>
                                We deliver more than insights. Our Syndicate Research Reports provide comprehensive industry and market coverage, while our
                                Custom Report Solutions are designed to address specific business needs with precision. We also offer Consulting Services to
                                solve critical challenges, Full-Time Engagement Models that act as an extension of your team, and Strategic Growth Solutions
                                that accelerate market expansion, strengthen competitive positioning, and drive long-term success.
                            </p>
                        </div>
                    </div>

                    {/* Right Images */}
                    <div className="flex flex-col items-center md:items-center space-y-4">
                        <div className="relative  overflow-hidden">
                            <Image src="/images/about1.webp" alt="About Us Illustration 1" width={250} height={220} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── Second Section (Tight Layout, No Extra Space) ───── */}
            <section className="w-full flex justify-center py-16 px-6 bg-[#F4F5F7]">
                <div className="w-full max-w-[82%] grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    {/* Left Content */}
                    <div className="space-y-6">
                        <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 leading-tight">The Story Behind Our Identity</h2>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            At KAISO Research and Consulting, our logo is more than a design — it is a reflection of our purpose and philosophy. Each element
                            symbolises a part of our journey with clients:
                        </p>

                        {/* Points */}
                        <div className="space-y-4">
                            {/* Circle */}
                            <div className="flex items-start space-x-3">
                                {/* <span className="w-4 h-4 rounded-full bg-red-500 mt-1"></span> */}
                                <Image src={"/images/about-1.svg"} alt="about-1" width={15} height={15} className="mt-1" />
                                <p className="text-gray-800 text-sm">
                                    <strong>Insight & Vision</strong> <br />
                                    We uncover opportunities hidden in complexity, helping businesses see the bigger picture.
                                </p>
                            </div>
                            {/* Bar */}
                            <div className="flex items-start space-x-3">
                                {/* <span className="w-3 h-6 bg-gray-800 mt-1"></span> */}
                                <Image src={"/images/about-2.svg"} alt="about-2" width={10} height={10} className="mt-1" />
                                <p className="text-gray-800 text-sm">
                                    <strong>Reliability & Trust</strong> <br />
                                    Our strategies are built on strong foundations, earning the confidence of global clients through data-driven precision.
                                </p>
                            </div>
                            {/* Curve */}
                            <div className="flex items-start space-x-3">
                                <Image src={"/images/about-3.svg"} alt="about-2" width={15} height={15} className="mt-1" />
                                <p className="text-gray-800 text-sm">
                                    <strong>Growth & Progress</strong> <br />
                                    We enable organisations to adapt, expand, and move forward with confidence in an ever-evolving marketplace.
                                </p>
                            </div>
                        </div>

                        <p className="text-gray-700 text-sm">
                            Together, these three elements define KAISO — a partner that blends insight, trust, and growth into every engagement.
                        </p>
                    </div>

                    {/* Right Side Image */}
                    <div className="flex justify-center md:justify-end">
                        <div className="w-[280px]">
                            <Image src="/images/aboutus3.png" alt="KAISO Identity Illustration" width={180} height={120} objectFit="contain" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full flex justify-center py-12 md:py-20 px-4 bg-white">
                <div className="w-full max-w-[82%] grid grid-cols-1 md:grid-cols-2 items-center">
                    {/* Left Content */}
                    <div className="text-center md:text-left">
                        <h1 className="text-[25px] sm:text-[30px] md:text-[32px] lg:text-[34px] xl:text-[30px] font-bold mb-4 text-text-primary leading-tight">
                            Kaiso for Scalable Business Growth!{" "}
                        </h1>
                        <div className="mt-4 text-sm md:text-[14px] text-black-600 space-y-4 leading-relaxed">
                            <p>
                                Kaiso Research and Consulting is a market research and strategic consulting firm delivering data-driven insights and
                                growth-focused solutions. We specialise in market research and strategic consulting, empowering businesses across industries and
                                geographies. Trusted by startups and Fortune 500 companies, our portfolio spans 5,000+ reports. From navigating complex markets
                                to uncovering white space opportunities, we help decision-makers act with clarity and confidence. What sets us apart is
                                impact—our intelligence delivers an average ROI of over 60%, proving that research is not just insight but a growth engine.
                            </p>
                        </div>
                    </div>

                    {/* Right Images */}
                    <div className="flex flex-col items-center md:items-center space-y-4">
                        <div className="relative  overflow-hidden ">
                            <Image src="/images/aboutus4.webp" alt="About Us Illustration 1" width={400} height={400} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AboutUsHero;
