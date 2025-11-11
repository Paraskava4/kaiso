"use client";
import { Footer } from "@/components";
import Breadcrumb from "@/components/pages/shared/Breadcrumb";
import Link from "next/link";
import React, { useState } from "react";

export default function PrivacyPolicyPage() {
    const [selectedName, setSelectedName] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* <Header /> */}
            <div className="ps-36 pt-10">
                <Breadcrumb
                    items={[
                        { label: "Privacy Policy", href: "/privacypolicy" },
                        ...(selectedName ? [{ label: selectedName, href: `/privacypolicy/${selectedName.toLowerCase().replace(/\s+/g, "-")}` }] : []),
                    ]}
                />
            </div>
            <main className="max-w-[88%] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <section className=" rounded-lg p-8">
                    <h1 className="text-3xl text-center font-bold text-zinc-900 mb-6">Privacy Policy</h1>
                    <p className="text-lg font-medium text-zinc-700 mb-4">Kaiso Research and Consulting LLP</p>
                    {/* <p className="text-sm text-zinc-600 mb-8">Last Updated: 2 July 2025</p> */}

                    <article className="prose prose-zinc max-w-none">
                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">1. Introduction</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            At Kaiso Research and Consulting LLP (“Kaiso,” “we,” “us,” or “our”), we are committed to protecting the privacy and personal data
                            of our clients, research participants, partners, and website users. This Privacy Policy explains how we collect, use, disclose, and
                            safeguard your information when you interact with our websites, services, platforms, or communications, whether online or offline.
                        </p>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            As a research and consulting firm operating in a digital-first, data-driven environment, we align our practices with global privacy
                            regulations, including the EU General Data Protection Regulation (GDPR), the Information Technology Act, 2000 (India), and other
                            applicable regional laws.
                        </p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">2. Information We Collect</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            We may collect and process different categories of personal and professional information depending on your engagement with us. This
                            includes, but is not limited to:
                        </p>
                        <h3 className="text-xl font-medium text-zinc-800 mt-6 mb-3">a. Personal Information</h3>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>Name, job title, email address, phone number, company name</li>
                            <li>Billing and payment information (when purchasing reports or subscriptions)</li>
                            <li>Geolocation and communication preferences</li>
                        </ul>
                        <h3 className="text-xl font-medium text-zinc-800 mt-6 mb-3">b. Business Information</h3>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>Survey responses (quantitative and qualitative)</li>
                            <li>Company-specific or sectoral data shared for custom research projects</li>
                            <li>Transaction and communication history</li>
                        </ul>
                        <h3 className="text-xl font-medium text-zinc-800 mt-6 mb-3">c. Automatically Collected Data</h3>
                        <p className="text-base text-zinc-600 leading-relaxed">When you interact with our website, we may automatically collect:</p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>IP address, device type, browser type</li>
                            <li>Pages visited, time spent, referring URLs</li>
                            <li>Cookies and session data</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">3. How We Use Your Information</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">We collect and use your data for the following purposes:</p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>To process orders, inquiries, or service requests</li>
                            <li>To conduct B2B market research, surveys, and consulting engagements</li>
                            <li>To improve our website and user experience</li>
                            <li>To personalise content, emails, and service recommendations</li>
                            <li>To comply with legal obligations, internal audits, or regulatory requests</li>
                            <li>To maintain communication regarding your account, transactions, or updates</li>
                            <li>We do not sell or rent personal data to third parties.</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">4. Legal Basis for Processing</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            Where applicable under GDPR, our lawful bases for collecting and processing personal data include:
                        </p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>
                                <strong>Consent</strong> – You have given clear permission for us to process your data for a specific purpose.
                            </li>
                            <li>
                                <strong>Contractual Necessity</strong> – Processing is required to fulfil a contract or pre-contractual request.
                            </li>
                            <li>
                                <strong>Legal Obligation</strong> – Processing is necessary to comply with applicable law.
                            </li>
                            <li>
                                <strong>Legitimate Interest</strong> – Processing is necessary for our business functions, such as research analysis or customer
                                communication, and does not override your rights.
                            </li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">5. Use of Cookies and Tracking Technologies</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            Kaiso uses cookies, pixels, and other tracking technologies to enhance your experience and improve our services. Cookies help us:
                        </p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>Understand how users interact with our content</li>
                            <li>Remember login details and preferences</li>
                            <li>Provide tailored recommendations or reminders</li>
                        </ul>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            You may choose to disable cookies in your browser settings. However, this may limit some functionality of our website.
                        </p>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            For more details, please refer to our full{" "}
                            <Link href="/cookie-policy" className="text-sky-500 hover:text-sky-600 underline">
                                Cookie Policy
                            </Link>{" "}
                            (available upon request).
                        </p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">6. Data Sharing and Third Parties</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">We may share data with:</p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>Trusted service providers (e.g., cloud hosts, analytics vendors, marketing platforms)</li>
                            <li>Research partners or clients (only anonymised or aggregated data, unless explicitly consented)</li>
                            <li>Legal or regulatory bodies (when required by law)</li>
                        </ul>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            All third-party vendors are bound by strict data protection agreements and confidentiality clauses.
                        </p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">7. Data Storage and Retention</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            All data is securely stored on servers with industry-standard encryption and access control measures. Personal data is retained:
                        </p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>For as long as necessary to fulfil the purpose for which it was collected</li>
                            <li>To meet legal, contractual, or regulatory obligations</li>
                            <li>Or until a valid request for erasure is received (see Section 9)</li>
                        </ul>
                        <p className="text-base text-zinc-600 leading-relaxed">Data is reviewed periodically for accuracy and relevance.</p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">8. International Data Transfers</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            Where data is transferred outside India or the EEA (European Economic Area), we ensure such transfers comply with data protection
                            requirements through:
                        </p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>Standard Contractual Clauses (SCCs)</li>
                            <li>Data Processing Agreements (DPAs)</li>
                            <li>Secure encryption protocols</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">9. Your Rights Under GDPR and Applicable Laws</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            If you are located within the EEA or under jurisdictions with data protection laws, you may have the right to:
                        </p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>Access your data</li>
                            <li>Rectify incorrect or incomplete data</li>
                            <li>Delete your data (“Right to be Forgotten”)</li>
                            <li>Restrict or object to processing</li>
                            <li>Data portability</li>
                            <li>Withdraw consent at any time</li>
                            <li>Complain to a supervisory authority</li>
                        </ul>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            To exercise any of these rights, please contact us at{" "}
                            <Link href="mailto:help@kaisoresearch.com" className="text-sky-500 hover:text-sky-600 underline">
                                help@kaisoresearch.com
                            </Link>
                            .
                        </p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">10. Data Security Measures</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">We implement multi-layered data protection mechanisms, including:</p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>Role-based access controls</li>
                            <li>Data encryption (in transit and at rest)</li>
                            <li>Secure payment gateways (e.g., PayPal, Stripe)</li>
                            <li>Two-factor authentication</li>
                            <li>Regular vulnerability scans and audits</li>
                            <li>Staff training in cybersecurity and data protection protocols</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">11. Links to Third-Party Sites</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            Our website or services may contain links to external websites. We are not responsible for the privacy practices, content, or
                            security of these third-party sites. We recommend reviewing their privacy policies before providing any personal information.
                        </p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">12. Policy Updates and Modifications</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            We may update this Privacy Policy periodically to reflect legal or operational changes. The updated version will be posted on our
                            website with a revised “Last Updated” date. Continued use of our services after any modification constitutes your acceptance of the
                            revised policy.
                        </p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">13. Contact Us</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            For questions, concerns, or requests related to this Privacy Policy or your data:
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
