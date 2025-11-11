import React from "react";
import Image from "next/image";

const CarouselCard = ({
    category = "Therapeutics",
    title = "Unlock Knowledge. Empower Research.",
    description = "Access thousands of peer-reviewed research papers across disciplines trusted by scholars, students, and institutions worldwide.",
    image = "/images/Hero-content.webp",
    mode = "Dark", // Default to Dark mode
}) => {
    // Debug logging
    console.log("CarouselCard received mode:", mode);

    // Determine text color based on mode with !important to override CSS specificity
    const textColorClass = mode === "Light" ? "!text-white" : "!text-black";

    console.log("Applied text color class:", textColorClass);
    return (
        <div className="carousel-card">
            {/* Content */}
            <div className="carousel-content">
                {/* Upper Content */}
                <div className="carousel-upper-content">
                    {/* First Frame - Category with Icon */}
                    <div className="carousel-category-frame">
                        <Image src={image} alt="Category Icon" className="carousel-category-icon" width={100} height={100} quality={100} />
                        <span className={`carousel-category-text ${textColorClass}`}>{category}</span>
                    </div>

                    {/* Second Frame - Main Title */}
                    <h1 className={`carousel-title ${textColorClass}`}>{title}</h1>

                    {/* Third Frame - Description */}
                    <p className={`carousel-description ${textColorClass}`}>{description}</p>
                </div>

                {/* Down Content - CTA */}
                <div className="carousel-cta">
                    {/* <span className="carousel-cta-text">Explore Papers</span> */}
                    {/* <Image src="/icons/Righte-Arrow.svg" alt="Arrow" className="carousel-cta-icon" width={100} height={100} quality={100} /> */}
                </div>
            </div>
        </div>
    );
};

export default CarouselCard;
