// "use client";
// import Image from "next/image";
// import { useRef, useState } from "react";

// const enterpriseSolutionsData = [
//     {
//         id: 1,
//         title: "Strategic Alignment First",
//         description:
//             "Each partner is assessed against long-term organisational goals to ensure alignment with core strategy, scalability, and future growth objectives.",
//         icon: "/icons/PartnerIdentificationPage1.png",
//         hoverIcon: "/icons/alignment-hover.webp",
//     },
//     {
//         id: 2,
//         title: "Multi-Dimensional Evaluation",
//         description:
//             "Every candidate undergoes rigorous evaluation across financial, operational, legal, and cultural dimensions to minimise risks and ensure sustainable collaboration.",
//         icon: "/icons/PartnerIdentificationPage2.png",
//         hoverIcon: "/icons/evaluation-hover.webp",
//     },
//     {
//         id: 3,
//         title: "Industry-Specific Intelligence",
//         description:
//             "Recommendations are grounded in sector-specific insights and real-world benchmarks, helping organisations select partners relevant to market needs and dynamics",
//         icon: "/icons/PartnerIdentificationPage3.png",
//         hoverIcon: "/icons/intelligence-hover.webp",
//     },
//     {
//         id: 4,
//         title: "Global and Regional Context",
//         description:
//             "Analysis incorporates global reach and local context, enabling partner selection that reflects both cross-border ambitions and regional business realities.",
//         icon: "/icons/PartnerIdentificationPage4.png",
//         hoverIcon: "/icons/global-hover.webp",
//     },
//     {
//         id: 5,
//         title: "Lifecycle-Based Suppor",
//         description:
//             "The approach covers the entire partnership journey—from scanning and assessment to structuring and integration—for consistent value delivery post-selection.",
//         icon: "/icons/PartnerIdentificationPage5.png",
//         hoverIcon: "/icons/lifecycle-hover.webp",
//     },
// ];

// const PartnerIdentificationPageEnterpriseSolutions = () => {
//     const scrollRef = useRef(null);
//     const [dragging, setDragging] = useState(false);
//     const [startX, setStartX] = useState(0);
//     const [scrollLeft, setScrollLeft] = useState(0);

//     const handleMouseDown = (e) => {
//         setDragging(true);
//         setStartX(e.pageX - scrollRef.current.offsetLeft);
//         setScrollLeft(scrollRef.current.scrollLeft);
//     };

//     const handleMouseUp = () => setDragging(false);
//     const handleMouseLeave = () => setDragging(false);

//     const handleMouseMove = (e) => {
//         if (!dragging) return;
//         const x = e.pageX - scrollRef.current.offsetLeft;
//         const walk = (x - startX) * 2;
//         scrollRef.current.scrollLeft = scrollLeft - walk;
//     };

//     return (
//         <>
//             <style jsx>{`
//                 .scrollbar-hide::-webkit-scrollbar {
//                     display: none;
//                 }
//                 .scrollbar-hide {
//                     -ms-overflow-style: none;
//                     scrollbar-width: none;
//                 }
//             `}</style>

//             <section className="flex flex-col items-center justify-center py-20 max-md:py-20 bg-[white] select-none">
//                 <header className="text-center max-w-[68%]">
//                     <h2 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-semibold text-zinc-900">Why Choose Kaiso for Partner Identification</h2>
//                     <p className="mt-3 text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] text-zinc-700">
//                         Selecting the right partner is a strategic decision that demands more than surface-level compatibility. Kaiso delivers a rigorous,
//                         intelligence-led approach to assess strategic alignment, operational fit, and long-term value.{" "}
//                     </p>
//                 </header>

