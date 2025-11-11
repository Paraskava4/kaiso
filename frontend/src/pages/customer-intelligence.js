import { CustomerIntelligencePage } from "@/page-components";
import UniversalSEO from "@/utils/seo/universalSEO";
import { BASE_URL } from "../../config";

/**
 * Customer Intelligence Route Component
 *
 * This is the Next.js pages router page component for the customer-intelligence route (/customer-intelligence).
 */
export default function CustomerIntelligence({ seoData }) {
    return (
        <>
            <UniversalSEO seoData={seoData} />
            <CustomerIntelligencePage />
        </>
    );
}

export async function getStaticProps() {
    const res = await fetch(`${BASE_URL}/web/getNavbar`);
    const seoData = await res.json();
    const seoItem = seoData?.data?.find((item) => item?.name === "Consulting Services")?.siteMenu?.find((sub) => sub?.url === "customer-intelligence") || {};
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
