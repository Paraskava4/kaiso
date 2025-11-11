import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "@/styles/globals.css";
import ClientProviders from "@/components/ClientProviders";
import { BASE_URL } from "../../config";
import GlobalLoadingBar from "@/components/LoadingBar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    metadataBase: BASE_URL ? new URL(BASE_URL) : undefined,
    title: {
        default: "Kaiso Research",
        template: "%s | Kaiso Research",
    },
    description: "Kaiso Research",
    icons: {
        icon: "/favicon.ico",
    },
    openGraph: {
        type: "website",
        siteName: "Kaiso Research",
        title: "Kaiso Research",
        description: "Kaiso Research",
        images: BASE_URL ? [`${BASE_URL}/images/socialShareImage.png`] : undefined,
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "Kaiso Research",
        description: "Kaiso Research",
        images: BASE_URL ? [`${BASE_URL}/images/socialShareImage.png`] : undefined,
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
            </head>
            {/*
                suppressHydrationWarning={true} is added to handle browser extension interference.
                Browser extensions like Grammarly add attributes to the body element on the client side,
                causing hydration mismatches. The BrowserExtensionCleanup component handles cleanup.
            */}
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning={true}>
                <ClientProviders>{children}</ClientProviders>
            </body>
        </html>
    );
}
