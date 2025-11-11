// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import Image from "next/image";

// // Custom hooks for client-side rendering and window size
// const useClientOnly = () => {
//     const [isClient, setIsClient] = useState(false);
//     useEffect(() => {
//         setIsClient(true);
//     }, []);
//     return isClient;
// };

// const useWindowSize = () => {
//     const [windowSize, setWindowSize] = useState({ width: undefined });
//     useEffect(() => {
//         if (typeof window !== "undefined") {
//             const handleResize = () => {
//                 setWindowSize({ width: window.innerWidth });
//             };
//             window.addEventListener("resize", handleResize);
//             handleResize();
//             return () => window.removeEventListener("resize", handleResize);
//         }
//     }, []);
//     return windowSize;
// };

// // SectionHeader Component
// const SectionHeader = ({ title, description, className = "" }) => {
//     return (
//         <header
//             className={`flex flex-col items-center w-full leading-relaxed text-center px-4 sm:px-6 lg:px-8 ${className}`}
//             style={{ marginTop: "-7%" }}
//         >
//             <div className="flex flex-col items-center max-w-full w-full sm:w-[762px]">
//                 <h1 className="mt-2 text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-semibold leading-tight text-zinc-900 max-w-full">
//                     {title}
//                 </h1>
//                 <p className="mt-2 text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] text-zinc-900 max-w-full">
//                     {description}
//                 </p>
//             </div>
//         </header>
//     );
// };

// // FeatureCard Component
// const FeatureCard = ({
//     iconSrc = "/icons/Competitive1.png",
//     iconBgColor = "bg-gray-100",
//     title,
//     subtitle,
//     description,
//     extraDetail = [],
//     className = "",
// }) => {
//     return (
//         <article
//             className={`overflow-hidden p-4 sm:p-5 bg-white rounded-xl min-w-[300px] w-full min-h-[300px] transition-all duration-500 ease-in-out hover:shadow-lg hover:-translate-y-2 group ${className}`}
//         >

//             <div className="relative w-full h-full [perspective:1000px]">
//                 <div className="relative w-full h-full min-h-[300px] transition-transform duration-500 ease-in-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
//                     {/* Front Side */}
//                     <div className="absolute w-full h-full min-h-[300px] [backface-visibility:hidden] flex flex-col">
//                         <div
//                             className={`flex overflow-hidden gap-2.5 items-center p-2 sm:p-3 w-12 h-12 sm:w-14 sm:h-14 ${iconBgColor} rounded-2xl transition-all duration-300`}
//                         >
//                             <Image
//                                 src={iconSrc}
//                                 alt="icon"
//                                 className="object-contain w-6 sm:w-8 aspect-square transition-all duration-300"
//                                 role="presentation"
//                                 width={100}
//                                 height={100}
//                                 quality={100}
//                             />
//                         </div>
//                         <div className="flex flex-col justify-center  w-full flex-grow">
//                             <div className="pb-3 sm:pb-4 w-full font-medium leading-snug border-solid border-b-[0.5px] border-b-[color:var(--Other-Border,rgba(67,70,75,0.30))]">
//                                 <h3 className="text-md text-zinc-900">{title}</h3>
//                                 <p className="mt-2 sm:mt-2.5 text-sm italic text-zinc-900">{subtitle}</p>
//                             </div>
//                             <p className="mt-3 text-xs leading-6 sm:leading-7 text-zinc-900">{description}</p>
//                         </div>
//                     </div>
//                     {/* Back Side */}
//                     <div className="absolute w-full h-full min-h-[400px] [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white  sm:p-5 flex flex-col justify-start">
//                         <ul className="space-y-2 overflow-y-auto pr-2">
//                             {extraDetail.map((detail, index) => (
//                                 <li
//                                     key={index}
//                                     className="flex items-start text-xs sm:text-sm text-zinc-900 leading-relaxed"
//                                 >
//                                     <span className="inline-block w-1.5 h-1.5 bg-zinc-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
//                                     <span>{detail}</span>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         </article>
//     );
// };

