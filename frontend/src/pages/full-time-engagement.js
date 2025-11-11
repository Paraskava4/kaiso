import { FullTimeEngagementPage } from "@/page-components";
import { BASE_URL } from "../../config";
import UniversalSEO from "@/utils/seo/universalSEO";

/**
 * Full Time Engagement Route Component
 *
 * This is the Next.js pages router page component for the full-time-engagement route (/full-time-engagement).
 */
export default function FullTimeEngagement({ seoData }) {
    return (
        <>
            <UniversalSEO seoData={seoData} />
            <FullTimeEngagementPage />
        </>
    );
}

export async function getStaticProps() {
    const res = await fetch(`${BASE_URL}/web/getNavbar`);
    const seoData = await res.json();
    const seoItem = seoData?.data?.find((item) => item?.name === "Services")?.siteMenu?.find((sub) => sub?.url === "full-time-engagement") || {};
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
