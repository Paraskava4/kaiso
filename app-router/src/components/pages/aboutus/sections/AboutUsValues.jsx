import React from "react";
import Image from "next/image";

const AboutUsValues = () => {
    const steps = [
        {
            number: "1",
            title: "Syndicate and Custom Reports",
            description:
                "Access our library of 5,000+ off-the-shelf reports or commission a custom report built entirely around your business goals. From market sizing and trend forecasting to segmentation and competitor analysis, we deliver validated insights across industries, including energy, healthcare, chemicals, technology, etc.",
        },
        {
            number: "2",
            title: "Strategic Growth Solutions",
            description:
                "Unlock new growth avenues with bespoke strategies for TAM expansion, go-to-market execution, and competitive positioning. We help you assess market potential, define optimal entry points, and benchmark performance against key competitors, ensuring that every strategic move is grounded in evidence and aligned with long-term goals.",
        },
        {
            number: "3",
            title: "Full-Time Engagement (FTE)",
            description:
                "Our Full-Time Engagement model provides you with dedicated research teams embedded directly into your workflows. Designed for startups, consulting firms, and enterprises seeking continuous, scalable insight, this model supports everything from daily intelligence and market tracking to strategic projects and investor-driven research mandates.",
        },
        {
            number: "4",
            title: "Consulting Services",
            description:
                "From market entry and innovation scouting to product strategy and M&A advisory, our consulting practice delivers high-impact solutions tailored to your specific business challenges. We work as your thought partners—simplifying complexity, mitigating risk, and translating research into strategies that deliver measurable, lasting impact.",
        },
    ];

    return (
        <section className="py-8 sm:py-12 md:py-16 lg:py-24 px-4 sm:px-6 md:px-8 bg-white">
            <div className="max-w-[90%] sm:max-w-[89%] md:max-w-[84%] mx-auto">
                <div className="text-center mb-8 sm:mb-10 md:mb-12 max-w-full sm:max-w-2xl mx-auto">
                    <h2 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-semibold mb-2 sm:mb-3 leading-tight">
                        Our Expertise: Research-Driven Strategies for Scalable Growth
                    </h2>
                    <p className="text-black-600 text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px]">
                        At Kaiso Research and Consulting, we help you see the market differently revealing hidden opportunities, reshaping strategic
                        possibilities, and delivering insights that bridge where you are with where you aspire to be.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8 sm:mt-10 md:mt-12">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="flex border border-gray-300 rounded-md p-4 flex-col transform transition duration-300 shadow-md hover:-translate-y-2 hover:shadow-xl"
                        >
                            {/* <div className="mb-3 sm:mb-4">
                <span className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[#F4F5F7] text-lg sm:text-xl font-bold text-black">
                  {step.number}
                </span>
              </div> */}
                            <h3 className="text-base sm:text-md font-semibold mb-2 sm:mb-3">{step.title}</h3>
                            <p className="text-gray-600 text-sm sm:text-sm">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div
                id="we-believe"
                className="mx-auto mt-8 sm:mt-10 md:mt-12 bg-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] xl:max-w-[75%]"
            >
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12 mt-6 sm:mt-8 md:mt-10">
                    <div className="md:w-1/2">
                        <h2 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-semibold mb-2 sm:mb-3 md:mb-4">
                            What We Believe
                        </h2>
                        <p className="text-black-600 mb-3 sm:mb-4 text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] leading-6">
                            At Kaiso Research and Consulting, we believe that bold steps define the future. That true leadership is not just about ambition, but
                            about the courage to adapt, the discipline to act on insight, and the integrity to do what’s right—even when it’s not easy. Grounded
                            in data, driven by purpose, and guided by integrity, we deliver insights that inspire clarity and action. Every solution we craft is
                            tailored, reflecting each client’s unique challenges and ambitions. We embrace innovation, decode complexity, and prioritise
                            long-term value over short-term gains. Above all, we believe in building trusted partnerships that help businesses not just succeed
                            today, but lead with confidence into tomorrow.
                        </p>
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center items-center px-2 sm:px-4 md:px-6 mt-[-15px]">
                        <div className="w-full max-w-[350px] sm:max-w-[350px] h-[180px] sm:h-[200px] md:h-[280px] lg:h-[300px] xl:h-[350px]">
                            <Image
                                src="/images/9ba29296d41c0e5aa78d29169d44f6f280952a7f.webp"
                                width={350}
                                height={350}
                                quality={100}
                                alt="Process visualization"
                                className="w-full h-full object-cover rounded-xl sm:rounded-2xl mt-2 sm:mt-4"
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 550px"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/550x450?text=Image+Not+Found";
                                }}
                                priority
                            />
                        </div>
                    </div>
                </div>

                <hr className="mb-4 sm:mb-6 md:mb-8 border-gray-300" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 pb-8 sm:pb-10 md:pb-12 px-2 sm:px-4 md:px-6 relative" id="our-mission">
                    <div className="p-2 sm:p-3 md:p-4 flex flex-col items-center">
                        <div className="w-full max-w-[400px] sm:max-w-[460px]">
                            <Image
                                src="/images/b581d7f990239afc2b33d77347d107e3d2b6d3a0.webp"
                                alt="Feature image"
                                className="object-cover mb-3 sm:mb-4 md:mb-6 mt-6 sm:mt-8 md:mt-10 rounded-xl w-full h-[180px] sm:h-[220px] md:h-[260px]"
                                width={460}
                                height={260}
                                quality={100}
                                sizes="(max-width: 640px) 100vw, 460px"
                                priority
                            />
                            {/* <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">A mission that turns insight into impact</h3>
                            <p className="text-[#17306E] text-center my-1 sm:my-2  text-md sm:text-md">Our Mission</p> */}

                            <h3 className="text-[#17306E] text-center my-1 sm:my-2 font-medium  text-base sm:text-lg md:text-xl ">Our Mission</h3>
                            <p className="text-md sm:text-md  font-semibold mb-2 sm:mb-3">A mission that turns insight into impact</p>
                            <p className="text-black-600 text-sm sm:text-sm mb-2 sm:mb-4">
                                Our mission is to empower businesses with accurate, actionable, and forward-looking market intelligence that drives strategic
                                growth, fuels innovation, and delivers a lasting competitive edge.
                            </p>
                            <p className="text-black-600 text-sm sm:text-sm">
                                We are committed to being the research and consulting partner of choice, trusted for our ability to deliver tailored insights,
                                scalable solutions, and measurable impact across global markets. By blending deep domain expertise with rigorous research, we
                                help our clients navigate uncertainty, seize opportunity, and make confident, data-backed decisions in a rapidly evolving world.
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 transform -translate-x-1/2" />

                    <div className="p-2 sm:p-3 md:p-4 flex flex-col items-center">
                        <div className="w-full max-w-[400px] sm:max-w-[460px]">
                            <Image
                                src="/images/fbc2cf4bafc687d07bd174b433801cebcbb55eb9.webp"
                                alt="Feature image"
                                className="object-cover mb-3 sm:mb-4 md:mb-6 mt-6 sm:mt-8 md:mt-10 rounded-xl w-full h-[180px] sm:h-[220px] md:h-[260px]"
                                width={460}
                                height={260}
                                quality={100}
                                sizes="(max-width: 640px) 100vw, 460px"
                                priority
                            />
                            <p className="text-[#17306E] text-center my-1 sm:my-2 font-medium text-base sm:text-lg md:text-xl ">Our Vision</p>
                            <h3 className=" text-md sm:text-md font-semibold mb-2 sm:mb-3">Shaping the future with data-driven decisions</h3>

                            <p className="text-black-600 text-sm sm:text-sm">
                                Our vision is to be a globally recognised leader in market research and strategic consulting, trusted by startups, enterprises,
                                and investors to navigate complexity, unlock opportunities, and shape the future through data-driven decisions. We envision a
                                world where every business decision is empowered by intelligence that is timely, relevant, and transformative.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUsValues;
