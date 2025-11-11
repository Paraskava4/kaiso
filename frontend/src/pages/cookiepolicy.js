"use client";
import { Footer, Header } from "@/components";
import Breadcrumb from "@/components/pages/shared/Breadcrumb";
import Link from "next/link";
import React, { useState } from "react";
// import { Link } from "react-alice-carousel";

export default function cookiepolicy() {
    const [selectedName, setSelectedName] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="ps-36 pt-10">
                <Breadcrumb
                    items={[
                        { label: "Cookie Policy", href: "/cookiepolicy" },
                        ...(selectedName ? [{ label: selectedName, href: `/cookiepolicy/${selectedName.toLowerCase().replace(/\s+/g, "-")}` }] : []),
                    ]}
                />
            </div>
            <main className="max-w-[88%] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <section className=" rounded-lg p-8">
                    <h1 className="text-3xl text-center font-bold text-zinc-900 mb-6">Cookie Policy</h1>
                    {/* <p className="text-lg font-medium text-zinc-700 mb-4">Kaiso Research and Consulting LLP</p> */}
                    <div className="text-sm text-zinc-600 mb-8">
                        <p>
                            <strong>Effective Date:</strong> 3 July 2025
                        </p>
                        <p>
                            <strong>Last Updated:</strong> 3 July 2025
                        </p>
                    </div>

                    <article className="prose prose-zinc max-w-none">
                        <p className="text-base text-zinc-600 leading-relaxed mb-6">
                            <strong>Entity:</strong> Kaiso Research and Consulting LLP ("Kaiso," "we," "us," or "our")
                        </p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">1. Introduction</h2>
                        <p className="text-base text-zinc-600 leading-relaxed mb-6">
                            This Cookie Policy explains how <strong>Kaiso Research and Consulting LLP</strong> uses cookies and similar technologies to
                            recognise you when you visit our website at https://www.kaisoresearch.com ("Website"). It explains what these technologies are, why
                            we use them, and your rights to control our use of them.
                        </p>
                        <p className="text-base text-zinc-600 leading-relaxed mb-6">
                            By continuing to browse our site, you agree to our use of cookies by this policy, unless you have disabled them through your browser
                            settings.
                        </p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">2. What Are Cookies?</h2>
                        <p className="text-base text-zinc-600 leading-relaxed mb-4">
                            Cookies are small text files that are placed on your computer or mobile device when you visit a website. Cookies are widely used to
                            ensure websites function efficiently, as well as to provide information to website owners and enhance user experience.
                        </p>
                        <p className="text-base text-zinc-600 leading-relaxed mb-4">There are two types of cookies:</p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed mb-4">
                            <li>
                                <strong>First-party cookies:</strong> Set by the website you are visiting.
                            </li>
                            <li>
                                <strong>Third-party cookies:</strong> Set by a third party, such as analytics providers or advertisers.
                            </li>
                        </ul>
                        <p className="text-base text-zinc-600 leading-relaxed mb-4">Cookies can also be categorised as:</p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed mb-6">
                            <li>
                                <strong>Session Cookies:</strong> Expire when you close your browser.
                            </li>
                            <li>
                                <strong>Persistent Cookies:</strong> Remain on your device for a set period or until you delete them.
                            </li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">3. Why We Use Cookies</h2>
                        <p className="text-base text-zinc-600 leading-relaxed mb-4">We use cookies for a variety of reasons, including to:</p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed mb-6">
                            <li>Ensure the website operates efficiently.</li>
                            <li>Understand how users interact with our website.</li>
                            <li>Personalise content and remember your preferences.</li>
                            <li>Enable secure access to user accounts and transaction features.</li>
                            <li>Improve website performance and usability.</li>
                            <li>Conduct analytics and market research.</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">4. Types of Cookies We Use</h2>
                        <div className="overflow-x-auto mb-6">
                            <table className="min-w-full border border-zinc-300">
                                <thead className="bg-zinc-100">
                                    <tr>
                                        <th className="border border-zinc-300 px-4 py-2 text-left font-semibold text-zinc-900">Cookie Type</th>
                                        <th className="border border-zinc-300 px-4 py-2 text-left font-semibold text-zinc-900">Purpose</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-zinc-300 px-4 py-2 text-zinc-600">
                                            <strong>Strictly Necessary</strong>
                                        </td>
                                        <td className="border border-zinc-300 px-4 py-2 text-zinc-600">
                                            Essential for navigating the website and using core features.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-zinc-300 px-4 py-2 text-zinc-600">
                                            <strong>Performance Cookies</strong>
                                        </td>
                                        <td className="border border-zinc-300 px-4 py-2 text-zinc-600">
                                            Collect data on website usage to improve performance and usability.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-zinc-300 px-4 py-2 text-zinc-600">
                                            <strong>Functionality</strong>
                                        </td>
                                        <td className="border border-zinc-300 px-4 py-2 text-zinc-600">
                                            Remember choices (e.g., language, region) to enhance personalization.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-zinc-300 px-4 py-2 text-zinc-600">
                                            <strong>Analytics</strong>
                                        </td>
                                        <td className="border border-zinc-300 px-4 py-2 text-zinc-600">
                                            Used by tools such as Google Analytics to track visitor behaviour.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-zinc-300 px-4 py-2 text-zinc-600">
                                            <strong>Advertising</strong>
                                        </td>
                                        <td className="border border-zinc-300 px-4 py-2 text-zinc-600">
                                            Serve relevant ads based on your browsing history (if applicable).
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">5. Third-Party Cookies</h2>
                        <p className="text-base text-zinc-600 leading-relaxed mb-4">
                            Some content or applications on the Website are served by third parties, including advertisers, ad networks and servers, content
                            providers, and application providers. These third parties may use cookies to collect information about you when you use our website.
                        </p>
                        <p className="text-base text-zinc-600 leading-relaxed mb-4">
                            We currently use the following third-party services that may set cookies:
                        </p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed mb-6">
                            <strong>
                                <li>Google Analytics</li>
                                <li>LinkedIn Insights</li>
                                <li>Meta Pixel (Facebook)</li>
                                <li>YouTube embedded content</li>
                                <li>Stripe / PayPal (for payment processing)</li>
                            </strong>
                        </ul>
                        <p className="text-base text-zinc-600 leading-relaxed mb-6">You can review each provider's cookie policy on their official websites.</p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">6. Your Choices and Control Over Cookies</h2>
                        <p className="text-base text-zinc-600 leading-relaxed mb-4">
                            You have the right to decide whether to accept or reject cookies. Most web browsers automatically accept cookies, but you can
                            usually modify your browser settings to decline cookies if you prefer.
                        </p>
                        <p className="text-base text-zinc-600 leading-relaxed mb-4">You can:</p>
                        <ul className="list-disc pl-6 text-base text-zinc-600 leading-relaxed mb-6">
                            <li>Set your browser to block or alert you about cookies.</li>
                            <li>Delete cookies already stored on your device.</li>
                            <li>Use "Do Not Track" features on modern browsers (note: effectiveness may vary).</li>
                        </ul>
                        <p className="text-base text-zinc-600 leading-relaxed mb-6">
                            However, disabling certain cookies may limit your ability to use parts of our website, such as login areas, secure content, and
                            report downloads.
                        </p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">7. Consent for Cookies</h2>
                        <p className="text-base text-zinc-600 leading-relaxed mb-6">
                            On your first visit to our website, you will be shown a cookie consent banner. By clicking "Accept All Cookies," you consent to the
                            use of cookies as outlined in this policy. You can manage your preferences via the cookie settings link on our website.
                        </p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">8. Updates to This Policy</h2>
                        <p className="text-base text-zinc-600 leading-relaxed mb-6">
                            We may update this Cookie Policy from time to time in response to legal, technical, or operational changes. We encourage you to
                            revisit this page regularly to stay informed about our use of cookies and related technologies.
                        </p>

                        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">9. Contact Us</h2>
                        <p className="text-base text-zinc-600 leading-relaxed mb-4">
                            If you have any questions or concerns about our Cookie Policy or data practices, please contact:
                        </p>
                        <div className="text-base text-zinc-600 leading-relaxed">
                            <p>
                                <strong>Kaiso Research and Consulting LLP</strong>
                            </p>
                            <p>
                                Email:{" "}
                                <Link href="help@kaisoresearch.com" className="text-sky-500 hover:text-sky-600 underline">
                                    help@kaisoresearch.com
                                </Link>
                            </p>
                            <p>
                                Phone: <strong>+1 872 219 0417</strong>
                            </p>
                            <p>
                                Website:{" "}
                                <Link href="www.kaisoresearch.com" className="text-sky-500 hover:text-sky-600 underline">
                                    www.kaisoresearch.com{" "}
                                </Link>
                            </p>
                        </div>
                    </article>
                </section>
            </main>
            <Footer />
        </div>
    );
}
