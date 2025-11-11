"use client";

import { lazy, Suspense } from 'react';
import { Footer } from "../components/layout";
import StrategicAnalysisPageHero from "../components/pages/strategic-analysis/StrategicAnalysisPageHero";
import CtaSection from "@/components/shared/CtaSection";
import SectionLoader from '../components/shared/SectionLoader.jsx';
import { useNavbarSEO } from "@/utils/hooks/useMetadata.js";

// Lazy load non-critical components
const StrategicAnalysisAbout = lazy(() => import("../components/pages/strategic-analysis/StrategicAnalysisAbout"));
const StrategicAnalysisBlogs = lazy(() => import("../components/pages/strategic-analysis/StrategicAnalysisBlogs"));
const StrategicAnalysisShowCase = lazy(() => import("../components/pages/strategic-analysis/StrategicAnalysisShowCase"));
const StrategicAnalysisCaseStudies = lazy(() => import("../components/pages/strategic-analysis/StrategicAnalysisCaseStudies"));
const CommonBlog = lazy(() => import("@/components/shared/commanBlog"));

const StrategicAnalysisPage = () => {
    // Set SEO metadata from navbar API for Strategic Analysis page - no fallback text
    useNavbarSEO("Services", "Strategic Analysis");

    return (
        <>
            <StrategicAnalysisPageHero />
            <Suspense fallback={<SectionLoader />}>
                <StrategicAnalysisAbout />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <StrategicAnalysisBlogs />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <StrategicAnalysisShowCase />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <StrategicAnalysisCaseStudies />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <CtaSection
                bgImage="/images/strategic-analysis.webp"
                title="Want Data That Drives Strategy and Results?"
                heading="Want Data That Drives Strategy and Results?"
                button1={{
                    text: "Book a Strategic Analysis Call",
                    showIcon: false
                }}
                inquiryForm1Props={{
                    title: "Book a Strategic Analysis Call",
                    buttonText: "Book a Strategic Analysis Call",
                    successMessage: "Strategic analysis call booked successfully!",
                    pageName: "Strategic Analysis(Book a Strategic Analysis Call)"
                }}
            />
            </Suspense>
            {/* <StrategicAnalysisNews /> */}
            <Suspense fallback={<SectionLoader />}>
                <CommonBlog
                    PageName={"Strategic Growth Solutions"}
                    header={"Latest Articles of Strategic Analysis"}
                    description={``}
                />
            </Suspense>
            <Footer />
        </>
    );
};

export default StrategicAnalysisPage;