// // CommanFeatureCardContainer Component
// const CommanFeatureCardContainer = ({ data, title, description }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const isClient = useClientOnly();
//     const { width } = useWindowSize();
//     const [cardsPerView, setCardsPerView] = useState(3);
//     const [isMobileView, setIsMobileView] = useState(false);

//     const scrollContainerRef = useRef(null);
//     const [isDragging, setIsDragging] = useState(false);
//     const [startX, setStartX] = useState(0);
//     const [scrollLeft, setScrollLeft] = useState(0);

//     // Update cards per view based on screen size
//     useEffect(() => {
//         if (!isClient) return;

//         if (width <= 767) {
//             setCardsPerView(1);
//             setIsMobileView(true);
//         } else if (width <= 1199) {
//             setCardsPerView(2);
//             setIsMobileView(false);
//         } else {
//             setCardsPerView(3);
//             setIsMobileView(false);
//         }
//     }, [isClient, width]);

//     // Global mouse event handlers for drag functionality
//     useEffect(() => {
//         if (!isClient) return;

//         const handleGlobalMouseMove = (e) => {
//             if (isDragging && scrollContainerRef.current) {
//                 e.preventDefault();
//                 const x = e.pageX - scrollContainerRef.current.offsetLeft;
//                 const walk = (x - startX) * 1.5;
//                 scrollContainerRef.current.scrollLeft = scrollLeft - walk;
//             }
//         };

//         const handleGlobalMouseUp = () => {
//             if (isDragging) {
//                 setIsDragging(false);
//                 if (scrollContainerRef.current) {
//                     scrollContainerRef.current.style.cursor = "grab";
//                 }
//             }
//         };

//         if (isDragging) {
//             document.addEventListener("mousemove", handleGlobalMouseMove);
//             document.addEventListener("mouseup", handleGlobalMouseUp);
//         }

//         return () => {
//             document.removeEventListener("mousemove", handleGlobalMouseMove);
//             document.removeEventListener("mouseup", handleGlobalMouseUp);
//         };
//     }, [isClient, isDragging, startX, scrollLeft]);

//     // Drag functionality handlers
//     const handleMouseDown = (e) => {
//         if (!isMobileView || !scrollContainerRef.current) return;
//         setIsDragging(true);
//         setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
//         setScrollLeft(scrollContainerRef.current.scrollLeft);
//         scrollContainerRef.current.style.cursor = "grabbing";
//     };

//     const handleMouseMove = (e) => {
//         if (!isDragging || !scrollContainerRef.current) return;
//         e.preventDefault();
//         const x = e.pageX - scrollContainerRef.current.offsetLeft;
//         const walk = (x - startX) * 1.5;
//         scrollContainerRef.current.scrollLeft = scrollLeft - walk;
//     };

//     const handleMouseUp = () => {
//         if (!scrollContainerRef.current) return;
//         setIsDragging(false);
//         scrollContainerRef.current.style.cursor = "grab";
//     };

//     const handleMouseLeave = () => {
//         if (!scrollContainerRef.current) return;
//         setIsDragging(false);
//         scrollContainerRef.current.style.cursor = "grab";
//     };

//     // Touch handlers for mobile
//     const handleTouchStart = (e) => {
//         if (!isMobileView || !scrollContainerRef.current) return;
//         setIsDragging(true);
//         setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
//         setScrollLeft(scrollContainerRef.current.scrollLeft);
//     };

//     const handleTouchMove = (e) => {
//         if (!isDragging || !scrollContainerRef.current) return;
//         const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
//         const walk = (x - startX) * 1.5;
//         scrollContainerRef.current.scrollLeft = scrollLeft - walk;
//     };

//     const handleTouchEnd = () => {
//         setIsDragging(false);
//     };

//     const handlePrevious = () => {
//         setCurrentIndex((prev) => Math.max(0, prev - 1));
//     };

//     const handleNext = () => {
//         setCurrentIndex((prev) => Math.min(data.length - cardsPerView, prev + 1));
//     };

//     const currentCards = data.slice(currentIndex, currentIndex + cardsPerView);

