"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";

const NewsCard = ({ image, date, title, alt, blogId, ...props }) => {
    const { redirect } = useRouteRedirect();

    // Format the date if needed (e.g., convert ISO string to readable format)
    const route = useRouter();
    const formattedDate = date
        ? new Date(date).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
          })
        : "N/A";

    const truncateText = (text, maxLength) => {
        if (text?.length <= maxLength) {
            return text;
        }
        return text?.substring?.(0, maxLength) + "...";
    };
    console.log("props", props);

    return (
        <div className="news-card" onClick={() => redirect(`blog/${props?.news?.blogId?.url}`)}>
            {/* Image */}
            <Image src={image} alt={"image"} className="news-card-image" width={100} height={100} quality={100} />
            {/* Content container */}
            <div className="news-card-content">
                {/* Text content */}
                <div className="news-card-text">
                    {/* Date */}
                    <p className="news-card-date">{formattedDate}</p>

                    {/* Title */}
                    <h3 className="news-card-title">{truncateText(title, 45) || "No title available"}</h3>
                </div>

                {/* Button container */}
                <div className="news-card-button">
                    {/* Read more text */}
                    <span className="news-card-button-text">Read more</span>

                    {/* Arrow icon */}
                    <Image src="/icons/Right-Arrow-Black.webp" alt="Read more arrow" className="news-card-button-icon" width={100} height={100} quality={100} />
                </div>
            </div>
        </div>
    );
};

export default NewsCard;
