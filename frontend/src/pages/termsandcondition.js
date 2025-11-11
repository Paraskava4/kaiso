"use client";
import { Footer } from "@/components";
import Breadcrumb from "@/components/pages/shared/Breadcrumb";
import Link from "next/link";
import React, { useState } from "react";

export default function TermsAndConditions() {
    const [selectedName, setSelectedName] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* <Header /> */}
            <div className="ps-41 pt-10">
                <Breadcrumb
                    items={[
                        { label: "Terms & Conditions", href: "/termsandcondition" },
                        ...(selectedName ? [{ label: selectedName, href: `/termsandcondition/${selectedName.toLowerCase().replace(/\s+/g, "-")}` }] : []),
                    ]}
                />
            </div>
            <main className="max-w-[88%] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="rounded-lg p-8 md:p-12">
                    <h1 className="text-3xl py-5 md:text-4xl text-center font-bold text-gray-900 mb-6">Terms and Conditions</h1>
                    {/* <p className="text-sm text-gray-500 mb-8">Last Updated: July 3, 2025</p> */}

                    <div className="prose prose-blue max-w-none">
                        <p className="text-gray-700 mb-6">
                            These Terms and Conditions (“License Terms”) govern your use of products and services (“Product(s)”) offered by{" "}
                            <strong className="list-disc mb-6 text-gray-600">Kaiso Research and Consulting LLP </strong>(“Kaiso Research,” “we,” “us,” or
                            “our”). By purchasing, accessing, or using our Product(s), you (“you,” “your,” “client,” “customer,” or “user”) agree to abide by
                            these License Terms in their entirety.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. License Grant and Restrictions</h2>
                        <p className="text-gray-600">
                            Kaiso Research grants you a non-transferable, non-exclusive, limited license to access and use the Product(s) solely for internal
                            business purposes. Depending on the license type selected at the time of purchase, usage rights may vary:
                        </p>
                        <ul className="list-disc pl-6 mb-6 text-gray-600">
                            <li>
                                <strong>Single-User License:</strong> Access granted to one named individual only.
                            </li>
                            <li>
                                <strong>Multi-User License:</strong> Access granted to a defined group of users within the same organisation (typically 2-5
                                users).
                            </li>
                            <li>
                                <strong>Enterprise License:</strong> Organisation-wide access across multiple users and departments within the purchasing
                                entity.
                            </li>
                        </ul>
                        <p className="text-gray-600">You are expressly prohibited from:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-600">
                            <li>Reproducing, reselling, distributing, or sublicensing the Product(s), in part or whole.</li>
                            <li>
                                Storing the Product(s) on shared drives or distributing them through public or internal networks unless explicitly licensed to
                                do so.
                            </li>
                            <li>Using our Product(s) in any legal proceeding, litigation, or regulatory filing without prior written consent.</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Payment Terms and Refund Policy</h2>
                        <p className="text-gray-600">
                            All payments for syndicated and customised reports must be made in full at the time of order placement. Prices quoted are exclusive
                            of applicable taxes, bank transfer fees, or shipping costs (if any).
                        </p>
                        <h3 className="text-xl font-medium text-gray-700 mt-6 mb-2">Refund Policy:</h3>
                        <p className="text-gray-600">
                            Due to the nature of the information services we provide, Kaiso Research maintains a strict no-refund policy once the content has
                            been delivered or accessed. Customers are advised to review samples, summaries, and the table of contents (TOC) before finalising
                            their purchase.
                        </p>
                        <h3 className="text-xl font-medium text-gray-700 mt-6 mb-2">Cancellation Policy:</h3>
                        <p className="text-gray-600">
                            Cancellations are not permitted once an order has been processed. For customised reports, cancellations post-confirmation of TOC
                            will not be honoured.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Product Usage Rights</h2>
                        <p className="text-gray-600">
                            All deliverables, including PDFs, Excel sheets, PowerPoints, and web-based dashboards, are licensed for use as per the scope defined
                            in the license type. Clients may cite or excerpt limited content (with proper attribution) in internal presentations or boardroom
                            discussions, but full-scale redistribution is not permitted without written authorisation. In case of breach of usage terms, Kaiso
                            Research reserves the right to suspend access, seek legal recourse, and/or impose penalties.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Delivery Timelines and Formats</h2>
                        <p className="text-gray-600">Upon receipt of full payment:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-600">
                            <li>
                                <strong>Syndicated Reports:</strong> Delivered within 12 to 24 business hours, if the report is available off-the-shelf and has
                                passed internal quality checks.
                            </li>
                            <li>
                                <strong>Customised Reports:</strong> Delivered as per mutually agreed timelines, post-TOC approval.
                            </li>
                        </ul>
                        <p className="text-gray-600">
                            Formats include PDF, Excel, PPT, or cloud-based dashboards, depending on client preferences. All digital files are delivered via
                            email to the registered client contact.
                        </p>
                        <p className="text-gray-600">For physical copies:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-600">
                            <li>Delivery charges are extra and vary by region.</li>
                            <li>Kaiso Research is not responsible for any damage during shipping.</li>
                            <li>Replacement, if deemed valid, is at the sole discretion of Kaiso Research.</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Ownership and Intellectual Property Rights</h2>
                        <p className="text-gray-600">
                            All copyrights, trademarks, data sets, analytical tools, graphics, report designs, and proprietary methodologies contained in the
                            Product(s) are the intellectual property of Kaiso Research and Consulting LLP. You acknowledge that:
                        </p>
                        <ul className="list-disc pl-6 mb-6 text-gray-600">
                            <li>You acquire no ownership rights in the Product(s).</li>
                            <li>You are only granted the right to use the Product(s) under the license agreed upon.</li>
                            <li>Unauthorised reproduction or distribution will result in legal action and may incur penalties.</li>
                        </ul>
                        <p className="text-gray-600">
                            In case of third-party infringement claims arising from your misuse, you agree to indemnify and hold harmless Kaiso Research.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Warranties and Limitation of Liability</h2>
                        <p className="text-gray-600">
                            <strong>Disclaimer:</strong> All Product(s) are provided on an “as is” and “as available” basis without warranties of any
                            kind—express or implied—including but not limited to merchantability, accuracy, reliability, or fitness for a particular purpose.
                        </p>
                        <p className="text-gray-600">We do not warrant that:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-600">
                            <li>The Product(s) will meet your expectations or business outcomes.</li>
                            <li>The Product(s) will be error-free, timely, and virus-free.</li>
                            <li>The data or forecasts will remain valid in perpetuity.</li>
                        </ul>
                        <p className="text-gray-600">
                            <strong>Limitation of Liability:</strong>
                        </p>
                        <ul className="list-disc pl-6 mb-6 text-gray-600">
                            <li>In no event shall Kaiso Research, its directors, employees, agents, or affiliates be liable for:</li>
                            <li>Any direct, indirect, incidental, or consequential damages;</li>
                            <li>Any loss of profits, business interruption, or loss of data;</li>
                            <li>Any costs arising from the procurement of substitute goods or services.</li>
                        </ul>
                        <p className="text-gray-600">
                            Kaiso Research shall not be liable for the use of our data in legal proceedings, including but not limited to civil, commercial,
                            bankruptcy, or criminal cases.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Confidentiality</h2>
                        <p className="text-gray-600">
                            All information shared with the client—including report drafts, methodologies, and communication—shall be treated as confidential
                            and may not be disclosed to third parties. Exceptions include:
                        </p>
                        <ul className="list-disc pl-6 mb-6 text-gray-600">
                            <li>Information already in the public domain.</li>
                            <li>Information independently developed or obtained without breaching this agreement.</li>
                            <li>Information disclosed under legal obligation.</li>
                        </ul>
                        <p className="text-gray-600">All parties must take reasonable measures to safeguard the confidentiality of shared materials.</p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Notices</h2>
                        <p className="text-gray-600">All formal notices between parties shall be sent to the respective contact person via:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-600">
                            <li>Registered courier or mail;</li>
                            <li>Email (with delivery confirmation);</li>
                            <li>Official correspondence on company letterhead.</li>
                        </ul>
                        <p className="text-gray-600">Kaiso Research's official contact details:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-600">
                            <li>Email: help@kaisoresearch.com</li>
                            <li>Phone: +1 872 219 0417</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9. Terms, Renewal, and Termination</h2>
                        <p className="text-gray-600">
                            These License Terms become effective on the date of order acceptance by Kaiso Research and remain valid until terminated by either
                            party.
                        </p>
                        <p className="text-gray-600">
                            <strong>Subscription-based Licenses:</strong>
                        </p>
                        <ul className="list-disc pl-6 mb-6 text-gray-600">
                            <li>Annual subscriptions commence from the Effective Date and automatically renew for successive 12-month periods.</li>
                            <li>Either party may terminate by providing a written notice 90 days in advance.</li>
                        </ul>
                        <p className="text-gray-600">Kaiso Research may terminate access immediately if the user:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-600">
                            <li>Breaches any clause of these Terms;</li>
                            <li>Fails to pay the agreed amount;</li>
                            <li>Misuses the licensed materials.</li>
                        </ul>
                        <p className="text-gray-600">Sections 2–7 and 11 shall survive termination.</p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10. Data Protection and GDPR Compliance</h2>
                        <p className="text-gray-600">
                            Kaiso Research is committed to protecting user data by India’s IT Act and the European Union’s General Data Protection Regulation
                            (GDPR), where applicable. Consent for marketing communications is taken in compliance with Article 7 of the GDPR. Users can opt out
                            of marketing communications at any time. Personal financial information once submitted cannot be withdrawn post-transaction. We do
                            not sell or disclose personal data to third parties without prior consent.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">11. Governing Law and Jurisdiction</h2>
                        <p className="text-gray-600">
                            These Terms shall be governed by and construed under the laws of the Republic of India. Any dispute arising out of or in connection
                            with these Terms shall fall under the exclusive jurisdiction of the courts in Madhya Pradesh, India, regardless of your location.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">12. Miscellaneous Provisions</h2>
                        <p className="text-gray-600">
                            <strong>Entire Agreement:</strong> These Terms, along with any order confirmation, constitute the entire agreement and supersede all
                            prior communications.
                        </p>
                        <p className="text-gray-600">
                            <strong>Assignment:</strong> You may not assign your rights under these Terms without written permission from Kaiso Research.
                        </p>
                        <p className="text-gray-600">
                            <strong>Waiver:</strong> Failure to enforce any right or provision shall not constitute a waiver.
                        </p>
                        <p className="text-gray-600">
                            <strong>Severability:</strong> If any clause is found to be invalid, the rest shall remain in force.
                        </p>
                        <p className="text-gray-600">
                            <strong>Equitable Relief:</strong> In the event of a breach, Kaiso Research may seek injunctive or equitable relief in addition to
                            monetary damages.
                        </p>

                        <p className="text-gray-600 mt-8">
                            For questions, clarifications, or legal concerns related to these Terms, please contact us at{" "}
                            <Link href="mailto:help@kaisoresearch.com" className="text-blue-600 hover:underline">
                                help@kaisoresearch.com
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
