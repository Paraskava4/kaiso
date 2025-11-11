"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";

const TechnologyScoutingFaq = () => {
    const faqs = [
        "Identify disruptive technologies before they impact your industry",
        "Align R&D efforts with validated future trends",
        "Reduce the risk of outdated or misaligned technology investments",
        "Support faster, informed decision-making across innovation teams",
        "Stay competitive by anticipating rather than reacting to market change",
    ];

    const listRef = useRef(null);

    // useEffect(() => {
    //     const list = listRef.current;
    //     if (!list) return;

    //     let scrollAmount = 0;
    //     const scrollSpeed = 0.5; // Adjust speed if needed
    //     const scrollHeight = list.scrollHeight; // Because we duplicate content

    //     const scrollLoop = () => {
    //         scrollAmount += scrollSpeed;
    //         if (scrollAmount >= scrollHeight) {
    //             scrollAmount = 0; // Reset for seamless loop
    //         }
    //         list.scrollTop = scrollAmount;
    //         requestAnimationFrame(scrollLoop);
    //     };

    //     scrollLoop();
    // }, []);

    useEffect(() => {
        const list = listRef.current;
        if (!list) return;

        // Duplicate the content to allow infinite looping
        list.innerHTML += list.innerHTML;

        let scrollAmount = 0;
        const scrollSpeed = 0.5; // Adjust speed

        const scrollLoop = () => {
            scrollAmount += scrollSpeed;

            if (scrollAmount >= list.scrollHeight / 2) {
                // Reset when halfway (because we doubled the content)
                scrollAmount = 0;
            }

            list.scrollTop = scrollAmount;
            requestAnimationFrame(scrollLoop);
        };

        scrollLoop();
    }, []);

    return (
        <section className="flex flex-col max-w-[78%] lg:flex-row justify-between items-center gap-8 sm:gap-10 bg-gray-100 rounded-3xl p-6  mx-auto my-12 sm:my-16 lg:my-20">
            {/* Text Block */}
            <header className="flex flex-col justify-center text-center ps-5 lg:text-left max-w-full lg:max-w-[600px]">
                <h2 className="text-xl sm:text-2xl md:text-2xl font-semibold text-zinc-900 mb-3">Why Technology Scouting & Monitoring</h2>
                <p className="text-sm sm:text-sm md:text-sm text-zinc-900 max-w-[546px] leading-6 mx-auto lg:mx-0">
                    Technology shifts quickly, and delayed decisions can lead to missed opportunities. Structured scouting and monitoring provide continuous
                    insight into emerging innovations, helping organisations act early, prioritise R&D, reduce risk, and maintain a competitive edge in
                    fast-moving markets.
                </p>
            </header>

            {/* FAQ List */}
            <div className="relative w-full lg:w-[560px] overflow-hidden mt-6 lg:mt-0">
                {/* Top and Bottom Fades */}
                <div className="absolute top-0 left-0 w-full h-8 sm:h-10 z-10 bg-gradient-to-b from-gray-100 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-8 sm:h-10 z-10 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none" />

                <ul ref={listRef} className="relative z-0 flex flex-col gap-3 max-h-[350px] sm:max-h-[380px] overflow-hidden">
                    {[...faqs, ...faqs].map((faq, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white border border-zinc-300 border-opacity-20 rounded-xl sm:rounded-2xl"
                        >
                            <Image src="/icons/Red-Checked-Icon.webp" alt="Check" width={20} height={20} className="sm:w-[23px] sm:h-[23px]" />
                            <p className="text-xs sm:text-sm md:text-sm font-medium text-zinc-700">{faq}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default TechnologyScoutingFaq;
