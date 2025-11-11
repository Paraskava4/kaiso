"use client";

import React from "react";
import Image from "next/image";

const SyndicateReportsCta = () => {
    return (
        <section
            className="
        p-4 flex flex-col w-full items-center gap-6 rounded-2xl bg-gray-100 my-6 mx-3 box-border
        max-w-[95%]

        max-2xs:p-3 max-2xs:gap-4 max-2xs:my-4 max-2xs:mx-2 max-2xs:max-w-[95%]

        sm:p-5 sm:gap-8 sm:my-10 sm:mx-4 sm:rounded-[20px] sm:max-w-[90%]

        md:p-6 md:gap-10 md:my-[50px] md:mx-auto md:max-w-[88%] md:rounded-[24px]

        lg:p-8 lg:flex-row lg:items-center lg:gap-16 lg:my-20 lg:rounded-[32px] lg:text-left lg:max-w-[85%]

        xl:gap-20 xl:my-[100px] xl:max-w-[80%]

        2xl:max-w-[75%] 2xl:gap-24 2xl:p-10
    "
        >
            {/* Left side image */}
            <div
                className="
                w-full h-[200px] flex-shrink-0 rounded-xl relative overflow-hidden order-first

                max-2xs:h-[160px] max-2xs:rounded-lg

                sm:h-[220px] sm:rounded-2xl

                md:h-[260px] md:rounded-[20px]

                lg:w-[360px] lg:h-[300px] lg:order-none lg:rounded-[32px]

                xl:w-[460px] xl:h-[360px]

                2xl:w-[500px] 2xl:h-[400px]
                "
            >
                <Image
                    src="/images/syndicateReports.webp"
                    alt="Syndicate Reports CTA"
                    width={650}
                    height={400}
                    quality={100}
                    priority={true}
                    className="object-cover object-center w-full h-full
                              rounded-xl sm:rounded-2xl md:rounded-[20px] lg:rounded-[32px]
                              transition-all duration-300"
                    sizes="(max-width: 360px) 100vw, 
                           (max-width: 576px) 100vw, 
                           (max-width: 768px) 100vw, 
                           (max-width: 1024px) 100vw, 
                           (max-width: 1280px) 500px, 
                           650px"
                />
            </div>

            {/* Text Section */}
            <div
                className="
                flex flex-col items-center gap-4 flex-1 text-center

                max-2xs:gap-3

                sm:gap-5

                md:gap-6

                lg:items-start lg:gap-7 lg:pr-10 lg:text-left

                xl:gap-8 xl:pr-14

                2xl:pr-20 2xl:gap-8
                "
            >
                <div
                    className="
                    flex flex-col items-center gap-3 w-full

                    max-2xs:gap-2

                    sm:gap-4

                    lg:items-start
                    "
                >
                    <h2
                        className="
                        text-[#1c1d21] font-inter font-semibold leading-[140%] m-0 
                        text-xs sm:text-xs sm:text-[16px] md:text-[18px] 2xl:text-[20px]
                        "
                    >
                        What Our Syndicated Reports Deliver
                    </h2>

                    <p
                        className="
                        text-black font-inter font-normal leading-[160%] m-0 
                        text-xs sm:text-xs sm:text-[10px] md:text-[12px] 2xl:text-[14px]
                        "
                    >
                        Kaiso’s Syndicated Reports are Industry-validated research studies that provide a detailed and reliable view of specific markets,
                        technologies, or industries. Our reports include market sizing, historical analysis, growth forecasts, segmentation insights,
                        competitive intelligence, and key trends. These off-the-shelf studies are designed to deliver clear and actionable market intelligence
                        to serve multiple stakeholders.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default SyndicateReportsCta;
