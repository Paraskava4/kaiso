"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components";
import { useGetNavbarDataQuery } from "@/api/navbar";
import { isStatusInclude } from "@/utils/axiosInstance";
import axios from "axios"; // Import Axios
import { BASE_URL } from "../../../config";
// import { BASE_URL } from "../../config";

// Define BASE_URL (replace with your actual base URL or import from config)
// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-domain.com";

export const dynamic = "force-dynamic";

const SiteMapPage = () => {
    const router = useRouter();
    const [navBarData, setNavBarData] = useState([]);
    const [industryData, setIndustryData] = useState([]); // State for category and subcategory data

    const { data: navDataReq } = useGetNavbarDataQuery();

    // Fetch navbar data
    useEffect(() => {
        if (!isStatusInclude(navDataReq?.status)) return;
        setNavBarData(navDataReq?.data);
    }, [navDataReq]);

    // Fetch category and subcategory data
    useEffect(() => {
        const fetchIndustryData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/web/categoryAndSubcategory`);
                if (response.data.status === 200) {
                    setIndustryData(response.data.data.reportCategories);
                }
            } catch (error) {
                console.error("Error fetching category and subcategory data:", error);
            }
        };
        fetchIndustryData();
    }, []);

    // Construct Industries menu with subcategories
    const industriesMenu = {
        name: "Industries",
        url: "/report-store/industries",
        children: industryData.map((industry) => ({
            name: industry.name,
            url: `/report-store/${industry.url}`,
            children:
                industry.subCategories?.map((subCategory) => ({
                    name: subCategory.name,
                    url: `/report-store/${subCategory.url}`,
                })) || [],
        })),
    };

    // Static menu items with dynamic Industries
    const menuData = [
        {
            name: "Home",
            url: "/",
            children: [],
        },
        {
            name: "Services",
            url: "/syndicate-reports",
            children: [
                { name: "Syndicate Reports", url: "/syndicate-reports" },
                { name: "Custom Reports", url: "/custom-reports-and-solutions" },
                { name: "Full Time Engagement", url: "/full-time-engagement" },
                { name: "Strategic Growth Solutions", url: "/strategic-growth-solutions" },
            ],
        },
        industriesMenu, // Use dynamic Industries menu
        {
            name: "Report Store",
            url: "/report-store",
            children: [],
        },
        {
            name: "Consulting Services",
            url: "/consulting-services",
            children: [
                { name: "Market Assessment", url: "/market-assessment" },
                { name: "Competitive Positioning Analysis", url: "/competitive-positioning-analysis" },
                { name: "Market Intelligence", url: "/market-intelligence" },
                { name: "Technology Scouting", url: "/technology-scouting-monitoring" },
                { name: "Partner Identification", url: "/partner-identification" },
                { name: "Customer Intelligence", url: "/customer-intelligence" },
                { name: "Strategic Analysis", url: "/strategic-analysis" },
            ],
        },
        {
            name: "Blogs & News",
            url: "/blog",
            children: [],
        },
        {
            name: "About Us",
            url: "/aboutus",
            children: [],
        },
        {
            name: "Contact Us",
            url: "/contactus",
            children: [],
        },
    ];

    const handleLinkClick = (url) => {
        if (router && router.push) {
            router.push(url);
        } else {
            window.location.href = url;
        }
    };

    // Show loading state if router is not ready or data is loading
    if (!router || navDataReq?.status === "pending") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sitemap Navigation */}
                    <div className="lg:col-span-3 rounded" style={{ border: "1px solid lightGrey" }}>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-[#2c48a3] mb-2">Site Map</h2>
                            </div>

                            <div className="space-y-6">
                                {menuData.map((menu, index) => (
                                    <div key={index} className="border-l-2 border-blue-100 pl-4">
                                        <div className="mb-3">
                                            <button
                                                onClick={() => handleLinkClick(menu.url)}
                                                className="text-[#2051f3] hover:text-blue-800 font-medium text-base transition-colors cursor-pointer hover:underline"
                                            >
                                                {menu.name}
                                            </button>
                                        </div>

                                        {menu.children && menu.children.length > 0 && (
                                            <div className="ml-4 space-y-2">
                                                {menu.children.map((child, childIndex) => (
                                                    <div key={childIndex}>
                                                        <button
                                                            onClick={() => handleLinkClick(child.url)}
                                                            className="text-gray-700 hover:text-blue-600 text-sm transition-colors cursor-pointer hover:underline block"
                                                        >
                                                            • {child.name}
                                                        </button>

                                                        {child.children && child.children.length > 0 && (
                                                            <div className="ml-4 mt-1 space-y-1">
                                                                {child.children.map((subChild, subIndex) => (
                                                                    <button
                                                                        key={subIndex}
                                                                        onClick={() => handleLinkClick(subChild.url)}
                                                                        className="text-gray-600 hover:text-blue-600 text-xs transition-colors cursor-pointer hover:underline block"
                                                                    >
                                                                        ◦ {subChild.name}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="rounded-lg shadow-sm p-6 mb-6" style={{ border: "1px solid lightgrey" }}>
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <span className="mr-2">📞</span>
                                Contact Us
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="font-medium">Call Us</p>
                                    <p>+1 872 219 0417</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SiteMapPage;
