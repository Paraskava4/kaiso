"use client";
import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../shared/Breadcrumb";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useScrollPosition, useClientOnly } from "../../../hooks/useClientOnly";
import { useButtonNames } from "../../../hooks/useButtonNames";
import { useDispatch } from "react-redux";
import { resetAuthor, setAuthor } from "@/redux/metaSlice";
import Link from "next/link";

const ReportHeader = ({ report }) => {
    const [breadcrumbTitle, setBreadcrumbTitle] = useState(null);
    const [breadcrumbCategory, setBreadcrumbCategory] = useState(null);
    const router = useRouter();

    // Scroll position for sticky header
    const isClient = useClientOnly();
    const scrollY = useScrollPosition();
    const showStickyHeader = isClient && scrollY > 350;

    // Fetch button names
    const { buttonNames, loading: buttonLoading, error: buttonError } = useButtonNames();

    useEffect(() => {
        const title = localStorage.getItem("reportBreadcrumbTitle");
        const category = localStorage.getItem("reportBreadcrumbCategory");

        setBreadcrumbTitle(title || null);
        setBreadcrumbCategory(category || null);
    }, []);

    if (!report) return null;
    console.log(".....................................................", report);

    const { image, title, reportSubTitle, _id, reportCode, pages, availableFormats, publishDate, license = "Single User" } = report;

    // Prioritize subtitle over title for display
    const displayTitle = reportSubTitle || title;

    const codeNumber = useMemo(() => {
        // if (pageType && !pageSlug && !pageSubSlug) {
        //     return reportNo;
        // } else if (pageType && pageSlug && !pageSubSlug) {
        //     return report?.categoryId?.code ? `${report?.categoryId?.code}_${reportNo}` : reportNo;
        // } else if (pageType && pageSlug && pageSubSlug) {
        //     return report?.subCategoryId?.code ? `${report?.subCategoryId?.code}_${reportNo}` : reportNo;
        // } else
        if (report?.sco?.subCategoryId?.code) {
            return `${report?.sco?.subCategoryId?.code}${reportCode}`;
        } else if (report?.sco?.categoryId?.code) {
            return `${report?.sco?.categoryId?.code}${reportCode}`;
        }
        return reportCode; // Fallback
    }, [reportCode, report?.sco?.categoryId?.code, report?.sco?.subCategoryId?.code]);

    // Click handlers for sticky header buttons
    const handleBuyNow = () => {
        if (report?.id || report?._id) {
            const reportId = report.id || report._id;
            router.push(`/checkout?id=${reportId}`);
        }
    };

    const handleRequestSample = () => {
        // Get current URL and add tabName=sample parameter
        const currentUrl = window.location.pathname + window.location.search;
        const url = new URL(window.location.href);
        url.searchParams.set("tabName", "sample");
        router.push(`/report-details?reportId=${_id}&sample=1#sample`);
    };

    // Sticky Header Component
    const StickyReportHeader = () => (
        <div
            className={`fixed top-0 left-0 right-0 bg-white shadow-md transition-all duration-300 ease-in-out ${
                showStickyHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
            }`}
            style={{
                zIndex: 1001, // Higher than main header
                height: "74px",
                padding: "12px 0px",
            }}
        >
            <div className="max-w-[86.7%] mx-auto px-4 sm:px-6 lg:px-10 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Left: KAISO Logo */}
                    <div className="flex items-center">
                        {/* <a href="/">
                            <Image
                                src="/icons/loogo.svg"
                                alt="KAISO Research and Consulting"
                                width={210}
                                height={50}
                                className="object-contain hidden sm:block"
                                quality={100}
                            />
                        
                            <Image src="/icons/loogo.svg" alt="KAISO" width={110} height={50} className="object-contain block sm:hidden" quality={100} />
                        </a> */}
                        <Link href="/">
                            <Image
                                src="/icons/loogo.svg"
                                alt="KAISO Research and Consulting"
                                width={207}
                                height={50}
                                sizes="(max-width: 640px) 110px, 210px"
                                className="object-contain"
                                priority
                                quality={100}
                            />
                        </Link>
                    </div>

                    {/* Center: Report Title and Details */}
                    <div className="flex-1 mx-4 sm:mx-8 min-w-0">
                        <h2 className="text-[16px] font-semibold text-zinc-900 truncate leading-tight">{displayTitle}</h2>
                        <div className="hidden sm:flex items-center gap-6 text-xs text-gray-600 mt-1">
                            <span>
                                Publication Date:{" "}
                                {publishDate ? new Date(publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                            </span>
                            <span>Pages: {pages}</span>
                        </div>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <button
                            onClick={handleBuyNow}
                            className="bg-sky-900 hover:bg-sky-800 text-white px-3 sm:px-5 py-1 sm:py-2.5 rounded text-xs sm:text-sm font-medium transition-colors flex items-center gap-1"
                            aria-label="Buy Now - Purchase the full market research report"
                        >
                            <span className="hidden sm:inline">{buttonNames?.buyButton || "Buy Now"}</span>
                            <span className="sm:hidden">{buttonNames?.buyButton?.split(" ")[0] || "Buy"}</span>
                            {/* <span className="text-xs ">→</span> */}
                        </button>
                        <button
                            onClick={handleRequestSample}
                            className="bg-sky-400 hover:bg-sky-500 text-white px-3 sm:px-5 py-1 sm:py-2.5 rounded text-xs sm:text-sm font-medium transition-colors"
                            aria-label="Request for sample - Get a free sample of this report"
                        >
                            <span className="hidden sm:inline">{buttonNames?.requestButton || "Request for sample"}</span>
                            <span className="sm:hidden">{buttonNames?.requestButton?.split(" ")[0] || "Sample"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    const dispatch = useDispatch();

    useEffect(() => {
        if (report?.author || report?.authorName) {
            dispatch(setAuthor(report.author || report.authorName));
        } else {
            dispatch(resetAuthor());
        }

        return () => {
            dispatch(resetAuthor()); // reset when leaving page
        };
    }, [report, dispatch]);

    return (
        <div className="w-[85%] mx-auto">
            {/* Sticky Header */}
            <StickyReportHeader />

            <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-sm text-gray-500">
                <div className="w-[100%] mx-auto">
                    {/* <Breadcrumb
                        items={[
                            { label: "Reports", href: "/report" },
                            ...(categoryUrl
                                ? [
                                    {
                                        label: categoryUrl,
                                        href: "/report/" + categoryUrl.toLowerCase().replace(/\s+/g, "-"),
                                    },
                                ]
                                : []),
                            ...(breadcrumbTitle
                                ? [
                                    {
                                        label: breadcrumbTitle.length > 20 ? `${breadcrumbTitle.slice(0, 20)}...` : breadcrumbTitle,
                                        href: "/report/" + breadcrumbTitle.toLowerCase().replace(/\s+/g, "-"),
                                    },
                                ]
                                : []),
                        ]}
                    /> */}
                    <Breadcrumb
                        items={[
                            { label: "Report-store", href: "/report-store" },
                            ...(report?.sco?.categoryId
                                ? [
                                      {
                                          label: report.sco.categoryId.name,
                                          href: `/report-store/${report.sco.categoryId.url}`,
                                      },
                                  ]
                                : []),
                            ...(report?.sco?.subCategoryId
                                ? [
                                      {
                                          label: report.sco.subCategoryId.name,
                                          href: `/report-store/${report.sco.categoryId?.url}/${report.sco.subCategoryId.url}`,
                                      },
                                  ]
                                : []),
                            // ...(report?.title
                            //     ? [
                            //         {
                            //             label:
                            //                 report.title.length > 20
                            //                     ? `${report.title.slice(0, 20)}...`
                            //                     : report.title,
                            //             href: `/report/${report.sco.categoryId?.url}/${report.sco.subCategoryId?.url}/${report.title
                            //                 .toLowerCase()
                            //                 .replace(/\s+/g, "-")
                            //                 .replace(/[^\w-]/g, "")}`,
                            //         },
                            //     ]
                            //     : []),
                        ]}
                    />
                </div>
            </div>
            <header className="w-full bg-white border-b border-gray-200">
                <div className="w-[100%] mx-auto px-4 sm:px-6 lg:px-8 pb-3">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                        {/* Image */}
                        <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                            <Image
                                src={image}
                                alt={`Report image for ${displayTitle}`}
                                width={150}
                                height={180}
                                className="object-contain aspect-[0.83] w-[85px] sm:w-[85px]"
                                quality={100}
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 w-full sm:min-w-0">
                            <h1
                                style={{ fontWeight: "600" }}
                                className="text-sm sm:text-[18px] md:text-[18px] lg:text-[18px] xl:text-[18px] 2xl:text-[18px] font-[600] leading-[160%] text-zinc-900 mb-3 sm:mb-4"
                            >
                                {title}
                            </h1>

                            {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-6 gap-2 text-sm sm:text-base text-black ">
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6" style={{ fontSize: "14px" }}>
                                    <span className="py-1 rounded-md inline-block w-fit">{report?.sco?.categoryId?.name || ""}</span>
                                    <span className="py-1 rounded-md inline-block w-fit">{report?.sco?.subCategoryId?.name || ""}</span>
                                </div>
                            </div> */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-6 gap-2 text-sm sm:text-base text-black ">
                                {/* Left Section: Report Code, Pages & Author */}
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                                    <span className="py-1 rounded-md inline-block w-fit">
                                        <span className="text-zinc-1000 text-[12px] font-medium">Report Code: </span>{" "}
                                        <span className="text-zinc-700 text-[12px]">{codeNumber}</span>
                                    </span>
                                    {(report?.author || report?.authorName || report?.createdBy || report?.writtenBy || report?.researcher) && (
                                        <span className="py-1 rounded-md inline-block w-fit">
                                            <span className="text-zinc-1000 text-[12px] font-medium">Author Name: </span>
                                            <span className="text-zinc-700 text-[12px]">
                                                {report?.author || report?.authorName || report?.createdBy || report?.writtenBy || report?.researcher}
                                            </span>
                                        </span>
                                    )}
                                    <span className="py-1 rounded-md inline-block w-fit">
                                        <span className="text-zinc-1000  text-[12px] font-medium">Publication Date: </span>
                                        <span className="text-zinc-700 text-[12px]">
                                            {publishDate ? new Date(publishDate).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "N/A"}
                                        </span>
                                    </span>
                                    <span className="py-1 rounded-md inline-block w-fit">
                                        <span className="text-zinc-1000 text-[12px] font-medium">Pages: </span>{" "}
                                        <span className="text-zinc-700 text-[12px]">{pages}</span>
                                    </span>
                                    {/* Author Name - Conditional rendering */}
                                </div>

                                {/* Right Section: Available In */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-black text-[12px] sm:text-base">
                                        <span className="text-zinc-1000  text-[12px] font-medium">Available In:</span>
                                    </span>
                                    <div className="flex gap-2">
                                        {/* {availableFormats.map((format, index) => ( */}
                                        <Image
                                            // key={index}
                                            src={"/icons/Publish-Formate3.svg"}
                                            width={20}
                                            height={20}
                                            // alt={`Format ${index + 1}`}
                                            className="object-contain w-5 h-5"
                                            quality={100}
                                        />
                                        <Image
                                            // key={index}
                                            src={"/icons/Publish-Formate1.svg"}
                                            width={20}
                                            height={20}
                                            // alt={`Format ${index + 1}`}
                                            className="object-contain w-5 h-5"
                                            quality={100}
                                        />
                                        <Image
                                            // key={index}
                                            src={"/icons/Publish-Formate2.svg"}
                                            width={20}
                                            height={20}
                                            // alt={`Format ${index + 1}`}
                                            className="object-contain w-5 h-5"
                                            quality={100}
                                        />
                                        {/* ))} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default ReportHeader;
