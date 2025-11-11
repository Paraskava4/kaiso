"use client";
import React from "react";
import Image from 'next/image';

const StrategicAnalysisMarketInsightsPageHero = () => {
  return (
    <section
      className="relative w-full h-[calc(100dvh-100px)] overflow-hidden"
      aria-label="Strategic Analysis Hero Section"
    >
      <Image src="/images/StrategicAnalysis11.webp"
        alt="Strategic analysis background representing market complexity and business insights"
        className="absolute top-0 left-0 object-cover size-full"
        fill
        quality={100} />
      <div className="absolute top-0 left-0 bg-black opacity-40 size-full" aria-hidden="true" />
      <div className="absolute top-0 left-0 opacity-20 size-full" aria-hidden="true" />

      <div className="absolute top-1/2 left-1/2 flex flex-col gap-6 items-center justify-center -translate-x-1/2 -translate-y-1/2 w-[700px] max-md:w-[90%] max-md:max-w-[600px] max-sm:max-w-[400px] max-sm:w-[95%] max-md:px-5 max-sm:px-4 max-sm:gap-5">
        <header className="flex flex-col gap-3 items-center w-full">
          {/* <p className="text-lg leading-7 text-gray-100 max-md:text-base max-sm:text-sm">
            Strategic Analysis
          </p> */}
          <h1 className="w-full text-[25px] sm:text-[30px] md:text-[32px] lg:text-[34px] xl:text-[36px] font-bold text-center text-white leading-[57.6px] max-md:text-4xl max-sm:text-3xl max-sm:leading-8">
            Turn Complexity into Competitive Clarity</h1>
        </header>

        <p className="w-full text-lg leading-7 text-center text-white max-md:text-base max-sm:text-sm max-sm:leading-5">
          <span className="text-xs sm:text-xs sm:text-[10px] md:text-[12px] 2xl:text-[14px] ">
            {/* Turn Complexity into Competitive Clarity */}
            {/* <br /> */}
            Strategic Analysis enables business leaders to assess market potential, prioritise growth opportunities, and align decisions with long-term objectives. Kaiso delivers actionable insights across segments, channels, and competitive landscapes, helping organizations craft clear, forward-looking strategies that reduce risk, maximise ROI, and ensure focused execution in a dynamic, high-stakes environment.
          </span>
        </p>

        {/* <button
          className="flex gap-2.5 justify-center items-center px-5 py-3 bg-red-600 rounded-lg cursor-pointer duration-[0.3s] ease-[ease] min-w-[220px] transition-[background-color] max-md:px-5 max-md:py-2.5 max-md:min-w-[180px] max-sm:px-4 max-sm:py-3 max-sm:min-w-40 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="Get started with Strategic Analysis services"
        >
          <span className="text-lg font-medium leading-6 text-center text-white max-md:text-base max-sm:text-sm">
            Get Start
          </span>
        </button> */}
      </div>
    </section>
  );
};

export default StrategicAnalysisMarketInsightsPageHero;
