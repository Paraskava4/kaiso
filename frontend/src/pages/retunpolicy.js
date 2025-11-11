"use client";
import { Footer } from "@/components";
import Breadcrumb from "@/components/pages/shared/Breadcrumb";
import Link from "next/link";
// import Link from "daisyui/components/link";

import React, { useState } from "react";
// import { Link } from "react-alice-carousel";

export default function ReturnPolicy() {
    const [selectedName, setSelectedName] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* <Header /> */}
            <div className="ps-39 pt-10">
                <Breadcrumb
                    items={[
                        { label: "Return and Refund Policy", href: "/retunpolicy" },
                        ...(selectedName ? [{ label: selectedName, href: `/retunpolicy/${selectedName.toLowerCase().replace(/\s+/g, "-")}` }] : []),
                    ]}
                />
            </div>
            <main className="max-w-[88%]  mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <section className=" rounded-lg p-8">
                    <h1 className="text-3xl text-center py-8 font-bold text-zinc-900 mb-6">Return and Refund Policy</h1>
                    <p className="text-lg font-medium text-zinc-700 mb-8">Kaiso Research and Consulting LLP</p>

                    <article className="prose prose-zinc max-w-none">
                        <p className="text-base text-zinc-600 leading-relaxed">
                            By proceeding with a purchase from Kaiso Research and Consulting LLP (“Kaiso Research”), the client agrees to all applicable terms,
                            including our{" "}
                            <Link href="/termsandcondition" className="text-sky-500 hover:text-sky-600 underline">
                                Terms & Conditions
                            </Link>
                            ,{" "}
                            <Link href="/privacypolicy" className="text-sky-500 hover:text-sky-600 underline">
                                Privacy Policy
                            </Link>
                            , GDPR Policy, Disclaimer, and this Return and Refund Policy, as stated on our website and reiterated in the invoice. Payment may be
                            made via credit card, PayPal, Stripe, or bank/wire transfer. Clients are responsible for any applicable taxes, customs duties, or
                            related charges.
                        </p>

                        <p className="text-base text-zinc-600 leading-relaxed mt-6">
                            All deliverables—reports, presentations, datasets, or consulting outputs are provided in digital formats (PDF, Excel, Word,
                            PowerPoint, or cloud access). Due to the intangible, consumable, and replicable nature of digital products, all purchases are final.
                            Once a report or service is delivered, it is considered accessed and cannot be returned. Accordingly, refunds are not permitted
                            under any circumstances after delivery.
                        </p>

                        <p className="text-base text-zinc-600 leading-relaxed mt-6">
                            This policy exists to protect the confidentiality, proprietary value, and intellectual property contained in our deliverables.
                            Clients are encouraged to carefully review the scope, sample pages, and any queries with our team prior to purchase.
                        </p>

                        <p className="text-base text-zinc-600 leading-relaxed mt-6">
                            In the rare case that a report contains missing or incomplete data within the agreed scope, we will provide reasonable customisation
                            or correction to address the issue at no additional cost. If you have any doubts or questions about the purchase, we strongly
                            recommend contacting our support or sales team before completing the transaction.
                        </p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Contact Us</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            For questions or concerns regarding this Return and Refund Policy, please contact:
                        </p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>
                                Email:{" "}
                                <Link href="mailto:help@kaisoresearch.com" className="text-sky-500 hover:text-sky-600 underline">
                                    help@kaisoresearch.com
                                </Link>
                            </li>
                            <li>Phone: +1 872 219 0417</li>
                        </ul>
                    </article>
                </section>
            </main>
            <Footer />
        </div>
    );
}
