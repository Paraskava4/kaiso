// Navigation data structure for header menu items and their sub-menus
export const navigationData = {
    "Our Experties": {
        items: [
            {
                title: "Syndicate Reports",
                subItems: ["Global Report", "Global Report", "Global Report"],
            },
            {
                title: "Custom Reports and Solutions",
                subItems: [],
            },
            {
                title: "Full Time Engagement",
                subItems: ["On-Demand Engagement", "Full-Time Dedicated Engagement (FTDE)", "Dedicated Analyst Engagement (DAE)"],
            },
            {
                title: "Strategic Analysis",
                subItems: ["TAM Expension", "GTM Strategy", "Competitive Growth"],
            },
        ],
    },
    Industries: {
        items: [
            // {
            //   title: 'Technology',
            //   subItems: [
            //     'Software & IT Services',
            //     'Hardware & Electronics',
            //     'Telecommunications',
            //     'Cybersecurity'
            //   ]
            // },
            // {
            //   title: 'Healthcare',
            //   subItems: [
            //     'Pharmaceuticals',
            //     'Medical Devices',
            //     'Digital Health',
            //     'Biotechnology'
            //   ]
            // },
            // {
            //   title: 'Energy',
            //   subItems: [
            //     'Renewable Energy',
            //     'Oil & Gas',
            //     'Power Generation',
            //     'Energy Storage'
            //   ]
            // },
            {
                title: "Life Sciences",
                subItems: ["Pharmaceuticals", "Medical Devices and Supplies", "Healthcare", "Diagnostics and Biotech", "Healthcare IT", "Therapeutics"],
            },
            {
                title: "Consumer Goods",
                subItems: [
                    "Consumer Electronics",
                    "Home Products",
                    "Luxury and High-Value Products",
                    "Personal Care and Cosmetics",
                    "Apparel and Fashion",
                    "Consumer and general services",
                    // 'Sports, Fitness and Leisure',
                    // 'Baby Products and Supplies',
                    // 'Office Products and Supplies',
                    // 'Pet Products and Supplies',
                    // 'Travel and Luxury Travel',
                    // 'Hospitality'
                ],
            },
            {
                title: "Materials And Chemicals",
                subItems: [
                    "Renewable and Specialty Chemicals",
                    "Bulk Chemicals",
                    "Composites",
                    "Advanced Materials",
                    "Paints, Coatings and Additives Materials and Chemicals",
                ],
            },
            {
                title: "Construction and Manufacturing",
                subItems: [
                    "Packaging",
                    "Manufacturing",
                    "Manufacturing Services",
                    "Engineering, Equipment and Machinery",
                    "Heavy Manufacturing",
                    // 'Roads and Highways',
                    // 'Residential Construction and Improvement',
                    // 'HVAC',
                    // 'Construction Materials'
                ],
            },
            // {
            //   title: 'Food and Beverages',
            //   subItems: [
            //     'Food Services and Hospitality',
            //     'Food Ingredients',
            //     'Additives and Supplements',
            //     'Advanced Packaging and Tracking Technologies',
            //     'Nutraceuticals and Wellness Foods',
            //     'Convenience Foods and Frozen Foods',
            //     'Agriculture and Agri Products',
            //     'Beverages'
            //   ]
            // },
            // {
            //   title: 'Energy and Power',
            //   subItems: [
            //     'Green, Alternative, and Renewable Energy',
            //     'Non-renewable and Conventional Energy',
            //     'Storage and Distribution',
            //     'Combined Heat and Power',
            //     'Energy Efficiency and Conservation',
            //     'Utilities',
            //     'Equipment and Devices'
            //   ]
            // },
            // {
            //   title: 'Semiconductors and Electronics',
            //   subItems: [
            //     'Sensors and Controls',
            //     'Semiconductors',
            //     'Electronic Security',
            //     'Electronic Systems and Devices',
            //     'Display Technologies',
            //     'Next-Generation Technologies'
            //   ]
            // },
            // {
            //   title: 'Automotive and Transportation',
            //   subItems: [
            //     'Infotainment, Navigation and Telematics',
            //     'Safety and Security Systems',
            //     'Automotive Aftermarket',
            //     'Electric and Hybrid Vehicles',
            //     'Freight and Logistics',
            //     'Automotive Systems and Accessories'
            //   ]
            // },
        ],
    },
    // "Report Store": {
    //     items: [
    //         {
    //             title: "Market Research Reports",
    //             subItems: ["Industry Analysis", "Market Trends", "Competitive Landscape", "Growth Opportunities"],
    //         },
    //         {
    //             title: "Custom Research",
    //             subItems: ["Tailored Studies", "Primary Research", "Secondary Research"],
    //         },
    //     ],
    // },
    "Consulting Services": {
        items: [
            {
                title: "Market Assessment",
                subItems: ["Current Market Demand", "Market Forecast", "Global and Regional Market Landscape", "Market Impacting Factors"],
            },
            {
                title: "Competitive Positioning Analysis",
                subItems: [
                    "Benchmarking",
                    "Pipeline Analysis",
                    "Product Mapping",
                    "Technology & Innovation Focus",
                    // 'Inventory Forecasting',
                    // 'Regional Sales and Production Capabilities',
                    // 'Key Customer Identification'
                ],
            },
            {
                title: "Market Intelligence",
                subItems: [
                    "Feasibility Study",
                    "Market Entry Strategy",
                    "Market Expansion Strategy",
                    "Risk Assessment",
                    // 'Sales Intelligence',
                    // 'Demand Mapping'
                ],
            },
            {
                title: "Partner Identification",
                subItems: ["M&A Due Diligence", "M&A Scanning & Targeting", "M&A Support"],
            },
            {
                title: "Technology Scouting & Monitoring",
                subItems: [
                    "Technology Intelligence",
                    "Idea Funnel Management",
                    // 'Technology Landscape Benchmarking',
                    // 'Emerging Technology',
                    // 'New Product Research'
                ],
            },
            {
                title: "Strategic Analysis",
                subItems: [
                    "Go-To-Market Insights",
                    "Identify Market Attractiveness",
                    "Create Differential Advantages",
                    // 'Channel Assessment Advisory'
                ],
            },
            {
                title: "Customer Intelligence",
                subItems: [
                    "Voice of Customers, Wants, Needs, Preferences, and Behaviour",
                    "Customer Satisfaction and Loyalty Assessment",
                    // 'Product Launches and Success Assessment',
                    // 'Consumer Behaviour Analysis',
                    // 'Product Test',
                    // 'Retailer Satisfaction and Effectiveness Index'
                ],
            },
        ],
    },
    "About us": {
        items: [
            // {
            //     title: "Company",
            //     subItems: ["Our Story", "Mission & Vision", "Leadership Team", "Careers"],
            // },
            {
                title: "Contact",
                subItems: [
                    // 'Get in Touch',
                    // 'Office Locations',
                    // 'Support'
                ],
            },
            {
                title: "Become a reseller",
                subItems: [],
            },
        ],
    },
    // Note: 'Blogs & News' doesn't have sub-menu data, so it's not included here
};

// Helper function to check if a menu item has sub-navigation
export const hasSubNavigation = (menuText) => {
    return navigationData.hasOwnProperty(menuText);
};

// Helper function to get sub-navigation data for a menu item
export const getSubNavigationData = (menuText) => {
    return navigationData[menuText] || null;
};
