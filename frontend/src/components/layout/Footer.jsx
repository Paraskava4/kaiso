"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { BASE_URL } from "../../../config";
import { useGetNavbarDataQuery } from "@/api/navbar";
import { isStatusInclude } from "@/utils/axiosInstance";

// Fallback for BASE_URL if not defined
const API_BASE_URL = BASE_URL || "https://api.kaisoresearch.com";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [navBarData, setnavBarData] = useState([]);

    const { data: navDataReq } = useGetNavbarDataQuery();

    useEffect(() => {
        if (!isStatusInclude(navDataReq?.status)) return;

        setnavBarData(navDataReq?.data);
    }, [navDataReq]);

    const industries =
        navBarData
            .find((section) => section.name === "Industries")
            ?.siteMenu.map((menu) => {
                return menu.categoryId;
            })
            .filter(Boolean) || [];

    const socialIcons = [
        { src: "/icons/facebook.webp", alt: "Facebook" },
        { src: "/icons/twitter.webp", alt: "Twitter" },
        { src: "/icons/insta.webp", alt: "Instagram" },
        { src: "/icons/linkedin.webp", alt: "LinkedIn" },
    ];

    const companyLinks = [
        { text: "About us", href: "/aboutus" },
        { text: "FAQ", href: "/faq" },
        { text: "Careers", href: "/careers" },
        { text: "Blogs", href: "/blog" },
        { text: "Contact Us", href: "/contactus" },
        { text: "What We Believe", href: "/aboutus/#we-believe" },
        { text: "Our Mission", href: "/aboutus/#our-mission" },
        { text: "Blogs & News", href: "/blog" },
        { text: "Privacy Policy", href: "/privacypolicy" },
        { text: "Terms & Conditions", href: "/termsandcondition" },
        { text: "GDPR Policy", href: "/gdrp" },
        { text: "Become a Reseller", href: "/become-a-reseller" },
        { text: "Disclaimer", href: "/dsisclaimer" },
        { text: "Return & Refund Policy", href: "/retunpolicy" },
        { text: "Delivery Formats", href: "/deliveryformats" },
        { text: "Cookie Policy", href: "/cookiepolicy" },
        { text: "Request for Consultation", href: "/consultation" },
        { text: "Career", href: "/career" },
        { text: "How to Order", href: "/how-to-order" },
        { text: "FAQs", href: "/faq" },
        { text: "Syndicate Reports", href: "/syndicate-reports" },
        { text: "Custom Report Solutions", href: "/custom-reports" },
        { text: "Full Time Engagement Models (FTE)", href: "/full-time-engagement" },
        { text: "Strategic Growth Solutions", href: "/strategic-growth-solutions" },
        { text: "Consulting Services", href: "/consulting-services" },
        { text: "Life Sciences", href: "/report-store/Life-Sciences" },
        // Dynamically add industry links
    ];

    const footerNav = [
        {
            heading: "Product",
            links: ["Request for Consultation", "Contact Us", "Career", "How to Order", "Become a Reseller", "FAQs"],
        },
        {
            heading: "Company",
            links: ["Privacy Policy", "Terms & Conditions", "GDPR Policy", "Disclaimer", "Return & Refund Policy", "Delivery Formats", "Cookie Policy"],
        },
        {
            heading: "About",
            links: ["About us", "What We Believe", "Our Mission", "Blogs & News"],
        },
    ];

    const popularData = [
        {
            title: "Services",
            items: [
                { name: "Syndicate Reports", href: "/syndicate-reports" },
                { name: "Custom Report Solutions", href: "/custom-reports-and-solutions" },
                { name: "Full Time Engagement Models (FTE)", href: "/full-time-engagement" },
                { name: "Strategic Growth Solutions", href: "/strategic-growth-solutions" },
                { name: "Consulting Services", href: "/consulting-services" },
            ],
        },
        // {
        //     title: "Industries",
        //     items: [
        //         "Life Sciences",
        //         "Consumer Goods",
        //         "Materials And Chemicals",
        //         "Construction and Manufacturing",
        //         "Food and Beverages",
        //         "Energy and Power",
        //         "Semiconductors and Electronics",
        //         "Automotive and Transportation",
        //         "ICT and Media",
        //         "Aerospace and Defense",
        //         "BFSI",
        //     ],
        // },
        {
            title: "Industries",
            items: [
                ...industries.map((industry) => {
                    return {
                        name: industry?.name,
                        href: `/report-store/${industry?.name.replace(/\s+/g, "-")}`,
                    };
                }),
            ], // Use dynamically fetched industries
        },
        {
            title: "Popular Reports",
            items: [
                { name: "Healthcare IT", href: "/report-store/Life-Sciences/Healthcare-IT" },
                { name: "Consumer Electronics", href: "/report-store/Consumer-Goods/Consumer-Electronics" },
                { name: "Renewable and Specialty Chemicals", href: "/report-store/Materials-and-Chemicals/Renewable-and-Specialty-Chemicals" },
                { name: "Engineering, Equipment and Machinery", href: "/report-store/Construction-and-Manufacturing/Engineering-Equipment-and-Machinery" },
                { name: "Nutraceuticals and Wellness Foods", href: "/report-store/Food-and-Beverages/Nutraceuticals-and-Wellness-Foods" },
                { name: "Green, Alternative, and Renewable Energy", href: "/report-store/Energy-and-Power/Green-Alternative-and-Renewable-Energy" },
            ],
        },
        {
            title: "",
            items: [
                "Semiconductors",
                { name: "Semiconductors", href: "/report-store/Semiconductors-and-Electronics/Semiconductors" },
                { name: "Electric and Hybrid Vehicles", href: "/report-store/Automotive-and-Transportation/Electric-and-Hybrid-Vehicles" },
                { name: "Enterprise and Consumer IT Solutions", href: "/report-store/ICT-and-Media/Enterprise-and-Consumer-IT-Solutions" },
                { name: "Commercial Aviation", href: "/report-store/Aerospace-and-Defense/Commercial-Aviation" },
                { name: "Financial Services", href: "/report-store/BFSI/Financial-Services" },
            ],
        },
    ];

    const contactInfo = [
        { icon: "/icons/Phone.webp", text: "+1 872 219 0417", alt: "Phone icon" },
        { icon: "/icons/Email.webp", text: "help@kaisoresearch.com", alt: "Email icon" },
    ];

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter an email address");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/web/sendEmail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.status === "Failed") {
                toast.error(data.message || "Failed to subscribe");
            } else {
                toast.success("Subscribed successfully!");
                setEmail("");
            }
        } catch (error) {
            toast.error("An error occurred while subscribing. Please try again later.", {
                duration: 5000,
                style: {
                    background: "#ef4444",
                    color: "#fff",
                },
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className="p-2 sm:p-4 lg:p-6 bg-blue-950 text-zinc-300 rounded-[20px] m-3">
            <div className="w-full max-w-[85%] sm:max-w-[85%] lg:max-w-[84%] xl:max-w-[84.9%] mx-auto">
                {/* Top Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-6 sm:gap-8 py-5 sm:py-5">
                    {/* Column 1: Brand + Social */}
                    <div className="space-y-4">
                        <Image
                            src="/images/Kaiso-Logo.webp"
                            alt="Kaiso Logo"
                            className="object-contain w-full max-w-[160px] sm:max-w-[180px] lg:max-w-[200px] aspect-[4.27]"
                            width={200}
                            height={47}
                            quality={100}
                            priority
                        />
                        <div className="flex items-center gap-2">
                            <Image
                                src="/icons/location.png"
                                alt="Location Icon"
                                className="w-4 sm:w-5 lg:w-6 aspect-square"
                                width={24}
                                height={24}
                                quality={100}
                            />
                            <Link href="#" className="text-xs sm:text-sm lg:text-xs hover:underline">
                                Office 205 N Michigan Ave, Chicago, Illinois 60601, USA
                            </Link>
                        </div>
                        <div>
                            <div className="flex gap-3 sm:gap-4 mt-2">
                                {socialIcons.map(({ src, alt }) => (
                                    <Image
                                        key={alt}
                                        src={src}
                                        alt={alt}
                                        className="object-contain w-5 sm:w-6 lg:w-7 aspect-square"
                                        width={28}
                                        height={28}
                                        quality={100}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-base sm:text-md lg:text-md text-white">We Accept</h3>
                            <div className="flex gap-2 flex-wrap">
                                {["we1.png", "we2.png", "we3.png", "we4.png", "we5.png", "we6.png"].map((icon, index) => (
                                    <Image
                                        key={index}
                                        src={`/icons/${icon}`}
                                        alt="Payment Method"
                                        className="object-contain w-6 sm:w-7 lg:w-8 aspect-square"
                                        width={32}
                                        height={32}
                                        quality={100}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Column 2: About */}
                    <nav className="min-w-[140px]">
                        <h3 className="text-base sm:text-md lg:text-lg font-medium text-white">About</h3>
                        <ul className="mt-3  text-xs sm:text-sm lg:text-xs">
                            {footerNav[2].links.map((text) => {
                                const href = companyLinks.find((link) => link.text.toLowerCase() === text.toLowerCase())?.href || "#";
                                return (
                                    <li key={text} className="py-1">
                                        <Link href={href} className="hover:underline hover:text-white transition-colors">
                                            {text}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Column 3: Company */}
                    <nav className="min-w-[140px]">
                        <h3 className="text-base sm:text-md lg:text-lg font-medium text-white">Company</h3>
                        <ul className="mt-3  text-xs sm:text-sm lg:text-xs">
                            {footerNav[1].links.map((text) => {
                                const href = companyLinks.find((link) => link.text.toLowerCase() === text.toLowerCase())?.href || "#";
                                return (
                                    <li key={text} className="py-1">
                                        <Link href={href} className="hover:underline hover:text-white transition-colors">
                                            {text}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Column 4: Product */}
                    <nav className="min-w-[140px]">
                        <h3 className="text-base sm:text-lg lg:text-md font-medium text-white">Contact Us</h3>
                        <ul className="mt-3  text-xs sm:text-sm lg:text-xs">
                            {footerNav[0].links.map((text) => {
                                const href = companyLinks.find((link) => link.text.toLowerCase() === text.toLowerCase())?.href || "#";
                                return (
                                    <li key={text} className="py-1">
                                        <Link href={href} className="hover:underline hover:text-white transition-colors">
                                            {text}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Column 5: Contact + Subscribe */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-base sm:text-lg lg:text-md font-medium text-white">Contact Detail</h3>
                            <div className="mt-3  text-xs sm:text-sm lg:text-xs">
                                {contactInfo.map(({ icon, text, alt }) => (
                                    <div key={text} className="flex items-center gap-2">
                                        <Image src={icon} alt={alt} className="w-4 sm:w-4 lg:w-4 aspect-square" width={24} height={24} quality={100} />
                                        <Link
                                            href={text.includes("@") ? `mailto:${text}` : text.includes("+") ? `tel:${text}` : "#"}
                                            className="text-xs sm:text-sm lg:text-sm hover:underline"
                                        >
                                            {text}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-base sm:text-md lg:text-md text-white">Keep in touch</h3>
                            <p className="mt-1 text-xs sm:text-sm lg:text-xs">Sign up for emails</p>
                            <form onSubmit={handleSubscribe} className="mt-3 space-y-3" aria-label="Newsletter subscription form">
                                <input
                                    type="email"
                                    placeholder="Your Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-white/30 bg-transparent text-white text-xs sm:text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    aria-label="Email address for newsletter subscription"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full sm:w-auto px-4 py-2 bg-gray-100 text-blue-950 font-medium rounded-lg text-xs sm:text-sm ${
                                        isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-white"
                                    }`}
                                >
                                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Popular Sections */}
                <div className="mt-8 sm:mt-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
                        {/* Blank First Column */}
                        <div className="hidden lg:block"></div>
                        {popularData.map(({ title, items }) => (
                            <div key={title} className="text-zinc-400">
                                <h3 className="font-medium h-5 text-white mb-3 text-base sm:text-md">{title}</h3>
                                <ul className="space-y-1 text-xs">
                                    {items.map((item, index) => {
                                        // const href = companyLinks.find((link) => link.text.toLowerCase() === item.toLowerCase())?.href || "#";

                                        return (
                                            <div key={index}>
                                                <Link href={`${item?.href}`} className="py-1 hover:underline hover:text-white transition-colors">
                                                    {item?.name}
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between items-center mt-8 sm:mt-12 text-xs sm:text-sm text-gray-100">
                    <p>© 2025 Kaiso Research and Consulting. All Rights Reserved.</p>
                    <p>ISO 9001 : 2015</p>
                    <nav className="flex gap-4">
                        <Link href="/privacypolicy" className="hover:underline">
                            Privacy Policy
                        </Link>
                        <Link href="/termsandcondition" className="hover:underline">
                            Terms & Conditions
                        </Link>
                        <Link href="/sitemap" className="hover:underline">
                            SiteMap
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
