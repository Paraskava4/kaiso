"use client";

import { lazy, Suspense } from "react";
import { Footer } from "../components/layout";
import MarketIntelligencePageHero from "../components/pages/market-intelligence/MarketIntelligencePageHero";
import SectionLoader from "../components/shared/SectionLoader.jsx";
// import { useNavbarSEO } from "@/utils/hooks/useMetadata.js";
// Lazy load non-critical components
const MarketIntelligenceBenefit = lazy(() => import("../components/pages/market-intelligence/MarketIntelligenceBenefit"));
const MarketIntelligenceEnterpriseSolutions = lazy(() => import("../components/pages/market-intelligence/MarketIntelligenceEnterpriseSolutions"));
const MarketIntelligenceFaq = lazy(() => import("../components/pages/market-intelligence/MarketIntelligenceFaq"));
const MarketIntelligencePageKeyOffering = lazy(() => import("../components/pages/market-intelligence/MarketIntelligencePageKeyOffering"));
const CommonBlog = lazy(() => import("@/components/shared/commanBlog"));
import CtaSection from "@/components/shared/CtaSection";

/**
 * MarketIntelligencePage Component
 *
 * This component represents the Market Intelligence page accessible from
 * Header > Consulting Services > Market Intelligence.
 * Contains the MarketIntelligenceNews component and Footer as requested.
 */
const MarketIntelligencePage = () => {
    // Set SEO metadata from navbar API for Market Intelligence page - no fallback text
    // useNavbarSEO("Consulting Services", "Market Intelligence");

    return (
        <div>
            <MarketIntelligencePageHero />
            <Suspense fallback={<SectionLoader />}>
                <MarketIntelligenceFaq />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <MarketIntelligencePageKeyOffering />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <MarketIntelligenceEnterpriseSolutions />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <MarketIntelligenceBenefit />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <CtaSection
                    bgImage="/images/CustomReportsPage-Cta-bg-1.webp"
                    heading="Let Intelligence Lead the Way"
                    description1="Market leadership begins with knowing more and knowing it first."
                    description2="Partner with Kaiso Research and Consulting to turn market intelligence into"
                    description3="decisive action with intelligent, real-time market insights."
                    button1={{
                        text: "Book a Call",
                        showIcon: false,
                    }}
                    inquiryForm1Props={{
                        title: "Book a Call",
                        buttonText: "Book a Call",
                        successMessage: "Call booked successfully!",
                        pageName: "Market Intelligence(Book a Call)",
                    }}
                />
            </Suspense>
            {/* <MarketIntelligenceNews /> */}
            <Suspense fallback={<SectionLoader />}>
                <CommonBlog PageName={"Market Intelligence"} header={"Latest Articles of Market Intelligence"} description={``} />
            </Suspense>
            <Footer />
        </div>
    );
};

export default MarketIntelligencePage;
