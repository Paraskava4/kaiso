"use client";

import { lazy, Suspense } from 'react';
import { Footer } from "../components/layout";
import CompetitivePositioningAnalysisHero from "../components/pages/competitive-positioning-analysis/CompetitivePositioningAnalysisHero";
import CtaSection from "@/components/shared/CtaSection";
import SectionLoader from '../components/shared/SectionLoader.jsx';
// import { useNavbarSEO } from "@/utils/hooks/useMetadata.js";

// Lazy load non-critical components
const CompetitivePositioningAnalysisWork = lazy(() => import("../components/pages/competitive-positioning-analysis/CompetitivePositioningAnalysisWork").then(module => ({ default: module.CompetitivePositioningAnalysisWork })));
const CompetitivePositioningAnalysisFocusAreas = lazy(() => import("../components/pages/competitive-positioning-analysis/CompetitivePositioningAnalysisFocusAreas"));
const CompetitivePositioningAnalysisBenefit = lazy(() => import("../components/pages/competitive-positioning-analysis/CompetitivePositioningAnalysisBenefit"));
const CompetitivePositioningAnalysisEnterpriseSolution = lazy(() => import("../components/pages/competitive-positioning-analysis/CompetitivePositioningAnalysisEnterpriseSolution"));
const CommonBlog = lazy(() => import("@/components/shared/commanBlog"));

/**
 * CompetitivePositioningAnalysisPage Component
 *
 * This component represents the Competitive Positioning Analysis page.
 * It includes only the Footer component as requested.
 */
const CompetitivePositioningAnalysisPage = () => {
    // Set SEO metadata from navbar API for Competitive Positioning Analysis page - no fallback text
    // useNavbarSEO("Consulting Services", "Competitive Positioning Analysis");

    return (
        <div>
            <CompetitivePositioningAnalysisHero />
            <Suspense fallback={<SectionLoader />}>
                <CompetitivePositioningAnalysisWork />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <CompetitivePositioningAnalysisFocusAreas />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <CompetitivePositioningAnalysisEnterpriseSolution />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <CompetitivePositioningAnalysisBenefit />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <CtaSection
                bgImage="/images/CustomReportsPage-Cta-bg.webp"
                heading="Gain a Strategic Edge"
                description1="Your competitors are evolving are you evolving faster?"
                description2="In a crowded and fast-moving market, timely insights can make the difference 
               between falling behind and taking the lead."
                description3="Partner with Kaiso Research and Consulting to uncover critical intelligence, 
               decode competitor strategy, and position your business to win."

                button1={{
                    text: "Book a Call",
                    showIcon: false
                }}
                inquiryForm1Props={{
                    title: "Book a Call",
                    buttonText: "Book a Call",
                    successMessage: "Call booked successfully!",
                    pageName: "Competitive Positioning Analysis(Book a Call)"
                }}
            />
            </Suspense>
            {/* <CompetitivePositioningAnalysisNews /> */}
            <Suspense fallback={<SectionLoader />}>
                <CommonBlog
                    PageName={"Competitive Positioning Analysis"}
                    header={"Latest Articles of Competitive Positioning Analysis"}
                    description={``}
                />
            </Suspense>
            <Footer />
        </div>
    );
};

export default CompetitivePositioningAnalysisPage;
