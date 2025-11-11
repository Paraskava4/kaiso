"use client";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

const Button = ({ children, onClick, className = "", variant = "primary", ...props }) => {
    const baseClasses =
        "overflow-hidden gap-2.5 px-5 py-3 font-medium leading-none text-center rounded-lg min-w-[220px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantClasses = {
        primary: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
        secondary: "text-red-600 bg-white border border-red-600 hover:bg-red-50 focus:ring-red-500",
    };

    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} onClick={onClick} {...props}>
            {children}
        </button>
    );
};

const HeroContent = () => {
    return (
        <section className="flex flex-col justify-center text-center lg:text-left">
            <div className="text-gray-100 w-full">
                <p className="leading-relaxed text-[18px] font-medium">Market Assessment</p>
                <h1 className="mt-3 font-bold text-white text-[25px] sm:text-[30px] md:text-[32px] lg:text-[34px] xl:text-[36px] leading-tight">
                    Make Smarter Moves with In-Depth Market Assessment
                </h1>
                <p className="mt-4 sm:mt-6 leading-relaxed text-xs sm:text-xs sm:text-[10px] md:text-[12px] 2xl:text-[14px] max-w-2xl mx-auto lg:mx-0">
                    Confident growth starts with clear market visibility. Our Market Assessment services uncover demand shifts, competitive dynamics, and
                    customer needs, empowering informed, data-led decisions for entry planning, portfolio expansion, and risk mitigation across every strategic
                    stage.
                </p>
            </div>
            {/* <Button
                className="self-start mt-6"
                onClick={() => console.log("Get Started button clicked")}
                aria-label="Get started with market assessment services"
            >
                Get Started
            </Button> */}
        </section>
    );
};

const HeroImages = () => {
    return (
        <div className="w-full">
            <div className="flex gap-3 sm:gap-4 md:gap-6 lg:gap-8 justify-center items-center">
                <Image
                    width={0}
                    height={0}
                    src="/images/Market1.webp"
                    alt="Market research visualization showing data analytics and business insights"
                    className="object-contain w-40 sm:w-40 md:w-40 lg:w-48 xl:w-56 h-auto"
                />
                <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                    <Image
                        width={0}
                        height={0}
                        src="/images/Market2.webp"
                        alt="Business consulting dashboard with market trends and growth metrics"
                        className="object-contain w-40 sm:w-40 md:w-40 lg:w-48 xl:w-56 h-auto"
                    />
                    <Image
                        width={0}
                        height={0}
                        src="/images/Market3.webp"
                        alt="Strategic planning interface showing market assessment tools and data visualization"
                        className="object-contain w-40 sm:w-40 md:w-40 lg:w-48 xl:w-56 h-auto"
                    />
                </div>
            </div>
        </div>
    );
};

const MarketAssessmentPageHero = () => {
    return (
        <section
            className="mb-35 mb-35 sm:mb-35 md:mb-50 lg:mb-65 relative min-h-screen flex items-center justify-center py-16 sm:py-20 md:py-24 lg:py-0"
            role="banner"
            aria-label="Market Assessment Services Hero Section"
        >
            {/* Background Image */}
            <Image
                width={0}
                height={0}
                src="/images/SyndicateReportsPage-component.webp"
                alt=""
                aria-hidden="true"
                className="object-cover absolute inset-0 w-full h-full"
            />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-[1300px] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 xl:py-0">
                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center">
                    {/* Text Content */}
                    <div className="flex-1 w-full lg:max-w-[50%] order-1">
                        <HeroContent />
                    </div>

                    {/* Images */}
                    <div className="flex-1 w-full lg:max-w-[50%] order-2">
                        <HeroImages />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MarketAssessmentPageHero;
