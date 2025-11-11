import { HomePage } from "@/page-components";
import UniversalSEO from "@/utils/seo/universalSEO";
import React from "react";

const Home = ({ seoData }) => {
    return (
        <>
            <UniversalSEO seoData={seoData} />
            <HomePage />
        </>
    );
};

export async function getStaticProps() {
    return {
        props: {
            seoData: {
                seoTitle: "Global Market Research, Strategy & Growth Solutions | Kaiso Research and Consulting" || "Kaiso Research",
                metaDescription:
                    "Kaiso Research and Consulting is a top Market Research and Management Consulting firm. We advise leaders on strategy, marketing decisions and M&A, across all industries and geographies." ||
                    "Kaiso Research",
                ogTitle: "Global Market Research, Strategy & Growth Solutions | Kaiso Research and Consulting" || "Kaiso Research",
                ogDescription:
                    "Kaiso Research and Consulting is a top Market Research and Management Consulting firm. We advise leaders on strategy, marketing decisions and M&A, across all industries and geographies." ||
                    "Kaiso Research",
            },
        },
        // Removed revalidate for static export compatibility
    };
}

export default Home;
