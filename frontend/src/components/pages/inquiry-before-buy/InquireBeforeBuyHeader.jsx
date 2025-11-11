"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { Typography } from "@mui/material";

const InquireBeforeBuyHeader = ({ report }) => {
    if (!report) return null;

    const {
        image,
        title,
        reportCode,
        pages,
        license = "Single User", // Default to 'Single User' if not provided
    } = report;

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

    console.log("report", report);

    return (
        <div className="w-full bg-white border-b border-gray-200">
            <div className="mx-auto w-[83%] ">
                <article className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start p-4 sm:p-6 lg:py-2 text-base leading-relaxed rounded-lg">
                    {/* Image */}
                    {/* <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                        <Image src={image} alt={title} className="object-contain aspect-[0.83] w-[120px] sm:w-[150px]" width={150} height={180} quality={100} />
                    </div> */}

                    {/* Content */}
                    <div className="flex-1 w-full sm:min-w-0">
                        <header className="text-base sm:text-lg text-red-600 font-medium">Inquiry Before Buy</header>
                        {title && (
                            <Typography component="h1" sx={{ fontSize: "18px", fontWeight: 600 }}>
                                {title}
                            </Typography>
                        )}

                        {/* <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 items-start sm:items-center mt-3 sm:mt-4 text-[12px] text-zinc-700">
                            {reportCode && (
                                <div className="bg-white pr-3 py-1 rounded">
                                    <span className="text-zinc-1000 text-[12px] font-medium">Report Code: </span> {codeNumber}
                                </div>
                            )}
                            {(report?.author || report?.authorName || report?.createdBy || report?.writtenBy || report?.researcher) && (
                                <span className="py-1 rounded-md inline-block w-fit">
                                    <span className="text-zinc-1000 text-[12px] font-medium">Author Name: </span>
                                    <span className="text-zinc-700 text-[12px]">
                                        {report?.author || report?.authorName || report?.createdBy || report?.writtenBy || report?.researcher}
                                    </span>
                                </span>
                            )}
                            {report?.publishDate && (
                                <div className="bg-white px-3 py-1 rounded">
                                    <span className="text-zinc-1000  text-[12px] font-medium">Publication Date: </span>
                                    {report?.publishDate
                                        ? new Date(report?.publishDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                                        : "N/A"}
                                </div>
                            )}
                            {pages && (
                                <div className="bg-white px-3 py-1 rounded">
                                    <span className="text-zinc-1000 text-[12px] font-medium">Pages: </span> {pages}
                                </div>
                            )}
                        </div> */}

                        {/* <div className="mt-3 sm:mt-4 text-[12px] text-zinc-700">
                            License Type: <span className="text-[#163272] font-medium">{license}</span>
                        </div> */}
                    </div>
                </article>
            </div>
        </div>
    );
};

export default InquireBeforeBuyHeader;
