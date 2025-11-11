"use client";
import { Feedback, Footer } from "@/components";
import AboutUsHero from "@/components/pages/aboutus/sections/AboutUsHero";
import AboutUsPages from "@/components/pages/aboutus/sections/AboutUsPages";
import AboutUsTeam from "@/components/pages/aboutus/sections/AboutUsTeam";
import AboutUsValues from "@/components/pages/aboutus/sections/AboutUsValues";
import React from "react";
// import { useNavbarSEO } from "@/utils/hooks/useMetadata.js";

const AboutUs = () => {
    // Set SEO metadata from navbar API for About Us page - no fallback text
    // useNavbarSEO("About Us");

    return (
        <div>
            <AboutUsHero />
            <AboutUsValues />
            {/* <AboutCustomer /> */}
            <AboutUsPages />
            <AboutUsTeam />
            <Feedback/>
            {/* <AboutUsPartners /> */}
            <Footer />
        </div>
    );
};

export default AboutUs;
