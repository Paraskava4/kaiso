"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useButtonNames } from "../../../hooks/useButtonNames";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";

const InquireBeforeBuySidemenu = ({ report, reportId, ...props }) => {
    const router = useRouter();
    const { redirect } = useRouteRedirect();

    // Fetch button names
    const { buttonNames, loading: buttonLoading, error: buttonError } = useButtonNames();
    const contactItems = [
        { icon: "/icons/Phone.webp", text: "+1 872 219 0417" },
        { icon: "/icons/Email.webp", text: "help@kaisoresearch.com", className: "mt-3 whitespace-nowrap" },
    ];

    console.log("report", report);

    return (
        <aside className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0">
            {/* Sample Request Section */}
            <section className="flex flex-col justify-start w-full font-medium bg-white border border-[0.5px] border-[color:var(--Steel-Gray-Scale-Black-150,#A9AAB0)]">
                <div className="flex flex-col justify-center px-4 sm:px-5 py-3 sm:py-4">
                    <h2 className="text-sm sm:text-base leading-relaxed text-zinc-900">GET A FREE SAMPLE</h2>
                    <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm leading-5 sm:leading-6 text-zinc-700">
                        This FREE sample includes market data points, ranging from trend analyses to market estimates & forecasts. See for yourself.
                    </p>
                </div>

                <div className="flex flex-col justify-center px-4 sm:px-5 py-2 sm:py-3 border-t border-b-[0.5px] border-b-[rgba(67,70,75,0.30)] bg-white">
                    <button
                        className="flex gap-2.5 justify-center items-center px-4 sm:px-5 py-2 w-full rounded-md text-sm sm:text-base text-white bg-sky-900"
                        onClick={() => redirect(`checkout?id=${report?.id || reportId || ""}`)}
                    >
                        <span>{buttonNames?.buyButton || "Buy Now"}</span>
                        <Image
                            src="/icons/Righte-Arrow.svg"
                            alt=""
                            className="w-4 sm:w-5 aspect-square object-contain"
                            width={100}
                            height={100}
                            quality={100}
                        />
                    </button>
                    <button
                        className="flex gap-2.5 justify-center items-center px-4 sm:px-5 py-2 w-full rounded-md text-sm sm:text-base text-white bg-blue-400 mt-2.5"
                        onClick={() => redirect(`report-store/${report?.sco?.url || props?.url}#sample`)}
                    >
                        <span>{buttonNames?.requestButton || "Request For Sample"}</span>
                    </button>
                </div>
            </section>

            {/* Contact Section */}
            <section className="flex flex-col justify-center p-4 sm:p-5 mt-4 w-full bg-white border border-[0.5px] border-[color:var(--Steel-Gray-Scale-Black-150,#A9AAB0)]">
                <div>
                    <h2 className="text-sm sm:text-base font-medium leading-relaxed text-zinc-900">Contact us</h2>
                </div>

                <address className="mt-2 space-y-2 not-italic text-xs sm:text-sm text-zinc-900">
                    {contactItems.map(({ icon, text, className = "" }) => (
                        <div key={text} className={`flex items-center gap-1.5 sm:gap-2 ${className}`}>
                            <Image
                                src={icon}
                                alt=""
                                className="w-5 sm:w-6 aspect-square object-contain filter invert-0 brightness-0"
                                width={100}
                                height={100}
                                quality={100}
                            />
                            <span>{text}</span>
                        </div>
                    ))}
                </address>
            </section>
        </aside>
    );
};

export default InquireBeforeBuySidemenu;
