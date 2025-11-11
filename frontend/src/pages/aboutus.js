import { AboutUsPage } from "@/page-components";
import UniversalSEO from "@/utils/seo/universalSEO";
import { BASE_URL } from "../../config";

/**
 * Aboutus Route Component
 *
 * This is the Next.js pages router page component for the aboutus route (/aboutus).
 */
export default function AboutUs({ seoData }) {
    return (
        <>
            <UniversalSEO seoData={seoData} />
            <AboutUsPage />
        </>
    );
}

// Enable ISR for better performance
// export async function getStaticProps() {
//     return {
//         props: {},
//         // Revalidate every 5 minutes
//         revalidate: 300,
//     };
// }

export async function getStaticProps() {
    const res = await fetch(`${BASE_URL}/web/getNavbar`);
    const seoData = await res.json();
    const seoItem = seoData?.data?.find((item) => item?.name === "About Us")?.siteMenu?.find((sub) => sub?.url === "aboutus") || {};
    console.log("aboutus seoItem", seoItem);
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
