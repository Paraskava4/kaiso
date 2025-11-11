"use client";

import Script from "next/script";

export default function GoogleAnalytics() {
    if (process.env.NODE_ENV !== "production") return null;

    return (
        <>
            <Script id="gtag-src" src="https://www.googletagmanager.com/gtag/js?id=G-C2NBT7N39X" strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-C2NBT7N39X');
        `}
            </Script>
        </>
    );
}
