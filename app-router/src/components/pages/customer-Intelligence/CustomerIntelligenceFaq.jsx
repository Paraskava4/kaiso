"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";

const CustomerIntelligenceFaq = () => {
    const faqs = [
        "Understand customer needs, preferences, and emotional triggers",
        "Enhance satisfaction and build long-term customer loyalty",
        "Make informed decisions based on real customer feedback",
        "Improve products, services, and experiences with precision",
        "Create offerings that resonate and convert",
    ];

    const listRef = useRef(null);

    // useEffect(() => {
    //     const list = listRef.current;
    //     if (!list) return;

    //     let scrollAmount = 0;
    //     const scrollSpeed = 0.5; // adjust for faster/slower scroll
    //     const scrollHeight = list.scrollHeight / 2; // half because we duplicated content

    //     const scrollLoop = () => {
    //         scrollAmount += scrollSpeed;
    //         if (scrollAmount >= scrollHeight) {
    //             scrollAmount = 0; // reset without visual jump
    //         }
    //         list.scrollTop = scrollAmount;
    //         requestAnimationFrame(scrollLoop);
    //     };

    //     scrollLoop(); // start loop immediately
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
        <section className="flex flex-col max-w-[81%] lg:flex-row justify-between items-center gap-8 sm:gap-10 bg-gray-100 rounded-3xl p-4 sm:p-6 md:p-8 lg:p-8  mx-auto my-12 sm:my-14 lg:my-14">            {/* FAQ List */}
            <div className="relative w-full lg:w-[560px] overflow-hidden mt-6 lg:mt-0">
                {/* Top and Bottom Fades */}
                <div className="absolute top-0 left-0 w-full h-8 sm:h-10 z-10 bg-gradient-to-b from-gray-100 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-8 sm:h-10 z-10 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none" />

                <ul ref={listRef} className="relative z-0 flex flex-col gap-3 max-h-[380px] overflow-hidden">
                    {[...faqs, ...faqs].map((faq, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white border border-zinc-300 border-opacity-20 rounded-xl sm:rounded-2xl"
                        >
                            <Image src="/icons/Red-Checked-Icon.webp" alt="Check" width={20} height={20} className="sm:w-[23px] sm:h-[23px]" />
                            <p className="text-[13px] py-2 font-medium text-zinc-700">{faq}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Text Block */}
            <header className="flex flex-col justify-center w-full lg:w-[520px] xl:w-[620px] min-h-full">
                <div className="flex flex-col justify-center h-full">
                    <h2 className="text-xl sm:text-2xl md:text-2xl font-semibold text-zinc-900 mb-3 sm:mb-4">Why Customer Intelligence</h2>
                    <p className="text-sm sm:text-sm text-zinc-900 max-w-full sm:max-w-[546px]">
                        Customer Intelligence turns assumptions into actionable insight, helping you measure satisfaction, uncover pain points, and stay aligned
                        with evolving needs to drive growth, retention, and more informed, customer-focused decisions.
                    </p>
                </div>
            </header>
        </section>
    );
};

export default CustomerIntelligenceFaq;

