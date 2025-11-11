// components/shared/seo/UniversalSEO.jsx
import Head from "next/head";
import { BASE_URL } from "../../../config";

export default function UniversalSEO({ seoData = {} }) {
    const { seoTitle = "Default Title", metaDescription = "Default description", ogTitle, ogDescription, author, pageUrl } = seoData;

    // Use pageUrl from seoData if provided, otherwise construct from window.location
    const canonicalUrl = pageUrl || (typeof window !== "undefined" ? window.location.href.split("?")[0] : "https://defaultdomain.com");

    return (
        <Head>
            <title>{seoTitle}</title>
            <meta property="og:image" content={`${BASE_URL}/images/socialShareImage.png`} />
            <meta name="twitter:image" content={`${BASE_URL}/images/socialShareImage.png`} />
            <meta itemProp="image" content={`${BASE_URL}/images/socialShareImage.png`} />
            <link rel="canonical" href={canonicalUrl} />
            <meta name="author" content={author || "Kaiso Research - Insights & Reports"} />
            {/* <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" /> */}
            <meta property="og:type" content="website" />
            <meta name="description" content={metaDescription} />

            {/* Open Graph */}
            <meta property="og:title" content={ogTitle || seoTitle} />
            <meta property="og:description" content={ogDescription || metaDescription} />
            <meta property="og:url" content={canonicalUrl} />

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={ogTitle || seoTitle} />
            <meta name="twitter:description" content={ogDescription || metaDescription} />
            <meta name="twitter:url" content={canonicalUrl} />
        </Head>
    );
}