//     if (!isClient) {
//         return (
//             <div className="w-full py-12 px-4 text-center">
//                 <h2 className="text-xl sm:text-2xl font-semibold mb-2">Loading...</h2>
//                 <p className="text-sm text-gray-500">Loading content...</p>
//             </div>
//         );
//     }

//     return (
//         <section className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-gray-100">
//             <div className="container mx-auto max-w-7xl">
//                 <SectionHeader
//                     title={title}
//                     description={description}
//                 />
//                 <div className="flex items-center gap-5 mt-8 sm:mt-12 md:mt-16">
//                     <button
//                         onClick={handlePrevious}
//                         className="hidden md:flex bg-white p-2 lg:p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors"
//                         aria-label="Previous card"
//                     >
//                         <Image
//                             src="/icons/Left-Swipe-Black.webp"
//                             alt="Previous"
//                             width={20}
//                             height={20}
//                             className="lg:w-6 lg:h-6"
//                         />
//                     </button>
//                     <div
//                         className={`${isMobileView
//                             ? "flex overflow-x-auto gap-4 snap-x scroll-smooth no-scrollbar"
//                             : "grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 w-full"
//                             }`}
//                         ref={isMobileView ? scrollContainerRef : null}
//                         onMouseDown={isMobileView ? handleMouseDown : undefined}
//                         onMouseMove={isMobileView ? handleMouseMove : undefined}
//                         onMouseUp={isMobileView ? handleMouseUp : undefined}
//                         onMouseLeave={isMobileView ? handleMouseLeave : undefined}
//                         onTouchStart={isMobileView ? handleTouchStart : undefined}
//                         onTouchMove={isMobileView ? handleTouchMove : undefined}
//                         onTouchEnd={isMobileView ? handleTouchEnd : undefined}
//                         style={{ cursor: isMobileView ? (isDragging ? "grabbing" : "grab") : "default" }}
//                     >
//                         {(isMobileView ? data : currentCards).map((feature, index) => (
//                             <FeatureCard
//                                 key={index}
//                                 iconSrc={feature.iconSrc}
//                                 iconBgColor={feature.iconBgColor}
//                                 title={feature.title}
//                                 subtitle={feature.subtitle}
//                                 description={feature.description}
//                                 extraDetail={feature.extraDetail}
//                             />
//                         ))}
//                     </div>
//                     <button
//                         onClick={handleNext}
//                         className="hidden md:flex bg-white p-2 lg:p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors"
//                         aria-label="Next card"
//                     >
//                         <Image
//                             src="/icons/Right-Swipe-Black.webp"
//                             alt="Next"
//                             width={20}
//                             height={20}
//                             className="lg:w-6 lg:h-6"
//                         />
//                     </button>
//                 </div>
//             </div>
//             <style jsx>{`
//         .no-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//         .no-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//         </section>
//     );
// };

