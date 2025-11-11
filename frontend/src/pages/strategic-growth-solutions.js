import { StrategicAnalysisPage } from "@/page-components";
import UniversalSEO from "@/utils/seo/universalSEO";
import { BASE_URL } from "../../config";

/**
 * Strategic Analysis Route Component
 *
 * This is the Next.js pages router page component for the strategic analysis route (/strategic-analysis).
 * It renders the StrategicAnalysisPage component which contains all the strategic analysis content.
 */
export default function StrategicAnalysis({ seoData }) {
    return (
        <>
            <UniversalSEO seoData={seoData} />
            <StrategicAnalysisPage />
        </>
    );
}

export async function getStaticProps() {
    const res = await fetch(`${BASE_URL}/web/getNavbar`);
    const seoData = await res.json();
    const seoItem = seoData?.data?.find((item) => item?.name === "Services")?.siteMenu?.find((sub) => sub?.url === "strategic-analysis") || {};
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
