"use client";
import React from "react";
import { CaseStudyCard } from "../partner-Identification/PartnerIdentificationPageCaseStudies";

const CaseStudiesHeader = () => {
    return (
        <header
            className="flex flex-col max-w-[90%] w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl leading-relaxed text-center mx-auto"
            style={{ marginTop: "-9%" }}
        >
            {/* <p className="text-xs sm:text-sm md:text-base font-medium text-red-600 mt-[-10%] sm:mt-[-5%]">
                Case Studies
            </p> */}
            <h2 className="mt-1 sm:mt-2 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[26px] font-semibold leading-tight text-zinc-900">
                Real-World Results
            </h2>
            <p className="self-center mt-2 sm:mt-3 text-xs sm:text-sm md:text-base lg:text-lg xl:text-md text-zinc-700">
                Explore how our strategic solutions drive measurable outcomes for businesses worldwide.
            </p>
        </header>
    );
};

// const CaseStudyCard = ({ imageUrl, title, altText, description }) => {
//     const router = useRouter();
//     return (
//         <article className="overflow-hidden flex-1 shrink rounded-2xl w-full min-w-[200px] max-w-[360px] sm:min-w-[240px] sm:max-w-[300px] md:max-w-[340px] lg:max-w-[360px] flex-shrink-0 group cursor-pointer shadow-sm hover:shadow-xl focus:shadow-xl transition-shadow duration-300 outline-none focus:ring-2 focus:ring-zinc-900">
//             <div className="relative flex flex-col pt-[120px] sm:pt-[150px] md:pt-[180px] lg:pt-[200px] w-full aspect-[0.764]">
//                 <Image
//                     src={imageUrl}
//                     alt={altText}
//                     fill
//                     sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 360px"
//                     className="object-cover absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-105 group-focus:scale-105"
//                 />

//                 {/* Hover overlay */}
//                 <div className="absolute inset-0 bg-[#FFF6D3] opacity-0 group-hover:opacity-90 group-focus:opacity-90 transition-opacity duration-300 z-10"></div>

//                 {/* Default title overlay */}
//                 <div className="absolute inset-0 z-10 pt-7 bg-gradient-to-t from-black/70 to-transparent flex items-end opacity-100 transition-opacity duration-300 group-hover:opacity-0 group-focus:opacity-0">
//                     <div className="p-4 sm:p-5 md:p-6 lg:p-7 text-white text-xs sm:text-sm md:text-base lg:text-md font-medium leading-tight">{title}</div>
//                 </div>

//                 {/* Hover content */}
//                 <div className="absolute inset-0 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 group-focus:translate-y-0 z-20 px-3 sm:px-4 md:px-5 lg:px-6">
//                     <h3 className="text-sm sm:text-base md:text-lg lg:text-md font-semibold text-zinc-900 mb-2 sm:mb-3 md:mb-4 leading-tight text-center">
//                         {title}
//                     </h3>
//                     <ul className="text-xs sm:text-sm md:text-md text-zinc-700 mb-3 sm:mb-4 md:mb-5 leading-relaxed text-left list-disc pl-4 sm:pl-5 space-y-1 max-w-[90%] mx-auto">
//                         {description.map((point, index) => (
//                             <li key={index}>{point}</li>
//                         ))}
//                     </ul>
//                     <button
//                         onClick={() => router.push("/contactus")}
//                         className="flex items-center gap-2 px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 lg:py-3 bg-transparent border border-zinc-900 rounded-lg text-xs sm:text-sm md:text-md text-zinc-900 font-medium hover:bg-zinc-900 hover:text-white focus:bg-zinc-900 focus:text-white transition-colors duration-300"
//                     >
//                         <span>Contact us</span>
//                         <Image
//                             src="/icons/Right-ArrowBlack.webp"
//                             width={16}
//                             height={16}
//                             alt="Arrow"
//                             className="w-3 sm:w-3.5 md:w-4 lg:w-5 h-3 sm:h-3.5 md:h-4 lg:h-5"
//                             aria-hidden="true"
//                         />
//                     </button>
//                 </div>
//             </div>
//         </article>
//     );
// };

const StrategicAnalysisCaseStudies = () => {
    const caseStudies = [
        {
            id: 1,
            imageUrl: "/images/Real-world4.webp",
            title: "Entered 3 new countries with a clear GTM and TAM roadmap",
            description: ["Conducted regional TAM and GTM analysis", "Identified strategic entry points", "Developed phased go-to-market roadmap"],
            altText: "Market expansion strategy",
        },
        {
            id: 2,
            imageUrl: "/images/Real-world2.webp",
            title: "Identified $450M in untapped revenue opportunity",
            description: ["Analyzed underserved market segments", "Benchmarked competitors and pricing gaps", "Forecasted new revenue streams"],
            altText: "Analyzing revenue potential",
        },
        {
            id: 3,
            imageUrl: "/images/Real-world3.webp",
            title: "Reduced go-to-market failure rate by 35%",
            description: ["Identified key risks in launch strategy", "Applied data-driven targeting", "Created adaptive rollout plans"],
            altText: "Successful GTM strategy",
        },
        {
            id: 4,
            imageUrl: "/images/Real-world1.webp",
            title: "Outpaced top 3 competitors in 18 months with positioning revamp",
            description: [
                "Refined value proposition and messaging",
                "Shifted perception across target accounts",
                "Drove category leadership through differentiation",
            ],
            altText: "Competitive market positioning",
        },
    ];

    return (
        <section
            className="flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-[9.4%] xl:px-[9.4%] py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-gray-100 w-full"
            aria-labelledby="case-studies-heading"
        >
            <CaseStudiesHeader />

            <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8 items-center mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-16 w-full max-w-[100%] overflow-x-auto xl:overflow-x-hidden scroll-smooth snap-x snap-mandatory scrollbar-hidden xl:justify-center"
                role="region"
                aria-label="Case study examples"
            >
                {caseStudies.map((study) => (
                    <CaseStudyCard
                        key={study.id}
                        cntactButton={true}
                        imageUrl={study.imageUrl}
                        title={study.title}
                        description={study.description}
                        altText={study.altText}
                    />
                ))}
            </div>
        </section>
    );
};

export default StrategicAnalysisCaseStudies;
