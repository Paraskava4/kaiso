"use client";
import React from "react";

const StrategicAnalysisAbout = () => {
    return (
        <section className="flex flex-col bg-[#FAF5EF] items-start gap-[10px] w-full px-4 sm:px-8 lg:px-[100px] xl:px-[200px] 2xl:px-[300px] py-[100px] md:py-[120px] lg:py-[150px]">
            {/* Wrapper */}
            <div className="flex flex-col lg:flex-row items-center gap-[52px] w-full">
                {/* Left Side */}
                <div className="flex flex-col items-start gap-[20px]">
                    {/* <span className="text-[#D62035] text-[16px] font-medium leading-[160%]">What Is Strategic Analysis</span> */}
                    <h2 className="text-[#1C1D21] text-[28px] sm:text-[30px] font-semibold leading-[120%] max-w-[618px]">What is Strategic Growth Solutions</h2>
                    <p className="text-[#1C1D21] text-[16px] sm:text-[16px] font-normal leading-[160%] max-w-[946px]">
                        Strategic Growth Solutions go beyond conventional planning; they help businesses uncover untapped potential, mitigate expansion risks,
                        and scale with purpose. Whether you're targeting new markets, launching a product, or repositioning for competitive advantage, our
                        solutions are built to answer critical questions around where to grow, how to grow, and how fast to move.
                    </p>
                </div>

                {/* Right Side */}
                <div className="w-full max-w-[650px] min-h-[350px] bg-gradient-to-b from-white to-white/20 rounded-t-[20px] p-[30px] flex flex-col items-start gap-5">
                    <h3 className="text-[#5AB1E0] text-[18px] font-medium leading-[160%]">What we provide Strategic Analysis</h3>
                    <ul className="flex flex-col items-start gap-[12px] list-disc pl-5">
                        {[
                            "TAM Sizing and Expansion Analysis",
                            "Go-to-Market (GTM) Strategy Frameworks",
                            "Competitive Benchmarking and Growth Positioning",
                            "Market Entry and Diversification Planning",
                            "Buyer Persona and Value Proposition Mapping",
                        ].map((item, index) => (
                            <li key={index} className="text-[#43464B] text-[18px] font-medium leading-[160%]">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default StrategicAnalysisAbout;
