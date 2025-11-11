import { Html, Head, Main, NextScript } from "next/document";
import { BASE_URL } from "../../config";
import { poppins } from "@/utils/fonts";

export default function Document() {
    return (
        <Html lang="en" className={poppins.variable}>
            <Head>
                <meta charSet="utf-8" />

                {/* Resource hints for better performance */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                
                {/* Preconnect to third-party domains */}
                <link rel="preconnect" href="https://www.googletagmanager.com" />
                <link rel="preconnect" href="https://embed.tawk.to" />
                
                {/* DNS prefetch for additional performance */}
                <link rel="dns-prefetch" href="//www.google-analytics.com" />
                <link rel="dns-prefetch" href="//kaiso.kmsoft.org" />
                <link rel="dns-prefetch" href="//api.kaisoresearch.com" />
                <link rel="dns-prefetch" href="//www.paypal.com" />

                {/* Base Canonical Link - will be dynamically updated by useCanonicalUrl hook */}
                {/* <link rel="canonical" href="/" /> */}
                
                {/* <meta property="og:image" content={`${BASE_URL}/images/socialShareImage.png`} />
                <meta name="twitter:image" content={`${BASE_URL}/images/socialShareImage.png`} />
                <meta itemProp="image" content={`${BASE_URL}/images/socialShareImage.png`} /> */}

                {/* Google Tag Manager - Optimized loading */}
                <script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=G-C2NBT7N39X"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            // Initialize dataLayer immediately but defer gtag calls
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            
                            // Defer gtag initialization until after page load
                            if (document.readyState === 'loading') {
                                document.addEventListener('DOMContentLoaded', function() {
                                    gtag('js', new Date());
                                    gtag('config', 'G-C2NBT7N39X', {
                                        page_title: document.title,
                                        page_location: window.location.href
                                    });
                                });
                            } else {
                                gtag('js', new Date());
                                gtag('config', 'G-C2NBT7N39X', {
                                    page_title: document.title,
                                    page_location: window.location.href
                                });
                            }
                        `,
                    }}
                />
            </Head>
            <body className="antialiased" suppressHydrationWarning>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