//                 <div
//                     ref={scrollRef}
//                     className="mt-16 w-full px-4 max-w-[82%] overflow-x-auto scrollbar-hide"
//                     style={{ cursor: dragging ? "grabbing" : "grab" }}
//                     onMouseDown={handleMouseDown}
//                     onMouseUp={handleMouseUp}
//                     onMouseLeave={handleMouseLeave}
//                     onMouseMove={handleMouseMove}
//                 >
//                     <div className="flex gap-6 w-max pb-2 pr-2">
//                         {enterpriseSolutionsData.map((item) => (
//                             <AudienceCard key={item.id} {...item} />
//                         ))}
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// };

// const AudienceCard = ({ title, description, icon, hoverIcon }) => {
//     const [hovered, setHovered] = useState(false);

//     return (
//         <article
//             className="relative flex-shrink-0 w-[300px] h-[260px] p-5 hover:bg-[#F4F5F7] rounded-2xl transition-shadow duration-300"
//             onMouseEnter={() => setHovered(true)}
//             onMouseLeave={() => setHovered(false)}
//         >
//             <div className={`flex justify-center items-center w-12 h-12 rounded-lg transition-colors duration-300 ${hovered ? "bg-gray-300" : "bg-white"}`}>
//                 <Image
//                     // src={hovered ? hoverIcon : icon}
//                     src={icon}
//                     alt="enterprise icon"
//                     width={23}
//                     height={23}
//                     quality={100}
//                 />
//             </div>
//             <h3 className="mt-4 text-md font-medium text-zinc-900">{title}</h3>
//             <p className="mt-3 text-sm text-zinc-600 pr-2">{description}</p>
//         </article>
//     );
// };

// export default PartnerIdentificationPageEnterpriseSolutions;
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useWindowSize, useClientOnly } from "../../../hooks/useClientOnly";
import { CommanAudienceCardContainer } from "@/components/ui/CommanAudienceCard";

const enterpriseSolutionsData = [
    {
        id: 1,
        title: "Strategic Alignment First",
        description:
            "Each partner is assessed against long-term organisational goals to ensure alignment with core strategy, scalability, and future growth objectives.",
        icon: "/icons/PartnerIdentificationPage1.png",
        hoverIcon: "/icons/alignment-hover.webp",
    },
    {
        id: 2,
        title: "Multi-Dimensional Evaluation",
        description:
            "Every candidate undergoes rigorous evaluation across financial, operational, legal, and cultural dimensions to minimise risks and ensure sustainable collaboration.",
        icon: "/icons/PartnerIdentificationPage2.png",
        hoverIcon: "/icons/evaluation-hover.webp",
    },
    {
        id: 3,
        title: "Industry-Specific Intelligence",
        description:
            "Recommendations are grounded in sector-specific insights and real-world benchmarks, helping organisations select partners relevant to market needs and dynamics",
        icon: "/icons/PartnerIdentificationPage3.png",
        hoverIcon: "/icons/intelligence-hover.webp",
    },
    {
        id: 4,
        title: "Global and Regional Context",
        description:
            "Analysis incorporates global reach and local context, enabling partner selection that reflects both cross-border ambitions and regional business realities.",
        icon: "/icons/PartnerIdentificationPage4.png",
        hoverIcon: "/icons/global-hover.webp",
    },
    {
        id: 5,
        title: "Lifecycle-Based Suppor",
        description:
            "The approach covers the entire partnership journey—from scanning and assessment to structuring and integration—for consistent value delivery post-selection.",
        icon: "/icons/PartnerIdentificationPage5.png",
        hoverIcon: "/icons/lifecycle-hover.webp",
    },
];

const PartnerIdentificationPageEnterpriseSolutions = () => {
    return (
        <CommanAudienceCardContainer
            data={enterpriseSolutionsData}
            title={"Why Choose Kaiso for Partner Identification"}
            subTitle={
                "  Selecting the right partner is a strategic decision that demands more than surface-level compatibility. Kaiso delivers a rigorous,intelligence-led approach to assess strategic alignment, operational fit, and long-term value."
            }
        />
    );
};

export default PartnerIdentificationPageEnterpriseSolutions;
