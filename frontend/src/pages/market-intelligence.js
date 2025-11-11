import { MarketIntelligencePage } from "@/page-components";
import { BASE_URL } from "../../config";
import UniversalSEO from "@/utils/seo/universalSEO";

/**
 * Market Intelligence Route Component
 *
 * This is the Next.js pages router page component for the market intelligence route (/market-intelligence).
 * It renders the MarketIntelligencePage component which contains the Market Intelligence content.
 */
export default function MarketIntelligence({ seoData }) {
    return (
        <>
            <UniversalSEO seoData={seoData} />
            <MarketIntelligencePage />
        </>
    );
}

export async function getStaticProps() {
    const res = await fetch(`${BASE_URL}/web/getNavbar`);
    const seoData = await res.json();
    const seoItem = seoData?.data?.find((item) => item?.name === "Consulting Services")?.siteMenu?.find((sub) => sub?.url === "market-intelligence") || {};
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
