// import CommonBlog from "@/components/shared/commanBlog/index.jsx";
// import { HeroSection, Services, Reports, Industries, Blog, News, Map, Feedback, ContactUs, Footer } from "../components/index.jsx";
// import ConsultingServicesPage from "./ConsultingServicesPage.jsx";
// import AboutUsPages from "@/components/pages/aboutus/sections/AboutUsPages.jsx";

// /**
//  * HomePage Component
//  *
//  * This component represents the main landing page of the application.
//  * It includes all the main sections like Hero, Services, Reports, etc.
//  */
// const HomePage = () => {
//     return (
//         <main
//             style={{
//                 width: "100%",
//                 minHeight: "100vh",
//                 display: "flex",
//                 flexDirection: "column",
//             }}
//         >
//             <HeroSection />
//             <Services />
//             <Reports />
//             <Industries />
//             <AboutUsPages />
//             <Blog />
//             <News />
//             <Map />
//             <Feedback />
//             <ContactUs />
//             <Footer />
//         </main>
//     );
// };

// export default HomePage;
"use client";
import { memo } from "react";
import dynamic from "next/dynamic";
import { Services, Reports, Industries, Footer } from "../components/index.jsx";
import LazyLoadWrapper from "../components/shared/LazyLoadWrapper.jsx";
// import { useNavbarSEO } from "@/utils/hooks/useMetadata.js";
import { HeroCarousel } from "@/components/pages/home/HeroSection.jsx";
import { useGetLandingPageDataQuery } from "@/api/home";

// Create lazy-loaded components with integrated top loading bar
// Using dynamic imports with ssr: false for client-only components
const AboutUsPages = dynamic(() => import("@/components/pages/aboutus/sections/AboutUsPages.jsx"));

const Blog = dynamic(() => import("../components/pages/home/Blog.jsx"));

const News = dynamic(() => import("../components/pages/home/News.jsx"));

const Map = dynamic(() => import("../components/pages/home/Map.jsx"), {
    ssr: false,
    loading: () => <LazyLoadWrapper showTopLoader={true} />,
});

const Feedback = dynamic(() => import("../components/pages/home/Feedback.jsx"));

const ContactUs = dynamic(() => import("../components/pages/home/ContactUs.jsx"));

// Memoized HomePage component for better performance
const HomePage = memo(() => {
    // Set SEO metadata from navbar API for Landing Page - no fallback text
    // useNavbarSEO("Landing Page", "Landing Page");

    // Single API call to get all home page data
    const { data: landingPageData, isLoading, error } = useGetLandingPageDataQuery();

    // Extract data for different components
    const heroData = landingPageData?.data?.heroSections || [];
    const reportsData = landingPageData?.data?.publications || [];
    const blogsData = landingPageData?.data?.insights || [];
    const newsData = landingPageData?.data?.newsArticles || [];
    const feedbackData = landingPageData?.data?.reviews || [];

    return (
        <>
            <main className="w-full min-h-screen flex flex-col">
                {/* Critical above-the-fold content - load immediately */}
                <HeroCarousel heroData={heroData} isLoading={isLoading} />
                <Services />

                {/* Below-the-fold content - lazy load for better performance */}
                <AboutUsPages />

                <Reports reportsData={reportsData} isLoading={isLoading} />
                <Industries />

                {/* Lazy-loaded components */}
                <Blog blogsData={blogsData} isLoading={isLoading} />

                <News newsData={newsData} isLoading={isLoading} />

                <Map />

                <Feedback feedbackData={feedbackData} isLoading={isLoading} />

                <ContactUs pageName="HomePage" />

                <Footer />
            </main>
        </>
    );
});

export default HomePage;
