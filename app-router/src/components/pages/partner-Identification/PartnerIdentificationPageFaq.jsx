"use client";
import React from "react";
import { ResponsiveMarginContainer } from "../../ui";
import Image from 'next/image';

const bulletPoints = [
  "Align partnerships with long-term business strategy",
  "Reduce risk through strategic partner evaluation",
  "Accelerate entry into new markets and regions",
  "Strengthen operational efficiency with capable collaborators",
  "Support scalable and future-ready growth plans",
];

const PartnerIdentificationPageFaq = () => {
  return (
    <ResponsiveMarginContainer>
      <section className="flex flex-col ] md:flex-row gap-6 md:gap-10 items-center  p-4 sm:p-6 md:p-18 text-base sm:text-lg rounded-3xl text-zinc-900">
        {/* Left Image */}
        <div className="flex-1 min-w-[240px] max-w-full sm:max-w-[400px] md:max-w-[500px]">
          <Image
            src="/images/PartnerIdentificationPageFaq.webp"
            alt="Partner Identification Visual"
            className="object-contain w-full rounded-2xl sm:rounded-3xl aspect-[1.26]"
            width={500}
            height={400}
            quality={100}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 500px"
            priority
          />
        </div>

        {/* Right Content */}
        <div className="flex-1 min-w-[240px]">
          {/* <p className="text-sm sm:text-base md:text-lg mb-4 font-medium text-red-600">
            Why Partner Identification?
          </p> */}
          <h2 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-semibold text-zinc-900 mb-4 sm:mb-5">
            Why Partner Identification
          </h2>
          <p className="mb-4 sm:mb-5 text-zinc-900 leading-6 text-xs sm:text-xs sm:text-[12px] md:text-[13px] 2xl:text-[14px]">
            A structured partner identification process ensures each alliance aligns with your strategic vision, mitigates risk, and drives long-term value. By evaluating partners for capability, reputation, and fit, we help accelerate market entry, enhance operational efficiency, and enable future-ready growth. Whether expanding distribution, co-developing technologies, or scaling operations, our methodology ensures that every collaboration is purposeful, resilient, and built to support sustainable business success across regions and industries.
          </p>
          {/* <ul className="space-y-2 sm:space-y-3 text-zinc-600 text-sm sm:text-base">
            {bulletPoints.map((text, index) => (
              <li key={index} className="flex items-start gap-2 sm:gap-3">
                <img
                  src="/icons/Black-Checked.webp"
                  alt="Checkmark"
                  className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 sm:mt-1"
                />
                <span>{text}</span>
              </li>
            ))}
          </ul> */}
        </div>
      </section>
    </ResponsiveMarginContainer>
  );
};

export default PartnerIdentificationPageFaq;