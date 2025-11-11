

"use client";
import { Footer, Header } from "@/components";
import Breadcrumb from "@/components/pages/shared/Breadcrumb";
import Link from "next/link";
import React, { useState } from "react";
// import { Link } from "react-alice-carousel";

export default function Deliveryformats() {
    const [selectedName, setSelectedName] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="ps-36 pt-10">
                <Breadcrumb
                    items={[
                        { label: "Delivery Formats", href: "/deliveryformats" },
                        ...(selectedName ? [{ label: selectedName, href: `/deliveryformats/${selectedName.toLowerCase().replace(/\s+/g, "-")}` }] : []),
                    ]}
                />
            </div>
            <main className="max-w-[88%] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <section className=" rounded-lg p-8">
                    <h1 className="text-3xl text-center font-bold text-zinc-900 mb-6">Delivery Formats</h1>
                    {/* <p className="text-lg font-medium text-zinc-700 mb-8">Kaiso Research and Consulting LLP</p> */}

                    <article className="prose prose-zinc max-w-none">
                        <p className="text-base text-zinc-600 leading-relaxed mb-6">
                            At <strong>Kaiso Research and Consulting LLP</strong>, we are committed to delivering research outputs in a timely and professional
                            manner, aligned with the licensing terms and delivery expectations agreed upon at the time of purchase.
                        </p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">1. Delivery Timeline</h2>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed mb-6">
                            <li>
                                For <strong>off-the-shelf (syndicated) reports,</strong> delivery will be made within <strong>12 to 24 business hours</strong>{" "}
                                from the time of payment confirmation, following an internal quality assurance check.
                            </li>
                            <li>
                                For <strong>customized research,</strong> the delivery timeline will be as communicated by our representatives and agreed to by
                                the client before order confirmation. This timeline will be considered binding upon payment and approval of the final Terms of
                                Reference or Table of Contents (TOC).
                            </li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">2. Delivery Formats</h2>
                        <p className="text-base text-zinc-600 leading-relaxed mb-4">
                            Reports are delivered electronically in one or more of the following formats, depending on the <strong>license type</strong> and{" "}
                            <strong>purchase agreement:</strong>
                        </p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed mb-6">
                            <li>
                                <strong>PDF</strong> (standard delivery format for licensed users)
                            </li>
                            <li>
                                <strong>Excel</strong> (for data-intensive deliverables)
                            </li>
                            <li>
                                <strong>PowerPoint (PPT)</strong> (for presentations and executive summaries)
                            </li>
                            <li>
                                <strong>Cloud Access </strong>(for select digital licenses, enabling secured multi-user access)
                            </li>
                        </ul>
                        <p className="text-base text-zinc-600 leading-relaxed mb-6">
                            All deliverables will be sent to the <strong>official email address</strong> provided by the client during the order process.
                            Clients are responsible for ensuring that the email address is valid and monitored.
                        </p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">3. Hard Copy Requests</h2>
                        <p className="text-base text-zinc-600 leading-relaxed mb-4">
                            If clients require <strong>physical copies</strong> of the report, the following conditions will apply:
                        </p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed mb-6">
                            <li>
                                Additional <strong>shipping and handling charges</strong> will be levied based on the delivery destination and courier
                                preference.
                            </li>
                            <li>
                                Kaiso Research shall not be held liable for <strong>damage, delay, or loss</strong> of materials once the report has been
                                dispatched.
                            </li>
                            <li>
                                In case of any quality or condition issues upon receipt, the <strong>sole discretion</strong> to provide a replacement lies with
                                Kaiso Research, and such replacement, if approved, will be provided <strong>free of cost.</strong>
                            </li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">4. Syndicated vs. Customized Reports</h2>
                        <p className="text-base text-zinc-600 leading-relaxed mb-4">We offer two distinct types of deliverables:</p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed mb-6">
                            <li>
                                <strong>Syndicated Reports:</strong> These are published reports based on standardized TOCs and cover comprehensive datasets,
                                industry insights, and projections as per our internal research methodology.
                            </li>
                            <li>
                                <strong>Customized Reports:</strong> These are tailored to specific client requirements. The scope, structure, and timelines are
                                finalized post-mutual agreement and approval of the customized TOC. The client must{" "}
                                <strong>explicitly confirm acceptance</strong> of the customized scope before making the final payment.
                            </li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">5. Post-TOC Finalization Modifications</h2>
                        <p className="text-base text-zinc-600 leading-relaxed mb-4">
                            Once the custom <strong>TOC is finalized</strong> and payment is processed, the report will be developed and delivered within the
                            agreed timeline. However:
                        </p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed mb-6">
                            <li>
                                <strong>Any additional requests, changes in scope, or new data requirements</strong> post-finalization will be treated as{" "}
                                <strong>out-of-scope</strong> and subject to <strong>additional charges.</strong>
                            </li>
                            <li>
                                The client will be informed of the incremental costs and revised timelines, and work will proceed only after formal approval and
                                payment for the added scope.
                            </li>
                        </ul>

                        <p className="text-base text-zinc-600 leading-relaxed">
                            For any clarifications regarding report formats, delivery expectations, or customization options, clients are encouraged to contact
                            our support team at{" "}
                            <Link href="mailto:help@kaisoresearch.com" className="text-sky-500 hover:text-sky-600 underline">
                                help@kaisoresearch.com
                            </Link>{" "}
                            or call us at <strong>+1 872 219 0417</strong>.
                        </p>
                    </article>
                </section>
            </main>
            <Footer />
        </div>
    );
}
