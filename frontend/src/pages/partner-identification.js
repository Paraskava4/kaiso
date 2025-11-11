import { PartnerIdentificationPage } from "@/page-components";
import { BASE_URL } from "../../config";
import UniversalSEO from "@/utils/seo/universalSEO";

/**
 * Partner Identification Route Component
 *
 * This is the Next.js pages router page component for the partner-identification route (/partner-identification).
 */
export default function PartnerIdentification({ seoData }) {
    return (
        <>
            <UniversalSEO seoData={seoData} />
            <PartnerIdentificationPage />
        </>
    );
}

export async function getStaticProps() {
    const res = await fetch(`${BASE_URL}/web/getNavbar`);
    const seoData = await res.json();
    const seoItem = seoData?.data?.find((item) => item?.name === "Consulting Services")?.siteMenu?.find((sub) => sub?.url === "partner-identification") || {};
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
