"use client";
import * as React from "react";
import Image from "next/image";

// Arrow Icon
export const ArrowIcon = ({ className = "" }) => {
    return (
        <div className={`relative w-6 h-6 ${className}`}>
            <Image src="/icons/Righte-Arrow.svg" alt="Arrow" width={24} height={24} className="w-auto h-auto" quality={100} />
        </div>
    );
};

// CTA Button
export const ViewReportsButton = ({ children = "View Reports", className = "" }) => {
    return (
        <button
            className={`flex gap-2.5 justify-center items-center px-5 py-3 bg-sky-900 rounded-lg cursor-pointer border-none min-w-[220px] max-sm:w-full max-sm:min-w-0 hover:bg-sky-800 transition-colors ${className}`}
        >
            <span className="text-lg font-medium leading-6 text-center text-white">{children}</span>
            <ArrowIcon />
        </button>
    );
};

// Main Section
export const CompetitivePositioningAnalysisWork = () => {
    return (
        <section className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 px-4 sm:px-6 md:px-10 lg:px-16 py-10 sm:py-12 md:py-16 lg:py-20 max-w-7xl mx-auto">
            {/* Left Content */}
            <div className="flex flex-col gap-6 md:gap-7 lg:gap-8 items-start md:items-start text-left md:text-left w-full md:w-1/2">
                <header className="w-full max-w-xl">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-snug text-zinc-900">Why Competitive Positioning</h2>
                </header>

                <p className="text-xs sm:text-xs md:text-sm leading-relaxed text-zinc-700">
                    Markets evolve quickly, competitors innovate, customer needs shift, and new technologies disrupt entire categories. Our Competitive
                    Positioning Analysis helps you stay aligned with changing market dynamics by uncovering what your competitors are doing, where new
                    opportunities are emerging, and how your brand can stay relevant. It enables you to make smarter decisions, refine your strategy, and build
                    a distinct, competitive edge that supports long-term business growth.
                </p>

                {/* CTA (optional) */}
                {/* <ViewReportsButton /> */}
            </div>

            {/* Right Image */}
            <div className="flex justify-center w-full md:w-1/2 max-w-[500px]">
                <Image
                    src="/images/CompetitivePositioning.webp"
                    alt="Competitive Positioning Visual"
                    className="object-cover rounded-xl sm:rounded-2xl w-full h-[220px] sm:h-[300px] md:h-[350px] lg:h-[400px]"
                    width={500}
                    height={400}
                    quality={100}
                />
            </div>
        </section>
    );
};

export default CompetitivePositioningAnalysisWork;
