"use client";
import Image from "next/image";

const PartnerIdentificationHero = () => {
    return (
        <section className="relative w-full min-h-[calc(100dvh-80px)] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/TechnologyScouting-Hero-BG.webp"
                    alt="Partner Identification Background"
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                    quality={100}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] xl:max-w-[75%] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                {/* Text Block */}
                <div className="flex flex-col gap-4 text-center sm:text-left max-w-[100%] sm:max-w-lg md:max-w-xl lg:max-w-2xl order-1 sm:order-none">
                    <p className="text-base text-[#F3F4F6]">Partner Identification</p>
                    <h1 className="text-[25px] sm:text-[30px] md:text-[32px] lg:text-[34px] xl:text-[36px] text-white font-bold leading-tight">
                        Identify Partners Aligned with Vision, Scale, and Strategy
                    </h1>
                    <p className="text-xs sm:text-[10px] md:text-[12px] 2xl:text-[14px] text-[#F3F4F6] leading-relaxed">
                        Strategic partnerships drive scale, innovation, and market
                        expansion. We help identify and evaluate partners based on strategic
                        fit, capabilities, and value, ensuring each alliance supports
                        sustainable growth with minimal risk.
                    </p>
                </div>

                {/* Image Block */}
                <div className="relative flex-shrink-0 w-[280px] h-[280px] sm:w-[240px] sm:h-[240px] md:w-[300px] md:h-[300px] lg:w-[360px] lg:h-[360px] xl:w-[400px] xl:h-[400px] order-2 sm:order-none mt-6 sm:mt-0">
                    {/* Back Image */}
                    <div className="absolute top-0 left-0 w-[160px] h-[160px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px] xl:w-[240px] xl:h-[240px] rounded-xl sm:rounded-2xl overflow-hidden z-0 shadow-md">
                        <Image
                            src="/images/PartnerIdentificationHero.webp"
                            alt="Back visual"
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 40vw, 240px"
                            quality={100}
                        />
                    </div>

                    {/* Front Image */}
                    <div className="absolute bottom-0 right-0 w-[160px] h-[160px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px] xl:w-[240px] xl:h-[240px] rounded-xl sm:rounded-2xl overflow-hidden z-10 shadow-xl">
                        <Image
                            src="/images/PartnerIdentificationHero22.webp"
                            alt="Front visual"
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 40vw, 240px"
                            quality={100}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnerIdentificationHero;