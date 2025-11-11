import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { generateUrlPath } from "../../../utils/navbarTransform";

const ReportCard = ({ image, title = "", subtitle = "", alt = "Report image", report, reportTitle }) => {
    const router = useRouter();

    // Generate slug from report title or use existing report data
    const getReportSlug = () => {
        if (report?.url) {
            return report.url;
        }
        if (reportTitle) {
            return generateUrlPath(reportTitle);
        }
        if (title) {
            return generateUrlPath(title);
        }
        // Fallback to ID if no title available
        return report;
    };

    const reportSlug = getReportSlug();

    return (
        <div
            onClick={() => router.push(`/report-store/${reportSlug}`)}
            className="group relative w-full aspect-[39/42] cursor-pointer overflow-hidden"
        >
            <Image
                src={image}
                alt={alt}
                width={390}
                height={420}
                quality={100}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full h-full object-cover transition-transform duration-600 ease-in-out group-hover:scale-105"
            />

            {/* White overlay */}
            <div
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out z-[5]"
            ></div>

            {/* Text content */}
            <div className="absolute top-0 left-0 right-0 p-[30px] z-10">
                <p
                    className="font-inter text-lg font-semibold leading-[160%] mb-2 text-white group-hover:text-[#17306E] transition-colors duration-500 ease-out"
                >
                    {title}
                </p>
                <p
                    className="font-inter text-sm font-normal leading-[150%] m-0 text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out group-hover:text-zinc-700 line-clamp-3"
                >
                    {subtitle}
                </p>
            </div>

            {/* Arrow */}
            <div
                className="absolute bottom-4 left-4 z-10 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out"
            >
                <ArrowRight
                    className="bg-[#17306E] text-white p-1 rounded-full"
                    size={25}
                />

            </div>
        </div>
    );
};

export default ReportCard;