"use client";

import { Footer } from "../components/layout";
import MarketAssessmentPageFocusAreas from "../components/pages/market-Assessment/MarketAssessmentPageFocusAreas";
import MarketAssessmentPageHero from "../components/pages/market-Assessment/MarketAssessmentPageHero";
import MarketAssessmentPageReports from "../components/pages/market-Assessment/MarketAssessmentPageReports";
import MarketAssessmentPageBenefit from "../components/pages/market-Assessment/MarketAssessmentPageBenefit";
import MarketAssessmentPageEnterpriseSolutions from "../components/pages/market-Assessment/MarketAssessmentPageEnterpriseSolutions";
import CommonBlog from "@/components/shared/commanBlog";
import CtaSection from "@/components/shared/CtaSection";
// import { useNavbarSEO } from "@/utils/hooks/useMetadata.js";

/**
 * MarketAssessmentPage Component
 *
 * This component represents the Market Assessment page accessible from
 * Header > Consulting Services > Market Assessment.
 * Currently contains only the Footer component as requested.
 */
const MarketAssessmentPage = () => {
    // Set SEO metadata from navbar API for Market Assessment page - no fallback text
    // useNavbarSEO("Consulting Services", "Market Assessment");

    return (
        <div>
            <MarketAssessmentPageHero />
            <MarketAssessmentPageReports />
            <MarketAssessmentPageFocusAreas />
            <MarketAssessmentPageEnterpriseSolutions />
            <MarketAssessmentPageBenefit />
            <CtaSection
            
                bgImage="/images/MarketAssessBg.webp"
                heading="Ready to Act with Market Certainty?"
                description1="Markets change. Insights don't have to lag."
                description2="Partner with Kaiso Research and Consulting to assess markets with "
                description3="confidence and move ahead with precision."
                button1={{
                    text: "Book a Call",
                    showIcon: false,
                }}
                inquiryForm1Props={{
                    title: "Book a Call",
                    buttonText: "Book a Call",
                    successMessage: "Call booked successfully!",
                    pageName: "Market Assessment(Book a Call)",
                }}
                // className="bg-gradient-to-t from-black/30"
            />
            {/* <MarketAssessmentPageNews /> */}
            <CommonBlog
                PageName={"Market Assessment"}
                header={"Latest Articles of Market Assessment"}
                description={``}
            />

            <Footer />
        </div>
    );
};

export default MarketAssessmentPage;
