"use client";

import { useState, useRef } from "react";
import { Footer } from "../components/layout";
import { FullTimeEngagementPageHero, FullTimeEngagementPageResearchProcess } from "../components";
import FullTimeEngagementPageEngagementModels from "../components/pages/full-time-engagement/FullTimeEngagementPageEngagementModels";
import FullTimeEngagementPageBenifits from "../components/pages/full-time-engagement/FullTimeEngagementPageBenifits";
import FullTimeEngagementTable from "../components/pages/full-time-engagement/FullTimeEngagementTable";
import CommonBlog from "@/components/shared/commanBlog";
import CtaSection from "@/components/shared/CtaSection";
import { useNavbarSEO } from "@/utils/hooks/useMetadata.js";

const FullTimeEngagementPage = () => {
    // Set SEO metadata from navbar API for Full Time Engagement page - no fallback text
    useNavbarSEO("Services", "Full Time Engagement");

    // State for managing CTA form configuration
    const [ctaFormConfig, setCtaFormConfig] = useState({
        title: "Request Engagement Proposal",
        buttonText: "Request Engagement Proposal",
        successMessage: "Request submitted successfully!",
        pageName: "Full-Time Engagement(Request Engagement Proposal)",
    });

    // Ref for CTA section to enable scrolling
    const ctaSectionRef = useRef(null);

    const updateCtaForm = (formConfig) => {
        setCtaFormConfig(formConfig);

        // Scroll to the form section with delay for DOM updates
        setTimeout(() => {
            // First try to find the actual form content section
            const formContent = document.querySelector("[data-form-content]");
            const formTarget = document.querySelector("[data-form-target]");

            if (formContent) {
                // Scroll to the form content with some top padding
                formContent.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            } else if (formTarget) {
                // Scroll to the form container
                formTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            } else if (ctaSectionRef.current) {
                // Fallback: calculate position to scroll past the CTA section to the form
                const element = ctaSectionRef.current;
                const elementRect = element.getBoundingClientRect();
                const elementTop = elementRect.top + window.pageYOffset;

                // Scroll to approximately where the form should be (CTA height + some buffer)
                window.scrollTo({
                    top: elementTop + 600, // Scroll past the CTA section to the form
                    behavior: "smooth",
                });
            }
        }, 100);
    };

    return (
        <>
            <FullTimeEngagementPageHero />
            <FullTimeEngagementPageResearchProcess />
            <FullTimeEngagementPageEngagementModels onFormRequest={updateCtaForm} />
            <FullTimeEngagementTable />
            <FullTimeEngagementPageBenifits />
            <div ref={ctaSectionRef} data-cta-form-section>
                <CtaSection
                    bgImage="/images/CustomReportsPage-Cta-bg.webp"
                    title="Ready to Build Your Research Engine?"
                    heading="Let’s create a partnership tailored to your growth."
                    description1="Choose the engagement model that fits your business rhythm"
                    description2="and let our team become an extension of yours."
                    button1={{
                        text: "Request Engagement Proposal",
                        icon: "/icons/Righte-Arrow.svg",
                        showIcon: true,
                    }}
                    button2={{
                        text: "Talk to Our Team",
                        icon: "/icons/Right-ArrowBlack.webp",
                        showIcon: true,
                    }}
                    inquiryForm1Props={{
                        title: "Request Engagement Proposal",
                        buttonText: "Request Engagement Proposal",
                        successMessage: "Request submitted successfully!",
                        pageName: "Full-Time Engagement(Request Engagement Proposal)",
                    }}
                    inquiryForm2Props={{
                        title: "Talk to Our Team",
                        buttonText: "Book a Consultation",
                        successMessage: "Consultation booked successfully!",
                        pageName: "Full-Time Engagement(Talk to Our Team)",
                    }}
                    currentFormConfig={ctaFormConfig}
                />
            </div>
            <CommonBlog PageName={"Full-Time Engagement Models"} header={"Latest Articles of Full-Time Engagement"} description={``} />

            <Footer />
        </>
    );
};

export default FullTimeEngagementPage;
