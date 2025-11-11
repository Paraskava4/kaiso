import { MarketAssessmentPage } from "@/page-components";
import { BASE_URL } from "../../config";
import UniversalSEO from "@/utils/seo/universalSEO";

/**
 * Market Assessment Route Component
 *
 * This is the Next.js pages router page component for the market-assessment route (/market-assessment).
 */
export default function MarketAssessment({ seoData }) {
    return (
        <>
            <UniversalSEO seoData={seoData} />
            <MarketAssessmentPage />
        </>
    );
}

export async function getStaticProps() {
    const res = await fetch(`${BASE_URL}/web/getNavbar`);
    const seoData = await res.json();
    const seoItem = seoData?.data?.find((item) => item?.name === "Consulting Services")?.siteMenu?.find((sub) => sub?.url === "market-assessment") || {};
    return {
        props: {
            seoData: {
                seoTitle: seoItem?.seoTitle || "Kaiso Research",
                metaDescription: seoItem?.metaDescription || "Kaiso Research",
                ogTitle: seoItem?.seoTitle || "Kaiso Research",
                ogDescription: seoItem?.metaDescription || "Kaiso Research",
            },
        },
        revalidate: 3600, // regenerate every 1hr
    };
}
