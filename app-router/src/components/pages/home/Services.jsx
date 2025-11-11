"use client";
import { useEffect, useRef, useState } from "react";
import SectionTitle from "../shared/SectionTitle";
import ServicesList from "./ServicesList";
import styles from "./Services.module.css";

const Services = () => {
    const [activeService, setActiveService] = useState(0);
    const [fade, setFade] = useState(true);
    const intervalRef = useRef(null); // ✅ No TypeScript type

    const servicesData = [
        {
            title: "Syndicate Reports",
            heading: "Comprehensive Market Intelligence Reports",
            description:
                "Access detailed market research reports covering industry trends, competitive analysis, and strategic insights across multiple sectors. Our syndicate reports provide comprehensive data and analysis to support your business decisions.",
            image: "/images/HeroSecoend.webp",
            path: "/syndicate-reports",
        },
        {
            title: "Full Time Engagement",
            heading: "Dedicated Research Partnership",
            description:
                "Partner with our expert research team for ongoing, dedicated support. Our full-time engagement model provides continuous market intelligence, custom analysis, and strategic guidance tailored to your specific business needs.",
            image: "/images/HeroSecoend.webp",
            path: "/full-time-engagement/",
        },
        {
            title: "Strategic Analysis",
            heading: "In-Depth Strategic Consulting",
            description:
                "Leverage our expertise for deep strategic analysis of market opportunities, competitive positioning, and growth strategies. Our strategic analysis helps you make informed decisions and identify new business opportunities.",
            image: "/images/HeroSecoend.webp",
            path: "/strategic-analysis/",
        },
        {
            title: "Consulting Services",
            heading: "Expert Advisory and Implementation",
            description:
                "Benefit from our consulting expertise to implement strategic initiatives, optimize operations, and drive business growth. Our consulting services provide hands-on support and actionable recommendations.",
            image: "/images/HeroSecoend.webp",
            path: "/consulting-services/",
        },
        {
            title: "Custom Report Solution",
            heading: "Data Aligned to Business Goals",
            description:
                "Kaiso’s Custom Report Solutions deliver tailored intelligence for your goals—from go-to-market and competitive benchmarking to opportunity analysis and investment feasibility—providing decision-ready insights that drive strategic impact.",
            image: "/images/HeroSecoend.webp",
            path: "/report-store/",
        },
    ];

    const startAutoSlide = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setActiveService((prev) => (prev + 1) % servicesData.length);
                setFade(true);
            }, 400);
        }, 4000); // ✅ 4 seconds
    };

    const handleServiceClick = (index) => {
        if (index === activeService) return;
        setFade(false);
        setTimeout(() => {
            setActiveService(index);
            setFade(true);
        }, 400);

        console.log("servicesData");
        startAutoSlide(); // ✅ reset interval after click
    };

    useEffect(() => {
        startAutoSlide(); // start on mount
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <section className={styles.servicesSection}>
            <SectionTitle />
            <ServicesList servicesData={servicesData} activeService={activeService} onServiceClick={handleServiceClick} fade={fade} />
        </section>
    );
};

export default Services;
