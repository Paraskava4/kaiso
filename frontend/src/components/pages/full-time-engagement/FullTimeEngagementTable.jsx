"use client";

import React from "react";

const rows = [
    {
        model: "Ad‑Hoc and On‑Demand",
        note: "For Urgent, short‑term needs",
        feature: "On‑demand, project‑based, fast delivery",
        pricing: "Hourly, adjustable",
        min: "160 hours",
    },
    {
        model: "FTDE",
        note: "For Ongoing and predictable projects",
        feature: "Consistent support from a dedicated team",
        pricing: "Discounted rates",
        min: "400 hours",
    },
    {
        model: "DAE",
        note: "For Long‑term, embedded expertise",
        feature: "Full‑time analyst integrated with your team",
        pricing: "Cost‑effective alternative to hiring",
        min: "480+ hours",
    },
];

const EngagementComparisonTable = () => (
    <section className="bg-[#FAF9F7] py-6 sm:py-12 md:py-16 lg:py-24 px-4 sm:px-6">
        <div className="max-w-[88%] mx-auto w-full px-4 sm:px-6 lg:px-8">
            {/* ---- heading ---- */}
            <header className="mb-6 sm:mb-8 md:mb-10">
                <p className="text-sm sm:text-base text-red-600 font-medium mb-1 leading-relaxed">{/* Engagement Comparison Table */}</p>
                <h2 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-semibold text-gray-900">
                    Strategic Engagement Frameworks
                </h2>
                <p className="text-gray-600 mt-2 text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] max-w-full sm:max-w-3xl">
                    Select the engagement model that best matches your research intensity, speed requirements, and strategic depth, whether for tactical
                    projects or embedded, ongoing decision support.
                </p>
            </header>
            <div className="relative">
                {/* table */}
                <div className="overflow-x-auto border border-gray-200 shadow-sm">
                    <table className="min-w-full text-sm text-left">
                        <thead>
                            <tr className="bg-[#172353] text-white">
                                <th className="px-4 sm:px-6 py-2 font-semibold border-r border-gray-200 text-center text-base">Engagement Model</th>
                                <th className="px-4 sm:px-6 py-2 text-center font-semibold border-r border-gray-200 text-base ">Key Features</th>
                                <th className="px-4 sm:px-6 py-2 text-center font-semibold border-r border-gray-200 text-base">Pricing</th>
                                <th className="px-4 sm:px-6 py-2 text-center font-semibold text-base ">Minimum Guarantee</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, idx) => (
                                <tr key={idx} className="border-t border-gray-200 bg-white">
                                    <td className="px-4 sm:px-6 py-4 sm:py-5 border-r border-gray-200">
                                        <span className="font-medium text-gray-900 text-base">{r.model}</span>
                                        <br />
                                        <span className="italic text-xs text-gray-600 leading-loose">{r.note}</span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 sm:py-5 text-center border-r border-gray-200 text-gray-900 text-sm">{r.feature}</td>
                                    <td className="px-4 sm:px-6 py-4 sm:py-5 text-center border-r border-gray-200 text-gray-900 text-sm">{r.pricing}</td>
                                    <td className="px-4 sm:px-6 py-4 sm:py-5 text-center text-gray-900 text-sm">{r.min}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
);

export default EngagementComparisonTable;