// // CompetitivePositioningAnalysisFocusAreas Component
// const CompetitivePositioningAnalysisFocusAreas = () => {
//     const featuresData = [
//         {
//             iconSrc: "/icons/Competitive11.png",
//             iconBgColor: "bg-[#E7E8EA]",
//             title: "Pipeline Analysis",
//             subtitle: "What are your competitors building next?",
//             description:
//                 "Stay ahead by uncovering what your competitors are planning next. Our pipeline analysis tracks product development, innovation timelines, and upcoming launches to help you make timely and strategic moves.",
//             extraDetail: [
//                 "Analyse competitor R&D and product roadmaps",
//                 "Spot potential market disruptions early",
//                 "Align your roadmap for stronger differentiation",
//                 "Optimise launch timing and innovation focus.",
//             ],
//         },
//         {
//             iconSrc: "/icons/Competitive12.png",
//             iconBgColor: "bg-[#E7E8EA]",
//             title: "Benchmarking",
//             subtitle: "Where do you really stand in the market?",
//             description:
//                 "Understand how your business stacks up against top players. Our benchmarking analysis reveals performance gaps and shows how you can improve across critical areas.",
//             extraDetail: [
//                 "Compare product offerings and pricing strategy",
//                 "Measure customer satisfaction against industry benchmarks",
//                 "Analyse GTM models, innovation efforts, and sales coverage",
//                 "Identify internal improvement areas and capability gaps",
//             ],
//         },
//         {
//             iconSrc: "/icons/Competitive13.png",
//             iconBgColor: "bg-[#E7E8EA]",
//             title: "Product Mapping",
//             subtitle: "Is your product portfolio aligned with market needs?",
//             description:
//                 "See how your products compare to competitor offerings and customer expectations. Our product mapping helps you position your portfolio more effectively and identify new areas for growth.",
//             extraDetail: [
//                 "Map features, pricing, and use cases",
//                 "Spot product gaps and white space opportunities",
//                 "Compare value propositions across segments",
//                 "Align offerings with market demand",
//             ],
//         },
//         {
//             iconSrc: "/icons/Competitive14.png",
//             iconBgColor: "bg-[#E7E8EA]",
//             title: "Technology & Innovation Focus",
//             subtitle: "Where are your competitors placing their innovation bets?",
//             description:
//                 "Track how industry leaders invest in technology and innovation. Our analysis reveals emerging trends, strategic bets, and tech alliances—so you can prioritise R&D and stay ahead.",
//             extraDetail: [
//                 "Monitor patents, R&D focus, and deep tech adoption",
//                 "Analyse innovation themes and tech partnerships",
//                 "Align your innovation with future market shifts",
//                 "Identify risks of tech-driven disruption early",
//             ],
//         },
//         {
//             iconSrc: "/icons/Competitive15.png",
//             iconBgColor: "bg-[#E7E8EA]",
//             title: "Inventory Forecasting",
//             subtitle: "Can your competitors meet market demand?",
//             description:
//                 "Understand your competitors’ supply-side readiness. Our analysis tracks production patterns, inventory levels, and procurement signals—helping you respond quickly to shifts in demand or disruptions.",
//             extraDetail: [
//                 "Decode production and stock trends",
//                 "Identify supply chain risks and gaps",
//                 "Monitor procurement cycles and readiness",
//                 "Adjust your logistics and planning strategy",
//             ],
//         },
//         {
//             iconSrc: "/icons/Competitive6.png",
//             iconBgColor: "bg-[#E7E8EA]",
//             title: "Regional Sales & Production Capabilities",
//             subtitle: "Where are your competitors gaining ground—and why",
//             description:
//                 "Discover where your competitors are growing faster and how they’re scaling operations. Our analysis highlights regional strengths, gaps, and expansion moves—so you can refine your market strategy.",
//             extraDetail: [
//                 "Track regional sales trends and hotspots",
//                 "Evaluate production capacity by geography",
//                 "Spot high-growth or underserved regions",
//                 "Optimise your expansion and distribution plans",
//             ],
//         },
//         {
//             iconSrc: "/icons/Competitive7.png",
//             iconBgColor: "bg-[#E7E8EA]",
//             title: "Key Customer Identification",
//             subtitle: "Who are your competitors selling to—and how can you win them over?",
//             description:
//                 "Uncover the key accounts and buyer relationships that drive your competitors’ success. Our analysis reveals customer preferences, account dependencies, and targeting opportunities—so you can improve your outreach and sales strategy.",
//             extraDetail: [
//                 "Identify competitor key accounts and buyer types",
//                 "Map procurement behaviour and deal size trends",
//                 "Spot cross-sell and win-back opportunities",
//                 "Strengthen your account-based targeting",
//             ],
//         },
//     ];

//     return (
//         <CommanFeatureCardContainer
//             data={featuresData}
//             title="Our Strategic Focus Area"
//             description="Identify Strengths, Spot Gaps, and Outperform Competitors with Data-Backed Strategies."
//         />
//     );
// };

// export default CompetitivePositioningAnalysisFocusAreas;
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Custom hooks for client-side rendering and window size
const useClientOnly = () => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    return isClient;
};

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({ width: undefined });
    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleResize = () => {
                setWindowSize({ width: window.innerWidth });
            };
            window.addEventListener("resize", handleResize);
            handleResize();
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);
    return windowSize;
};

