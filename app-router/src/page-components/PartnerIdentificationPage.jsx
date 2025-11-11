"use client";

import CommonBlog from "@/components/shared/commanBlog";
import { Footer } from "../components/layout";
import PartnerIdentificationHero from "../components/pages/partner-Identification/PartnerIdentificationHero";
import PartnerIdentificationPageBenefit from "../components/pages/partner-Identification/PartnerIdentificationPageBenefit";
import PartnerIdentificationPageCaseStudies from "../components/pages/partner-Identification/PartnerIdentificationPageCaseStudies";
import PartnerIdentificationPageEnterpriseSolutions from "../components/pages/partner-Identification/PartnerIdentificationPageEnterpriseSolutions";
import PartnerIdentificationPageFaq from "../components/pages/partner-Identification/PartnerIdentificationPageFaq";
import CtaSection from "@/components/shared/CtaSection";
// import { useNavbarSEO } from "@/utils/hooks/useMetadata.js";

const PartnerIdentificationPage = () => {
    // Set SEO metadata from navbar API for Partner Identification page - no fallback text
    // useNavbarSEO("Consulting Services", "Partner Identification");

    return (
        <div>
            <PartnerIdentificationHero />
            <PartnerIdentificationPageFaq />
            <PartnerIdentificationPageCaseStudies />
            <PartnerIdentificationPageEnterpriseSolutions />
            <PartnerIdentificationPageBenefit />
            <CtaSection
                bgImage="/images/CustomReportsPage-Cta-bg.webp"
                heading="Make the Right Connections"
                description1="The right partner doesn't just meet your goals—it multiplies your potential."
                description2="Partner with Kaiso Research and Consulting to find, assess, and collaborate with organisations that unlock transformational growth"
                button1={{
                    text: "Book a Call",
                    showIcon: false,
                }}
                inquiryForm1Props={{
                    title: "Book a Call",
                    buttonText: "Book a Call",
                    successMessage: "Call booked successfully!",
                    pageName: "Partner Identification(Book a Call)",
                }}
            />
            {/* <PartnerIdentificationPageNews/> */}
            <CommonBlog PageName={"Partner Identification"} header={"Latest Articles of Partner Identification"} description={``} />
            <Footer />
        </div>
    );
};

export default PartnerIdentificationPage;
