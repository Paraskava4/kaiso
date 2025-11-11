import { CompetitivePositioningAnalysisPage } from "@/page-components";
import { BASE_URL } from "../../config";
import UniversalSEO from "@/utils/seo/universalSEO";

/**
 * Competitive Positioning Analysis Route Component
 *
 * This is the Next.js pages router page component for the competitive-positioning-analysis route (/competitive-positioning-analysis).
 */
export default function CompetitivePositioningAnalysis({ seoData }) {
    return (
        <>
            <UniversalSEO seoData={seoData} />
            <CompetitivePositioningAnalysisPage />
        </>
    );
}

export async function getStaticProps() {
    const res = await fetch(`${BASE_URL}/web/getNavbar`);
    const seoData = await res.json();
    const seoItem =
        seoData?.data?.find((item) => item?.name === "Consulting Services")?.siteMenu?.find((sub) => sub?.url === "competitive-positioning-analysis") || {};
    return {
        props: {
            seoData: {
                seoTitle: seoItem?.seoTitle || "Kaiso Research",
                metaDescription: seoItem?.metaDescription || "Kaiso Research",
                ogTitle: seoItem?.seoTitle || "Kaiso Research",
                ogDescription: seoItem?.metaDescription || "Kaiso Research",
            },
        },
        // Removed revalidate for static export compatibility
    };
}
