import { BASE_URL } from "../../../../../config";
import dynamic from "next/dynamic";
import { headers } from "next/headers";

const ReportStorePage = dynamic(() => import("@/page-components").then((m) => ({ default: m.ReportStorePage })), { ssr: true });
const FeaturedBlogs = dynamic(() => import("@/components/pages/blog/sections/FeaturedBlogs"), { ssr: true });

export async function generateMetadata({ params }) {
    const awaitedParams = await params;
    const { locale, slug, sub_slug } = awaitedParams || {};
    const type = locale === "report-store" ? "report" : locale === "blog" ? "blog" : locale;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const [primaryRes, categoryRes] = await Promise.allSettled([
            fetch(`${BASE_URL}/web/getDataByURL?type=${type}&url=${sub_slug || slug}`, {
                signal: controller.signal,
                headers: { "Content-Type": "application/json" },
                next: { revalidate: 300 },
            }),
            fetch(`${BASE_URL}/web/getDataByCategoryAndSubcategory?type=${type}&categoryUrl=${slug}&subcategoryUrl=${sub_slug || ""}`, {
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
                    seoTitle: catData?.data?.[0]?.subCategoryId?.name,
                    metaDescription: catData?.data?.[0]?.subCategoryId?.description,
                };
            }
        }
        const keywords = seoItem?.keywords || "Kaiso Research";

        const headersList = await headers();
        const host = headersList.get("host");
        const protocol = headersList.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
        const author = `Kaiso Research and Consulting, ${protocol}://${host}`;
        const canonicalUrl = `${protocol}://${host}/${locale}/${slug}/${sub_slug}`;

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
        const headersList = await headers();
        const host = headersList.get("host");
        const protocol = headersList.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
        const author = `Kaiso Research and Consulting, ${protocol}://${host}`;
        const canonicalUrl = `${protocol}://${host}/${locale}/${slug}/${sub_slug}`;

        const fallbackTitle = "Reports & Blogs - Kaiso Research";
        const fallbackDescription = "Explore our comprehensive research reports and blogs covering industries, markets, and insights.";
        const fallbackKeywords = "Kaiso Research";

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

async function getData(locale, slug, sub_slug) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const type = locale === "report-store" ? "report" : locale === "blog" ? "blog" : locale;
    try {
        const [primaryRes, categoryRes] = await Promise.allSettled([
            fetch(`${BASE_URL}/web/getDataByURL?type=${type}&url=${sub_slug || slug}`, {
                signal: controller.signal,
                headers: { "Content-Type": "application/json" },
                next: { revalidate: 300 },
            }),
            fetch(`${BASE_URL}/web/getDataByCategoryAndSubcategory?type=${type}&categoryUrl=${slug}&subcategoryUrl=${sub_slug || ""}`, {
                signal: controller.signal,
                headers: { "Content-Type": "application/json" },
                next: { revalidate: 300 },
            }),
        ]);
        clearTimeout(timeoutId);

        let pageData = null;
        if (primaryRes.status === "fulfilled" && primaryRes.value.ok) {
            const data = await primaryRes.value.json();
            if (data?.status === 200 && data?.data) pageData = data.data;
        }
        if (!pageData && categoryRes.status === "fulfilled" && categoryRes.value.ok) {
            const catData = await categoryRes.value.json();
            if (catData?.status === 200 && catData?.data) pageData = catData.data;
        }
        return { pageData };
    } catch (e) {
        clearTimeout(timeoutId);
        return { pageData: null };
    }
}

export default async function LocaleSlugSubPage({ params }) {
    const awaitedParams = await params;
    const { locale, slug, sub_slug } = awaitedParams || {};
    const { pageData } = await getData(locale, slug, sub_slug);
    const pageType = locale;

    if (pageData && pageType === "report-store") {
        return (
            <ReportStorePage
                reportData={pageData}
                loadingData={false}
                urlData={{
                    type: pageType === "report-store" ? "report" : pageType === "blog" ? "blogs" : pageType,
                    categoryUrl: slug,
                    subcategoryUrl: sub_slug,
                }}
            />
        );
    }

    if (pageData && pageType === "blogs") {
        return <FeaturedBlogs blogsData={pageData} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading content...</p>
            </div>
        </div>
    );
}
