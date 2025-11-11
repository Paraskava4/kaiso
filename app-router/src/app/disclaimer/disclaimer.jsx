
"use client";
import { Footer } from "@/components";
import Breadcrumb from "@/components/pages/shared/Breadcrumb";
import React, { useState } from "react";

export default function Disclaimer() {
    const [selectedName, setSelectedName] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="ps-36 pt-10">
                <Breadcrumb
                    items={[
                        { label: "Disclaimer", href: "/disclaimer" },
                        ...(selectedName ? [{ label: selectedName, href: `/disclaimer/${selectedName.toLowerCase().replace(/\s+/g, "-")}` }] : []),
                    ]}
                />
            </div>
            <main className="max-w-[88%] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <section className=" rounded-lg p-8">
                    <h1 className="text-3xl text-center font-bold text-zinc-900 mb-6">Disclaimer</h1>
                    <p className="text-lg font-medium text-zinc-700 mb-8">Kaiso Research and Consulting LLP</p>

                    <article className="prose prose-zinc max-w-none">
                        <p className="text-base text-zinc-600 leading-relaxed mb-6">
                            Kaiso Research and Consulting LLP ("Kaiso Research") provides strategic market intelligence, industry analysis, and consulting
                            services to a limited clientele. All deliverables are licensed exclusively for internal use by the purchasing organisation or
                            individual and are not intended for public distribution.
                        </p>

                        <p className="text-base text-zinc-600 leading-relaxed mb-6">By placing an order, the client acknowledges that:</p>

                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed mb-6">
                            <li>
                                All content provided by Kaiso Research is confidential and may not be published, shared, sold, or distributed without prior
                                written consent.
                            </li>
                            <li>
                                Reports and materials are protected by copyright and intellectual property laws; unauthorised reproduction, storage, or
                                transmission in any form is strictly prohibited.
                            </li>
                            <li>
                                Kaiso Research makes no warranty regarding the absolute accuracy of the data presented, as it is primarily derived from industry
                                interviews and third-party sources, which are subject to change and interpretation. Kaiso Research shall not be held responsible
                                for any inaccuracies resulting from incorrect or incomplete information provided by manufacturers, users, or other external
                                contributors. Clients agree that Kaiso is not liable for any business decision, loss, or commercial impact arising from the use
                                of our insights.
                            </li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Restrictions on Use</h2>
                        <p className="text-base text-zinc-600 leading-relaxed mb-6">
                            Reports may not be reproduced, lent, resold, or shared in any format, including PDF, Excel, PPT, or cloud, without explicit written
                            permission.
                        </p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Communication Policy</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            All communications (phone, video, digital) may be recorded or monitored for quality assurance, compliance, and client service. By
                            engaging, the client consents to this under applicable laws.
                        </p>
                    </article>
                </section>
            </main>
            <Footer />
        </div>
    );
}
