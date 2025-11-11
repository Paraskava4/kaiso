"use client";
import Image from "next/image";

const TechnologyScoutingHero = () => {
    return (
        <section className="relative w-full max-w-[1920px] mx-auto min-h-[calc(100vh-100px)] flex items-center">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/images/TechnologyScouting-Hero-BG.webp"
                    alt="Technology Scouting Background"
                    fill
                    quality={100}
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col w-full lg:flex-row items-center justify-between max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8">
                {/* Left Text */}
                <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 w-full lg:w-1/2 max-w-[600px] text-center lg:text-left lg:ml-[5.9%]">
                    <p className="text-[#F3F4F6] text-xs sm:text-sm md:text-base leading-relaxed">Technology Scouting & Monitoring</p>

                    <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
                        <h1 className="text-white font-bold leading-tight text-[22px] sm:text-[26px] md:text-[30px] lg:text-[32px] xl:text-[36px]">
                            Track Emerging Technologies.
                            <br className="hidden lg:block" />
                            Stay Ahead of the Curve.
                        </h1>

                        <p className="text-[#F3F4F6] text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px] leading-relaxed">
                            Our Technology Scouting and Monitoring service delivers timely insights into emerging technologies, helping you anticipate
                            disruption, assess relevance, and make informed adoption decisions that support innovation, reduce risk, and unlock early-mover
                            advantage.
                        </p>
                    </div>
                </div>

                {/* Right Hero Image */}
                <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-0 lg:w-1/2 flex justify-center lg:justify-center">
                    <div className="w-full max-w-[250px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[320px] xl:max-w-[350px]">
                        <Image
                            src="/images/TechnologyScouting-Hero.webp"
                            alt="Technology Scouting Hero"
                            width={500}
                            height={533}
                            quality={100}
                            priority
                            className="w-full h-auto object-contain"
                            sizes="(max-width: 640px) 80vw, (max-width: 768px) 70vw, (max-width: 1024px) 60vw, (max-width: 1280px) 50vw, 500px"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechnologyScoutingHero;
