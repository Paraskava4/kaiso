"use client";

import { lazy, Suspense } from 'react';
import { Footer } from "../components/layout";
import { SyndicateReportsHero } from "../components";
import SectionLoader from '../components/shared/SectionLoader.jsx';
// import { useNavbarSEO } from "@/utils/hooks/useMetadata.js";

// Lazy load non-critical components
const Feedback = lazy(() => import("../components/pages/home/Feedback"));
const SyndicateReportsCta = lazy(() => import("../components/pages/syndicate-reports/SyndicateReportsCta"));
const SyndicateReportsType = lazy(() => import("../components/pages/syndicate-reports/SyndicateReportsType"));
const SyndicateIndustries = lazy(() => import("../components/pages/syndicate-reports/SyndicateIndustries"));
const KeyFeatures = lazy(() => import("../components/pages/syndicate-reports/KeyFeatures"));
const SyndicateReportsFaq = lazy(() => import("../components/pages/syndicate-reports/SyndicateReportsFaq"));
const CommonBlog = lazy(() => import("@/components/shared/commanBlog"));


const SyndicateReportsPage = () => {
    // Set SEO metadata from navbar API for Syndicate Reports page - no fallback text
    // useNavbarSEO("Services", "Syndicate Reports");

    return (
        <>
            <SyndicateReportsHero />
            <Suspense fallback={<SectionLoader />}>
                <SyndicateReportsCta />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <SyndicateReportsType />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <KeyFeatures />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <SyndicateIndustries />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <SyndicateReportsFaq />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <Feedback />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <CommonBlog
                    PageName={"Syndicate Reports"}
                    header={"Latest Articles of Syndicate Reports"}
                    description={``}
                />
            </Suspense>
            <Footer />
        </>
    );
};

export default SyndicateReportsPage;
