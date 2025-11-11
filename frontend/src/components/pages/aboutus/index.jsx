"use client";
import AboutUsHero from "./sections/AboutUsHero";
import AboutUsValues from "./sections/AboutUsValues";
import AboutUsTeam from "./sections/AboutUsTeam";
// import AboutUsPartners from './sections/AboutUsPartners';
import { Footer } from "../../layout";
import ConsultingServicesImpact from "../consulting-Services/ConsultingServicesImpact";
import { MessageSquare } from "lucide-react";

const AboutUs = () => {
    return (
        <div>
            <AboutUsHero />
            <AboutUsValues />
            {/* <AboutCustomer /> */}
            <ConsultingServicesImpact />
            <AboutUsTeam />
            <MessageSquare />
            {/* <AboutUsPartners /> */}
            <Footer />
        </div>
    );
};

export default AboutUs;
