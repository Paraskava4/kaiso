import { SyndicateReportsPage } from "@/page-components";
import UniversalSEO from "@/utils/seo/universalSEO";
import { BASE_URL } from "../../config";

/**
 * Syndicate Reports Route Component
 *
 * This is the Next.js pages router page component for the syndicate-reports route (/syndicate-reports).
 */
export default function SyndicateReports({ seoData }) {
    return (
        <>
            <UniversalSEO seoData={seoData} />
            <SyndicateReportsPage />
        </>
    );
}

export async function getStaticProps() {
    const res = await fetch(`${BASE_URL}/web/getNavbar`);
    const seoData = await res.json();

    const seoItem = seoData?.data?.find((item) => item?.name === "Services")?.siteMenu?.find((sub) => sub?.url === "syndicate-reports") || {};

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
