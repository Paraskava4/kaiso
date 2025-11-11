import { headers } from "next/headers";
import { BASE_URL } from "../../../config";
import Contact_Us from "./contactus";

export async function generateMetadata() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

    try {
        const response = await fetch(`${BASE_URL}/web/getNavbar`, { next: { revalidate: 3600 }, signal: controller.signal });
        clearTimeout(timeoutId);
        const seoData = await response.json();
        const seoItem = seoData?.data?.find((item) => item?.name === "About Us")?.siteMenu?.find((sub) => sub?.url === "contactus") || {};

        const title = seoItem?.seoTitle || "Kaiso Research";
        const description = seoItem?.metaDescription || "Kaiso Research";
        const keywords = seoItem?.keywords || "Kaiso Research";

        const headersList = headers();
        const host = headersList.get("host");
        const protocol = headersList.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
        const locale = "contactus";
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
        const author = "Kaiso Research and Consulting";
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

export default function ContactUs({ seoData }) {
    // Since Contact Us is a menu item under About Us page, we need to call it correctly
    // useNavbarSEO(pageName, menuName, subMenuName)
    // useNavbarSEO("About Us", "Contact Us");
    // Captcha state - initialize as null to prevent hydration mismatch

    return (
        <>
            <Contact_Us />
        </>
    );
}
