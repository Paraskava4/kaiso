"use client";

import { lazy, Suspense } from "react";
import { Footer } from "../components/layout";
import CustomerIntelligenceHero from "../components/pages/customer-Intelligence/CustomerIntelligenceHero";
import SectionLoader from "../components/shared/SectionLoader.jsx";
import CtaSection from "@/components/shared/CtaSection";
// import { useNavbarSEO } from "@/utils/hooks/useMetadata.js";

// Lazy load non-critical components
const CommonBlog = lazy(() => import("@/components/shared/commanBlog"));
const CustomerIntelligenceBenefit = lazy(() => import("../components/pages/customer-Intelligence/CustomerIntelligenceBenefit"));
const CustomerIntelligenceEnterpriseSolutions = lazy(() => import("../components/pages/customer-Intelligence/CustomerIntelligenceEnterpriseSolutions"));
const CustomerIntelligenceFaq = lazy(() => import("../components/pages/customer-Intelligence/CustomerIntelligenceFaq"));
const CustomerIntelligenceKeyOffering = lazy(() => import("../components/pages/customer-Intelligence/CustomerIntelligenceKeyOffering"));

/**
 * CustomerIntelligencePage Component
 *
 * This component represents the Customer Intelligence page accessible from
 * Header > Consulting Services > Customer Intelligence.
 * Currently contains only the Footer component as requested.
 */
const CustomerIntelligencePage = () => {
    // Set SEO metadata from navbar API for Customer Intelligence page - no fallback text
    // useNavbarSEO("Consulting Services", "Customer Intelligence");

    return (
        <div>
            <CustomerIntelligenceHero />
            <Suspense fallback={<SectionLoader />}>
                <CustomerIntelligenceFaq />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <CustomerIntelligenceKeyOffering />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <CustomerIntelligenceEnterpriseSolutions />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <CustomerIntelligenceBenefit />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <CtaSection
                    bgImage="/images/CustomReportsPage-Cta-bg.webp"
                    heading="Know Your Customers Like Never Before!"
                    description1="Let Kaiso Research and Consulting help you turn insight into action. Our Customer Intelligence"
                description2="services uncover the real drivers behind customer choices—so you can deliver what matters most."
                    button1={{
                        text: "Contact us today to get started.",
                        showIcon: false,
                    }}
                    inquiryForm1Props={{
                        title: "Contact us today to get started",
                        buttonText: "Contact us today to get started",
                        successMessage: "Request submitted successfully!",
                        pageName: "Customer Intelligence(Contact us today to get started)",
                    }}
                />
            </Suspense>
            {/* <CustomerIntelligenceNews /> */}
            <Suspense fallback={<SectionLoader />}>
                <CommonBlog
                    PageName={"Customer Intelligence"}
                    header={"Latest Articles of Customer Intelligence"}
                    description={``}
                />
            </Suspense>
            <Footer />
        </div>
    );
};

export default CustomerIntelligencePage;
