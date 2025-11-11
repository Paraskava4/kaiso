"use client";
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const AboutCustomer = () => {
    // Array of testimonial data
    const testimonials = [
        // {
        //     logo: "/images/shopify.webp",
        //     logoFallback: "/images/1c174837964fdc398368a0ce8669ac82e631d906.webp",
        //     title: "Lorem Ipsum is simply dummy text of the printing.",
        //     description:
        //         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        //     stats: [
        //         { value: "55,490+", label: "Managed Business" },
        //         { value: "3X", label: "Business Growth" },
        //     ],
        //     image: "/images/572f20edcf2e338064798d5bb08f05c55c79be7b.webp",
        //     person: { name: "John Doe", title: "Senior Startup Program Manager, Segment" },
        // },
        {
            logo: "/images/shopify.webp",
            logoFallback: "/images/1c174837964fdc398368a0ce8669ac82e631d906.webp",
            title: "Amazon has revolutionized the way we shop online.",
            description:
                "Our partnership with this platform has enabled us to reach millions of customers worldwide. The robust infrastructure and customer-centric approach have been key to our success in the digital marketplace.",
            stats: [
                { value: "78,320+", label: "Products Listed" },
                { value: "4.2X", label: "Revenue Growth" },
            ],
            image: "/images/4633e771459bc21a6207c9bd2c7f0dd7463e1a68.webp",
            person: { name: "Sarah Johnson", title: "E-commerce Director, TechGadgets Inc." },
        },
        {
            logo: "/images/shopify.webp",
            logoFallback: "/images/1c174837964fdc398368a0ce8669ac82e631d906.webp",
            title: "Microsoft's cloud solutions transformed our operations.",
            description:
                "Implementing Microsoft's enterprise solutions has significantly improved our productivity and collaboration. The seamless integration between different tools has created a more efficient workflow for our teams across multiple locations.",
            stats: [
                { value: "42%", label: "Productivity Increase" },
                { value: "4.2X", label: "Revenue Growth" },
            ],
            image: "/images/fbc2cf4bafc687d07bd174b433801cebcbb55eb9.webp",
            person: { name: "Michael Chen", title: "CTO, Global Innovations" },
        },
    ];

    // State to track current testimonial index
    const [currentIndex, setCurrentIndex] = useState(0);

    // Function to go to next testimonial
    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    // Function to go to previous testimonial
    const prevTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };

    // Current testimonial data
    const currentTestimonial = testimonials[currentIndex];

    return (
        <section className="py-6 sm:py-8 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-[#FAF5F0]">
            {/* Section Header */}
            <div className="max-w-xl sm:max-w-2xl mx-auto text-center mb-8 sm:mb-12">
                <h2 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-semibold mb-3">Feedback</h2>
                <p className="text-black-600 text-sm">{/* Optional description */}</p>
            </div>

            {/* Testimonial Wrapper */}
            <div className="relative max-w-[95%] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto mt-8 sm:mt-10 p-4 sm:p-6 md:p-8 rounded-2xl">
                {/* Left Arrow */}
                <button
                    className="absolute -left-2 sm:-left-4 md:-left-6 lg:-left-8 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white flex items-center justify-center shadow-md z-10"
                    aria-label="Previous testimonial"
                    onClick={prevTestimonial}
                >
                    <Image
                        width={100}
                        height={100}
                        quality={100}
                        src="/icons/Left-Swipe-Black.webp"
                        alt="Previous"
                        className="w-4 sm:w-5 h-4 sm:h-5"
                        onError={(e) => {
                            e.currentTarget.src = "/icons/Left-Swipe.svg";
                        }}
                    />
                </button>

                {/* Content */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                    {/* Left Column */}
                    <div className="md:w-1/2 flex flex-col text-center md:text-left">
                        <Image
                            src={currentTestimonial.logo}
                            width={100}
                            height={100}
                            quality={100}
                            alt="Company Logo"
                            className="w-24 sm:w-28 md:w-32 h-auto mx-auto md:mx-0 mb-4 sm:mb-6"
                            onError={(e) => {
                                e.currentTarget.src = currentTestimonial.logoFallback;
                            }}
                        />

                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">{currentTestimonial.title}</h2>

                        <p className="text-black-600 text-xs sm:text-sm mb-4 sm:mb-6">{currentTestimonial.description}</p>

                        {/* Stats */}
                        <div className="flex justify-center md:justify-start flex-wrap gap-4 sm:gap-6 mt-auto">
                            {currentTestimonial.stats.map((stat, index) => (
                                <div key={index} className="bg-white rounded-lg px-4 py-3 sm:px-5 sm:py-4">
                                    <p className="text-md sm:text-lg font-bold pb-1">{stat.value}</p>
                                    <p className="text-xs sm:text-sm text-black-500">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="md:w-1/2 flex justify-center">
                        <div
                            className="
            relative rounded-[32px] overflow-hidden 
            w-[290px] sm:w-[380px] md:w-[430px] lg:w-[450px] 
            h-[260px] sm:h-[330px] md:h-[380px] lg:h-[430px]
          "
                        >
                            <Image
                                src={currentTestimonial.image}
                                alt="Customer testimonial"
                                className="w-full h-full object-cover"
                                width={100}
                                height={100}
                                quality={100}
                            />

                            {/* Person Info */}
                            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 bg-white p-3 sm:p-4 rounded-xl flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-sm sm:text-sm">{currentTestimonial.person.name}</p>
                                    <p className="text-xs sm:text-xs text-black-500">{currentTestimonial.person.title}</p>
                                </div>
                                <div className="rounded-full p-2 sm:p-3 hover:bg-black-100 cursor-pointer border border-gray-300">
                                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Arrow */}
                <button
                    className="absolute -right-2 sm:-right-4 md:-right-6 lg:-right-8 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white flex items-center justify-center shadow-md z-10"
                    aria-label="Next testimonial"
                    onClick={nextTestimonial}
                >
                    <Image
                        width={100}
                        height={100}
                        quality={100}
                        src="/icons/Right-Swipe-Black.webp"
                        alt="Next"
                        className="w-4 sm:w-5 h-4 sm:h-5"
                        onError={(e) => {
                            e.currentTarget.src = "/icons/Right-Swipe.svg";
                        }}
                    />
                </button>
            </div>
        </section>
    );
};

export default AboutCustomer;
