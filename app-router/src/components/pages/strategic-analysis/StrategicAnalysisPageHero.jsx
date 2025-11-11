"use client";
import Image from "next/image";
import * as React from "react";

function StrategicAnalysisPageHero() {
    const handleScheduleSession = () => {
        console.log("Schedule strategy session clicked");
    };

    return (
        <header
            className="relative flex flex-col w-full h-[calc(100dvh-100px)] overflow-hidden sm:overflow-auto md:overflow-auto"
            role="banner"
            aria-label="Strategic Analysis Hero Section"
        >
            <Image
                fill
                quality={100}
                src="/images/strategicGrowth.webp"
                alt="Strategic Analysis Hero Background"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* <div className="absolute inset-0 bg-black/50"></div> */}

            <div className="relative flex flex-col justify-center items-start px-[9.4%] w-full z-10 h-full">
                <div className="flex flex-col justify-center max-w-full w-3xl max-md:w-full pb-4 pt-4">
                    <h1 className="font-bold text-white leading-tight text-[25px] sm:text-[30px] md:text-[32px] lg:text-[34px] xl:text-[36px]">
                        Translate Insight into Strategy. Translate Strategy into Scalable Growth.
                    </h1>
                    <p className="mt-4 text-xs sm:text-xs sm:text-[10px] md:text-[12px] 2xl:text-[14px font-medium leading-relaxed text-slate-200 ">
                        Strategic growth doesn’t happen by chance; it’s engineered. Our solutions help you identify untapped markets, refine go-to-market plans,
                        and outpace competition with evidence-led strategies built for long-term, scalable success.
                    </p>

                    {/* <button
                        onClick={handleScheduleSession}
                        className="mt-6 px-5 py-3 text-lg font-medium text-white bg-[#D5003C] rounded-lg w-75 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-300 max-md:text-base max-md:px-4 max-md:py-2.5"
                        aria-label="Schedule a strategy session with Kaiso Research and Consulting"
                    >
                        Schedule Strategy Session
                    </button> */}
                </div>
            </div>
        </header>
    );
}

export default StrategicAnalysisPageHero;
