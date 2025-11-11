"use client";
import Image from "next/image";

function HeroContent() {
    return (
        <div className="relative flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-16 py-10 w-full min-h-[calc(100dvh-100px)]">
            {/* Background */}
            <Image
                src="/images/SyndicateReportsPage-component.webp"
                alt="Hero background"
                className="absolute inset-0 w-full h-full object-cover -z-10"
                width={1920}
                height={1080}
                priority
                quality={100}
            />

            {/* Content */}
            <div className="relative w-full max-w-[88%]">
                <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 lg:gap-16">
                    <HeroTextSection />
                    <HeroImageSection />
                </div>
            </div>
        </div>
    );
}

function HeroTextSection() {
    return (
        <section
            className="w-full lg:w-1/2 text-center lg:text-left"
            aria-labelledby="hero-heading"
        >
            <header>
                <h1
                    id="hero-heading"
                    className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-bold text-white leading-snug"
                >
                    Seamless Research.
                    <br />
                    Scalable Support.
                    <br />
                    Fully Integrated.
                </h1>
                <p className="mt-4 text-xs njjb sm:text-sm md:text-md text-slate-200 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Dedicated research support aligned to your strategy,
                    timelines, and goals, delivering timely insights, operational
                    agility, and continuity across high-priority decisions.
                </p>
            </header>
            <HeroButtons />
        </section>
    );
}

function HeroButtons() {
    return (
        <></>
        // <div className="flex flex-wrap gap-4 justify-center lg:justify-start mt-6 text-sm sm:text-base font-medium">
        //     <button className="px-5 py-3 bg-red-600 rounded-lg min-w-[180px] text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors">
        //         Request a Custom Engagement
        //     </button>
        //     <button className="px-5 py-3 border border-white/40 rounded-lg min-w-[180px] text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white transition-colors">
        //         Talk to a Specialist
        //     </button>
        // </div>
    );
}

function HeroImageSection() {
    return (
        <aside className="w-full lg:w-1/2 flex justify-center">
            <div className="w-full max-w-sm sm:max-w-sm md:max-w-sm lg:max-w-md xl:max-w-lg mx-auto">
                <Image
                    src="/images/fulltime1.webp"
                    alt="Kaiso Research and Consulting team collaboration"
                    className="w-full h-auto rounded-3xl object-contain"
                    width={1200}
                    height={800}
                    quality={100}
                    priority
                />
            </div>

        </aside>
    );
}

function FullTimeEngagementPageHero() {
    return (
        <main className="overflow-hidden">
            <HeroContent />
        </main>
    );
}

export default FullTimeEngagementPageHero;
