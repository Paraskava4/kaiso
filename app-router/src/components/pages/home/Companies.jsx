import React from "react";
import Image from "next/image";

const Companies = () => {
    // Company logos data - 9 logos as specified
    const companyLogos = [
        { id: 1, src: "/icons/Component logos-1.webp", alt: "Company 1" },
        { id: 2, src: "/icons/Component logos-2.webp", alt: "Company 2" },
        { id: 3, src: "/icons/Component logos-3.webp", alt: "Company 3" },
        { id: 4, src: "/icons/Component logos-4.webp", alt: "Company 4" },
        { id: 5, src: "/icons/Component logos-5.webp", alt: "Company 5" },
        { id: 6, src: "/icons/Component logos-6.webp", alt: "Company 6" },
        { id: 7, src: "/icons/Component logos-7.webp", alt: "Company 7" },
        { id: 8, src: "/icons/Component logos-8.webp", alt: "Company 8" },
        { id: 9, src: "/icons/Component logos-9.webp", alt: "Company 9" },
    ];

    return (
        <div className="companies-container bg-white">
            {/* Companies title */}
            <h3 className="text-[20px] font-medium">Trusted by Global Leaders</h3>

            {/* Companies logos container with auto-scroll */}
            <div className="companies-logos-container">
                <div className="companies-logos-track">
                    {/* First set of logos */}
                    {companyLogos.map((logo) => (
                        <div key={`first-${logo.id}`} className="company-logo-wrapper">
                            <Image src={logo.src} alt={logo.alt} className="company-logo" width={100} height={100} quality={100} />
                        </div>
                    ))}
                    {/* Second set for seamless scrolling */}
                    {companyLogos.map((logo) => (
                        <div key={`second-${logo.id}`} className="company-logo-wrapper">
                            <Image src={logo.src} alt={logo.alt} className="company-logo" width={100} height={100} quality={100} />
                        </div>
                    ))}
                    {/* Third set for seamless scrolling */}
                    {companyLogos.map((logo) => (
                        <div key={`third-${logo.id}`} className="company-logo-wrapper">
                            <Image src={logo.src} alt={logo.alt} className="company-logo" width={100} height={100} quality={100} />
                        </div>
                    ))}
                    {/* Fourth set for seamless scrolling */}
                    {companyLogos.map((logo) => (
                        <div key={`fourth-${logo.id}`} className="company-logo-wrapper">
                            <Image src={logo.src} alt={logo.alt} className="company-logo" width={100} height={100} quality={100} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Companies;
