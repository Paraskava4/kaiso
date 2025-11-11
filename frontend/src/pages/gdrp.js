"use client";
import { Footer } from "@/components";
import Breadcrumb from "@/components/pages/shared/Breadcrumb";
import Link from "next/link";
import React, { useState } from "react";
// import { Link } from "react-alice-carousel";

export default function gdrp() {
    const [selectedName, setSelectedName] = useState(null);

    return (
        <div classNamex="min-h-screen bg-gray-50">
            {/* <Header /> */}
            <div className="ps-36 pt-10">
                <Breadcrumb
                    items={[
                        { label: "GDPR Policy", href: "/gdrp" },
                        ...(selectedName ? [{ label: selectedName, href: `/gdrp/${selectedName.toLowerCase().replace(/\s+/g, "-")}` }] : []),
                    ]}
                />
            </div>
            <main className="max-w-[88%] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <section className=" rounded-lg p-8">
                    <h1 className="text-3xl text-center font-bold text-zinc-900 mb-6">General Data Protection Regulation (GDPR) Compliance Policy</h1>
                    <p className="text-lg font-medium text-zinc-700 mb-4">Kaiso Research and Consulting LLP</p>
                    <p className="text-sm text-zinc-600 mb-8">Last updated: 2 July 2025</p>

                    <article className="prose prose-zinc max-w-none">
                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Introduction</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            In today's global digital economy, personal data is created, shared, and stored at an unprecedented scale. As a firm engaged in
                            market intelligence, consulting, and data licensing, <strong>Kaiso Research and Consulting LLP</strong> acknowledges the critical
                            importance of safeguarding personal information and upholding the principles of responsible data governance.
                        </p>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            In alignment with the <strong>General Data Protection Regulation (GDPR)</strong> enforced across the European Union since{" "}
                            <strong>25 May 2018,</strong> we have instituted comprehensive measures to ensure lawful, transparent, and accountable processing of
                            personal data. This commitment applies to all personal data we handle, irrespective of the country or platform from which it is
                            collected or processed.
                        </p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Our Commitment to GDPR Compliance</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            At Kaiso Research and Consulting LLP ("Kaiso", "we", "our", or "us"), we are committed to maintaining high standards of data
                            privacy, security, and ethical handling of personal information. Whether working with enterprise clients, research respondents, or
                            digital audiences, we strive to process all personal data in compliance with applicable laws, including the GDPR,{" "}
                            <strong>India's data protection regulations,</strong> and other international frameworks.
                        </p>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            Our privacy and compliance efforts are rooted in transparency, accountability, and respect for individual rights.
                        </p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Scope of Applicability</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">This GDPR Policy applies to:</p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>
                                Data subjects located within the <strong>European Economic Area (EEA)</strong>
                            </li>
                            <li>Clients and users of our services worldwide whose data is collected, processed, or transferred by us or on our behalf</li>
                            <li>All employees, partners, service providers, and contractors working with or on behalf of Kaiso</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Key Areas of GDPR Alignment</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            Kaiso Research and Consulting LLP has adopted the following steps to support GDPR compliance and responsible data practices:
                        </p>

                        <h3 className="text-xl font-medium text-zinc-800 mt-6 mb-3">1. Data Processing & Security Controls</h3>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>
                                We continuously refine our <strong>information security policies,</strong> aligned with best practices in encryption, access
                                control, and breach prevention.
                            </li>
                            <li>Our internal systems and procedures minimise unauthorised access, disclosure, or modification of personal data.</li>
                        </ul>

                        <h3 className="text-xl font-medium text-zinc-800 mt-6 mb-3">2. Privacy Impact & Gap Assessments</h3>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            We conduct regular data privacy audits and risk assessments to evaluate our compliance posture and ensure readiness for regulatory
                            obligations.
                        </p>

                        <h3 className="text-xl font-medium text-zinc-800 mt-6 mb-3">3. Customer Support for GDPR Readiness</h3>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>We offer guidance to clients on data governance, data usage rights, and proper disclosures in line with GDPR standards.</li>
                            <li>Contractual amendments are implemented to reflect GDPR requirements for joint controllers or processors where applicable.</li>
                        </ul>

                        <h3 className="text-xl font-medium text-zinc-800 mt-6 mb-3">4. Data Subject Rights Enablement</h3>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            Kaiso supports the exercise of <strong>GDPR rights,</strong> including:
                        </p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>Right to Access</li>
                            <li>Right to Rectification</li>
                            <li>Right to Erasure (Right to be Forgotten)</li>
                            <li>Right to Restrict Processing</li>
                            <li>Right to Data Portability</li>
                            <li>Right to Object</li>
                            <li>Rights related to Automated Decision Making and Profiling</li>
                        </ul>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            We provide mechanisms to submit, verify, and respond to such requests within GDPR-defined timeframes.
                        </p>

                        <h3 className="text-xl font-medium text-zinc-800 mt-6 mb-3">5. Consent Management</h3>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>
                                All consents obtained for data processing are <strong>freely given, specific, informed, and unambiguous.</strong>
                            </li>
                            <li>
                                We maintain time-stamped audit trails and provide data subjects with <strong>easy opt-out mechanisms.</strong>
                            </li>
                        </ul>

                        <h3 className="text-xl font-medium text-zinc-800 mt-6 mb-3">6. Third-Party Engagement & Data Transfers</h3>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            When transferring data across borders (including outside the EEA), we implement <strong>appropriate safeguards</strong> such as:
                        </p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>Standard Contractual Clauses (SCCs)</li>
                            <li>Data Processing Agreements (DPAs)</li>
                            <li>Due diligence on third-party sub-processors</li>
                        </ul>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            Use of third-party platforms (e.g., Zoom, Google Forms, analytics tools) is governed by strict data-sharing protocols and compliance
                            checks.
                        </p>

                        <h3 className="text-xl font-medium text-zinc-800 mt-6 mb-3">7. Breach Notification Protocol</h3>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            In the event of a data breach affecting EEA residents, we have in place an <strong>incident response protocol</strong> that includes
                            timely notification to relevant supervisory authorities and affected individuals, by Articles 33 and 34 of the GDPR.
                        </p>

                        <h3 className="text-xl font-medium text-zinc-800 mt-6 mb-3">8. Employee Training & Awareness</h3>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>
                                All Kaiso personnel undergo <strong>mandatory GDPR training,</strong> with annual refreshers covering personal data handling,
                                consent rules, breach reporting, and data subject rights.
                            </li>
                            <li>New hires receive training during onboarding, specific to their roles in sales, research, IT, or project delivery.</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Our Ongoing GDPR Journey</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            Compliance is not a one-time activity; it is an ongoing effort. Kaiso Research and Consulting LLP maintains a{" "}
                            <strong>dedicated privacy compliance team</strong> that oversees our GDPR initiatives, ensures alignment with evolving regulations,
                            and fosters a culture of accountability.
                        </p>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            We recognise that protecting personal data is a shared responsibility. We encourage our clients and partners to implement strong
                            data practices in alignment with their legal obligations.
                        </p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Your Rights and How to Contact Us</h2>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            If you are a data subject protected by the GDPR and wish to exercise any of your rights under the Regulation, or if you have
                            questions about how your data is processed, please contact our Privacy Team at:
                        </p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed">
                            <li>
                                Email:{" "}
                                <Link href="mailto:help@kaisoresearch.com" className="text-sky-500 hover:text-sky-600 underline">
                                    help@kaisoresearch.com
                                </Link>
                            </li>
                            <li>
                                Phone: <strong>+1 872 219 0417</strong>
                            </li>
                        </ul>
                        <p className="text-base text-zinc-600 leading-relaxed">
                            We will respond to all legitimate requests within <strong>one month</strong> by GDPR Article 12. For complex or multiple requests,
                            this period may be extended by two additional months.
                        </p>
                    </article>
                </section>
            </main>
            <Footer />
        </div>
    );
}
