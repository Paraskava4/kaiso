"use client";

import { lazy, Suspense } from "react";
import { Footer } from "../components/layout";
import TechnologyScoutingHero from "../components/pages/technology-Scouting/TechnologyScoutingHero";
import CtaSection from "@/components/shared/CtaSection";
import SectionLoader from "../components/shared/SectionLoader.jsx";
// import { useNavbarSEO } from "@/utils/hooks/useMetadata.js";

// Lazy load non-critical components
const CommonBlog = lazy(() => import("@/components/shared/commanBlog"));
const TechnologyScoutingBenifits = lazy(() => import("../components/pages/technology-Scouting/TechnologyScoutingBenifits"));
const TechnologyScoutingEnterpriseSolutions = lazy(() => import("../components/pages/technology-Scouting/TechnologyScoutingEnterpriseSolutions"));
const TechnologyScoutingFaq = lazy(() => import("../components/pages/technology-Scouting/TechnologyScoutingFaq"));
const TechnologyScoutingFocusArea = lazy(() => import("../components/pages/technology-Scouting/TechnologyScoutingFocusArea"));

const TechnologyScouting = () => {
    // Set SEO metadata from navbar API for Technology Scouting page - no fallback text
    // useNavbarSEO("Consulting Services", "Technology Scouting & Monitoring");

    return (
        <>
            <TechnologyScoutingHero />
            <Suspense fallback={<SectionLoader />}>
                <TechnologyScoutingFaq />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <TechnologyScoutingFocusArea />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <TechnologyScoutingEnterpriseSolutions />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <TechnologyScoutingBenifits />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <CtaSection
                    bgImage="/images/CustomReportsPage-Cta-bg.webp"
                    heading="Transform Disruption into Opportunity"
                    description1="With Kaiso Research and Consulting’s Technology Scouting & Monitoring solutions, you don’t just keep up, you lead. Our data-driven foresight enables you to innovate confidently, invest wisely, and build for the future."
                    button1={{
                        text: "Let's shape tomorrow together.",
                        showIcon: false,
                    }}
                    inquiryForm1Props={{
                        title: "Let's shape tomorrow together",
                        buttonText: "Let's shape tomorrow together",
                        successMessage: "Request submitted successfully!",
                        pageName: "Technology Scouting(Let's shape tomorrow together)",
                    }}
                />
            </Suspense>
            {/* <TechnologyScoutingNews /> */}
            <Suspense fallback={<SectionLoader />}>
                <CommonBlog
                    PageName={"Technology Scouting & Monitoring"}
                    header={"Latest Articles of Technology Scouting"}
                    description={``}
                />
            </Suspense>
            <Footer />
        </>
    );
};

export default TechnologyScouting;
