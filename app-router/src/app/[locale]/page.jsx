import LocalePageClient from "./LocalePageClient";
import { BASE_URL } from "../../../config";
import { headers } from "next/headers";

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { locale } = resolvedParams || {};
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(`${BASE_URL}/web/getNavbar`, {
            signal: controller.signal,
            headers: { "Content-Type": "application/json" },
            next: { revalidate: 300 },
        });
        clearTimeout(timeoutId);

        if (res.ok) {
            const navbarData = await res.json();
            const seoItem =
                locale === "report-store"
                    ? navbarData?.data?.find((item) => item?.name === "Report Store")?.siteMenu?.find((sub) => sub?.url === "report-store")
                    : navbarData?.data?.find((item) => item?.name === "Blogs & News")?.siteMenu?.find((sub) => sub?.url === "blog");

            console.log("navbarData", navbarData, seoItem);

            const keywords = seoItem?.keywords || "Kaiso Research";
            
            const headersList = await headers();
            const host = headersList.get("host");
            const protocol = headersList.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
            const canonicalUrl = `${protocol}://${host}/${locale}`;
            const author = `Kaiso Research and Consulting,  ${protocol}://${host}`;
            
            const title = seoItem?.seoTitle || "Kaiso Research - Reports & Blogs";
            const description = seoItem?.metaDescription || "Explore our comprehensive research reports, blogs, and insights across industries and markets.";

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
        }
    } catch (e) {
        console.error("Metadata fetch failed:", e);
    }

    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
    const canonicalUrl = `${protocol}://${host}/${locale}`;

    const fallbackTitle = "Kaiso Research - Reports & Blogs";
    const fallbackDescription = "Explore our comprehensive research reports, blogs, and insights across industries and markets.";
    const fallbackKeywords = "Kaiso Research";
    const author = "Kaiso Research and Consulting";

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

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <LocalePageClient params={resolvedParams} />;
}
