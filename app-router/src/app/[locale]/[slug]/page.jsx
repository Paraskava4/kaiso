import { BASE_URL } from "../../../../config";
import LocalePageClient from "./LocalePageClient";
import { headers } from "next/headers";

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { locale, slug } = resolvedParams || {};
    const type = locale === "report-store" ? "report" : locale === "blog" ? "blogs" : locale;

    try {
        const headersList = await headers();
        const host = headersList.get("host");
        const protocol = headersList.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const [primaryRes, categoryRes] = await Promise.allSettled([
            fetch(`${BASE_URL}/web/getDataByURL?type=${type}&url=${slug}`, {
                signal: controller.signal,
                headers: { "Content-Type": "application/json" },
                next: { revalidate: 300 },
            }),
            fetch(`${BASE_URL}/web/getDataByCategoryAndSubcategory?type=${type}&categoryUrl=${slug}`, {
                signal: controller.signal,
                headers: { "Content-Type": "application/json" },
                next: { revalidate: 300 },
            }),
        ]);

        clearTimeout(timeoutId);

        let seoItem = null;

        if (primaryRes.status === "fulfilled" && primaryRes.value.ok) {
            const data = await primaryRes.value.json();
            if (data?.status === 200 && data?.data) seoItem = data.data;
        }

        if (!seoItem && categoryRes.status === "fulfilled" && categoryRes.value.ok) {
            const catData = await categoryRes.value.json();
            if (catData?.status === 200 && catData?.data) {
                seoItem = {
                    seoTitle: catData?.data?.[0]?.categoryId?.name,
                    metaDescription: catData?.data?.[0]?.categoryId?.description,
                    author: catData?.data?.[0]?.categoryId?.author ? `${catData?.data?.[0]?.categoryId?.author}` : `Kaiso Research`,
                };
            }
        }

        const keywords = seoItem?.keywords || "Kaiso Research";
        const author = `${seoItem?.author}, ${protocol}://${host}`;

        const canonicalUrl = `${protocol}://${host}/${locale}/${slug}`;

        const title = seoItem?.seoTitle || "Reports & Blogs - Kaiso Research";
        const description = seoItem?.metaDescription || "Explore our comprehensive research reports and blogs covering industries, markets, and insights.";

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
    } catch (_) {
        // Fallback metadata if API fails
        return {
            title: "Reports & Blogs - Kaiso Research",
            description: "Explore our comprehensive research reports and blogs covering industries, markets, and insights.",
            keywords: "Kaiso Research",
            authors: [{ name: "Kaiso Research Team" }],
            alternates: { canonical: `${BASE_URL}/${locale}/${slug}` },
            robots: { index: true, follow: true },
            openGraph: {
                title: "Reports & Blogs - Kaiso Research",
                description: "Explore our comprehensive research reports and blogs covering industries, markets, and insights.",
                type: "article",
                authors: ["Kaiso Research Team"],
                siteName: "Kaiso Research",
                images: [
                    {
                        url: `${BASE_URL}/default-og-image.jpg`,
                        width: 1200,
                        height: 630,
                        alt: "Kaiso Research",
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: "Reports & Blogs - Kaiso Research",
                description: "Explore our comprehensive research reports and blogs covering industries, markets, and insights.",
                creator: "Kaiso Research Team",
                site: "@kaiso_research",
                images: [`${BASE_URL}/default-og-image.jpg`],
            },
        };
    }
}
export default async function LocaleSlugPage({ params }) {
    const resolvedParams = await params;
    return <LocalePageClient params={resolvedParams} />;
}
