import { AboutUsPage } from "@/page-components";
import { headers } from "next/headers";
import { BASE_URL } from "../../../config";
/**
 * Aboutus Route Component
 *
 * This is the Next.js pages router page component for the aboutus route (/aboutus).
 */
export default function AboutUs() {
    return (
        <>
            <AboutUsPage />
        </>
    );
}

export async function generateMetadata() {
    try {
        const response = await fetch(`${BASE_URL}/web/getNavbar`, { next: { revalidate: 3600 } });
        const seoData = await response.json();
        const seoItem = seoData?.data?.find((item) => item?.name === "About Us")?.siteMenu?.find((sub) => sub?.url === "aboutus") || {};
        console.log("seoData", seoData);

        const title = seoItem?.seoTitle || "Kaiso Research";
        const description = seoItem?.metaDescription || "Kaiso Research";
        const keywords = seoItem?.keywords || "Kaiso Research";

        const headersList = headers();
        const host = headersList.get("host");
        const protocol = headersList.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
        const locale = "aboutus";
        const author = `Kaiso Research and Consulting, ${protocol}://${host}`;
        const canonicalUrl = `${protocol}://${host}/${locale}`;

        return {
            title,
            description,
            keywords,
            authors: [{ name: author }],
            alternates: { canonical: canonicalUrl },
            robots: { index: true, follow: true },

            // ✅ Open Graph metadata (used by Facebook, LinkedIn, etc.)
            openGraph: {
                title,
                description,
                type: "article",
                url: canonicalUrl,
                authors: [author],
                siteName: "Kaiso Research",
                images: [
                    {
                        url: `${BASE_URL}/images/socialShareImage.png`,
                        width: 1200,
                        height: 630,
                        alt: title,
                    },
                ],
            },

            // ✅ Twitter Card metadata (for Twitter/X sharing)
            twitter: {
                card: "summary_large_image",
                title,
                description,
                creator: author,
                site: "@kaiso_research", // optional: your Twitter handle
                images: [`${BASE_URL}/images/socialShareImage.png`],
            },
        };
    } catch (e) {
        const fallbackTitle = "Kaiso Research";
        const fallbackDescription = "Kaiso Research";
        const fallbackKeywords = "Kaiso Research";
        const headersList = headers();
        const host = headersList.get("host");
        const protocol = headersList.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
        const author = `Kaiso Research and Consulting, ${protocol}://${host}`;
        const canonicalUrl = `${BASE_URL}/market-assessment`;
        return {
            title: fallbackTitle,
            description: fallbackDescription,
            keywords: fallbackKeywords,
            authors: [{ name: author }],
            alternates: { canonical: canonicalUrl },
            robots: { index: true, follow: true },

            // ✅ Open Graph metadata (used by Facebook, LinkedIn, etc.)
            openGraph: {
                title: fallbackTitle,
                description: fallbackDescription,
                type: "article",
                url: canonicalUrl,
                authors: [author],
                siteName: "Kaiso Research",
                images: [
                    {
                        url: `${BASE_URL}/images/socialShareImage.png`,
                        width: 1200,
                        height: 630,
                        alt: fallbackTitle,
                    },
                ],
            },

            // ✅ Twitter Card metadata (for Twitter/X sharing)
            twitter: {
                card: "summary_large_image",
                title: fallbackTitle,
                description: fallbackDescription,
                creator: author,
                site: "@kaiso_research", // optional: your Twitter handle
                images: [`${BASE_URL}/images/socialShareImage.png`],
            },
        };
    }
}

// Enable ISR for better performance
// export async function getStaticProps() {
//     return {
//         props: {},
//         // Revalidate every 5 minutes
//         revalidate: 300,
//     };
// }
