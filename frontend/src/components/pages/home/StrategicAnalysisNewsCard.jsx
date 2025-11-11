import React from "react";
import Image from "next/image";

const StrategicAnalysisNewsCard = ({
    image,
    date = "Mar 15, 2025",
    title = "Strategic Analysis: Market Intelligence and Business Insights",
    alt = "Strategic Analysis image",
}) => {
    return (
        <div className="strategic-analysis-news-card">
            {/* Image */}
            <Image src={image} alt={alt} className="strategic-analysis-news-card-image" width={100} height={100} quality={100} />

            {/* Content container */}
            <div className="strategic-analysis-news-card-content">
                {/* Text content */}
                <div className="strategic-analysis-news-card-text">
                    {/* Date */}
                    <p className="strategic-analysis-news-card-date">{date}</p>

                    {/* Title */}
                    <h3 className="strategic-analysis-news-card-title">{title}</h3>
                </div>

                {/* Button container */}
                <div className="strategic-analysis-news-card-button">
                    {/* Read more text */}
                    <span className="strategic-analysis-news-card-button-text">Read Analysis</span>

                    {/* Arrow icon */}
                    <Image
                        src="/icons/Right-Arrow-Black.webp"
                        alt="Read analysis arrow"
                        className="strategic-analysis-news-card-button-icon"
                        width={100}
                        height={100}
                        quality={100}
                    />
                </div>
            </div>
        </div>
    );
};

export default StrategicAnalysisNewsCard;
