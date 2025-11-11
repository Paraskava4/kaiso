import React from "react";
import Footer from "../components/layout/Footer";
import StrategicAnalysisMarketInsightsPageHero from "../components/pages/strategic-Analysis-MarketInsights/StrategicAnalysisMarketInsightsPageHero";
import StrategicAnalysisMarketInsightsPageFaq from "../components/pages/strategic-Analysis-MarketInsights/StrategicAnalysisMarketInsightsPageFaq";
import StrategicAnalysisMarketInsightsPageCaseStudies from "../components/pages/strategic-Analysis-MarketInsights/StrategicAnalysisMarketInsightsPageCaseStudies";
import StrategicAnalysisMarketInsightsPageEnterpriseSolutions from "../components/pages/strategic-Analysis-MarketInsights/StrategicAnalysisMarketInsightsPageEnterpriseSolutions";
import StrategicAnalysisMarketInsightsPageBenefit from "../components/pages/strategic-Analysis-MarketInsights/StrategicAnalysisMarketInsightsPageBenefit";
import CommonBlog from "@/components/shared/commanBlog";
import CtaSection from "@/components/shared/CtaSection";
// import { useNavbarSEO } from "@/utils/hooks/useMetadata.js";

const StrategicAnalysisMarketInsightsPage = () => {
    // Set SEO metadata from navbar API for Strategic Analysis Market Insights page - no fallback text
    // useNavbarSEO("Consulting Services", "Strategic Analysis");

    return (
        <div>
            <StrategicAnalysisMarketInsightsPageHero />
            <StrategicAnalysisMarketInsightsPageFaq />
            <StrategicAnalysisMarketInsightsPageCaseStudies />
            <StrategicAnalysisMarketInsightsPageEnterpriseSolutions />
            <StrategicAnalysisMarketInsightsPageBenefit />
            <CtaSection
                bgImage="/images/CustomReportsPage-Cta-bg.webp"
                heading="Gain Clarity. Move with Confidence."
                description1="Your competitors are already evolving."
                description2="Let Kaiso Research and Consulting give you the strategic edge to stay ahead, grow faster, and lead smarter."
                button1={{
                    text: "Book a Call",
                    showIcon: false
                }}
                inquiryForm1Props={{
                    title: "Book a Call",
                    buttonText: "Book a Call",
                    successMessage: "Call booked successfully!",
                    pageName: "Strategic Analysis Market Insights(Book a Call)"
                }}
            />
            {/* <StrategicAnalysisMarketInsightsPageNews/> */}
            <CommonBlog
                PageName={"Strategic Growth Solutions"}
                header={"Latest Articles of Strategic Analysis and MarketInsights"}
                description={``}
            />
            <Footer />
        </div>
    );
};

export default StrategicAnalysisMarketInsightsPage;
