"use client";
import * as React from "react";
import { ResponsiveMarginContainer } from "../../ui";
import Image from "next/image";

function MarketAssessmentPageReports() {
    return (
        <ResponsiveMarginContainer>
            <section
                className="flex flex-col gap-10 items-center text-base sm:text-lg md:flex-row-reverse xl:gap-15"
                role="region"
                aria-labelledby="market-assessment-heading"
                style={{ marginTop: "-12%" }}
            >
                {/* Text on the left (even on desktop) */}
                <div className="flex flex-col  w-full md:w-[86%] sm-text-center md-text-left lg-text-left 2xl-text-left">
                    <h2
                        id="market-assessment-heading"
                        className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-semibold text-zinc-900 leading-snug"
                    >
                        Why Market Assessment
                    </h2>
                    <p className="mt-5 text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] sm:mt-6 md:mt-7 text-zinc-700 leading-relaxed sm:leading-7">
                        In unpredictable and fast-changing markets, relying on assumptions or outdated data can lead to costly errors. A thorough Market
                        Assessment provides businesses with a clear, up-to-date, and accurate understanding of where opportunities exist and what challenges to
                        anticipate. It facilitates smarter market entry, product positioning, and investment choices by identifying demand trends, regulatory
                        changes, customer needs, and competitor strategies.
                    </p>

                    {/* Optional Button */}
                    {/*
          <button
            className="flex gap-2.5 justify-center items-center px-5 py-3 mt-7 text-white bg-red-600 rounded-lg min-w-[220px] hover:bg-red-700 transition duration-200"
            aria-label="View market assessment reports"
            type="button"
          >
            <span>View Reports</span>
            <Image
              src="icons/Righte-Arrow.svg"
              alt=""
              className="w-6 h-6"
              aria-hidden="true"
              width={100}
              height={100}
              quality={100}
            />
          </button>
          */}
                </div>
                {/* Image on the right (even on desktop) */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <Image
                        src="/images/MarketAssesment.webp"
                        alt="Market assessment visualization showing data analytics and business insights"
                        width={630}
                        height={420}
                        className="w-full xl:mr-22 max-w-[480px] xl:w-[490px] rounded-2xl object-contain"
                    />
                </div>
            </section>
        </ResponsiveMarginContainer>
    );
}

export default MarketAssessmentPageReports;
