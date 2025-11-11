"use client";

import dynamic from "next/dynamic";
import { Footer } from "../components/layout";
import { CustomReportsPageHero } from "../components";
import { useNavbarSEO } from "@/utils/hooks/useMetadata.js";
import { useState, useRef, useEffect } from "react";

// Lazy load heavy components
const CustomReportsPageFeatures = dynamic(() => import("../components").then(mod => ({ default: mod.CustomReportsPageFeatures })), {
    loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const CustomReportsPageWork = dynamic(() => import("../components").then(mod => ({ default: mod.CustomReportsPageWork })), {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
});

const CustomReportsHelp = dynamic(() => import("../components").then(mod => ({ default: mod.CustomReportsHelp })), {
    loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded-lg" />
});

const CommonBlog = dynamic(() => import("@/components/shared/commanBlog"), {
    loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const CtaSection = dynamic(() => import("@/components/shared/CtaSection"), {
    loading: () => <div className="animate-pulse bg-gray-200 h-24 rounded-lg" />
});

/**
 * CustomReportsPage Component
 *
 * This component represents the Custom Reports and Solutions page.
 * It's a blank page with only the Footer component included.
 */
const CustomReportsPage = () => {
    // Set SEO metadata from navbar API for Custom Reports page - no fallback text
    useNavbarSEO("Services", "Custom Reports and Solutions");

    // State for managing CTA form configuration
    const [ctaFormConfig, setCtaFormConfig] = useState({
        title: "Submit a Custom Request",
        type: "Other",
        buttonText: "Submit a Custom Request",
        successMessage: "Message sent successfully!",
        pageName: "Custom Reports(Submit a Custom Request)",
    });

    // Ref for CTA section to enable scrolling
    const ctaSectionRef = useRef(null);

    // Handle redirect from other pages
    useEffect(() => {
        // Check if we should scroll to form after redirect
        const shouldScrollToForm = sessionStorage.getItem("scrollToForm");
        const storedFormConfig = sessionStorage.getItem("customReportsFormConfig");

        if (shouldScrollToForm === "true" && storedFormConfig) {
            try {
                const formConfig = JSON.parse(storedFormConfig);
                setCtaFormConfig(formConfig);

                // Clear the session storage
                sessionStorage.removeItem("scrollToForm");
                sessionStorage.removeItem("customReportsFormConfig");

                // Scroll to form after a short delay to ensure page is loaded
                setTimeout(() => {
                    scrollToCtaForm();
                }, 500);
            } catch (error) {
                console.error("Error parsing stored form config:", error);
            }
        }
    }, []);

    // Function to scroll to CTA form section
    const scrollToCtaForm = () => {
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
    };

    const updateCtaForm = (formConfig) => {
        setCtaFormConfig(formConfig);

        // Scroll to form after a short delay to ensure state update
        setTimeout(() => {
            scrollToCtaForm();
        }, 200); // Increased delay to ensure DOM is fully updated
    };

    return (
        <div>
            <CustomReportsPageHero
                onFormRequest={() =>
                    updateCtaForm({
                        title: "Request a Custom Report",
                        type: "Other",
                        buttonText: "Request a Custom Report",
                        successMessage: "Message sent successfully!",
                        pageName: "Custom Reports Hero(Request a Custom Report)",
                    })
                }
            />
            <CustomReportsPageWork />
            <CustomReportsPageFeatures />
            <CustomReportsHelp
                onFormRequest={() =>
                    updateCtaForm({
                        title: "Request a Custom Report",
                        type: "Other",
                        buttonText: "Request a Custom Report",
                        successMessage: "Message sent successfully!",
                        pageName: "Custom Reports Help(Request a Custom Report)",
                    })
                }
            />
            <div ref={ctaSectionRef} data-cta-form-section>
                <CtaSection
                    bgImage="/images/Custom-Reports-Solutions-Cta.webp"
                    title="We love to here"
                    heading="Your Business Is Unique. So Should Be Your Market Intelligence."
                    button1={{
                        text: "Submit a Custom Request",
                        icon: "/icons/Righte-Arrow.svg",
                        showIcon: true,
                    }}
                    button2={{
                        text: "Book a Consultation",
                        icon: "/icons/Right-ArrowBlack.webp",
                        showIcon: true,
                    }}
                    inquiryForm1Props={{
                        title: "Submit a Custom Request",
                        type: "Other",
                        buttonText: "Submit a Custom Request",
                        successMessage: "Message sent successfully!",
                        pageName: "Custom Reports(Submit a Custom Request)",
                    }}
                    inquiryForm2Props={{
                        title: "Book a Consultation",
                        type: "Other",
                        buttonText: "Book a Consultation",
                        successMessage: "Message sent successfully!",
                        pageName: "Custom Reports(Book a Consultation)",
                    }}
                    currentFormConfig={ctaFormConfig}
                />
            </div>

            <CommonBlog PageName={"Custom Report Solutions"} />

            <Footer />
        </div>
    );
};

export default CustomReportsPage;