// SectionHeader Component
const SectionHeader = ({ title, description, className = "" }) => {
    return (
        <header className={`flex flex-col items-center w-full leading-relaxed text-center px-4 sm:px-6 lg:px-8 ${className}`} style={{ marginTop: "-7%" }}>
            <div className="flex flex-col items-center max-w-full w-full sm:w-[762px]">
                <h2 className="mt-2 text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-semibold leading-tight text-zinc-900 max-w-full">
                    {title}
                </h2>
                <p className="mt-2 text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] text-zinc-900 max-w-full">{description}</p>
            </div>
        </header>
    );
};

// FeatureCard Component with Bottom-to-Top Slide Effect
const FeatureCard = ({ iconSrc = "/icons/Competitive1.png", iconBgColor = "bg-gray-100", title, subtitle, description, extraDetail = [], className = "" }) => {
    return (
        <article
            className={`overflow-hidden p-4 sm:p-5 bg-white rounded-xl min-w-[300px] w-full min-h-[300px] transition-all duration-500 ease-in-out hover:shadow-lg hover:-translate-y-2 group ${className}`}
        >
            <div className="relative w-full h-full min-h-[300px] overflow-hidden">
                {/* Front Side */}
                <div className="absolute w-full h-full min-h-[300px] transition-transform duration-500 ease-in-out group-hover:-translate-y-full">
                    <div
                        className={`flex overflow-hidden gap-2.5 items-center p-2 sm:p-3 w-12 h-12 sm:w-14 sm:h-14 ${iconBgColor} rounded-2xl transition-all duration-300`}
                    >
                        <Image
                            src={iconSrc}
                            alt="icon"
                            className="object-contain w-6 sm:w-8 aspect-square transition-all duration-300"
                            role="presentation"
                            width={100}
                            height={100}
                            quality={100}
                        />
                    </div>
                    <div className="flex flex-col justify-center w-full flex-grow">
                        <div className="pb-3 sm:pb-4 w-full font-medium leading-snug border-solid border-b-[0.5px] border-b-[color:var(--Other-Border,rgba(67,70,75,0.30))]">
                            <h3 className="text-md mt-3 text-zinc-900">{title}</h3>
                            <p className="mt-2 sm:mt-2.5 text-sm italic text-zinc-900">{subtitle}</p>
                        </div>
                        <p className="mt-3 text-xs leading-6 sm:leading-7 text-zinc-900">{description}</p>
                    </div>
                </div>
                {/* Back Side */}
                <div className="absolute w-full h-full min-h-[300px] transition-transform duration-500 ease-in-out translate-y-full group-hover:translate-y-0 bg-white p-4 sm:p-5 flex flex-col justify-start">
                    <ul className="space-y-2 overflow-y-auto pr-2">
                        {extraDetail.map((detail, index) => (
                            <li key={index} className="flex items-start text-xs sm:text-sm text-zinc-900 leading-relaxed">
                                <span className="inline-block w-1.5 h-1.5 bg-zinc-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span>{detail}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </article>
    );
};

// CommanFeatureCardContainer Component
const CommanFeatureCardContainer = ({ data, title, description }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const isClient = useClientOnly();
    const { width } = useWindowSize();
    const [cardsPerView, setCardsPerView] = useState(3);
    const [isMobileView, setIsMobileView] = useState(false);

    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Update cards per view based on screen size
    useEffect(() => {
        if (!isClient) return;

        if (width <= 767) {
            setCardsPerView(1);
            setIsMobileView(true);
        } else if (width <= 1199) {
            setCardsPerView(2);
            setIsMobileView(false);
        } else {
            setCardsPerView(3);
            setIsMobileView(false);
        }
    }, [isClient, width]);

    // Global mouse event handlers for drag functionality
    useEffect(() => {
        if (!isClient) return;

        const handleGlobalMouseMove = (e) => {
            if (isDragging && scrollContainerRef.current) {
                e.preventDefault();
                const x = e.pageX - scrollContainerRef.current.offsetLeft;
                const walk = (x - startX) * 1.5;
                scrollContainerRef.current.scrollLeft = scrollLeft - walk;
            }
        };

        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.style.cursor = "grab";
                }
            }
        };

        if (isDragging) {
            document.addEventListener("mousemove", handleGlobalMouseMove);
            document.addEventListener("mouseup", handleGlobalMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleGlobalMouseMove);
            document.removeEventListener("mouseup", handleGlobalMouseUp);
        };
    }, [isClient, isDragging, startX, scrollLeft]);

    // Drag functionality handlers
    const handleMouseDown = (e) => {
        if (!isMobileView || !scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
        scrollContainerRef.current.style.cursor = "grabbing";
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        if (!scrollContainerRef.current) return;
        setIsDragging(false);
        scrollContainerRef.current.style.cursor = "grab";
    };

    const handleMouseLeave = () => {
        if (!scrollContainerRef.current) return;
        setIsDragging(false);
        scrollContainerRef.current.style.cursor = "grab";
    };

    // Touch handlers for mobile
    const handleTouchStart = (e) => {
        if (!isMobileView || !scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!isDragging || !scrollContainerRef.current) return;
        const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(data.length - cardsPerView, prev + 1));
    };

    const currentCards = data.slice(currentIndex, currentIndex + cardsPerView);

    if (!isClient) {
        return (
            <div className="w-full py-12 px-4 text-center">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Loading...</h2>
                <p className="text-sm text-gray-500">Loading content...</p>
            </div>
        );
    }

    return (
        <section className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-gray-100">
            <div className="container mx-auto max-w-7xl">
                <SectionHeader title={title} description={description} />
                <div className="flex items-center gap-5 mt-8 sm:mt-12 md:mt-16">
                    <button
                        onClick={handlePrevious}
                        className="hidden md:flex bg-white p-2 lg:p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        aria-label="Previous card"
                    >
                        <Image src="/icons/Left-Swipe-Black.webp" alt="Previous" width={20} height={20} className="lg:w-6 lg:h-6" />
                    </button>
                    <div
                        className={`${
                            isMobileView
                                ? "flex overflow-x-auto gap-4 snap-x scroll-smooth no-scrollbar"
                                : "grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 w-full"
                        }`}
                        ref={isMobileView ? scrollContainerRef : null}
                        onMouseDown={isMobileView ? handleMouseDown : undefined}
                        onMouseMove={isMobileView ? handleMouseMove : undefined}
                        onMouseUp={isMobileView ? handleMouseUp : undefined}
                        onMouseLeave={isMobileView ? handleMouseLeave : undefined}
                        onTouchStart={isMobileView ? handleTouchStart : undefined}
                        onTouchMove={isMobileView ? handleTouchMove : undefined}
                        onTouchEnd={isMobileView ? handleTouchEnd : undefined}
                        style={{ cursor: isMobileView ? (isDragging ? "grabbing" : "grab") : "default" }}
                    >
                        {(isMobileView ? data : currentCards).map((feature, index) => (
                            <FeatureCard
                                key={index}
                                iconSrc={feature.iconSrc}
                                iconBgColor={feature.iconBgColor}
                                title={feature.title}
                                subtitle={feature.subtitle}
                                description={feature.description}
                                extraDetail={feature.extraDetail}
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleNext}
                        className="hidden md:flex bg-white p-2 lg:p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        aria-label="Next card"
                    >
                        <Image src="/icons/Right-Swipe-Black.webp" alt="Next" width={20} height={20} className="lg:w-6 lg:h-6" />
                    </button>
                </div>
            </div>
            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
};

// CompetitivePositioningAnalysisFocusAreas Component
const CompetitivePositioningAnalysisFocusAreas = () => {
    const featuresData = [
        {
            iconSrc: "/icons/Competitive11.png",
            iconBgColor: "bg-[#E7E8EA]",
            title: "Pipeline Analysis",
            subtitle: "What are your competitors building next?",
            description:
                "Stay ahead by uncovering what your competitors are planning next. Our pipeline analysis tracks product development, innovation timelines, and upcoming launches to help you make timely and strategic moves.",
            extraDetail: [
                "Analyse competitor R&D and product roadmaps",
                "Spot potential market disruptions early",
                "Align your roadmap for stronger differentiation",
                "Optimise launch timing and innovation focus.",
            ],
        },
        {
            iconSrc: "/icons/Competitive12.png",
            iconBgColor: "bg-[#E7E8EA]",
            title: "Benchmarking",
            subtitle: "Where do you really stand in the market?",
            description:
                "Understand how your business stacks up against top players. Our benchmarking analysis reveals performance gaps and shows how you can improve across critical areas.",
            extraDetail: [
                "Compare product offerings and pricing strategy",
                "Measure customer satisfaction against industry benchmarks",
                "Analyse GTM models, innovation efforts, and sales coverage",
                "Identify internal improvement areas and capability gaps",
            ],
        },
        {
            iconSrc: "/icons/Competitive13.png",
            iconBgColor: "bg-[#E7E8EA]",
            title: "Product Mapping",
            subtitle: "Is your product portfolio aligned with market needs?",
            description:
                "See how your products compare to competitor offerings and customer expectations. Our product mapping helps you position your portfolio more effectively and identify new areas for growth.",
            extraDetail: [
                "Map features, pricing, and use cases",
                "Spot product gaps and white space opportunities",
                "Compare value propositions across segments",
                "Align offerings with market demand",
            ],
        },
        {
            iconSrc: "/icons/Competitive14.png",
            iconBgColor: "bg-[#E7E8EA]",
            title: "Technology & Innovation Focus",
            subtitle: "Where are your competitors placing their innovation bets?",
            description:
                "Track how industry leaders invest in technology and innovation. Our analysis reveals emerging trends, strategic bets, and tech alliances—so you can prioritise R&D and stay ahead.",
            extraDetail: [
                "Monitor patents, R&D focus, and deep tech adoption",
                "Analyse innovation themes and tech partnerships",
                "Align your innovation with future market shifts",
                "Identify risks of tech-driven disruption early",
            ],
        },
        {
            iconSrc: "/icons/Competitive15.png",
            iconBgColor: "bg-[#E7E8EA]",
            title: "Inventory Forecasting",
            subtitle: "Can your competitors meet market demand?",
            description:
                "Understand your competitors’ supply-side readiness. Our analysis tracks production patterns, inventory levels, and procurement signals—helping you respond quickly to shifts in demand or disruptions.",
            extraDetail: [
                "Decode production and stock trends",
                "Identify supply chain risks and gaps",
                "Monitor procurement cycles and readiness",
                "Adjust your logistics and planning strategy",
            ],
        },
        {
            iconSrc: "/icons/Competitive6.png",
            iconBgColor: "bg-[#E7E8EA]",
            title: "Regional Sales & Production Capabilities",
            subtitle: "Where are your competitors gaining ground—and why",
            description:
                "Discover where your competitors are growing faster and how they’re scaling operations. Our analysis highlights regional strengths, gaps, and expansion moves—so you can refine your market strategy.",
            extraDetail: [
                "Track regional sales trends and hotspots",
                "Evaluate production capacity by geography",
                "Spot high-growth or underserved regions",
                "Optimise your expansion and distribution plans",
            ],
        },
        {
            iconSrc: "/icons/Competitive7.png",
            iconBgColor: "bg-[#E7E8EA]",
            title: "Key Customer Identification",
            subtitle: "Who are your competitors selling to—and how can you win them over?",
            description:
                "Uncover the key accounts and buyer relationships that drive your competitors’ success. Our analysis reveals customer preferences, account dependencies, and targeting opportunities—so you can improve your outreach and sales strategy.",
            extraDetail: [
                "Identify competitor key accounts and buyer types",
                "Map procurement behaviour and deal size trends",
                "Spot cross-sell and win-back opportunities",
                "Strengthen your account-based targeting",
            ],
        },
    ];

    return (
        <CommanFeatureCardContainer
            data={featuresData}
            title="Our Strategic Focus Area"
            description="Identify Strengths, Spot Gaps, and Outperform Competitors with Data-Backed Strategies."
        />
    );
};

export default CompetitivePositioningAnalysisFocusAreas;
