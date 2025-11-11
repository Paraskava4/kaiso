"use client";
import * as React from "react";

export default function SimilarReportsList({ reports = [] }) {
    if (!reports.length) return null;

    return (
        <section className="flex flex-col justify-center items-start self-stretch bg-white border border-zinc-400">
            <header className="gap-2.5 self-stretch px-5 py-4 text-lg text-left font-medium leading-7 bg-white border-b border-zinc-700 border-opacity-30 text-zinc-900 max-sm:px-4 max-sm:py-3 max-sm:text-base">
                Similar Reports
            </header>
            <nav aria-label="Similar market research reports">
                <ul className="w-full">
                    {reports.map((report, index) => (
                        <li key={index}>
                            <a
                                href="#"
                                className="block gap-2.5 w-full px-4 py-2.5 text-base font-medium leading-6 border-b border-zinc-700 border-opacity-30 text-zinc-600 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-900 focus:ring-inset max-sm:px-3 max-sm:py-2 max-sm:text-sm"
                                aria-label={`View ${report} report`}
                            >
                                {report}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </section>
    );
}
