"use client";

import { Box } from "@mui/material";
import { Footer } from "../components/layout";
import ConsultingServicesHero from "../components/pages/consulting-Services/ConsultingServicesHero";
import { createLazyComponent } from "../components/shared/LazyLoadWrapper.jsx";
// import { useNavbarSEO } from "@/utils/hooks/useMetadata.js";

// Create lazy-loaded components with integrated top loading bar
const ConsultingServicesImpact = createLazyComponent(
    () => import("../components/pages/consulting-Services/ConsultingServicesImpact"),
    { showTopLoader: true } // Enable for first section
);

const ConsultingServicesBenefit = createLazyComponent(() => import("../components/pages/consulting-Services/ConsultingServicesBenefit"), {
    showTopLoader: false,
});

const ConsultingServicesEnterpriseSolutions = createLazyComponent(
    () => import("../components/pages/consulting-Services/ConsultingServicesEnterpriseSolutions"),
    { showTopLoader: false }
);

const ContactUs = createLazyComponent(() => import("../components/pages/home/ContactUs"), { showTopLoader: false });

const CommonBlog = createLazyComponent(() => import("@/components/shared/commanBlog"), { showTopLoader: false });

/**
 * ConsultingServicesPage Component
 *
 * This component represents the Consulting Services page.
 * It's a blank page with only the Footer component included.
 */
const ConsultingServicesPage = () => {
    // Set SEO metadata from navbar API for Consulting Services page
    // This will automatically check if "Consulting Services" exists as a site menu item with SEO data
    // If it exists, it will use that SEO data; otherwise, it falls back to the first menu's SEO data
    //   useNavbarSEO("Consulting Services");

    return (
        <div>
            <ConsultingServicesHero />
            {/* Lazy-loaded components now include their own Suspense wrappers */}
            <ConsultingServicesImpact />
            <ConsultingServicesEnterpriseSolutions />
            <ConsultingServicesBenefit />
            <CommonBlog PageName={"Competitive Positioning Analysis"} header={"Latest Articles of Competitive Positioning Analysis"} description={``} />
            <ContactUs pageName="Consulting Services" />
            <Footer />
        </div>
    );
};

export default ConsultingServicesPage;
