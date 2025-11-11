"use client";
import Image from "next/image";
import OtherInquiryForm from "@/components/shared/OtherInquiryForm";
import { useState, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { X, Check } from "lucide-react";

const SyndicateReportsFaq = () => {
    const [activeForm, setActiveForm] = useState("first"); // Default to 'first' form, always visible
    const formSectionRef = useRef(null);

    const handleFormToggle = (formType) => {
        setActiveForm(formType);

        // Smoothly scroll to the form section after state updates
        setTimeout(() => {
            if (formSectionRef.current) {
                formSectionRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }, 100);
    };

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: "#363636",
                        color: "#fff",
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: "#4ade80",
                            color: "#fff",
                        },
                        icon: <Check />,
                    },
                    error: {
                        duration: 5000,
                        style: {
                            background: "#ef4444",
                            color: "#fff",
                        },
                        icon: <X />,
                    },
                }}
            />
            <section className="w-full overflow-x-hidden py-10 relative">
                {/* Background image using Next.js Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/SyndicateReportsPage-component.webp"
                        alt="Syndicate Reports Background"
                        fill
                        quality={100}
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="container w-[86%] mx-auto px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 2xl:gap-20">
                        {/* Left Content */}
                        <div className="flex flex-col items-start gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 flex-1 w-full text-white">
                            <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 w-full text-left">
                                <p className="uppercase text-xs xs:text-[13px] sm:text-sm md:text-[15px] lg:text-base font-medium leading-[160%] text-[#EFF7FC] font-inter">
                                    Need Something Specific?
                                </p>
                                <h2 className="text-lg xs:text-md sm:text-xl md:text-[20px] lg:text-[26px] xl:text-[26px] 2xl:text-[26px] font-semibold leading-[120%] font-inter-display">
                                    Custom Report?
                                    <br />
                                    We've Got You Covered.
                                </h2>
                                <p className="text-xs xs:text-sm sm:text-[15px] md:text-base lg:text-[17px] xl:text-sm text-[#F5F5F5] font-medium leading-[160%] font-inter">
                                    Need country-specific segmentation? A niche industry analysis? Our team can customize any syndicated report to meet your
                                    exact requirements.
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-row gap-3 sm:gap-4 w-full">
                                <button
                                    className="w-auto bg-[#5AB1E0] hover:opacity-90 transition rounded-lg px-1 py-2 sm:px-2 sm:py-2"
                                    onClick={() => handleFormToggle("first")}
                                >
                                    <span className="text-white text-xs sm:text-sm md:text-md lg:text-[14px] font-medium font-inter-display leading-[135%] text-center block">
                                        Talk to a research consultant
                                    </span>
                                </button>
                                <div className="carousel-cta flex items-center justify-center gap-2 cursor-pointer" onClick={() => handleFormToggle("second")}>
                                    <span className="carousel-cta-text text-xs sm:text-sm md:text-xs">Submit a Brief</span>
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 relative">
                                        <Image src="/icons/Righte-Arrow.svg" alt="Arrow" fill quality={100} className="object-contain" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="w-full max-w-[320px] xs:max-w-[380px] sm:max-w-[480px] md:max-w-[540px] lg:max-w-[450px] xl:max-w-[520px] h-[180px] xs:h-[220px] sm:h-[280px] md:h-[320px] lg:h-[380px] xl:h-[400px] 2xl:h-[400px] rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[28px] xl:rounded-[32px] flex-shrink-0 relative overflow-hidden mt-4 sm:mt-0">
                            <Image src="/images/SyndicateReportsPage-demo.webp" alt="Syndicate Reports Demo" fill quality={100} className="object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Always Visible Form Section - Outside FAQ with White Background */}
            <section className="w-full bg-white py-8 sm:py-12 md:py-16 lg:py-20">
                <div ref={formSectionRef} className="container mx-auto px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20">
                    <div className="max-w-4xl mx-auto">
                        {activeForm === "first" && (
                            <OtherInquiryForm
                                title="Talk to a research consultant"
                                isOpen={true}
                                isExpandedView={true}
                                buttonText="Talk to a research consultant"
                                successMessage="Message sent successfully!"
                                pageName="Syndicate Reports(Talk to a research consultant)"
                            />
                        )}
                        {activeForm === "second" && (
                            <OtherInquiryForm
                                title="Submit a Brief"
                                isOpen={true}
                                isExpandedView={true}
                                buttonText="Submit a Brief"
                                successMessage="Message sent successfully!"
                                pageName="Syndicate Reports(Submit a Brief)"
                            />
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default SyndicateReportsFaq;
